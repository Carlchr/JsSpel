//Player
let player_xPos = 500;
let player_yPos = 500;
const player_size = 25;
const player_speed = 5;

//Kollar om knappen är nedtryckt
//Lägga till arrow keys
let keys = {
  w: false,
  a: false,
  s: false,
  d: false,
};

//Kollar om man trycker ner knappen
document.onkeydown = function (e) {
  console.log(e); //Inparametern e innehåller ett event-objekt med information om eventet.
  const key = e.key;

  //Objektet får värdet true
  keys[key] = true;
};

//Kollar om knappen är inte tryckt
document.onkeyup = function (e) {
  const key = e.key;

  //Objektet fär värde false
  keys[key] = false;
};
