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
    tx.fillStyle = "green";
    ctx.fillRect(zombie.x * cellSize, zombie.y * cellSize, cellSize, cellSize);
  }
}

//Spelet
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

class Game {
  constructor() {
    this.gridSize = 10;
    this.cellSize = 40;
  }

  drawGame() {
    //Gör spelplanens storlek
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "lightgray";

    for (let i = 0; i <= gridSize; i++) {
      ctx.beginPath();

      //Flyttar och ritar sidan av cellen
      ctx.moveTo(i * cellSize, 0);
      ctx.lineTo(i * cellSize, canvas.height);

      //Flyttar och ritar toppen och botten av cellen
      ctx.moveTo(0, i * cellSize);
      ctx.lineTo(canvas.width, i * cellSize);

      //Gör allt
      ctx.stroke();
    }
  }
}
