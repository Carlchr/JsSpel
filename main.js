import {
  updateHealthCounter,
  updateLevelCounter,
  updateCoinCounter,
  updateZombieDmgCounter,
  updateZombieHpCounter,
  updateZombieCoinCounter,
  updateHpButtonText,
  updateDamageButtonText,
  updateFirerateButtonText,
  updateSpeedButtonText
} from "./ui.js";

import { keys, controls } from "./controls.js";
import { BackgroundLibrary } from "./backgroundLibrary.js";
import {
  buyCountHp,
  buyCountDmg,
  buyCountSpeed,
  buyCountFireRate,
  buttonClassesEnchant
} from "./button.js";

//Player
class Player {
  constructor() {
    this.playerSizeX = 24; //Player size
    this.playerSizeY = 47; //Player size
    this.playerSpeed = 2; //Player speed
    this.playerHealth = 100; //Player health§
    this.playerX = canvas.width / 2 - this.playerSizeX / 2; //X position
    this.playerY = canvas.height / 2 - this.playerSizeY / 2; //Y position
  }

  movePlayer(direction) {
    //Temporära variabler för att hålla koll på spelaren
    let nyX = this.playerX;
    let nyY = this.playerY;

    //Rör spelaren i den riktning som trycks ned
    if (direction === "up") nyY -= this.playerSpeed;
    if (direction === "down") nyY += this.playerSpeed;
    if (direction === "left") nyX -= this.playerSpeed;
    if (direction === "right") nyX += this.playerSpeed;

    //Kollar om  spelare kan gå på tilen
    if (
      game.isTileWalkable(
        nyX,
        nyY,
        this.playerSizeX - 1,
        this.playerSizeY - 1,
        ["walkable"]
      )
    ) {
      this.playerX = nyX;
      this.playerY = nyY;
    }
  }
}

//Bullets
class Bullets {
  constructor() {
    this.bulletDamage = 5;
    this.bullet = [];
    this.bulletSize = 5;
    this.direction = "right";
    this.shootCooldown = 0;
    this.shootCooldownMax = 20; // Standardvärde för cooldown
  }
}

//Zombie
class Zombie {
  constructor(cellSize, startX, startY) {
    this.zombieSize = 32;
    this.zombieSpeed = 1;
    this.zombieHealth = 20 + 4 * game.level; // Zombiens hälsa ökar med nivån
    this.zombieDamage = 5 + game.level; // Zombiens skada ökar med nivån
    this.attackCooldown = 0;
    this.zombie = [];
    this.zombieX = startX;
    this.zombieY = startY;
    this.cellSize = cellSize;
    this.image = new Image();
    this.image.src = "assets/monsters.png";
    this.respawnCount = 0; // en variabel för att hålla koll på hur många zombies man dödat
  }
  respawnZombie() {
    const maxX = Math.floor(canvas.width / this.cellSize); // Max antal celler i X-led
    const maxY = Math.floor(canvas.height / this.cellSize); // Max antal celler i Y-led

    this.zombieX = Math.floor(Math.random() * maxX); // Slumpa X-position
    this.zombieY = Math.floor(Math.random() * maxY); // Slumpa Y-position
    this.zombieHealth = 20 + 4 * game.level; // Återställ hälsan
    this.respawnCount++; // Öka respawn-räknaren
    game.coinCount += game.level; // Öka myntantalet med leveln
    console.log("Zombie respawned at:", this.zombieX, this.zombieY);
    console.log("Respawn count:", this.respawnCount);
  }

  drawZombie() {
    ctx.drawImage(
      this.image,
      this.zombieX * this.cellSize,
      this.zombieY * this.cellSize,
      this.zombieSize,
      this.zombieSize
    );
  }

  checkBulletCollision(bullets) {
    bullets.bullet.forEach((bullet, index) => {
      // Zombiens rektangel
      const zombieLeft = this.zombieX * this.cellSize;
      const zombieRight = zombieLeft + this.zombieSize;
      const zombieTop = this.zombieY * this.cellSize;
      const zombieBottom = zombieTop + this.zombieSize;

      // Bulletens rektangel
      const bulletLeft = bullet.x;
      const bulletRight = bullet.x + bullets.bulletSize;
      const bulletTop = bullet.y;
      const bulletBottom = bullet.y + bullets.bulletSize;

      // Kontrollera om rektanglarna överlappar
      if (
        bulletRight > zombieLeft &&
        bulletLeft < zombieRight &&
        bulletBottom > zombieTop &&
        bulletTop < zombieBottom
      ) {
        this.zombieHealth -= bullets.bulletDamage; // Minska zombiens hälsa
        bullets.bullet.splice(index, 1); // Ta bort kulan

        // Om zombiens hälsa är 0 eller mindre, ta bort zombien
        if (this.zombieHealth <= 0) {
          this.respawnZombie(); // Respawna zombien någonstans på kartan
        }
      }
    });
  }

  trackPlayer(playerX, playerY) {
    const currentTime = Date.now(); // Get the current time

    // Check if the zombie collides with the player
    if (checkCollision(player, this)) {
      // Check if enough time has passed since the last attack
      if (this.attackCooldown <= 0) {
        player.playerHealth -= this.zombieDamage; // Reduce player's health
        this.attackCooldown = 30;
      }

      return;
    }

    // Skillnad i position mellan zombien och spelaren
    const dX = playerX - this.zombieX * this.cellSize;
    const dY = playerY - this.zombieY * this.cellSize;
    // Pythagoras sats för att beräkna avståndet
    const distance = Math.sqrt(dX * dX + dY * dY);

    // Om zombien är nära spelaren, sluta röra sig
    if (distance < 1) {
      player.playerHealth -= this.zombieDamage; //Skada spelaren
      return; // Avbryt om zombien är nära spelaren
    }

    //Räkna ut riktningen
    const riktningX = dX / distance;
    const riktningY = dY / distance;
    // Uppdatera zombiens position, cellsize gör att den rör sig rätt på kartan
    this.zombieX += (riktningX * this.zombieSpeed) / this.cellSize;
    this.zombieY += (riktningY * this.zombieSpeed) / this.cellSize;
  }
}

const backgroundLibrary = new BackgroundLibrary(); //Skapar en instans av BackgroundLibrary

//Spelet
const canvas = document.getElementById("gameCanvas");
/** @type {CanvasRenderingContext2D} */
const ctx = canvas.getContext("2d");

//Game
class Game {
  constructor() {
    this.gridSize = 13;
    this.cellSize = 16; //Storlek på tiles
    this.level = 1; //Nivå
    this.coinCount = 0; //Antal coins
    this.tilemap = new Image(); //Tilemap tar en bild
    this.tilemap.src = "assets/Tilemap.png"; //Källan på bilden
    this.overlay = new Image(); //Overlay tar en bild
    this.overlay.src = "assets/Tilemap.png"; //Källan på bilden
    this.tiles = backgroundLibrary.background1; //Kebab är en array med bakgrundsbilder
  }

  //Ritar spelet
  drawGame() {
    const tilesPerRow = 13; // Tiles per row in the tilemap
    const tilesPerColumn = 13; // Tiles per column in the tilemap

    ctx.clearRect(0, 0, canvas.width, canvas.height);


    this.tiles.forEach((row, y) => {
      row.forEach((tile, x) => {
        const { tileIndex, overlayIndex } = tile;

        //Pick tile from tilemap according to tileIndex
        const tileMapX = (tileIndex % tilesPerRow) * this.cellSize;
        const tileMapY = Math.floor(tileIndex / tilesPerColumn) * this.cellSize;

        // Draw the base tile
        ctx.drawImage(
          this.tilemap,
          tileMapX,
          tileMapY,
          this.cellSize,
          this.cellSize,
          x * this.cellSize * 3,
          y * this.cellSize * 3,
          this.cellSize * 3,
          this.cellSize * 3
        );

        //Skapar en duplikat av tilemapen för att kunna rita över den
        if (overlayIndex !== null) {
          const overlayMapX = (overlayIndex % tilesPerRow) * this.cellSize;
          const overlayMapY = Math.floor(overlayIndex / tilesPerColumn) * this.cellSize;

          ctx.drawImage(
            this.tilemap, // Use the same tilemap for the overlay
            overlayMapX,
            overlayMapY,
            this.cellSize,
            this.cellSize,
            x * this.cellSize * 3,
            y * this.cellSize * 3,
            this.cellSize * 3,
            this.cellSize * 3
          );
        }
      });
    });
  }

  drawPlayer(player) {
    ctx.fillStyle = "blue";
    ctx.fillRect(
      player.playerX, // Use exact pixel position
      player.playerY, // Use exact pixel position
      player.playerSizeX,
      player.playerSizeY
    );
  }

  drawBullets(bullets) {
    ctx.fillStyle = "red";
    bullets.bullet.forEach((bullet, index) => {
      ctx.beginPath();
      ctx.arc(bullet.x, bullet.y, bullets.bulletSize, 0, 2 * Math.PI);
      ctx.fill();

      // Flytta skottet
      if (bullet.direction === "up") bullet.y -= bullet.speed;
      if (bullet.direction === "down") bullet.y += bullet.speed;
      if (bullet.direction === "left") bullet.x -= bullet.speed;
      if (bullet.direction === "right") bullet.x += bullet.speed;

      // Ta bort skott om det lämnar canvasen
      if (
        bullet.x < 0 ||
        bullet.x > canvas.width ||
        bullet.y < 0 ||
        bullet.y > canvas.height
      ) {
        bullets.bullet.splice(index, 1);
      }
    });
  }

  checkDeath() {
    if (player.playerHealth <= 0) {
      continueGame = false; // Stoppa spelet
      alert("Game Over!, YOU DIED"); // Visa meddelande
      return; // Avsluta funktionen
    }
  }

  increaseLevel() {
    var previousLevel = this.level; //Spara nivån innan den ökar
    this.level++; //Öka nivån med 1
    if (previousLevel <= 1 && this.level >= 2) {
      // this.tilemap.src = "Tilemap_2.png"; 
      this.overlay.src = "Tilemap_2.png"; 
      this.tiles = backgroundLibrary.background2; //Kebab är en array med bakgrundsbilder
    }

    zombie.respawnCount = 0; // Återställ respawn-räknaren för zombien
    zombie2.respawnCount = 0; // Återställ respawn-räknaren för zombien nummer 2
    console.log("Level up! Current level:", game.level); // Logga nivån
    console.log(globalZombieRespawnCount);
  }

  //Kordinat på spelaren och vart man kan gå
  isTileWalkable(x, y, width, height, walkable = ["walkable"]) {
    const tileMapX1 = Math.floor((x + width) / (this.cellSize * 3)); //Kollar vilken tile spelaren är på(bredd inkluderad)
    const tileMapX = Math.floor(x / (this.cellSize * 3)); //Kollar vilken tile spelaren är på, tar x positionen och delar med cellstorleken
    const tileMapY1 = Math.floor((y + height) / (this.cellSize * 3)); //Kollar vilken tile spelaren är på(höjd inkluderad)
    const tileMapY = Math.floor(y / (this.cellSize * 3)); //Kollar vilken tile spelaren är på, tar x positionen och delar med cellstorleken

    //Om spelaren är utanför kartan, return false
    if (
      tileMapX < 0 ||
      tileMapY < 0 ||
      tileMapY >= this.tiles.length ||
      tileMapX >= this.tiles[0].length
    ) {
      return false;
    }

    //om alla delar av gubben är på en tile som är walkable, return true
    return (
      walkable.includes(this.tiles[tileMapY][tileMapX].type) &&
      walkable.includes(this.tiles[tileMapY1][tileMapX1].type) &&
      walkable.includes(this.tiles[tileMapY][tileMapX1].type) &&
      walkable.includes(this.tiles[tileMapY1][tileMapX].type)
    );
  }
}

//Definerar player och zombies och bullets
const bulletHandeler = new Bullets();
const player = new Player();
const game = new Game();
const zombie = new Zombie(game.cellSize, 0, 0);
const zombie2 = new Zombie(game.cellSize, 10, 0);

//Antal döda zombies
let globalZombieRespawnCount = 0;
// Variabel för att kontrollera om spelet ska fortsätta
let continueGame = true; 

//Kollar när knapparna klickas
buttonClassesEnchant({
  game,
  player,
  bulletHandeler,
  updateCoinCounter,
  updateHealthCounter,
  updateHpButtonText,
  updateDamageButtonText,
  updateFirerateButtonText,
  updateSpeedButtonText
});

function checkCollision(player, zombie) {
  // Spelarens rektangel
  const playerLeft = player.playerX;
  const playerRight = player.playerX + player.playerSizeX;
  const playerTop = player.playerY;
  const playerBottom = player.playerY + player.playerSizeY;

  // Zombiens rektangel
  const zombieLeft = zombie.zombieX * zombie.cellSize;
  const zombieRight = zombieLeft + zombie.zombieSize;
  const zombieTop = zombie.zombieY * zombie.cellSize;
  const zombieBottom = zombieTop + zombie.zombieSize;

  // Kontrollera om rektanglarna överlappar
  return (
    //om kanterna nuddar så ger den sant
    playerRight > zombieLeft &&
    playerLeft < zombieRight &&
    playerBottom > zombieTop &&
    playerTop < zombieBottom
  );
}
function checkZombieCollision(zombie1, zombie2) {
  // Samma som övre fast för zombie 1 och 2
  // Zombie 1:s rektangel
  const zombie1Left = zombie1.zombieX * zombie1.cellSize;
  const zombie1Right = zombie1Left + zombie1.zombieSize;
  const zombie1Top = zombie1.zombieY * zombie1.cellSize;
  const zombie1Bottom = zombie1Top + zombie1.zombieSize;

  // Zombie 2:s rektangel
  const zombie2Left = zombie2.zombieX * zombie2.cellSize;
  const zombie2Right = zombie2Left + zombie2.zombieSize;
  const zombie2Top = zombie2.zombieY * zombie2.cellSize;
  const zombie2Bottom = zombie2Top + zombie2.zombieSize;

  // Kontrollera om rektanglarna överlappar
  return (
    zombie1Right > zombie2Left &&
    zombie1Left < zombie2Right &&
    zombie1Bottom > zombie2Top &&
    zombie1Top < zombie2Bottom
  );
}

//Behövs
function gameLoop() {
  if (continueGame == false) return;

  // -------- FÖR HTML SAKER -------- //

  //Stats
  updateHealthCounter(player);
  updateLevelCounter(game);
  updateCoinCounter(game);
  
  //Zombie
  updateZombieDmgCounter(zombie);
  updateZombieHpCounter(game);
  updateZombieCoinCounter(game);

  //Enchantments
  updateHpButtonText(buyCountHp);
  updateDamageButtonText(buyCountDmg);
  updateFirerateButtonText(buyCountFireRate);
  updateSpeedButtonText(buyCountSpeed);

  
  //Om man är död
  game.checkDeath();
  //Kontrollerna på spelaren
  controls(bulletHandeler);

  

  // Håller koll på hur många zombies som dött
  globalZombieRespawnCount = zombie.respawnCount + zombie2.respawnCount; 
  if (globalZombieRespawnCount % 10 === 0 && globalZombieRespawnCount > 0) {
    game.increaseLevel(); // Öka nivån
  }

  // Om knappen är nedtryckt och inom gränserna
  if (keys.w && player.playerY > 0) {
    player.movePlayer("up");
  }
  if (keys.s && player.playerY < canvas.height - player.playerSizeY) {
    player.movePlayer("down");
  }
  if (keys.a && player.playerX > 0) {
    player.movePlayer("left");
  }
  if (keys.d && player.playerX < canvas.width - player.playerSizeX) {
    player.movePlayer("right");
  }

  // Om knappen är nedtryckt och om cooldown är noll
  if (
    bulletHandeler.shootCooldown === 0 &&
    (keys.ArrowRight || keys.ArrowLeft || keys.ArrowUp || keys.ArrowDown)
  ) {
    bulletHandeler.bullet.push({
      x: player.playerX + player.playerSizeX / 2 - bulletHandeler.bulletSize / 2,
      y: player.playerY,
      direction: bulletHandeler.direction,
      speed: 5,
    });
    bulletHandeler.shootCooldown = bulletHandeler.shootCooldownMax;
  }

  // Kontrollera kollision mellan zombier
  if (bulletHandeler.shootCooldown > 0) {
    bulletHandeler.shootCooldown--;
  }

  //minskar attackCooldown med 1 varje frame
  if (zombie.attackCooldown > 0) {
    zombie.attackCooldown--;
  }
  if (zombie2.attackCooldown > 0) {
    zombie2.attackCooldown--;
  }

  if (checkZombieCollision(zombie, zombie2)) {
    console.log("Zombies collided!");

    zombie.zombieX -= zombie.zombieSpeed / zombie.cellSize;
    zombie.zombieY -= zombie.zombieSpeed / zombie.cellSize;

    zombie2.zombieX += zombie2.zombieSpeed / zombie2.cellSize;
    zombie2.zombieY += zombie2.zombieSpeed / zombie2.cellSize;
  }

  zombie2.trackPlayer(player.playerX, player.playerY);
  zombie2.checkBulletCollision(bulletHandeler); // Kontrollera kollision mellan kulor och zombien nummer 2

  zombie.trackPlayer(player.playerX, player.playerY);
  zombie.checkBulletCollision(bulletHandeler); // Kontrollera kollision mellan kulor och zombien

  game.drawGame(); // Ritar bakgrunden och clearar canvasen
  game.drawPlayer(player); // Ritar spelaren
  game.drawBullets(bulletHandeler); // Ritar skotten
  zombie.drawZombie(); // Ritar zombien
  zombie2.drawZombie(); //Ritar zombien nummer 2
  

  requestAnimationFrame(gameLoop); // Fortsätt loopen
}
// Startar game loopen när tilemapen är laddad
game.tilemap.onload = () => {
  continueGame = true; // Sätt till true när spelet startar
  requestAnimationFrame(gameLoop); // Starta loopen
};
