const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const gridSize = 10;
const cellSize = 40;

let playerX = 0,
  playerY = 0;
let direction = "right";
let bullets = [];
let zombie = { x: 7, y: 7 };

function drawGame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Rita rutnät
  ctx.strokeStyle = "lightgray";
  for (let i = 0; i <= gridSize; i++) {
    ctx.beginPath();
    ctx.moveTo(i * cellSize, 0);
    ctx.lineTo(i * cellSize, canvas.height);
    ctx.moveTo(0, i * cellSize);
    ctx.lineTo(canvas.width, i * cellSize);
    ctx.stroke();
  }

  // Rita spelaren
  ctx.fillStyle = "blue";
  ctx.fillRect(playerX * cellSize, playerY * cellSize, cellSize, cellSize);

  // Rita zombien
  ctx.fillStyle = "green";
  ctx.fillRect(zombie.x * cellSize, zombie.y * cellSize, cellSize, cellSize);

  // Rita skott
  ctx.fillStyle = "red";
  bullets.forEach((bullet) => {
    ctx.fillRect(bullet.x * cellSize, bullet.y * cellSize, cellSize, cellSize);
  });
}

document.addEventListener("keydown", (e) => {
  if (e.key === "w" && playerY > 0) {
    playerY--;
    direction = "up";
  }
  if (e.key === "s" && playerY < gridSize - 1) {
    playerY++;
    direction = "down";
  }
  if (e.key === "a" && playerX > 0) {
    playerX--;
    direction = "left";
  }
  if (e.key === "d" && playerX < gridSize - 1) {
    playerX++;
    direction = "right";
  }
  if (e.key === " ") {
    // Skjut med mellanslag
    bullets.push({ x: playerX, y: playerY, dir: direction });
  }
  drawGame();
});

function updateGame() {
  // Flytta skotten
  bullets.forEach((bullet, index) => {
    if (bullet.dir === "up") bullet.y--;
    if (bullet.dir === "down") bullet.y++;
    if (bullet.dir === "left") bullet.x--;
    if (bullet.dir === "right") bullet.x++;

    // Ta bort skott om det går utanför gränsen
    if (
      bullet.x < 0 ||
      bullet.x >= gridSize ||
      bullet.y < 0 ||
      bullet.y >= gridSize
    ) {
      bullets.splice(index, 1);
    }

    // Kolla om en zombie träffas
    if (bullet.x === zombie.x && bullet.y === zombie.y) {
      zombie.x = Math.floor(Math.random() * gridSize);
      zombie.y = Math.floor(Math.random() * gridSize);
      bullets.splice(index, 1);
    }
  });

  drawGame();
  setTimeout(updateGame, 200);
}

drawGame();
updateGame();
