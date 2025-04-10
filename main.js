//Player
class Player {
  constructor() {
    this.playerSize = 25;
    this.playerSpeed = 5;
    this.playerPlayerHealth = 100;
  }

  drawPlayer() {
    ctx.fillStyle = "blue";
    ctx.fillRect(playerX * cellSize, playerY * cellSize, cellSize, cellSize);
  }
}

class Bullets {
  constructor() {
    this.bulletDamage = 5;
  }

  drawBullet() {
    ctx.fillStyle = "red";

    bullets.forEach((bullet) => {
      ctx.fillRect(
        bullet.x * cellSize,
        bullet.y * cellSize,
        cellSize,
        cellSize
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
  }

  drawZombie() {
    ctx.fillStyle = "green";
    ctx.fillRect(zombie.x * cellSize, zombie.y * cellSize, cellSize, cellSize);
  }
}

//Spelet
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

class Game {
  constructor() {
    this.gridSize = 10;
    this.cellSize = 32; // Update to match the tile size in the tilemap
    this.tilemap = new Image();
    this.tilemap.src = "assets/Tilemap.png"; // Path to your tilemap image
    this.tiles = [
      [
        { tileIndex: 1, type: "water" },
        { tileIndex: 1, type: "grass" },
        { tileIndex: 1, type: "water" },
        { tileIndex: 1, type: "grass" },
        { tileIndex: 1, type: "water" },
        { tileIndex: 1, type: "grass" },
        { tileIndex: 1, type: "water" },
        { tileIndex: 1, type: "grass" },
        { tileIndex: 1, type: "water" },
        { tileIndex: 1, type: "grass" },
      ],
      [
        { tileIndex: 1, type: "water" },
        { tileIndex: 1, type: "grass" },
        { tileIndex: 1, type: "water" },
        { tileIndex: 1, type: "grass" },
        { tileIndex: 1, type: "water" },
        { tileIndex: 1, type: "grass" },
        { tileIndex: 1, type: "water" },
        { tileIndex: 1, type: "grass" },
        { tileIndex: 1, type: "water" },
        { tileIndex: 1, type: "grass" },
      ],
      [
        { tileIndex: 1, type: "water" },
        { tileIndex: 1, type: "grass" },
        { tileIndex: 1, type: "water" },
        { tileIndex: 1, type: "grass" },
        { tileIndex: 1, type: "water" },
        { tileIndex: 1, type: "grass" },
        { tileIndex: 1, type: "water" },
        { tileIndex: 1, type: "grass" },
        { tileIndex: 1, type: "water" },
        { tileIndex: 1, type: "grass" },
      ],
      [
        { tileIndex: 1, type: "water" },
        { tileIndex: 1, type: "grass" },
        { tileIndex: 1, type: "water" },
        { tileIndex: 1, type: "grass" },
        { tileIndex: 1, type: "water" },
        { tileIndex: 1, type: "grass" },
        { tileIndex: 1, type: "water" },
        { tileIndex: 1, type: "grass" },
        { tileIndex: 1, type: "water" },
        { tileIndex: 1, type: "grass" },
      ],
      [
        { tileIndex: 1, type: "water" },
        { tileIndex: 1, type: "grass" },
        { tileIndex: 1, type: "water" },
        { tileIndex: 1, type: "grass" },
        { tileIndex: 1, type: "water" },
        { tileIndex: 1, type: "grass" },
        { tileIndex: 1, type: "water" },
        { tileIndex: 1, type: "grass" },
        { tileIndex: 1, type: "water" },
        { tileIndex: 1, type: "grass" },
      ],
      [
        { tileIndex: 1, type: "water" },
        { tileIndex: 1, type: "grass" },
        { tileIndex: 1, type: "water" },
        { tileIndex: 1, type: "grass" },
        { tileIndex: 1, type: "water" },
        { tileIndex: 1, type: "grass" },
        { tileIndex: 1, type: "water" },
        { tileIndex: 1, type: "grass" },
        { tileIndex: 1, type: "water" },
        { tileIndex: 1, type: "grass" },
      ],
      [
        { tileIndex: 1, type: "water" },
        { tileIndex: 1, type: "grass" },
        { tileIndex: 1, type: "water" },
        { tileIndex: 1, type: "grass" },
        { tileIndex: 1, type: "water" },
        { tileIndex: 1, type: "grass" },
        { tileIndex: 1, type: "water" },
        { tileIndex: 1, type: "grass" },
        { tileIndex: 1, type: "water" },
        { tileIndex: 1, type: "grass" },
      ],
      [
        { tileIndex: 1, type: "water" },
        { tileIndex: 1, type: "grass" },
        { tileIndex: 1, type: "water" },
        { tileIndex: 1, type: "grass" },
        { tileIndex: 1, type: "water" },
        { tileIndex: 1, type: "grass" },
        { tileIndex: 1, type: "water" },
        { tileIndex: 1, type: "grass" },
        { tileIndex: 1, type: "water" },
        { tileIndex: 1, type: "grass" },
      ],
      [
        { tileIndex: 1, type: "water" },
        { tileIndex: 1, type: "grass" },
        { tileIndex: 1, type: "water" },
        { tileIndex: 1, type: "grass" },
        { tileIndex: 1, type: "water" },
        { tileIndex: 1, type: "grass" },
        { tileIndex: 1, type: "water" },
        { tileIndex: 1, type: "grass" },
        { tileIndex: 1, type: "water" },
        { tileIndex: 1, type: "grass" },
      ],
      [
        { tileIndex: 1, type: "water" },
        { tileIndex: 1, type: "grass" },
        { tileIndex: 1, type: "water" },
        { tileIndex: 1, type: "grass" },
        { tileIndex: 1, type: "water" },
        { tileIndex: 1, type: "grass" },
        { tileIndex: 1, type: "water" },
        { tileIndex: 1, type: "grass" },
        { tileIndex: 1, type: "water" },
        { tileIndex: 1, type: "grass" },
      ],

      // Add more rows as needed
    ];
  }

  drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const tilesPerRow = 16; // Number of tiles per row in the tilemap

    this.tiles.forEach((row, y) => {
      row.forEach((tile, x) => {
        const { tileIndex } = tile; // Get the tileIndex from the tile object

        // Calculate the tile's position in the tilemap
        const tileX = (tileIndex % tilesPerRow) * this.cellSize;
        const tileY = Math.floor(tileIndex / tilesPerRow) * this.cellSize;

        // Draw the tile on the canvas
        ctx.drawImage(
          this.tilemap,
          tileX,
          tileY,
          this.cellSize,
          this.cellSize,
          x * this.cellSize,
          y * this.cellSize,
          this.cellSize,
          this.cellSize
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
}

const game = new Game();
game.tilemap.onload = () => {
  game.drawGame(); // Ensure the tilemap is loaded before drawing
};
