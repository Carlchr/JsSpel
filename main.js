//Player
class Player {
  constructor() {
    this.playerSizeX = 24; //Player size
    this.playerSizeY = 47; //Player size
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

    this.overlay = new Image(); //Overlay tar en bild
    this.overlay.src = "assets/free.png"; //Källan på bilden

    this.tiles = [
      [
        { tileIndex: 6, type: "not_walkable"},
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
          const overlayY = Math.floor(overlayIndex / tilesPerColumn) * this.cellSize;

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

    // Draw grid (optional)
    // ctx.strokeStyle = "lightgray";
    // for (let i = 0; i <= this.gridSize; i++) {
    //   ctx.beginPath();
    //   ctx.moveTo(i * this.cellSize * 3, 0);
    //   ctx.lineTo(i * this.cellSize * 3, canvas.height);
    //   ctx.moveTo(0, i * this.cellSize * 3);
    //   ctx.lineTo(canvas.width, i * this.cellSize * 3);
    //   ctx.stroke();
    // }
  }

  //Kordinat på spelaren och vart man kan gå
  isTileWalkable(x, y, width, height, walkable = ["walkable"]) {
    const tileX1 = Math.floor((x + width) / (this.cellSize * 3)); //Kollar vilken tile spelaren är på(bredd inkluderad)
    const tileX = Math.floor(x / (this.cellSize * 3)); //Kollar vilken tile spelaren är på, tar x positionen och delar med cellstorleken
    const tileY1 = Math.floor((y + height) / (this.cellSize * 3)); //Kollar vilken tile spelaren är på(höjd inkluderad)
    const tileY = Math.floor(y / (this.cellSize * 3)); //Kollar vilken tile spelaren är på, tar x positionen och delar med cellstorleken

    console.log(x, y, tileX, tileY, tileX1, tileY1);

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

//Håller igång spelet
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); //Tömmer canvasen

  //Om knappen är nedtryckt och inom gränserna
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

  //Om knappen är nedtryckt och om cooldown är noll
  if (keys.Space && bulletHandeler.shootCooldown === 0) {
    //Lägger till ett skott i arrayen med  x, y, riktning och hastighet
    bulletHandeler.bullet.push({
      x:
        player.playerX +
        player.playerSizeX / 2 -
        bulletHandeler.bulletSize / 2, // Starta från spelarens mitt
      y: player.playerY,
      direction: bulletHandeler.direction,
      speed: 5, // Hastighet för skottet
    });
    //Gör cooldown till 20 frames
    bulletHandeler.shootCooldown = 20; // Återställ cooldown
  }

  //Minskar cooldown med 1 varje frame
  if (bulletHandeler.shootCooldown > 0) {
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
