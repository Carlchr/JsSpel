export class Game {
    constructor(backgroundLibrary, canvas, ctx) {
      this.gridSize = 13;
      this.cellSize = 16;
      this.level = 1;
      this.coinCount = 0;
      this.tilemap = new Image();
      this.tilemap.src = "assets/Tilemap.png";
      this.overlay = new Image();
      this.overlay.src = "assets/Tilemap.png";
      this.backgroundLibrary = backgroundLibrary; //Så att jag kan använda backgroundLibrary i klassen
      this.tiles = this.backgroundLibrary.background1;
      this.canvas = canvas;
      this.ctx = ctx;
    }

    drawGame() {
        const tilesPerRow = 13; // Tiles per row in the tilemap
        const tilesPerColumn = 13; // Tiles per column in the tilemap
    
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    
        this.tiles.forEach((row, y) => {
          row.forEach((tile, x) => {
            const { tileIndex, overlayIndex } = tile;
    
            //Pick tile from tilemap according to tileIndex
            const tileMapX = (tileIndex % tilesPerRow) * this.cellSize;
            const tileMapY = Math.floor(tileIndex / tilesPerColumn) * this.cellSize;
    
            // Draw the base tile
            this.ctx.drawImage(
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
    
              this.ctx.drawImage(
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
        this.ctx.fillStyle = "blue";
        this.ctx.fillRect(
          player.playerX, // Use exact pixel position
          player.playerY, // Use exact pixel position
          player.playerSizeX,
          player.playerSizeY
        );
      }

      drawBullets(bullets) {
        this.ctx.fillStyle = "red";
        bullets.bullet.forEach((bullet, index) => {
            this.ctx.beginPath();
            this.ctx.arc(bullet.x, bullet.y, bullets.bulletSize, 0, 2 * Math.PI);
            this.ctx.fill();
    
          // Flytta skottet
          if (bullet.direction === "up") bullet.y -= bullet.speed;
          if (bullet.direction === "down") bullet.y += bullet.speed;
          if (bullet.direction === "left") bullet.x -= bullet.speed;
          if (bullet.direction === "right") bullet.x += bullet.speed;
    
          // Ta bort skott om det lämnar canvasen
          if (
            bullet.x < 0 ||
            bullet.x > this.canvas.width ||
            bullet.y < 0 ||
            bullet.y > this.canvas.height
          ) {
            bullets.bullet.splice(index, 1);
          }
        });
      }

      checkDeath(player) {
        if (player.playerHealth <= 0) {
          alert("Game Over!, YOU DIED"); // Visa meddelande
          return true; // Avsluta funktionen
        }
        return false
      }

      increaseLevel(zombie, zombie2) {
        var previousLevel = this.level; //Spara nivån innan den ökar
        this.level++; //Öka nivån med 1
        if (previousLevel <= 1 && this.level >= 2) {
          // this.tilemap.src = "Tilemap_2.png"; 
          this.overlay.src = "Tilemap_2.png"; 
          this.tiles = this.backgroundLibrary.background2; //Kebab är en array med bakgrundsbilder
        }
    
        zombie.respawnCount = 0; // Återställ respawn-räknaren för zombien
        zombie2.respawnCount = 0; // Återställ respawn-räknaren för zombien nummer 2
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