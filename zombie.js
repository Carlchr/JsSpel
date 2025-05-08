export class Zombie {
    constructor(cellSize, startX, startY, game, canvas, ctx) {
      this.zombieSize = 32;
      this.zombieSpeed = 1;
      this.zombieHealth = 20 + 4 * game.level;
      this.zombieDamage = 5 + game.level;
      this.attackCooldown = 0;
      this.zombie = [];
      this.zombieX = startX;
      this.zombieY = startY;
      this.cellSize = cellSize;
      this.image = new Image();
      this.image.src = "assets/monsters.png";
      this.respawnCount = 0;
      this.canvas = canvas;
      this.ctx = ctx;
    }
  
    respawnZombie(game) {
      const maxX = Math.floor(this.canvas.width / this.cellSize);
      const maxY = Math.floor(this.canvas.height / this.cellSize);
  
      this.zombieX = Math.floor(Math.random() * maxX);
      this.zombieY = Math.floor(Math.random() * maxY);
      this.zombieHealth = 20 + 4 * game.level;
      this.respawnCount++;
      game.coinCount += game.level;
      console.log("Respawn count:", this.respawnCount);
    }
  
    drawZombie() {
      this.ctx.drawImage(
        this.image,
        this.zombieX * this.cellSize,
        this.zombieY * this.cellSize,
        this.zombieSize,
        this.zombieSize
      );
    }
  
    checkBulletCollision(bullets, game) {
        for (let i = bullets.bullet.length - 1; i >= 0; i--) {
          const bullet = bullets.bullet[i];
          const zombieLeft = this.zombieX * this.cellSize;
          const zombieRight = zombieLeft + this.zombieSize;
          const zombieTop = this.zombieY * this.cellSize;
          const zombieBottom = zombieTop + this.zombieSize;
      
          const bulletLeft = bullet.x;
          const bulletRight = bullet.x + bullets.bulletSize;
          const bulletTop = bullet.y;
          const bulletBottom = bullet.y + bullets.bulletSize;
      
          if (
            bulletRight > zombieLeft &&
            bulletLeft < zombieRight &&
            bulletBottom > zombieTop &&
            bulletTop < zombieBottom
          ) {
            this.zombieHealth -= bullets.bulletDamage;
            bullets.bullet.splice(i, 1);
      
            if (this.zombieHealth <= 0) {
              this.respawnZombie(game);
            }
          }
        }
      }
  
    trackPlayer(player, game, checkCollision) {
      if (checkCollision(player, this)) {
        if (this.attackCooldown <= 0) {
          player.playerHealth -= this.zombieDamage;
          this.attackCooldown = 30;
        }
        return;
      }
  
      const dX = player.playerX - this.zombieX * this.cellSize;
      const dY = player.playerY - this.zombieY * this.cellSize;
      const distance = Math.sqrt(dX * dX + dY * dY);
  
      if (distance < 1) {
        player.playerHealth -= this.zombieDamage;
        return;
      }
  
      const riktningX = dX / distance;
      const riktningY = dY / distance;
      this.zombieX += (riktningX * this.zombieSpeed) / this.cellSize;
      this.zombieY += (riktningY * this.zombieSpeed) / this.cellSize;
    }
  }