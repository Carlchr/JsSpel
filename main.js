//Player
class Player {
  constructor() {
    this.playerSize = 25;
    this.playerSpeed = 5;
    this.playerPlayerHealth = 100;
    this.playerX = 0;
    this.playerY = 0;
  }

  drawPlayer() {
    ctx.fillStyle = "blue";
    ctx.fillRect(
      this.playerX * this.cellSize,
      this.playerY * this.cellSize,
      this.cellSize,
      this.cellSize
    );
  }
}

class Bullets {
  constructor() {
    this.bulletDamage = 5;
    this.bullet = [];
    this.bulletSize = 10;
    this.bulletX = 0;
    this.bulletY = 0;
    this.direction = "right";
  }

  drawBullet() {
    this.bullet.forEach((bullet) => {
      ctx.fillRect(
        bullet.x * this.bulletSize,
        bullet.y * this.bulletSize,
        this.bulletSize,
        this.bulletSize
      );
    });
  }
}

//Zombie
class Zombie {
  constructor() {
    this.zombieSize = 15;
    this.zombieSpeed = 2;
    this.zombieHealth = 20;
    this.zombieX = 0;
    this.zombieY = 0;
  }

  drawZombie() {
    ctx.fillStyle = "green";
    ctx.fillRect(
      this.zombieX * this.cellSize,
      this.zombieY * this.cellSize,
      this.cellSize,
      this.cellSize
    );
  }
}

//Spelet
const canvas = document.getElementById("gameCanvas");
/** @type {CanvasRenderingContext2D} */
const ctx = canvas.getContext("2d");

class Game {
  constructor() {
    this.gridSize = 10;
    this.cellSize = 16; //Storlek på tiles
    this.tilemap = new Image(); //Tilemap tar en bild
    this.tilemap.src = "assets/free.png"; //Källan på bilden
    this.tiles = [
      [
        { tileIndex: 28, type: "water" },
        { tileIndex: 28, type: "water" },
        { tileIndex: 28, type: "water" },
        { tileIndex: 28, type: "water" },
        { tileIndex: 28, type: "water" },
        { tileIndex: 28, type: "water" },
        { tileIndex: 28, type: "water" },
        { tileIndex: 28, type: "water" },
        { tileIndex: 28, type: "water" },
        { tileIndex: 28, type: "water" },
      ],
      [
        { tileIndex: 28, type: "water" },
        { tileIndex: 28, type: "water" },
        { tileIndex: 28, type: "water" },
        { tileIndex: 28, type: "water" },
        { tileIndex: 28, type: "water" },
        { tileIndex: 28, type: "water" },
        { tileIndex: 28, type: "water" },
        { tileIndex: 28, type: "water" },
        { tileIndex: 28, type: "water" },
        { tileIndex: 28, type: "water" },
      ],
      [
        { tileIndex: 28, type: "water" },
        { tileIndex: 28, type: "water" },
        { tileIndex: 28, type: "water" },
        { tileIndex: 28, type: "water" },
        { tileIndex: 28, type: "water" },
        { tileIndex: 28, type: "water" },
        { tileIndex: 28, type: "water" },
        { tileIndex: 28, type: "water" },
        { tileIndex: 28, type: "water" },
        { tileIndex: 28, type: "water" },
      ],
      [
        { tileIndex: 28, type: "water" },
        { tileIndex: 28, type: "water" },
        { tileIndex: 28, type: "water" },
        { tileIndex: 28, type: "water" },
        { tileIndex: 28, type: "water" },
        { tileIndex: 28, type: "water" },
        { tileIndex: 28, type: "water" },
        { tileIndex: 28, type: "water" },
        { tileIndex: 28, type: "water" },
        { tileIndex: 28, type: "water" },
      ],
      [
        { tileIndex: 28, type: "water" },
        { tileIndex: 28, type: "water" },
        { tileIndex: 28, type: "water" },
        { tileIndex: 28, type: "water" },
        { tileIndex: 28, type: "water" },
        { tileIndex: 28, type: "water" },
        { tileIndex: 28, type: "water" },
        { tileIndex: 28, type: "water" },
        { tileIndex: 28, type: "water" },
        { tileIndex: 28, type: "water" },
      ],
      [
        { tileIndex: 28, type: "water" },
        { tileIndex: 28, type: "water" },
        { tileIndex: 28, type: "water" },
        { tileIndex: 28, type: "water" },
        { tileIndex: 28, type: "water" },
        { tileIndex: 28, type: "water" },
        { tileIndex: 28, type: "water" },
        { tileIndex: 28, type: "water" },
        { tileIndex: 28, type: "water" },
        { tileIndex: 28, type: "water" },
      ],
      [
        { tileIndex: 28, type: "water" },
        { tileIndex: 28, type: "water" },
        { tileIndex: 28, type: "water" },
        { tileIndex: 28, type: "water" },
        { tileIndex: 28, type: "water" },
        { tileIndex: 28, type: "water" },
        { tileIndex: 28, type: "water" },
        { tileIndex: 28, type: "water" },
        { tileIndex: 28, type: "water" },
        { tileIndex: 28, type: "water" },
      ],

      // Add more rows as needed
    ];
  }

  drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); //Tömmer allt

    const tilesPerRow = 16; //Tiles på tilemap
    const tilesPerColumn = 12; //tiles per column

    this.tiles.forEach((row, y) => {
      row.forEach((tile, x) => {
        const { tileIndex } = tile; // Get the tileIndex from the tile object
        const tileX = (tileIndex % tilesPerRow) * this.cellSize; //Räknar ut tileposition i x
        const tileY = Math.floor(tileIndex / tilesPerColumn) * this.cellSize; // R

        console.log(tileX, tileY);
        // Draw the tile on the canvas
        ctx.drawImage(
          this.tilemap,
          tileX,
          tileY,
          this.cellSize,
          this.cellSize,
          x * this.cellSize * 3,
          y * this.cellSize * 3cs,
          this.cellSize * 3,
          this.cellSize * 3
        );
      });
    });

    // Draw grid lines
    ctx.strokeStyle = "lightgray";
    for (let i = 0; i <= this.gridSize; i++) {
      ctx.beginPath();
      ctx.moveTo(i * this.cellSize, 0);
      ctx.lineTo(i * this.cellSize, canvas.height);
      ctx.moveTo(0, i * this.cellSize);
      ctx.lineTo(canvas.width, i * this.cellSize);
      ctx.stroke();
    }
  }

  updateGame() {
    this.bullet.forEach((bullet) => {
      if (bulletHandeler.direction === "up") bullet.y--;
      if (bulletHandeler.direction === "down") bullet.y++;
      if (bulletHandeler.direction === "left") bullet.x--;
      if (bulletHandeler.direction === "right") bullet.x++;
    });
  }
}

document.addEventListener("keydown", (e) => {
  //Fixa W och w

  //Flytta gubbe
  if (e.key === "w" && player.playerY > 0) {
    player.playerY--;
  }
  if (e.key === "s" && player.playerY < gridSize - 1) {
    player.playerY++;
  }
  if (e.key === "a" && player.playerX > 0) {
    player.playerX--;
  }
  if (e.key === "d" && player.playerX < gridSize - 1) {
    player.playerX++;
  }

  //Flytta skott
  if (e.key === "ArrowLeft") {
    bulletHandeler.direction = "left";
  }

  if (e.key === "ArrowUp") {
    bulletHandeler.direction = "up";
  }

  if (e.key === "ArrowRight") {
    bulletHandeler.direction = "right";
  }

  if (e.key === "ArrowDown") {
    bulletHandeler.direction = "down";
  }
  if (e.key === " ") {
    bulletHandeler.bullet.push({
      x: player.playerX,
      y: player.playerY,
      dir: bulletHandeler.direction,
    });
  }
  // drawGame();
});

//Starta spel
const bulletHandeler = new Bullets();
const zombie = new Zombie();
const player = new Player();
const game = new Game();
game.tilemap.onload = () => {
  game.drawGame(); //
};
