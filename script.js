
const words = [
  "apple", "bird", "cat", "dog",
  "fish", "goat", "hat", "ice",
  "jazz", "kite", "lamp", "moon",
  "nest", "open", "pear", "quit",
  "rain", "star", "tree", "user",
  "vase", "wind", "xylo", "yawn",
  "zebra", "code", "ball", "door",
  "frog", "gold", "home", "iron",
  "jump", "king", "love", "maze",
  "note", "opal", "park", "quad",
  "rest", "soap", "time", "urge",
  "vest", "well", "year", "zero",
  "zoom"
  ];

 let currentWordIndex = Math.floor(Math.random() * words.length);
 let nextWordIndex = Math.floor(Math.random() * words.length);
 let score = 0;
 let level = 1;

 const wordContainer = document.getElementById("word-container");
 const nextWordContainer = document.getElementById("next-word-container");
 const inputField = document.getElementById("input-field");
 const screen = document.getElementById("screen");
 const levelContainer = document.getElementById("level-container");
 levelContainer.textContent = "Level: " + level;


 function displayWord() {
     wordContainer.textContent = words[currentWordIndex];
    nextWordContainer.textContent = words[nextWordIndex];  
    nextWordContainer.classList.add("slide-in-animation-right");
    wordContainer.classList.add("slide-in-animation");

    setTimeout(function() {
      nextWordContainer.classList.remove("slide-in-animation-right");
    }, 500);
    setTimeout(function() {
        wordContainer.classList.remove("slide-in-animation");
        }
        , 500);

 }

 function checkInput() {
     const enteredWord = inputField.value.trim().toLowerCase();


     if (enteredWord === words[currentWordIndex]) {
         score++;
         shoot();
         inputField.value = "";
         currentWordIndex = nextWordIndex;
        nextWordIndex = Math.floor(Math.random() * words.length);
         displayWord();
     }
 }

 inputField.addEventListener("input", checkInput);

 displayWord();


let GAME_WIDTH = 1500;
let GAME_HEIGHT = 170;
let PLAYER_SPEED = 0;
let BULLET_SPEED = 10;
let BLOON_SPEED = 1;
let INITIAL_BLOON_COUNT = 1;

let game = document.getElementById("game");
let player = createPlayer();
let bullets = [];
let bloons = createBloons(INITIAL_BLOON_COUNT);
let keys = {};

function gameLoop() {

bullets.forEach(function(bullet) {
 bullet.style.left = bullet.offsetLeft + BULLET_SPEED + "px";

 bloons.forEach(function(bloon) {
   if (checkCollision(bullet, bloon)) {

     bullet.remove();
     bullets.splice(bullets.indexOf(bullet), 1);
     bloon.remove();
     bloons.splice(bloons.indexOf(bloon), 1);
   }
 });

 if (bullet.offsetLeft > GAME_WIDTH) {
   bullet.remove();
   bullets.splice(bullets.indexOf(bullet), 1);
 }
});

bloons.forEach(function(bloon) {
 bloon.style.left = bloon.offsetLeft - BLOON_SPEED + "px";

 if (checkCollision(player, bloon)) {
   location.reload();
 }
});

if (bloons.length === 0) {

    level++;
    levelContainer.textContent = "Level: " + level;
    
    levelContainer.style.backgroundImage = "url('images/shine.png')";
    setTimeout(function() {
        levelContainer.style.backgroundImage = "none";
    }, 1000);

    BLOON_SPEED += 0.5;


    bloons = createBloons(INITIAL_BLOON_COUNT + level);

    PLAYER_SPEED += 0.5;

}

// Run the game loop again
requestAnimationFrame(gameLoop);
}

// Create the player
function createPlayer() {
let player = document.createElement("div");
player.className = "player";
game.appendChild(player);
return player;
}

function createBloons(count) {
    let bloons = [];
    const startX = GAME_WIDTH - 30;
    const startY = GAME_HEIGHT - 110;
  
    for (let i = 0; i < count; i++) {
      let bloon = document.createElement("div");
      bloon.className = "bloon";
      bloon.style.left = startX + i * 30 + "px";
      bloon.style.top = startY + "px";
      game.appendChild(bloon);
      bloons.push(bloon);
    }
return bloons;
}

function shoot() {
let bullet = document.createElement("div");
bullet.className = "bullet";
bullet.style.left = player.offsetLeft + player.offsetWidth + "px";

bullet.style.top = player.offsetTop - player.offsetHeight / 2 + "px";

game.appendChild(bullet);
bullets.push(bullet);

player.style.backgroundImage = "url('images/chickenattack.gif')";
setTimeout(function() {
  player.style.backgroundImage = "url('images/chicken.gif')";
}, 500);
}

function checkCollision(element1, element2) {
let rect1 = element1.getBoundingClientRect();
let rect2 = element2.getBoundingClientRect();
return (
 rect1.left < rect2.right &&
 rect1.right > rect2.left &&
 rect1.top < rect2.bottom &&
 rect1.bottom > rect2.top
);
}
requestAnimationFrame(gameLoop);