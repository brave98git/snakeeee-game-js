const board = document.querySelector(".board");
const startButton = document.querySelector(".btn-start");
const modal = document.querySelector(".modal");
const modalTitle = document.getElementById("modalTitle");
const highScoreElement = document.querySelector("#high-score");
const scoreElement = document.querySelector("#score");
const timeElement = document.querySelector("#time");

const blockHeight = 80;
const blockWidth = 80;

let highScore = localStorage.getItem("highScore") || 0;
let score = 0;
let time = `00:00`;

highScoreElement.innerText = highScore;

const cols = Math.floor(board.clientWidth / blockWidth);
const rows = Math.floor(board.clientHeight / blockHeight);

let intervalID = null;
let isGameOver = false;
let timerIntervalId = null;

let food = {
  x: Math.floor(Math.random() * rows),
  y: Math.floor(Math.random() * cols),
};

const blocks = [];
const snake = [{ x: 1, y: 3 }];
let direction = "down";

for (let row = 0; row < rows; row++) {
  for (let col = 0; col < cols; col++) {
    const block = document.createElement("div");
    block.classList.add("block");
    board.appendChild(block);
    // block.innerText = `${row}-${col}`;
    blocks[`${row}-${col}`] = block;
  }
}

function gameOver() {
  clearInterval(intervalID);
  isGameOver = true;
  clearInterval(timerIntervalId);
  let storedHighScore = Number(localStorage.getItem("highscore")) || 0;
  if (score > storedHighScore) {
    localStorage.setItem("highscore", score);
    storedHighScore = score;
  }
  highScoreElement.innerText = storedHighScore;
  modalTitle.innerText = "Game Over";
  startButton.innerText = "Restart";
  modal.style.display = "flex";
}

function render() {
  let head = null;
 let storedHighScore = Number(localStorage.getItem("highscore")) || 0;
  if (score > storedHighScore) {
    localStorage.setItem("highscore", score);
    storedHighScore = score;
  }
  highScoreElement.innerText = storedHighScore;
  blocks[`${food.x}-${food.y}`].classList.add("food");

  if (direction === "left") {
    head = { x: snake[0].x, y: snake[0].y - 1 };
  } else if (direction === "right") {
    head = { x: snake[0].x, y: snake[0].y + 1 };
  } else if (direction === "up") {
    head = { x: snake[0].x - 1, y: snake[0].y };
  } else if (direction === "down") {
    head = { x: snake[0].x + 1, y: snake[0].y };
  }

  if (head.x < 0 || head.x >= rows || head.y < 0 || head.y >= cols) {
    gameOver();
    return;
  }

  if (head.x == food.x && head.y == food.y) {
    blocks[`${food.x}-${food.y}`].classList.remove("food");
    food = {
      x: Math.floor(Math.random() * rows),
      y: Math.floor(Math.random() * cols),
    };
    blocks[`${food.x}-${food.y}`].classList.add("food");
    snake.unshift(head);

    score += 10;
    scoreElement.innerText = score;

    if (score > highScore) {
      highScore = score;
      localStorage.setItem("highscore", highScore.toString());
    }
  }

  snake.forEach((segment) => {
    blocks[`${segment.x}-${segment.y}`].classList.remove("fill");
  });

  snake.unshift(head);
  snake.pop();

  snake.forEach((segment) => {
    let snakeeee = blocks[`${segment.x}-${segment.y}`];
    snakeeee.classList.add("fill");
  });
}

function restart() {
  snake.forEach((seg) => {
    blocks[`${seg.x}-${seg.y}`].classList.remove("fill");
  });

  blocks[`${food.x}-${food.y}`].classList.remove("food");

  score = 0;
  time = `00:00`;

  scoreElement.innerText = score;
  timeElement.innerText = time;
  highScoreElement.innerText = highScore;

  snake.length = 0;
  snake.push({ x: 1, y: 3 });
  direction = "down";

  food = {
    x: Math.floor(Math.random() * rows),
    y: Math.floor(Math.random() * cols),
  };

  isGameOver = false;
  startButton.innerText = "Start";
  modalTitle.innerText = "Start Game";
}

startButton.addEventListener("click", () => {
  modal.style.display = "none";

  if (isGameOver) {
    restart();
  }

  intervalID = setInterval(() => {
    render();
  }, 200);

  timerIntervalId = setInterval(() => {
    let [min, sec] = time.split(":").map(Number);
    if (sec == 59) {
      min += 1;
      sec = 0;
    } else {
      sec += 1;
    }

    time = `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
    timeElement.innerText = time;
  }, 1000);
});

addEventListener("keydown", (e) => {
  if (e.key == "ArrowUp") {
    direction = "up";
  } else if (e.key == "ArrowDown") {
    direction = "down";
  } else if (e.key == "ArrowRight") {
    direction = "right";
  } else if (e.key == "ArrowLeft") {
    direction = "left";
  }
});
