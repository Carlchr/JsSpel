//Player
class Player {
  constructor() {
    this.playerSize = 25;
    this.playerSpeed = 5;
    this.playerPlayerHealth = 100;
    this.playerX = 0
    this.playerY = 0
  }

  drawPlayer() {
    ctx.fillStyle = "blue";
    ctx.fillRect(playerX * cellSize, playerY * cellSize, cellSize, cellSize);
  }
}

class Bullets {
  constructor() {
    this.bulletDamage = 5;
    this.bulletSize = 10
    this.direction = "right"
  }

  drawBullet() {
    ctx.fillStyle = "red";

    bullets.forEach((bullet) => {
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
    this.cellSize = 32; //Storlek på tiles
    this.tilemap = new Image(); //Tilemap tar en bild
    this.tilemap.src = "assets/Tilemap.png"; //Källan på bilden
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
    ctx.clearRect(0, 0, canvas.width, canvas.height); //Tömmer allt

    const tilesPerRow = 16; //Tiles på tilemap
    const tilesPerColumn = 12; //tiles per column

    this.tiles.forEach((row, y) => {
      row.forEach((tile, x) => {
        const { tileIndex } = tile; // Get the tileIndex from the tile object
        const tileX = (tileIndex % tilesPerRow) * this.cellSize; //Räknar ut tileposition i x
        const tileY = Math.floor(tileIndex / tilesPerColumn) * this.cellSize; // R

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

  updateGame(){
    
    if (Bullets.direction === "up") bullet.y--;
    if (Bullets.direction === "down") bullet.y++;
    if (Bullets.direction === "left") bullet.x--;
    if (Bullets.direction === "right") bullet.x++;
  }


}

const game = new Game();
game.tilemap.onload = () => {
  game.drawGame(); // Ensure the tilemap is loaded before drawing
};


document.addEventListener("keydown", (e) => {

  //Fixa W och w

  //Flytta gubbe
  if (e.key === "w"  && playerY > 0) {
    playerY--;
  }
  if (e.key === "s" && playerY < gridSize - 1) {
    playerY++;
  }
  if (e.key === "a" && playerX > 0) {
    playerX--;
  }
  if (e.key === "d" && playerX < gridSize - 1) {
    playerX++;
  }
  
  //Flytta gubbe
  if(e.key === ArrowLeft){
    Bullets.direction = "left"
  }
  
  if(e.key === ArrowUp){
    Bullets.direction = "up"
  }
  
  if(e.key === ArrowRight){
    Bullets.direction = "right"
  }
  
  if(e.key === ArrowDown){
    Bullets.direction = "down"
  }
  if (e.key === " ") {
    bullets.push({ x: playerX, y: playerY, dir: Bullets.direction });
  }
  drawGame();
});

//Flytta skott
