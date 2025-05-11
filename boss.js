export class Boss {
  constructor(cellSize, startX, startY, game, canvas, ctx) {
    this.bossSize = 64; // Större storlek för boss
    this.bossSpeed = 0.5; // Långsammare än vanliga zombies
    this.bossHealth = 100 + 10 * game.level; // Mer hälsa
    this.bossDamage = 20 + game.level; // Mer skada
    this.attackCooldown = 0;
    this.boss = [];
    this.bossX = startX;
    this.bossY = startY;
    this.cellSize = cellSize;
    this.image = new Image();
    this.image.src = "assets/boss.png"; // Ny bild för boss
    this.respawnCount = 0;
    this.canvas = canvas;
    this.ctx = ctx;
  }

  drawBoss() {
    this.ctx.fillStyle = "red"; // Gör bossen röd
    this.ctx.fillRect(
      this.bossX * this.cellSize,
      this.bossY * this.cellSize,
      this.bossSize,
      this.bossSize
    );
  }

  checkBulletCollision(bullets, game) {
    for (let i = bullets.bullet.length - 1; i >= 0; i--) {
      const bullet = bullets.bullet[i];
      const bossLeft = this.bossX * this.cellSize;
      const bossRight = bossLeft + this.bossSize;
      const bossTop = this.bossY * this.cellSize;
      const bossBottom = bossTop + this.bossSize;

      const bulletLeft = bullet.x;
      const bulletRight = bullet.x + bullets.bulletSize;
      const bulletTop = bullet.y;
      const bulletBottom = bullet.y + bullets.bulletSize;

      if (
        bulletRight > bossLeft &&
        bulletLeft < bossRight &&
        bulletBottom > bossTop &&
        bulletTop < bossBottom
      ) {
        this.bossHealth -= bullets.bulletDamage;
        bullets.bullet.splice(i, 1);

        if (this.bossHealth <= 0) {
          this.respawnBoss(game);
        }
      }
    }
  }

  trackPlayer(player, game, checkCollision) {
    if (checkCollision(player, this)) {
      if (this.attackCooldown <= 0) {
        player.playerHealth -= this.bossDamage;
        this.attackCooldown = 50; // Längre cooldown för boss
      }
      return;
    }

    const dX = player.playerX - this.bossX * this.cellSize;
    const dY = player.playerY - this.bossY * this.cellSize;
    const distance = Math.sqrt(dX * dX + dY * dY);

    if (distance < 1) {
      player.playerHealth -= this.bossDamage;
      return;
    }

    const riktningX = dX / distance;
    const riktningY = dY / distance;
    this.bossX += (riktningX * this.bossSpeed) / this.cellSize;
    this.bossY += (riktningY * this.bossSpeed) / this.cellSize;
  }
}
