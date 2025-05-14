export class Player {
  constructor(canvas) {
    this.playerSizeX = 24; //Player size
    this.playerSizeY = 47; //Player size
    this.playerSpeed = 2; //Player speed
    this.playerHealth = 100; //Player health§
    this.playerX = canvas.width / 2 - this.playerSizeX / 2; //X position
    this.playerY = canvas.height / 2 - this.playerSizeY / 2; //Y position
  }

  movePlayer(direction, game) {
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

export class Bullets {
  constructor() {
    this.bulletDamage = 5;
    this.bullet = [];
    this.bulletSize = 5;
    this.direction = "right";
    this.shootCooldown = 0;
    this.shootCooldownMax = 20; // Standardvärde för cooldown
  }
}

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

    this.projectiles = [];
    this.shootTimer = 0;
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

  shootAtPlayer(player) {
    // Skapa ett skott som går mot spelarens position
    this.projectiles.push({
      x: this.zombieX * this.cellSize + this.zombieSize / 2,
      y: this.zombieY * this.cellSize + this.zombieSize / 2,
      targetX: player.playerX + player.playerSizeX / 2,
      targetY: player.playerY + player.playerSizeY / 2,
      speed: 2,
    });
  }

  updateProjectilesWithPlayer(player) {
    console.log("Updating boss projectiles...");
    for (let index = this.projectiles.length - 1; index >= 0; index--) {
      const projectile = this.projectiles[index];
      const dx = projectile.targetX - projectile.x;
      const dy = projectile.targetY - projectile.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Flytta skottet
      projectile.x += (dx / distance) * projectile.speed;
      projectile.y += (dy / distance) * projectile.speed;

      // Kontrollera kollision med spelaren
      const playerLeft = player.playerX;
      const playerRight = player.playerX + player.playerSizeX;
      const playerTop = player.playerY;
      const playerBottom = player.playerY + player.playerSizeY;

      if (
        projectile.x > playerLeft &&
        projectile.x < playerRight &&
        projectile.y > playerTop &&
        projectile.y < playerBottom
      ) {
        player.playerHealth -= 10; // Spelaren tar 10 skada
        this.projectiles.splice(index, 1); // Ta bort projektilen
        console.log("Boss projectile hit the player!");
        continue;
      }

      // Ta bort skott om det lämnar canvasen
      if (
        projectile.x < 0 ||
        projectile.x > this.canvas.width ||
        projectile.y < 0 ||
        projectile.y > this.canvas.height
      ) {
        console.log("Projectile left canvas at:", projectile.x, projectile.y);
        this.projectiles.splice(index, 1);
      }
    }
  }

  updateProjectiles() {
    for (let index = this.projectiles.length - 1; index >= 0; index--) {
      const projectile = this.projectiles[index];
      const dx = projectile.targetX - projectile.x;
      const dy = projectile.targetY - projectile.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Flytta skottet
      projectile.x += (dx / distance) * projectile.speed;
      projectile.y += (dy / distance) * projectile.speed;

      // Ta bort skott om det når målet
      if (distance < 0.5) {
        this.projectiles.splice(index, 1);
        continue;
      }

      // Ta bort skott om det lämnar canvasen
      if (
        projectile.x < 0 ||
        projectile.x > this.canvas.width ||
        projectile.y < 0 ||
        projectile.y > this.canvas.height
      ) {
        console.log("Projectile left canvas at:", projectile.x, projectile.y);
        this.projectiles.splice(index, 1);
      }
    }
  }

  drawProjectiles(ctx) {
    ctx.fillStyle = "red";
    this.projectiles.forEach((projectile) => {
      ctx.beginPath();
      ctx.arc(projectile.x, projectile.y, 5, 0, 2 * Math.PI);
      ctx.fill();
    });
  }

  handleShooting(player) {
    // Hantera skjutlogik var femte sekund
    if (this.shootTimer <= 0) {
      this.shootAtPlayer(player);
      this.shootTimer = 30; // 5 sekunder (60 FPS * 5)
    } else {
      this.shootTimer--;
    }
  }
  //Går baklänges eftersom man tar bort skotten framifrån
  //Annars kan man missa om man går igenom arrayen framifrån
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

        if (game.level === 2) {
        } else {
          if (this.zombieHealth <= 0) {
            this.respawnZombie(game);
          }
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
  trackBossPlayer(player, game, checkBossCollision) {
    if (checkBossCollision(player, this)) {
      if (this.attackCooldown <= 0) {
        player.playerHealth -= this.zombieDamage; // Bossen skadar spelaren
        this.attackCooldown = 50; // Längre cooldown för bossens attacker
      }
      return; // Stoppa bossens rörelse vid kollision
    }

    const dX = player.playerX - this.zombieX * this.cellSize;
    const dY = player.playerY - this.zombieY * this.cellSize;
    const distance = Math.sqrt(dX * dX + dY * dY);

    if (distance < 1) {
      return; // Om bossen är väldigt nära spelaren, stoppa rörelsen
    }

    // Bossen rör sig långsammare och mer strategiskt
    const riktningX = dX / distance;
    const riktningY = dY / distance;
    this.zombieX += (riktningX * this.zombieSpeed * 0.8) / this.cellSize; // Bossen rör sig långsammare
    this.zombieY += (riktningY * this.zombieSpeed * 0.8) / this.cellSize;

    // Kontrollera om bossen är död
    if (this.zombieHealth <= 0) {
      game.coinCount += 40; // Ge spelaren 40 coins
      game.level++; // Öka spelets nivå
    }
  }
}

export class BackgroundLibrary {
  constructor() {
    this.background1 = [
      [
        { tileIndex: 6, type: " walkable" },
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

    this.background2 = [
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
        { tileIndex: 14, type: "not_walkable", overlayIndex: 10 },
        { tileIndex: 14, type: "walkable" },
        { tileIndex: 14, type: "walkable" },
        { tileIndex: 14, type: "walkable" },
      ],
      [
        { tileIndex: 14, type: "walkable" },
        { tileIndex: 16, type: "walkable" },
        { tileIndex: 27, type: "walkable" },
        { tileIndex: 27, type: "walkable" },
        { tileIndex: 27, type: "walkable" },
        { tileIndex: 27, type: "walkable" },
        { tileIndex: 27, type: "walkable" },
        { tileIndex: 27, type: "walkable" },
        { tileIndex: 27, type: "walkable" },
        { tileIndex: 27, type: "walkable" },
        { tileIndex: 27, type: "walkable" },
        { tileIndex: 17, type: "walkable" },
        { tileIndex: 14, type: "walkable" },
      ],
      [
        { tileIndex: 14, type: "walkable" },
        { tileIndex: 15, type: "walkable" },
        { tileIndex: 6, type: "walkable" },
        { tileIndex: 6, type: "not_walkable", overlayIndex: 48 },
        { tileIndex: 6, type: "not_walkable", overlayIndex: 49 },
        { tileIndex: 6, type: "walkable" },
        { tileIndex: 6, type: "walkable" },
        { tileIndex: 6, type: "walkable" },
        { tileIndex: 6, type: "walkable" },
        { tileIndex: 6, type: "walkable" },
        { tileIndex: 6, type: "walkable" },
        { tileIndex: 13, type: "walkable" },
        { tileIndex: 14, type: "walkable" },
      ],
      [
        { tileIndex: 14, type: "walkable" },
        { tileIndex: 15, type: "walkable" },
        { tileIndex: 6, type: "walkable" },
        { tileIndex: 6, type: "not_walkable", overlayIndex: 61 },
        { tileIndex: 6, type: "not_walkable", overlayIndex: 62 },
        { tileIndex: 6, type: "walkable" },
        { tileIndex: 6, type: "walkable" },
        { tileIndex: 6, type: "walkable" },
        { tileIndex: 6, type: "walkable" },
        { tileIndex: 6, type: "walkable" },
        { tileIndex: 6, type: "walkable" },
        { tileIndex: 13, type: "walkable" },
        { tileIndex: 14, type: "walkable" },
      ],
      [
        { tileIndex: 14, type: "walkable" },
        { tileIndex: 15, type: "walkable" },
        { tileIndex: 6, type: "walkable" },
        { tileIndex: 6, type: "not_walkable", overlayIndex: 10 },
        { tileIndex: 6, type: "walkable" },
        { tileIndex: 6, type: "walkable" },
        { tileIndex: 6, type: "walkable" },
        { tileIndex: 6, type: "walkable" },
        { tileIndex: 6, type: "walkable" },
        { tileIndex: 6, type: "walkable" },
        { tileIndex: 6, type: "walkable" },
        { tileIndex: 13, type: "walkable" },
        { tileIndex: 14, type: "walkable" },
      ],
      [
        { tileIndex: 14, type: "walkable" },
        { tileIndex: 29, type: "walkable" },
        { tileIndex: 1, type: "walkable" },
        { tileIndex: 1, type: "walkable" },
        { tileIndex: 2, type: "walkable" },
        { tileIndex: 6, type: "walkable" },
        { tileIndex: 6, type: "walkable" },
        { tileIndex: 6, type: "walkable" },
        { tileIndex: 6, type: "walkable" },
        { tileIndex: 0, type: "walkable" },
        { tileIndex: 1, type: "walkable" },
        { tileIndex: 30, type: "walkable" },
        { tileIndex: 14, type: "walkable" },
      ],
      [
        { tileIndex: 14, type: "walkable" },
        { tileIndex: 14, type: "walkable" },
        { tileIndex: 14, type: "walkable" },
        { tileIndex: 14, type: "walkable" },
        { tileIndex: 15, type: "walkable" },
        { tileIndex: 6, type: "walkable" },
        { tileIndex: 6, type: "walkable" },
        { tileIndex: 6, type: "walkable" },
        { tileIndex: 6, type: "walkable" },
        { tileIndex: 13, type: "walkable" },
        { tileIndex: 14, type: "walkable" },
        { tileIndex: 14, type: "walkable" },
        { tileIndex: 14, type: "walkable" },
      ],
      [
        { tileIndex: 14, type: "walkable" },
        { tileIndex: 14, type: "walkable" },
        { tileIndex: 14, type: "walkable" },
        { tileIndex: 14, type: "walkable" },
        { tileIndex: 29, type: "walkable" },
        { tileIndex: 1, type: "walkable" },
        { tileIndex: 1, type: "not_walkable", overlayIndex: 10 },
        { tileIndex: 1, type: "walkable" },
        { tileIndex: 1, type: "walkable" },
        { tileIndex: 30, type: "walkable" },
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
        { tileIndex: 14, type: "not_walkable", overlayIndex: 10 },
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
    ];
  }
}

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
          const overlayMapY =
            Math.floor(overlayIndex / tilesPerColumn) * this.cellSize;

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
    return false;
  }

  increaseLevel(zombie, zombie2, player) {
    var previousLevel = this.level; //Spara nivån innan den ökar
    this.level++; //Öka nivån med 1
    if (previousLevel <= 1 && this.level >= 2) {
      // this.tilemap.src = "Tilemap_2.png";
      this.overlay.src = "Tilemap_2.png";
      player.playerX = this.canvas.width / 2;
      player.playerY = this.canvas.height / 2;
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
