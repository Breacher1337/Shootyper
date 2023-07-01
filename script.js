let GAME_WIDTH = 1500;
let GAME_HEIGHT = 170;
let BULLET_SPEED = 10;
let BLOON_SPEED = 1;
let BLOON_HEALTH = 1;
let INITIAL_BLOON_COUNT = 1;
let MAX_LIVES = 3;

const words = [
	"cat", "dog", "bird", "fish", "tree", "book", "rain",
	"moon", "sun", "star", "fire", "ball", "home", "door",
	"lamp", "car", "road", "frog", "cake", "corn", "leaf",
	"boat", "hair", "hand", "milk", "nest", "pipe", "rock",
	"song", "toad", "twig", "wind", "worm", "yard", "baby",
	"bear", "bee", "duck", "eyes", "fish", "foot", "goat",
	"hair", "hand", "ink", "juice", "kiss", "lady", "lamb"
];

let currentWordIndex = Math.floor(Math.random() * words.length);
let nextWordIndex = Math.floor(Math.random() * words.length);
const wordContainer = document.getElementById("word-container");
const nextWordContainer = document.getElementById("next-word-container");
const inputField = document.getElementById("input-field");
const levelContainer = document.getElementById("level-container");
const livesContainer = document.getElementById("lives-container");
const gameContainer = document.getElementById("game");
const gameOverScreen = document.getElementById("game-over");
const finalLevelText = document.getElementById("final-level");
const tryAgainButton = document.getElementById("try-again");
const instructionsContainer = document.getElementById("instructions-container");
const startButton = document.getElementById("start-button");
let score = 0;
let level = 1;
let lives = MAX_LIVES;
let player = createPlayer();
let bullets = [];
let bloons = createBloons(INITIAL_BLOON_COUNT);
let keys = {};
let numAbilitiesUsed = 0;

let gameRunning = true;
let paused = false;

levelContainer.textContent = "Level: " + level;
livesContainer.textContent = "Lives: " + lives;

// Display next word
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
	}, 500);
}

// Check Collision
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
function checkInput() {
	const enteredWord = inputField.value.trim().toLowerCase();
	if (!gameRunning) {
		return;
	}
	if (enteredWord === words[currentWordIndex]) {
		score++;
		shoot();
		inputField.value = "";
		currentWordIndex = nextWordIndex;
		nextWordIndex = Math.floor(Math.random() * words.length);
		displayWord();
	}
	if (enteredWord === "restart") {
		location.reload();
	}
}

document.addEventListener("keydown", function(event) {
  if (event.key === "Escape") {
    paused = !paused;
    if (!paused) {
      requestAnimationFrame(gameLoop);
    }
  }
});

document.addEventListener("click", function(event) {
	if (event.target === tryAgainButton) {
		location.reload();
	}
	if (event.target === startButton) {
		startGame();
	}
});

displayWord();
inputField.addEventListener("input", checkInput);

function gameLoop() {
	if (!gameRunning) {
		return;
	}
	if (paused) {
    requestAnimationFrame(gameLoop);
    return;
 	}
	bullets.forEach(function(bullet) {
		bullet.style.left = bullet.offsetLeft + BULLET_SPEED + "px";

		bloons.forEach(function(bloon) {
			if (checkCollision(bullet, bloon)) {
				playBloonDeathAnimation(bloon);

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
			handleCollision();
		}
	});

	if (bloons.length === 0) {
		level++;
		levelContainer.textContent = "Level: " + level;

		levelContainer.style.backgroundImage = "url('images/shine.png')";
		setTimeout(function() {
			levelContainer.style.backgroundImage = "none";
		}, 1000);

		BLOON_SPEED += 0.2;

		bloons = createBloons(INITIAL_BLOON_COUNT + level);

		BULLET_SPEED += 0.5;
	}

	if (lives <= 0) {
		gameRunning = false;
		gameOver();
		return;
	}

	requestAnimationFrame(gameLoop);
}

// Create the player
function createPlayer() {
	let player = document.createElement("div");
	player.className = "player";
	gameContainer.appendChild(player);
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
		gameContainer.appendChild(bloon);
		bloons.push(bloon);
	}
	return bloons;
}

function shoot() {
	let bullet = document.createElement("div");
	bullet.className = "bullet";
	bullet.style.left = player.offsetLeft + player.offsetWidth + "px";
	bullet.style.top = player.offsetTop - player.offsetHeight / 2 + "px";
	gameContainer.appendChild(bullet);
	bullets.push(bullet);

	player.style.backgroundImage = "url('images/chickenattack.gif')";
	setTimeout(function() {
		player.style.backgroundImage = "url('images/chicken.gif')";
	}, 500);
}

function playBloonDeathAnimation(bloon) {
	let collisionAnimation = document.createElement("div");
	collisionAnimation.className = "bomb_explosion";
	collisionAnimation.style.left = bloon.offsetLeft + "px";
	collisionAnimation.style.top = bloon.offsetTop + "px";
	gameContainer.appendChild(collisionAnimation);

	setTimeout(function() {
		collisionAnimation.remove();
	}, 500);
}

function handleCollision() {
	lives--;
	livesContainer.textContent = "Lives: " + lives;
}

function gameOver() {
	gameOverScreen.style.display = "block";
	finalLevelText.textContent = "You made it to level " + level;
}

function startGame() {
	instructionsContainer.style.display = "none";
	gameContainer.style.display = "block";
	requestAnimationFrame(gameLoop);
}



// Available on Railway at https://shootyper.up.railway.app/
