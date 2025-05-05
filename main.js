const healthCounter = document.querySelector(".hp");

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

  drawPlayer() {
    ctx.fillStyle = "blue";
    ctx.fillRect(
      this.playerX, // Use exact pixel position
      this.playerY, // Use exact pixel position
      this.playerSizeX,
      this.playerSizeY
    );
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
    this.bulletSize = 10;
    this.direction = "right";
    this.shootCooldown = 0;
  }

  drawBullet() {
    ctx.fillStyle = "red"; // Färg för skotten

    //För varje skott i arrayen
    this.bullet.forEach((bullet, index) => {
      // Rita skottet
      ctx.fillRect(bullet.x, bullet.y, this.bulletSize, this.bulletSize);

      //Flytta skottet
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
        this.bullet.splice(index, 1);
      }
    });
  }
}

//Zombie
class Zombie {
  constructor(cellSize, startX, startY) {
    this.zombieSize = 32;
    this.zombieSpeed = 1;
    this.zombieHealth = 20;
    this.zombieDamage = 1;
    this.zombie = [];
    this.zombieX = startX;
    this.zombieY = startY;
    this.cellSize = cellSize;
    this.attackCooldown = 0;
    this.image = new Image();
    this.image.src = "assets/monsters.png";
    this.respawnCount = 0; // en variabel för att hålla koll på hur många zombies man dödat
  }
  respawnZombie() {
    const maxX = Math.floor(canvas.width / this.cellSize); // Max antal celler i X-led
    const maxY = Math.floor(canvas.height / this.cellSize); // Max antal celler i Y-led

    this.zombieX = Math.floor(Math.random() * maxX); // Slumpa X-position
    this.zombieY = Math.floor(Math.random() * maxY); // Slumpa Y-position
    this.zombieHealth = 20; // Återställ hälsan
    this.respawnCount++; // Öka respawn-räknaren
    console.log("Zombie respawned at:", this.zombieX, this.zombieY);
    console.log("Respawn count:", this.respawnCount);
  }

  drawZombie() {
    // ctx.fillStyle = "green";

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
        console.log("bullets hit zombi");
        this.zombieHealth -= bullets.bulletDamage; // Minska zombiens hälsa
        bullets.bullet.splice(index, 1); // Ta bort kulan

        // Om zombiens hälsa är 0 eller mindre, ta bort zombien
        if (this.zombieHealth <= 0) {
          console.log("Zombie defeated!");
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
        console.log("Zombie attacked! Player health:", player.playerHealth);
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
      console.log("Player health: " + player.playerHealth); //Logga spelarens hälsa
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

//Spelet
const canvas = document.getElementById("gameCanvas");
/** @type {CanvasRenderingContext2D} */
const ctx = canvas.getContext("2d");

//Game
class Game {
  constructor() {
    this.gridSize = 13;
    this.cellSize = 16; //Storlek på tiles
    this.tilemap = new Image(); //Tilemap tar en bild
    this.tilemap.src = "assets/free.png"; //Källan på bilden

    this.overlay = new Image(); //Overlay tar en bild
    this.overlay.src = "assets/free.png"; //Källan på bilden

    this.tiles = [
      [
        { tileIndex: 6, type: " walkable" },
        { tileIndex: 6, type: "walkable" },
        { tileIndex: 6, type: "walkable" },
        { tileIndex: 6, type: "walkable" },
        { tileIndex: 6, type: "walkable" },
        { tileIndex: 6, type: "walkable" },
        { tileIndex: 6, type: "walkable" },
        { tileIndex: 6, type: "walkable" },
        { tileIndex: 6, type: "walkable" },
        { tileIndex: 6, type: "walkable" },
        { tileIndex: 6, type: "walkable" },
        { tileIndex: 6, type: "walkable" },
        { tileIndex: 6, type: "walkable" },
      ],
      [
        { tileIndex: 6, type: "walkable" },
        { tileIndex: 0, type: "walkable" },
        { tileIndex: 1, type: "walkable" },
        { tileIndex: 2, type: "walkable" },
        { tileIndex: 6, type: "walkable" },
        { tileIndex: 6, type: "walkable" },
        { tileIndex: 6, type: "walkable" },
        { tileIndex: 6, type: "walkable" },
        { tileIndex: 6, type: "walkable" },
        { tileIndex: 6, type: "walkable" },
        { tileIndex: 6, type: "walkable" },
        { tileIndex: 6, type: "walkable" },
        { tileIndex: 6, type: "walkable" },
      ],
      [
        { tileIndex: 1, type: "walkable" },
        { tileIndex: 19, type: "walkable" },
        { tileIndex: 14, type: "walkable" },
        { tileIndex: 15, type: "walkable" },
        { tileIndex: 6, type: "walkable" },
        { tileIndex: 6, type: "walkable" },
        { tileIndex: 6, type: "walkable" },
        { tileIndex: 6, type: "walkable" },
        { tileIndex: 6, type: "walkable" },
        { tileIndex: 6, type: "walkable" },
        { tileIndex: 6, type: "walkable" },
        { tileIndex: 6, type: "walkable" },
        { tileIndex: 6, type: "walkable" },
      ],
      [
        { tileIndex: 14, type: "walkable" },
        { tileIndex: 14, type: "not_walkable", overlayIndex: 48 },
        { tileIndex: 14, type: "not_walkable", overlayIndex: 49 },
        { tileIndex: 20, type: "walkable" },
        { tileIndex: 1, type: "walkable" },
        { tileIndex: 1, type: "walkable" },
        { tileIndex: 1, type: "walkable" },
        { tileIndex: 1, type: "walkable" },
        { tileIndex: 1, type: "walkable" },
        { tileIndex: 1, type: "walkable" },
        { tileIndex: 1, type: "walkable" },
        { tileIndex: 1, type: "walkable" },
        { tileIndex: 1, type: "walkable" },
      ],
      [
        { tileIndex: 14, type: "walkable" },
        { tileIndex: 14, type: "not_walkable", overlayIndex: 61 },
        { tileIndex: 14, type: "not_walkable", overlayIndex: 62 },
        { tileIndex: 14, type: "walkable" },
        { tileIndex: 14, type: "walkable" },
        { tileIndex: 14, type: "walkable" },
        { tileIndex: 14, type: "walkable" },
        { tileIndex: 14, type: "walkable" },
        { tileIndex: 14, type: "walkable" },
        { tileIndex: 14, type: "walkable" },
        { tileIndex: 14, type: "walkable" },
        { tileIndex: 14, type: "walkable" },
        { tileIndex: 14, type: "walkable" },
      ],
      [
        { tileIndex: 14, type: "walkable" },
        { tileIndex: 14, type: "walkable" },
        { tileIndex: 14, type: "walkable" },
        { tileIndex: 14, type: "walkable" },
        { tileIndex: 14, type: "walkable" },
        { tileIndex: 14, type: "walkable" },
        { tileIndex: 14, type: "walkable" },
        { tileIndex: 14, type: "walkable" },
        { tileIndex: 14, type: "walkable" },
        { tileIndex: 14, type: "walkable" },
        { tileIndex: 14, type: "not_walkable", overlayIndex: 10 },
        { tileIndex: 14, type: "walkable" },
        { tileIndex: 14, type: "walkable" },
      ],
      [
        { tileIndex: 14, type: "walkable" },
        { tileIndex: 14, type: "walkable" },
        { tileIndex: 14, type: "walkable" },
        { tileIndex: 14, type: "walkable" },
        { tileIndex: 14, type: "walkable" },
        { tileIndex: 14, type: "walkable" },
        { tileIndex: 14, type: "walkable" },
        { tileIndex: 14, type: "walkable" },
        { tileIndex: 14, type: "walkable" },
        { tileIndex: 14, type: "walkable" },
        { tileIndex: 14, type: "walkable" },
        { tileIndex: 14, type: "walkable" },
        { tileIndex: 14, type: "walkable" },
      ],
      [
        { tileIndex: 14, type: "walkable" },
        { tileIndex: 14, type: "walkable" },
        { tileIndex: 14, type: "walkable" },
        { tileIndex: 14, type: "walkable" },
        { tileIndex: 14, type: "walkable" },
        { tileIndex: 14, type: "walkable" },
        { tileIndex: 14, type: "not_walkable", overlayIndex: 10 },
        { tileIndex: 14, type: "walkable" },
        { tileIndex: 14, type: "walkable" },
        { tileIndex: 14, type: "walkable" },
        { tileIndex: 14, type: "walkable" },
        { tileIndex: 14, type: "walkable" },
        { tileIndex: 14, type: "walkable" },
      ],
      [
        { tileIndex: 14, type: "walkable" },
        { tileIndex: 14, type: "walkable" },
        { tileIndex: 14, type: "walkable" },
        { tileIndex: 16, type: "walkable" },
        { tileIndex: 17, type: "walkable" },
        { tileIndex: 14, type: "walkable" },
        { tileIndex: 14, type: "walkable" },
        { tileIndex: 14, type: "walkable" },
        { tileIndex: 14, type: "walkable" },
        { tileIndex: 14, type: "walkable" },
        { tileIndex: 14, type: "walkable" },
        { tileIndex: 14, type: "walkable" },
        { tileIndex: 14, type: "walkable" },
      ],
      [
        { tileIndex: 14, type: "walkable" },
        { tileIndex: 14, type: "walkable" },
        { tileIndex: 14, type: "walkable" },
        { tileIndex: 29, type: "walkable" },
        { tileIndex: 30, type: "walkable" },
        { tileIndex: 14, type: "walkable" },
        { tileIndex: 14, type: "walkable" },
        { tileIndex: 14, type: "walkable" },
        { tileIndex: 14, type: "walkable" },
        { tileIndex: 14, type: "walkable" },
        { tileIndex: 14, type: "walkable" },
        { tileIndex: 14, type: "walkable" },
        { tileIndex: 14, type: "walkable" },
      ],
      [
        { tileIndex: 14, type: "walkable" },
        { tileIndex: 14, type: "walkable" },
        { tileIndex: 14, type: "walkable" },
        { tileIndex: 14, type: "walkable" },
        { tileIndex: 14, type: "walkable" },
        { tileIndex: 14, type: "walkable" },
        { tileIndex: 14, type: "walkable" },
        { tileIndex: 14, type: "walkable" },
        { tileIndex: 14, type: "walkable" },
        { tileIndex: 14, type: "walkable" },
        { tileIndex: 14, type: "walkable" },
        { tileIndex: 14, type: "walkable" },
        { tileIndex: 14, type: "walkable" },
      ],
      [
        { tileIndex: 14, type: "walkable" },
        { tileIndex: 14, type: "walkable" },
        { tileIndex: 14, type: "walkable" },
        { tileIndex: 14, type: "walkable" },
        { tileIndex: 14, type: "walkable" },
        { tileIndex: 14, type: "walkable" },
        { tileIndex: 14, type: "walkable" },
        { tileIndex: 14, type: "walkable" },
        { tileIndex: 14, type: "walkable" },
        { tileIndex: 14, type: "walkable" },
        { tileIndex: 14, type: "walkable" },
        { tileIndex: 14, type: "walkable" },
        { tileIndex: 14, type: "walkable" },
      ],
      [
        { tileIndex: 14, type: "walkable" },
        { tileIndex: 14, type: "walkable" },
        { tileIndex: 14, type: "walkable" },
        { tileIndex: 14, type: "walkable" },
        { tileIndex: 14, type: "walkable" },
        { tileIndex: 14, type: "walkable" },
        { tileIndex: 14, type: "walkable" },
        { tileIndex: 14, type: "walkable" },
        { tileIndex: 14, type: "walkable" },
        { tileIndex: 14, type: "walkable" },
        { tileIndex: 14, type: "walkable" },
        { tileIndex: 14, type: "walkable" },
        { tileIndex: 14, type: "walkable" },
      ],
    ];
  }

  //Ritar spelet
  drawGame() {
    const tilesPerRow = 13; // Tiles per row in the tilemap
    const tilesPerColumn = 13; // Tiles per column in the tilemap

    this.tiles.forEach((row, y) => {
      row.forEach((tile, x) => {
        const { tileIndex, overlayIndex } = tile;

        // Calculate the position of the base tile in the tilemap
        const tileX = (tileIndex % tilesPerRow) * this.cellSize;
        const tileY = Math.floor(tileIndex / tilesPerColumn) * this.cellSize;

        // Draw the base tile
        ctx.drawImage(
          this.tilemap,
          tileX,
          tileY,
          this.cellSize,
          this.cellSize,
          x * this.cellSize * 3,
          y * this.cellSize * 3,
          this.cellSize * 3,
          this.cellSize * 3
        );

        //Skapar en duplikat av tilemapen för att kunna rita över den
        if (overlayIndex !== null) {
          const overlayX = (overlayIndex % tilesPerRow) * this.cellSize;
          const overlayY =
            Math.floor(overlayIndex / tilesPerColumn) * this.cellSize;

          ctx.drawImage(
            this.tilemap, // Use the same tilemap for the overlay
            overlayX,
            overlayY,
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

  //Kordinat på spelaren och vart man kan gå
  isTileWalkable(x, y, width, height, walkable = ["walkable"]) {
    const tileX1 = Math.floor((x + width) / (this.cellSize * 3)); //Kollar vilken tile spelaren är på(bredd inkluderad)
    const tileX = Math.floor(x / (this.cellSize * 3)); //Kollar vilken tile spelaren är på, tar x positionen och delar med cellstorleken
    const tileY1 = Math.floor((y + height) / (this.cellSize * 3)); //Kollar vilken tile spelaren är på(höjd inkluderad)
    const tileY = Math.floor(y / (this.cellSize * 3)); //Kollar vilken tile spelaren är på, tar x positionen och delar med cellstorleken

    //Om spelaren är utanför kartan, return false
    if (
      tileX < 0 ||
      tileY < 0 ||
      tileY >= this.tiles.length ||
      tileX >= this.tiles[0].length
    ) {
      return false;
    }

    //om alla delar av gubben är på en tile som är walkable, return true
    return (
      walkable.includes(this.tiles[tileY][tileX].type) &&
      walkable.includes(this.tiles[tileY1][tileX1].type) &&
      walkable.includes(this.tiles[tileY][tileX1].type) &&
      walkable.includes(this.tiles[tileY1][tileX].type)
    );
  }
}

//Definerar player och zombies och bullets
const bulletHandeler = new Bullets();
const player = new Player();
const game = new Game();
const zombie = new Zombie(game.cellSize, 0, 0);
const zombie2 = new Zombie(game.cellSize, 10, 0);
let zombie2Spawned = false; // kontrollerar om zombie 2 har spawnats

function updateHealthCounter() {
  healthCounter.textContent = `Player Health: ${player.playerHealth}`; // Uppdatera hälsan i HTML-elementet
}

//Håller koll vilka som är nedtrckta
const keys = {
  w: false,
  a: false,
  s: false,
  d: false,
  ArrowUp: false,
  ArrowDown: false,
  ArrowLeft: false,
  ArrowRight: false,
  Space: false,
};

//När knappen trycks ned
document.addEventListener("keydown", (e) => {
  //Gubbe

  if (e.key === "w") keys.w = true;
  if (e.key === "s") keys.s = true;
  if (e.key === "a") keys.a = true;
  if (e.key === "d") keys.d = true;

  //Skott
  if (e.key === "ArrowUp") {
    keys.ArrowUp = true;
    bulletHandeler.direction = "up";
  }
  if (e.key === "ArrowDown") {
    keys.ArrowDown = true;
    bulletHandeler.direction = "down";
  }
  if (e.key === "ArrowLeft") {
    keys.ArrowLeft = true;
    bulletHandeler.direction = "left";
  }
  if (e.key === "ArrowRight") {
    keys.ArrowRight = true;
    bulletHandeler.direction = "right";
  }
  if (e.key === " ") keys.Space = true;
});

//När knappen släpps
document.addEventListener("keyup", (e) => {
  //Gubbe
  if (e.key === "w") keys.w = false;
  if (e.key === "s") keys.s = false;
  if (e.key === "a") keys.a = false;
  if (e.key === "d") keys.d = false;

  //Skott
  if (e.key === "ArrowUp") keys.ArrowUp = false;
  if (e.key === "ArrowDown") keys.ArrowDown = false;
  if (e.key === "ArrowLeft") keys.ArrowLeft = false;
  if (e.key === "ArrowRight") keys.ArrowRight = false;
  if (e.key === " ") keys.Space = false; //Sluta skjuta skott
});

let continueGame = true; // Variabel för att kontrollera om spelet ska fortsätta

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

function gameLoop() {
  if (continueGame == false) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  updateHealthCounter();

  // Kontrollera om spelaren kolliderar med zombien
  // if (checkCollision(player, zombie)) {
  //   player.playerHealth -= zombie.zombieDamage; // Minska spelarens hälsa
  //   console.log("Player health: " + player.playerHealth);
  // }

  // Kontrollera om spelarens hälsa är under eller lika med 0
  if (player.playerHealth <= 0) {
    continueGame = false; // Stoppa spelet
    alert("Game Over!, du dog"); // Visa meddelande
    return; // Avsluta funktionen
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
  if (keys.Space && bulletHandeler.shootCooldown === 0) {
    bulletHandeler.bullet.push({
      x:
        player.playerX + player.playerSizeX / 2 - bulletHandeler.bulletSize / 2,
      y: player.playerY,
      direction: bulletHandeler.direction,
      speed: 5,
    });
    bulletHandeler.shootCooldown = 20; // Återställ cooldown
  }

  // Minska cooldown med 1 varje frame
  if (bulletHandeler.shootCooldown > 0) {
    bulletHandeler.shootCooldown--;
  }
  if (zombie.attackCooldown > 0) {
    zombie.attackCooldown--;
  }
  if (zombie2.attackCooldown > 0) {
    zombie2.attackCooldown--;
  }
  if (checkZombieCollision(zombie, zombie2)) {
    console.log("Zombies collided!");
    // Hantera kollision, t.ex. justera positioner eller stoppa rörelse
    zombie.zombieX -= zombie.zombieSpeed / zombie.cellSize;
    zombie.zombieY -= zombie.zombieSpeed / zombie.cellSize;

    zombie2.zombieX += zombie2.zombieSpeed / zombie2.cellSize;
    zombie2.zombieY += zombie2.zombieSpeed / zombie2.cellSize;
  }
  zombie2.trackPlayer(player.playerX, player.playerY);
  // Kontrollera kollision mellan kulor och zombien nummer 2
  zombie2.checkBulletCollision(bulletHandeler);

  zombie.trackPlayer(player.playerX, player.playerY);
  // Kontrollera kollision mellan kulor och zombien
  zombie.checkBulletCollision(bulletHandeler);

  game.drawGame(); // Ritar bakgrunden
  player.drawPlayer(); // Ritar spelaren
  bulletHandeler.drawBullet(); // Ritar skotten
  zombie.drawZombie(); // Ritar zombien
  zombie2.drawZombie(); //Ritar zombien nummer 2

  requestAnimationFrame(gameLoop); // Fortsätt loopen
}

// Startar game loopen när tilemapen är laddad
game.tilemap.onload = () => {
  continueGame = true; // Sätt till true när spelet startar
  requestAnimationFrame(gameLoop); // Starta loopen
};
