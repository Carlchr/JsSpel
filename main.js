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
  updateSpeedButtonText,
  buttonClassesEnchant,
  buyCountHp, // Lägg till denna import
  buyCountDmg, // Lägg till denna import
  buyCountSpeed, // Lägg till denna import
  buyCountFireRate, // Lägg till denna import
} from "./ui.js";
import { controls, keys } from "./controls.js"; // Importera kontrollerna
import { Player, Zombie, Bullets, Game, BackgroundLibrary } from "./classes.js";

const backgroundLibrary = new BackgroundLibrary(); // Skapar en instans av BackgroundLibrary

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Definerar player och zombies och bullets
const player = new Player(canvas);
const bulletHandeler = new Bullets();
const game = new Game(backgroundLibrary, canvas, ctx);
const zombie = new Zombie(game.cellSize, 0, 0, game, canvas, ctx);
const zombie2 = new Zombie(game.cellSize, 10, 0, game, canvas, ctx);

// Antal döda zombies
let globalZombieRespawnCount = 0;
// Variabel för att kontrollera om spelet ska fortsätta
let continueGame = true;

// Kollar när knapparna klickas
buttonClassesEnchant({
  game,
  player,
  bulletHandeler,
  updateCoinCounter,
  updateHealthCounter,
  updateHpButtonText,
  updateDamageButtonText,
  updateFirerateButtonText,
  updateSpeedButtonText,
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
    playerRight > zombieLeft &&
    playerLeft < zombieRight &&
    playerBottom > zombieTop &&
    playerTop < zombieBottom
  );
}

function checkZombieCollision(zombie1, zombie2) {
  // Samma som övre fast för zombie 1 och 2
  const zombie1Left = zombie1.zombieX * zombie1.cellSize;
  const zombie1Right = zombie1Left + zombie1.zombieSize;
  const zombie1Top = zombie1.zombieY * zombie1.cellSize;
  const zombie1Bottom = zombie1Top + zombie1.zombieSize;

  const zombie2Left = zombie2.zombieX * zombie2.cellSize;
  const zombie2Right = zombie2Left + zombie2.zombieSize;
  const zombie2Top = zombie2.zombieY * zombie2.cellSize;
  const zombie2Bottom = zombie2Top + zombie2.zombieSize;

  return (
    zombie1Right > zombie2Left &&
    zombie1Left < zombie2Right &&
    zombie1Bottom > zombie2Top &&
    zombie1Top < zombie2Bottom
  );
}

function gameLoop() {
  if (continueGame == false) return;

  // -------- FÖR HTML SAKER -------- //

  // Stats
  updateHealthCounter(player);
  updateLevelCounter(game);
  updateCoinCounter(game);

  // Zombie
  updateZombieDmgCounter(zombie);
  updateZombieHpCounter(game);
  updateZombieCoinCounter(game);

  // Enchantments
  updateHpButtonText(buyCountHp);
  updateDamageButtonText(buyCountDmg);
  updateFirerateButtonText(buyCountFireRate);
  updateSpeedButtonText(buyCountSpeed);

  // Om man är död
  if (game.checkDeath(player)) {
    continueGame = false;
    return;
  }

  // Kontrollerna på spelaren
  controls(bulletHandeler);

  // Håller koll på hur många zombies som dött
  globalZombieRespawnCount = zombie.respawnCount + zombie2.respawnCount;
  if (globalZombieRespawnCount % 10 === 0 && globalZombieRespawnCount > 0) {
    game.increaseLevel(zombie, zombie2); // Öka nivån
  }

  // Om knappen är nedtryckt och inom gränserna
  if (keys.w && player.playerY > 0) {
    player.movePlayer("up", game);
  }
  if (keys.s && player.playerY < canvas.height - player.playerSizeY) {
    player.movePlayer("down", game);
  }
  if (keys.a && player.playerX > 0) {
    player.movePlayer("left", game);
  }
  if (keys.d && player.playerX < canvas.width - player.playerSizeX) {
    player.movePlayer("right", game);
  }

  // Om knappen är nedtryckt och om cooldown är noll
  if (
    bulletHandeler.shootCooldown === 0 &&
    (keys.ArrowRight || keys.ArrowLeft || keys.ArrowUp || keys.ArrowDown)
  ) {
    bulletHandeler.bullet.push({
      x:
        player.playerX + player.playerSizeX / 2 - bulletHandeler.bulletSize / 2,
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

  // Minskar attackCooldown med 1 varje frame
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

  zombie2.trackPlayer(player, game, checkCollision);
  zombie2.checkBulletCollision(bulletHandeler, game);

  zombie.trackPlayer(player, game, checkCollision);
  zombie.checkBulletCollision(bulletHandeler, game);

  game.drawGame(); // Ritar bakgrunden och clearar canvasen
  game.drawPlayer(player); // Ritar spelaren
  game.drawBullets(bulletHandeler); // Ritar skotten
  zombie.drawZombie(ctx); // Ritar zombien
  zombie2.drawZombie(ctx); // Ritar zombien nummer 2

  requestAnimationFrame(gameLoop); // Fortsätt loopen
}

// Startar game loopen när tilemapen är laddad
game.tilemap.onload = () => {
  continueGame = true; // Sätt till true när spelet startar
  requestAnimationFrame(gameLoop); // Starta loopen
};
