document.addEventListener('DOMContentLoaded', () => {
    const boardSize = 17; // Size of the game board
    const cellSize = 36; // Size of each cell in pixels
    const gameBoard = document.getElementById('game-board');
    const startButton = document.getElementById('start-button');
    const restartButton = document.getElementById('restart-button');
    const scoreElement = document.getElementById('score');

    let snake = [{ x: 10, y: 10 }]; // Initial position of the snake
    let food = { x: 15, y: 10 }; // Initial position of the food
    let direction = 'right'; // Initial direction of the snake
    let intervalId;
    let score = 0;

    // Create the game board
    for (let row = 0; row < boardSize; row++) {
      for (let col = 0; col < boardSize; col++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.style.width = `${cellSize}px`;
        cell.style.height = `${cellSize}px`;
        cell.style.top = `${row * cellSize}px`;
        cell.style.left = `${col * cellSize}px`;
        gameBoard.appendChild(cell);
      }
    }

    // Update the snake on the game board
    function updateSnake() {
      const cells = document.getElementsByClassName('cell');
      Array.from(cells).forEach(cell => cell.classList.remove('snake'));

      snake.forEach(segment => {
        const index = segment.y * boardSize + segment.x;
        cells[index].classList.add('snake');
      });
    }

    // Update the food on the game board
    function updateFood() {
      const cells = document.getElementsByClassName('cell');
      Array.from(cells).forEach(cell => cell.classList.remove('food'));

      const index = food.y * boardSize + food.x;
      cells[index].classList.add('food');
    }

    // Move the snake
    function moveSnake() {
      const head = { ...snake[0] }; // Create a new head segment

      // Update the head segment based on the direction
      if (direction === 'up') {
        head.y--;
      } else if (direction === 'down') {
        head.y++;
      } else if (direction === 'left') {
        head.x--;
      } else if (direction === 'right') {
        head.x++;
      }

      // Check if the snake eats the food
      if (head.x === food.x && head.y === food.y) {
        snake.push(food); // Add a new segment to the snake
        food = generateFood(); // Generate new food
        updateFood(); // Update the food on the game board
        increaseScore(); // Increase the score
      }

      snake.unshift(head); // Add the new head segment to the snake
      snake.pop(); // Remove the tail segment

      // Check if the snake collides with itself or hits the wall
      if (checkCollision() || checkWallCollision()) {
        clearInterval(intervalId);
        alert('Game Over!');
      }

      updateSnake(); // Update the snake on the game board
    }

    // Check if the snake collides with itself
    function checkCollision() {
      const head = snake[0];
      for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === head.x && snake[i].y === head.y) {
          return true;
        }
      }
      return false;
    }

    // Check if the snake hits the wall
    function checkWallCollision() {
      const head = snake[0];
      return head.x < 0 || head.x >= boardSize || head.y < 0 || head.y >= boardSize;
    }

    // Generate a random position for the food
    function generateFood() {
      let newFood;
      do {
        newFood = {
          x: Math.floor(Math.random() * boardSize),
          y: Math.floor(Math.random() * boardSize)
        };
      } while (checkCollisionWithSnake(newFood));

      return newFood;
    }

    // Check if the food collides with the snake
    function checkCollisionWithSnake(food) {
      for (let i = 0; i < snake.length; i++) {
        if (snake[i].x === food.x && snake[i].y === food.y) {
          return true;
        }
      }
      return false;
    }

    // Increase the score and update the score display
    function increaseScore() {
      score++;
      scoreElement.textContent = `Score: ${score}`;
    }

    // Handle keyboard events to change the direction of the snake
    document.addEventListener('keydown', e => {
      if (e.key === 'ArrowUp' && direction !== 'down') {
        direction = 'up';
      } else if (e.key === 'ArrowDown' && direction !== 'up') {
        direction = 'down';
      } else if (e.key === 'ArrowLeft' && direction !== 'right') {
        direction = 'left';
      } else if (e.key === 'ArrowRight' && direction !== 'left') {
        direction = 'right';
      }
    });

    // Start the game when the Start Game button is clicked
    startButton.addEventListener('click', () => {
      intervalId = setInterval(moveSnake, 200); // Move the snake every 200 milliseconds
      startButton.disabled = true; // Disable the Start Game button
      restartButton.disabled = false; // Enable the Restart Game button
    });

    // Restart the game when the Restart Game button is clicked
    restartButton.addEventListener('click', () => {
      clearInterval(intervalId); // Stop the current game
      snake = [{ x: 10, y: 10 }]; // Reset the snake position
      food = { x: 15, y: 10 }; // Reset the food position
      direction = 'right'; // Reset the direction
      score = 0; // Reset the score
      scoreElement.textContent = 'Score: 0'; // Update the score display
      updateSnake(); // Update the snake on the game board
      updateFood(); // Update the food on the game board
      startButton.disabled = false; // Enable the Start Game button
      restartButton.disabled = true; // Disable the Restart Game button
    });

    updateFood(); // Initialize the food on the game board
    updateSnake(); // Initialize the snake on the game board
    restartButton.disabled = true; // Disable the Restart Game button initially
  });