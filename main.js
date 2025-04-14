//Player
class Player {
  constructor() {
    this.playerSizeX = 24;//Player size
    this.playerSizeY = 48;//Player size
    this.playerSpeed = 1; //Player speed
    this.playerPlayerHealth = 100; //Player health§
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
    if (game.isTileWalkable(nyX, nyY, ["walkable"])) {
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
        { tileIndex: 6, type: "not_walkable" },
        { tileIndex: 28, type: "walkable" },
        { tileIndex: 28, type: "walkable" },
        { tileIndex: 28, type: "walkable" },
        { tileIndex: 28, type: "walkable" },
        { tileIndex: 28, type: "walkable" },
        { tileIndex: 28, type: "walkable" },
        { tileIndex: 28, type: "walkable" },
        { tileIndex: 28, type: "walkable" },
        { tileIndex: 28, type: "walkable" },
        { tileIndex: 28, type: "walkable" },
        { tileIndex: 28, type: "walkable" },
        { tileIndex: 28, type: "walkable" },
      ],
      [
        { tileIndex: 28, type: "walkable" },
        { tileIndex: 28, type: "walkable" },
        { tileIndex: 28, type: "walkable" },
        { tileIndex: 28, type: "walkable" },
        { tileIndex: 28, type: "walkable" },
        { tileIndex: 28, type: "walkable" },
        { tileIndex: 28, type: "walkable" },
        { tileIndex: 28, type: "walkable" },
        { tileIndex: 28, type: "walkable" },
        { tileIndex: 28, type: "walkable" },
        { tileIndex: 28, type: "walkable" },
        { tileIndex: 28, type: "walkable" },
        { tileIndex: 28, type: "walkable" },
      ],
      [
        { tileIndex: 28, type: "walkable" },
        { tileIndex: 28, type: "walkable" },
        { tileIndex: 28, type: "walkable" },
        { tileIndex: 28, type: "walkable" },
        { tileIndex: 28, type: "walkable" },
        { tileIndex: 28, type: "walkable" },
        { tileIndex: 28, type: "walkable" },
        { tileIndex: 28, type: "walkable" },
        { tileIndex: 28, type: "walkable" },
        { tileIndex: 28, type: "walkable" },
        { tileIndex: 28, type: "walkable" },
        { tileIndex: 28, type: "walkable" },
        { tileIndex: 28, type: "walkable" },
      ],
      [
        { tileIndex: 28, type: "walkable" },
        { tileIndex: 28, type: "walkable" },
        { tileIndex: 28, type: "walkable" },
        { tileIndex: 28, type: "walkable" },
        { tileIndex: 28, type: "walkable" },
        { tileIndex: 28, type: "walkable" },
        { tileIndex: 28, type: "walkable" },
        { tileIndex: 28, type: "walkable" },
        { tileIndex: 28, type: "walkable" },
        { tileIndex: 28, type: "walkable" },
        { tileIndex: 28, type: "walkable" },
        { tileIndex: 28, type: "walkable" },
        { tileIndex: 28, type: "walkable" },
      ],
      [
        { tileIndex: 28, type: "walkable" },
        { tileIndex: 28, type: "walkable" },
        { tileIndex: 28, type: "walkable" },
        { tileIndex: 28, type: "walkable" },
        { tileIndex: 28, type: "walkable" },
        { tileIndex: 28, type: "walkable" },
        { tileIndex: 28, type: "walkable" },
        { tileIndex: 28, type: "walkable" },
        { tileIndex: 28, type: "walkable" },
        { tileIndex: 28, type: "walkable" },
        { tileIndex: 28, type: "walkable" },
        { tileIndex: 28, type: "walkable" },
        { tileIndex: 28, type: "walkable" },
      ],
      [
        { tileIndex: 28, type: "walkable" },
        { tileIndex: 28, type: "walkable" },
        { tileIndex: 28, type: "walkable" },
        { tileIndex: 28, type: "walkable" },
        { tileIndex: 28, type: "walkable" },
        { tileIndex: 28, type: "walkable" },
        { tileIndex: 28, type: "walkable" },
        { tileIndex: 28, type: "walkable" },
        { tileIndex: 28, type: "walkable" },
        { tileIndex: 28, type: "walkable" },
        { tileIndex: 28, type: "walkable" },
        { tileIndex: 28, type: "walkable" },
        { tileIndex: 28, type: "walkable" },
      ],
      [
        { tileIndex: 28, type: "walkable" },
        { tileIndex: 28, type: "walkable" },
        { tileIndex: 28, type: "walkable" },
        { tileIndex: 28, type: "walkable" },
        { tileIndex: 28, type: "walkable" },
        { tileIndex: 28, type: "walkable" },
        { tileIndex: 28, type: "walkable" },
        { tileIndex: 28, type: "walkable" },
        { tileIndex: 28, type: "walkable" },
        { tileIndex: 28, type: "walkable" },
        { tileIndex: 28, type: "walkable" },
        { tileIndex: 28, type: "walkable" },
        { tileIndex: 28, type: "walkable" },
      ],
      [
        { tileIndex: 28, type: "walkable" },
        { tileIndex: 28, type: "walkable" },
        { tileIndex: 28, type: "walkable" },
        { tileIndex: 28, type: "walkable" },
        { tileIndex: 28, type: "walkable" },
        { tileIndex: 28, type: "walkable" },
        { tileIndex: 28, type: "walkable" },
        { tileIndex: 28, type: "walkable" },
        { tileIndex: 28, type: "walkable" },
        { tileIndex: 28, type: "walkable" },
        { tileIndex: 28, type: "walkable" },
        { tileIndex: 28, type: "walkable" },
        { tileIndex: 28, type: "walkable" },
      ],
      [
        { tileIndex: 28, type: "walkable" },
        { tileIndex: 28, type: "walkable" },
        { tileIndex: 28, type: "walkable" },
        { tileIndex: 28, type: "walkable" },
        { tileIndex: 28, type: "walkable" },
        { tileIndex: 28, type: "walkable" },
        { tileIndex: 28, type: "walkable" },
        { tileIndex: 28, type: "walkable" },
        { tileIndex: 28, type: "walkable" },
        { tileIndex: 28, type: "walkable" },
        { tileIndex: 28, type: "walkable" },
        { tileIndex: 28, type: "walkable" },
        { tileIndex: 28, type: "walkable" },
      ],
      [
        { tileIndex: 28, type: "walkable" },
        { tileIndex: 28, type: "walkable" },
        { tileIndex: 28, type: "walkable" },
        { tileIndex: 28, type: "walkable" },
        { tileIndex: 28, type: "walkable" },
        { tileIndex: 28, type: "walkable" },
        { tileIndex: 28, type: "walkable" },
        { tileIndex: 28, type: "walkable" },
        { tileIndex: 28, type: "walkable" },
        { tileIndex: 28, type: "walkable" },
        { tileIndex: 28, type: "walkable" },
        { tileIndex: 28, type: "walkable" },
        { tileIndex: 28, type: "walkable" },
      ],
      [
        { tileIndex: 28, type: "walkable" },
        { tileIndex: 28, type: "walkable" },
        { tileIndex: 28, type: "walkable" },
        { tileIndex: 28, type: "walkable" },
        { tileIndex: 28, type: "walkable" },
        { tileIndex: 28, type: "walkable" },
        { tileIndex: 28, type: "walkable" },
        { tileIndex: 28, type: "walkable" },
        { tileIndex: 28, type: "walkable" },
        { tileIndex: 28, type: "walkable" },
        { tileIndex: 28, type: "walkable" },
        { tileIndex: 28, type: "walkable" },
        { tileIndex: 28, type: "walkable" },
      ],
      [
        { tileIndex: 28, type: "walkable" },
        { tileIndex: 28, type: "walkable" },
        { tileIndex: 28, type: "walkable" },
        { tileIndex: 28, type: "walkable" },
        { tileIndex: 28, type: "walkable" },
        { tileIndex: 28, type: "walkable" },
        { tileIndex: 28, type: "walkable" },
        { tileIndex: 28, type: "walkable" },
        { tileIndex: 28, type: "walkable" },
        { tileIndex: 28, type: "walkable" },
        { tileIndex: 28, type: "walkable" },
        { tileIndex: 28, type: "walkable" },
        { tileIndex: 28, type: "walkable" },
      ],
      [
        { tileIndex: 28, type: "walkable" },
        { tileIndex: 28, type: "walkable" },
        { tileIndex: 28, type: "walkable" },
        { tileIndex: 28, type: "walkable" },
        { tileIndex: 28, type: "walkable" },
        { tileIndex: 28, type: "walkable" },
        { tileIndex: 28, type: "walkable" },
        { tileIndex: 28, type: "walkable" },
        { tileIndex: 28, type: "walkable" },
        { tileIndex: 28, type: "walkable" },
        { tileIndex: 28, type: "walkable" },
        { tileIndex: 28, type: "walkable" },
        { tileIndex: 28, type: "walkable" },
      ],
      
    ];
  }

  //Ritar spelet  
  drawGame() {
    const tilesPerRow = 16; //Tiles på tilemap
    const tilesPerColumn = 12; //tiles per column

    this.tiles.forEach((row, y) => {
      row.forEach((tile, x) => {

        const { tileIndex } = tile; //tar indexen på tilen och sätter det som variabeln tile
        const tileX = (tileIndex % tilesPerRow) * this.cellSize; //Räknar ut tileposition i x
        const tileY = Math.floor(tileIndex / tilesPerColumn) * this.cellSize; //Räknar ut tileposition i y

        //Ritar tilemapen
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

  //Kordinat på spelaren och vart man kan gå
  isTileWalkable(x, y, walkable = ["walkable"]) {
    const tileX = Math.floor(x / (this.cellSize * 3)); //Kollar vilken tile spelaren är på, tar x positionen och delar med cellstorleken
    const tileY = Math.floor(y / (this.cellSize * 3)); //Kollar vilken tile spelaren är på, tar x positionen och delar med cellstorleken
  
    //Om spelaren är utanför kartan, return false
    if (tileX < 0 || tileY < 0 || tileY >= this.tiles.length || tileX >= this.tiles[0].length) {
      return false;
    } else{
      //om tiles listan har tilen man står på och om typen är walkable, return true
      return walkable.includes(this.tiles[tileY][tileX].type);
    }


    
  }
}

//Definerar player och zombies och bullets
const bulletHandeler = new Bullets();
const player = new Player();
const zombie = new Zombie();
const game = new Game();

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
}

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
  if (e.key === "ArrowRight"){
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

//Håller igång spelet
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); //Tömmer canvasen

  //Om knappen är nedtryckt och inom gränserna
  if (keys.w && player.playerY > 0) {player.movePlayer("up");}
  if (keys.s && player.playerY < canvas.height - player.playerSizeY) {player.movePlayer("down");}
  if (keys.a && player.playerX > 0) {player.movePlayer("left");}
  if (keys.d && player.playerX < canvas.width - player.playerSizeX) {player.movePlayer("right");}

  //Om knappen är nedtryckt och om cooldown är noll
  if (keys.Space && bulletHandeler.shootCooldown === 0) {
    //Lägger till ett skott i arrayen med  x, y, riktning och hastighet
    bulletHandeler.bullet.push({
      x: player.playerX + player.playerSizeX / 2 - bulletHandeler.bulletSize / 2, // Starta från spelarens mitt
      y: player.playerY,
      direction: bulletHandeler.direction,
      speed: 5, // Hastighet för skottet
    });
    //Gör cooldown till 20 frames
    bulletHandeler.shootCooldown = 20; // Återställ cooldown 
  }

  //Minskar cooldown med 1 varje frame
  if ( bulletHandeler.shootCooldown > 0) {
    bulletHandeler.shootCooldown--;
  }
  
  

  game.drawGame(); //Ritar bakgrunden
  player.drawPlayer(); //Ritar spelaren
  bulletHandeler.drawBullet(); //Ritar skotten
  zombie.drawZombie(); //Ritar zombien

  requestAnimationFrame(gameLoop); // Fortsätter loopen
}

//Startar game loopen, och göt det när tilemapen är laddad
game.tilemap.onload = () => {
  gameLoop();
};
