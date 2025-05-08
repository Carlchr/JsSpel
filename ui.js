const healthCounter = document.querySelector(".hp");
const levelCounter = document.querySelector(".level");
const coinCounter = document.querySelector(".coin");
const zombieHpCounter = document.querySelector(".zombieHp");
const zombieDmgCounter = document.querySelector(".zombieDmg");
const coinsPerZombieCounter = document.querySelector(".coinsPerZombie");
export function updateHealthCounter(player) {
    healthCounter.textContent = `Player Health: ${player.playerHealth}`;
  }
  export function updateLevelCounter(game) {
    levelCounter.textContent = `Level: ${game.level}`;
  }
  export function updateCoinCounter(game) {
    coinCounter.textContent = `Coins: ${game.coinCount}`;
  }
  export function updateZombieDmgCounter(zombie) {
    zombieDmgCounter.textContent = `Zombie Damage: ${zombie.zombieDamage}`;
  }
  export function updateZombieHpCounter(game) {
    zombieHpCounter.textContent = `Zombie Health: ${20 + 4 * game.level}`;
  }
  export function updateZombieCoinCounter(game) {
    coinsPerZombieCounter.textContent = `Coins Per Zombie: ${game.level}`;
  }
  
  export function updateHpButtonText(buyCountHp) {
    const HpButton = document.getElementById("hp_enchant");
    const cost = 25 * (buyCountHp + 1);
    HpButton.textContent = `+ 25 Hp: ${cost} Coins`;
  }
  export function updateDamageButtonText(buyCountDmg) {
    const DamageButton = document.getElementById("damage_enchant");
    const cost = 25 * (buyCountDmg + 1);
    DamageButton.textContent = `+ 3 Damage: ${cost} Coins`;
  }
  export function updateFirerateButtonText(buyCountFireRate) {
    const firerateButton = document.getElementById("firerate_enchant");
    const cost = 25 * (buyCountFireRate + 1);
    firerateButton.textContent = `x 1.25 firerate: ${cost} Coins`;
  }
  export function updateSpeedButtonText(buyCountSpeed) {
    const speedButton = document.getElementById("speed_enchant");
    const cost = 25 * (buyCountSpeed + 1);
    speedButton.textContent = `+ 0.5 Speed: ${cost} Coins`;
  }