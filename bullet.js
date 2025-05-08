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