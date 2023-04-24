let blockSize = 25;
let rows = (cols = 20);
const board = $("#canvas")[0];
const ctx = board.getContext("2d");
const boardHeight = rows * blockSize;
const boardWidth = cols * blockSize;
let scoreField = $(".score span");

const pauseDiv = $(".pause");
const pauseP = $(".pause p");
const playAgainBtn = $(".pause button");

let velocityX = 0;
let velocityY = 0;

let score = 0;

let snakeBody = [];

let gameOver = false;

let gamePause = false;

let interval;

const snake = {
  x: blockSize * 10,
  y: blockSize * 10,
  speed: 100,
};

const food = {
  x: undefined,
  y: undefined,
};

const extraFood = {
  x: undefined,
  y: undefined,
};

window.onload = () => {
  board.height = boardHeight;
  board.width = boardWidth;

  loadRank();

  alignFood();
  alignExtraFood();
  $("body").on("keyup", changeDirection);

  interval = setInterval(update, 100);
};

const loadRank = () => {
  if (typeof Storage !== "undefined") {
    // Store
    if (localStorage.length != 0 && localStorage.getItem("lastScore") != null)
      // Retrieve
      $(".lastScore").text(
        `Your last score:${localStorage.getItem("lastScore")}`
      );
  } else {
    $(".lastScore").text(
      localStorage.getItem(
        "Sorry, your browser does not support Web Storage..."
      )
    );
  }
};

const changeSpeed = () => {
  clearInterval(interval);
  snake.speed -= 2;
  interval = setInterval(update, snake.speed);
  // console.log(snake.speed);
};

const update = () => {
  scoreField.text(score);
  if (gameOver) {
    pauseDiv.addClass("active");
    pauseP.text("Game lost");
    playAgainBtn.addClass("active");
    pressedPlayAgain();
    return;
  }

  if (!gamePause) {
    pauseDiv.removeClass("active");
    //board
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, boardWidth, boardHeight);

    //food
    ctx.fillStyle = "orange";
    ctx.fillRect(food.x, food.y, blockSize, blockSize);

    //extra food
    ctx.fillStyle = "red";
    ctx.fillRect(extraFood.x, extraFood.y, blockSize, blockSize);

    //food eaten
    if (snake.x == food.x && snake.y == food.y) foodEaten();
    if (snake.x == extraFood.x && snake.y == extraFood.y) extraFoodEaten();

    for (let i = snakeBody.length - 1; i > 0; i--) {
      snakeBody[i] = snakeBody[i - 1];
    }
    if (snakeBody.length) {
      snakeBody[0] = [snake.x, snake.y];
    }

    //snake
    ctx.fillStyle = "lime";
    snake.x += velocityX * blockSize;
    snake.y += velocityY * blockSize;
    ctx.fillRect(snake.x, snake.y, blockSize, blockSize);
    for (let i = 0; i < snakeBody.length; i++) {
      ctx.fillRect(snakeBody[i][0], snakeBody[i][1], blockSize, blockSize);
    }

    if (
      snake.x < 0 ||
      snake.x > boardWidth - blockSize ||
      snake.y < 0 ||
      snake.y > boardHeight - blockSize
    ) {
      localStorage.setItem("lastScore", score);
      gameOver = true;

      // alert('Game Over')
    }

    for (let i = 0; i < snakeBody.length; i++) {
      if (snake.x == snakeBody[i][0] && snake.y == snakeBody[i][1]) {
        gameOver = true;
        // alert('Game Over')
      }
    }
  } else {
    pauseDiv.addClass("active");
    pauseP.text("Game paused");
  }
};

const foodEaten = () => {
  snakeBody.push([food.x, food.y]);
  alignFood();
  score++;
  changeSpeed();
};

const extraFoodEaten = () => {
  snakeBody.push([extraFood.x, extraFood.y]);
  snakeBody.push([extraFood.x, extraFood.y]);
  alignExtraFood();
  score += 2;
  changeSpeed();
};

const alignFood = () => {
  food.x = randVal();
  food.y = randVal();
};

const alignExtraFood = () => {
  extraFood.x = randVal();
  extraFood.y = randVal();
};

const randVal = () => {
  return Math.floor(Math.random() * cols) * blockSize;
};

const changeDirection = (e) => {
  // left 37
  if (e.keyCode === 37 && velocityX != 1) {
    velocityX = -1;
    velocityY = 0;
  }
  // up 38
  else if (e.keyCode === 38 && velocityY != 1) {
    velocityX = 0;
    velocityY = -1;
  }
  // right 39
  else if (e.keyCode === 39 && velocityX != -1) {
    velocityX = 1;
    velocityY = 0;
  }
  // down 40
  else if (e.keyCode === 40 && velocityY != -1) {
    velocityX = 0;
    velocityY = 1;
  }
};

$("body").on("keyup", (e) => {
  if (e.keyCode === 27) gamePause = !gamePause;
});

$(".pause button").on("click", () => {
  location.reload();
});

const pressedPlayAgain = () => {
  $("body").on("keyup", (e) => {
    if (e.keyCode === 13) {
      $(".pause button").click();
      console.log("adasdsdada");
    }
  });
};
