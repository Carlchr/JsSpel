//Player
class Player {
  constructor() {
    this.playerSize = 25;//Player size
    this.playerSpeed = 1; //Player speed
    this.playerPlayerHealth = 100; //Player health§
    this.playerX = canvas.width / 2 - this.playerSize / 2; //X position
    this.playerY = canvas.height / 2 - this.playerSize / 2; //Y position
    
  }

  drawPlayer() {
    ctx.fillStyle = "blue";
    ctx.fillRect(
      this.playerX, // Use exact pixel position
      this.playerY, // Use exact pixel position
      this.playerSize,
      this.playerSize
    );
  }

  movePlayer(direction) {
    // Update player position based on direction
    if (direction === "up") this.playerY -= this.playerSpeed;
    if (direction === "down") this.playerY += this.playerSpeed;
    if (direction === "left") this.playerX -= this.playerSpeed;
    if (direction === "right") this.playerX += this.playerSpeed;
  }
}

//Bullets
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

//Game
class Game {
  constructor() {
    this.gridSize = 13;
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
        { tileIndex: 28, type: "water" },
        { tileIndex: 28, type: "water" },
        { tileIndex: 28, type: "water" },
      ],
    ];
  }

  //Ritar spelet  
  drawGame() {
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
          y * this.cellSize * 3,
          this.cellSize * 3,
          this.cellSize * 3
        );
      });
    });

    //Ritar 
    ctx.strokeStyle = "lightgray";
    for (let i = 0; i <= this.gridSize; i++) {
      
      //* 3 för att göra rutor 3 ggr större
      ctx.beginPath();
      ctx.moveTo(i * this.cellSize * 3, 0);
      ctx.lineTo(i * this.cellSize * 3, canvas.height);
      ctx.moveTo(0, i * this.cellSize * 3);
      ctx.lineTo(canvas.width, i * this.cellSize * 3);
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

//håller koll vilka som är nedtrckta
const keys = {
  w: false,
  a: false,
  s: false,
  d: false,
}

document.addEventListener("keydown", (e) => {
  //Flytta gubbe

  if (e.key === "w") keys.w = true;
  if (e.key === "s") keys.s = true;
  if (e.key === "a") keys.a = true;
  if (e.key === "d") keys.d = true;

  // if (e.key === "w" && player.playerY > 0) {
  //   keys.w = true;
  //   direction = "up";
  //   player.playerY -= player.playerSpeed; // Move player up
  // }
  // if (e.key === "s" && player.playerY < canvas.height) {
  //   keys.s = true;
  //   direction = "down";
  //   player.playerY += player.playerSpeed; // Move player down 
  // }
  // if (e.key === "a" && player.playerX > 0) {
  //   keys.a = true;
  //   direction = "left";
  //   player.playerX -= player.playerSpeed; // Move player to the left
  // }
  // if (e.key === "d" && player.playerX < canvas.width) {
  //   keys.d = true;  
  //   direction = "right";  
  //   player.playerX += player.playerSpeed; // Move player to the right
  // }

});

document.addEventListener("keyup", (e) => {
  //Sluta flytta gubbe
  if (e.key === "w") keys.w = false;
  if (e.key === "s") keys.s = false;
  if (e.key === "a") keys.a = false;
  if (e.key === "d") keys.d = false;
});


//Definerar player och zombies och bullets
const bulletHandeler = new Bullets();
const player = new Player();
const zombie = new Zombie();
const game = new Game();

//Håller igång spelet
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); //Tömmer canvasen

  //Kollar om knappar är nedtryckta och flyttar spelaren

  //Om knappen är nedtryckt och inom gränserna
  if (keys.w && player.playerY > 0) {
    player.movePlayer("up");
  }
  
  if (keys.s && player.playerY < canvas.height - player.playerSize) {//tar hänsyn till storleken på spelaren med gränserna
    player.movePlayer("down");
  }
  if (keys.a && player.playerX > 0) {
    player.movePlayer("left");
  }
  if (keys.d && player.playerX < canvas.width - player.playerSize) {
    player.movePlayer("right");
  }


  game.drawGame(); //Ritar bakgrunden
  player.drawPlayer(); //Ritar spelaren
  bulletHandeler.drawBullet(); //Ritar skotten
  zombie.drawZombie(); //Ritar zombien

  requestAnimationFrame(gameLoop); // Fortsätter loopen
}

//Startar game loopen
game.tilemap.onload = () => {
  gameLoop();
};

