let GAME_WIDTH = 1500;
let GAME_HEIGHT = 170;
let BULLET_SPEED = 10;
let BLOON_SPEED = 1;
let BLOON_HEALTH = 1;
let INITIAL_BLOON_COUNT = 1;
let MAX_LIVES = 1;

const words = [
	"able", "also", "area", "away", "back",
	"base", "best", "blue", "book", "both",
	"call", "city", "come", "cost", "dark",
	"dead", "door", "draw", "each", "easy",
	"even", "ever", "face", "fact", "fall",
	"fast", "fear", "feel", "file", "fill",
	"find", "fire", "five", "flow", "food",
	"foot", "form", "four", "free", "from",
	"full", "game", "give", "good", "gray",
	"grow", "hand", "hard", "have", "head",
	"hear", "help", "here", "high", "hold",
	"home", "hope", "hour", "huge", "idea",
	"into", "iron", "join", "jump", "just",
	"keep", "kind", "king", "kiss", "know",
	"land", "last", "late", "lead", "left",
	"less", "life", "lift", "like", "line",
	"list", "live", "long", "look", "lose",
	"love", "luck", "made", "main", "make",
	"many", "mark", "meet", "milk", "mind",
	"miss", "more", "most", "move", "much"
];

// const sentences = [    
// "The sun is shining today.",
// "I love eating pizza.",
// "She plays the piano beautifully.",
// "He enjoys going for long walks.",
// "The cat is sleeping on the mat.",
// "I need to buy groceries.",
// "They won the championship game.",
// "My favorite color is blue.",
// "The book is on the table.",
// "We went to the beach last weekend.",
// "He is studying for his exams.",
// "She likes to dance in the rain.",
// "The car broke down on the highway.",
// "I enjoy watching movies.",
// "They are going on vacation next month.",
// "The dog barks at strangers.",
// "I want to learn how to cook.",
// "She is a talented singer.",
// "He is always late for meetings.",
// "The flowers are blooming in the garden.",
// "I need to clean my room.",
// "They are getting married in December.",
// "The coffee is too hot to drink.",
// "She wears glasses to see better.",
// "He is an excellent swimmer.",
// "The train arrives at 9 o'clock.",
// "I like to listen to music.",
// "They are going to the party tonight.",
// "The bird is building a nest.",
// "I enjoy playing soccer.",
// "She has a big collection of stamps.",
// "He is afraid of heights.",
// "The rain is pouring outside.",
// "I need to call my parents.",
// "They are going to the concert tomorrow.",
// "The tree provides shade in the park.",
// "I like to read books.",
// "She is studying to become a doctor.",
// "He always forgets his keys.",
// "The river flows into the ocean.",
// "I enjoy painting pictures.",
// "They are going hiking this weekend.",
// "The clock is ticking on the wall.",
// "I want to learn a new language.",
// "She loves to play video games.",
// "He is a talented actor.",
// "The cat is chasing the mouse.",
// "I need to buy a new pair of shoes.",
// ]


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
const pauseScreen = document.getElementById("pause-screen");
let score = 0;
let level = 1;
let lives = MAX_LIVES;
let player = createPlayer();
let bullets = [];
let bloons = createBloons(INITIAL_BLOON_COUNT);
let keys = {};
let numAbilitiesUsed = 0;
let currentWord = words[Math.floor(Math.random() * words.length)];
let nextWord = getWord();

let gameRunning = false;
let paused = false;

pauseScreen.style.display = "none";
gameOverScreen.style.display = "none";

levelContainer.textContent = "Level: " + level;
livesContainer.textContent = "Lives: " + lives;

function getWord() {
	// const randomNumber = Math.random();
	// if (randomNumber < 0.9) { 
	return words[Math.floor(Math.random() * words.length)];
	// } else { 
	// 	return sentences[Math.floor(Math.random() * sentences.length)];
	// }
}

// Display next word
function displayWord() {
	wordContainer.textContent = currentWord;
	nextWordContainer.textContent = nextWord
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
	const enteredWord = inputField.value.trim().toLocaleLowerCase();
	if (!gameRunning) {
		return;
	}
	if (enteredWord === currentWord) {
		score++;
		shoot();
		inputField.value = "";
		currentWord = nextWord;
		nextWord = getWord()
		displayWord();
	}
	if (enteredWord === "restart".toLocaleLowerCase()) {
		location.reload();
	}

	if (enteredWord === "pause".toLocaleLowerCase()) {
		pauseOrRunGame();
	}

}

document.addEventListener("keydown", function(event) {
	if (event.key === "Escape") {
		pauseOrRunGame();
	}
	if (event.key === "Enter" && gameRunning === false) {
		startGame();
	}

	if (event.key === " " && gameRunning === false) {
		startGame();
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

		BLOON_SPEED += 0.1;

		bloons = createBloons(level);

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

function createBloons(level) {
	let bloons = [];
	const startX = GAME_WIDTH - 30;
	const startY = GAME_HEIGHT - 110;
	const count = level * 5

	for (let i = 0; i < count; i++) {
		let bloon = document.createElement("div");
		bloon.className = "bloon";
		bloon.style.left = startX + i * 30 + getRandomOffset() + "px";
		bloon.style.top = startY + getRandomOffset() + "px";
		gameContainer.appendChild(bloon);
		bloons.push(bloon);
	}
	return bloons;
}

function getRandomOffset() {
	const offsetRange = 20;
	const randomOffset = Math.random() * offsetRange - offsetRange / 2;
	return randomOffset;
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
	finalLevelText.textContent = "You made it to level " + level + "Your final score:" + score;
}

function startGame() {
	instructionsContainer.style.display = "none";
	gameContainer.style.display = "block";
	displayWord();
	inputField.addEventListener("input", checkInput);
	gameRunning = true;
	requestAnimationFrame(gameLoop);
}

function pauseOrRunGame() {
	paused = !paused;
	if (paused) {
		gameRunning = false;
		gameContainer.style.display = "none";
		instructionsContainer.style.display = "none";
		gameOverScreen.style.display = "none";
		pauseScreen.style.display = "block";
	} else {
		gameRunning = true;
		gameContainer.style.display = "block";
		pauseScreen.style.display = "none";
	}
	if (!paused) {
		requestAnimationFrame(gameLoop);
	}
}



// Available on Railway at https://shootyper.up.railway.app/
