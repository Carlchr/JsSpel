export let buyCountHp = 0;
export let buyCountDmg = 0;
export let buyCountSpeed = 0;
export let buyCountFireRate = 0;

export function buttonClassesEnchant({
    game,
    player,
    bulletHandeler,
    updateCoinCounter,
    updateHealthCounter,
    updateHpButtonText,
    updateDamageButtonText,
    updateFirerateButtonText,
    updateSpeedButtonText
  }) {
    document.getElementById("classic").addEventListener("click", () => {
      bulletHandeler.bulletDamage = 5;
      bulletHandeler.shootCooldownMax = 30;
      player.playerHealth = 100;
    });
    document.getElementById("minigun").addEventListener("click", () => {
      if (game.coinCount >= 100) {
        bulletHandeler.bulletDamage = 2;
        bulletHandeler.shootCooldownMax = 6;
        player.playerHealth = 150;
        player.playerSpeed = 1.2;
        game.coinCount -= 100;
        updateCoinCounter(game);
      }
    });
    document.getElementById("shotgun").addEventListener("click", () => {
      if (game.coinCount >= 15) {
        bulletHandeler.bulletDamage = 15;
        bulletHandeler.shootCooldownMax = 120;
        player.playerHealth = 100;
        player.playerSpeed = 1.8;
        game.coinCount -= 15;
        updateCoinCounter(game);
      }
    });
  
    document.getElementById("hp_enchant").addEventListener("click", () => {
      if (game.coinCount >= 25 * (buyCountHp + 1)) {
        player.playerHealth += 25;
        game.coinCount -= 25 * (buyCountHp + 1);
        updateCoinCounter(game);
        updateHealthCounter(player);
        buyCountHp++;
        updateHpButtonText(buyCountHp);
      }
    });
    document.getElementById("damage_enchant").addEventListener("click", () => {
      if (game.coinCount >= 25 * (buyCountDmg + 1)) {
        bulletHandeler.bulletDamage += 3;
        game.coinCount -= 25 * (buyCountDmg + 1);
        updateCoinCounter(game);
        buyCountDmg++;
        updateDamageButtonText(buyCountDmg);
      }
    });
    document.getElementById("firerate_enchant").addEventListener("click", () => {
      if (game.coinCount >= 25 * (buyCountFireRate + 1)) {
        bulletHandeler.shootCooldownMax = bulletHandeler.shootCooldownMax * 0.75;
        game.coinCount -= 25 * (buyCountFireRate + 1);
        updateCoinCounter(game);
        buyCountFireRate++;
        updateFirerateButtonText(buyCountFireRate);
      }
    });
    document.getElementById("speed_enchant").addEventListener("click", () => {
      if (game.coinCount >= 25 * (buyCountSpeed + 1)) {
        player.playerSpeed += 0.5;
        game.coinCount -= 25 * (buyCountSpeed + 1);
        updateCoinCounter(game);
        buyCountSpeed++;
        updateSpeedButtonText(buyCountSpeed);
      }
    });
  }