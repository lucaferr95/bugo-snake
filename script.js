const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 600;
const gridSize = 60; // Dimensione della griglia

const snake = [{ x: 2, y: 2 }];
let direction = { x: 0, y: 0 };
let food = {
  x: Math.floor(Math.random() * (canvas.width / gridSize)),
  y: Math.floor(Math.random() * (canvas.height / gridSize)),
};
let lastUpdate = 0;
const updateInterval = 400; // Intervallo di aggiornamento in millisecondi
let gameOver = false;

let imagesLoaded = 0;
let foodDrawn = false;
let logsPrinted = false; // Variabile per tracciare se i log sono stati stampati

// Carica l'immagine di background
const backgroundImage = new Image();
backgroundImage.src = "images/cell_gamesarena.jpg";
backgroundImage.onload = () => imagesLoaded++;

// Carica l'immagine del personaggio del serpente
const playerImage = new Image();
playerImage.src = "images/morgan_200x200.jpg";
playerImage.onload = () => imagesLoaded++;

// Carica l'immagine del personaggio del cibo
const foodImage = new Image();
foodImage.src = "images/bugo_2_100x100.jpg";
foodImage.onload = () => imagesLoaded++;

// Aggiungi un gestore di errori per verificare se l'immagine del cibo viene caricata correttamente
foodImage.onerror = function () {
  console.error("Errore nel caricamento dell'immagine del cibo");
};

function allImagesLoaded() {
  return imagesLoaded === 3;
}

function draw() {
  if (!allImagesLoaded()) {
    requestAnimationFrame(draw);
    return;
  }

  // Disegna l'immagine di background
  ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

  // Disegna il serpente usando l'immagine del player
  for (let i = 0; i < snake.length; i++) {
    ctx.drawImage(
      playerImage,
      snake[i].x * gridSize,
      snake[i].y * gridSize,
      gridSize,
      gridSize
    );
  }

  // Disegna il cibo usando l'immagine del cibo
  if (foodImage.complete) {
    ctx.drawImage(
      foodImage,
      food.x * gridSize,
      food.y * gridSize,
      gridSize,
      gridSize
    );
    if (!logsPrinted) {
      console.log(
        `Cibo disegnato a (${food.x}, ${food.y}) sulla griglia (${
          food.x * gridSize
        }, ${food.y * gridSize})`
      );
      logsPrinted = true;
    }
  } else {
    console.error("L'immagine del cibo non è ancora caricata.");
  }

  // Se il gioco è finito, mostra il messaggio di Game Over
  if (gameOver) {
    ctx.fillStyle = "red";
    ctx.font = "48px Arial";
    ctx.fillText("Game Over", canvas.width / 2 - 100, canvas.height / 2);
    ctx.font = "24px Arial";
    ctx.fillText(
      "Premi Invio per ricominciare",
      canvas.width / 2 - 150,
      canvas.height / 2 + 50
    );
  }
}

function update(currentTime) {
  if (currentTime - lastUpdate < updateInterval || gameOver) {
    requestAnimationFrame(update);
    return;
  }
  lastUpdate = currentTime;

  const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

  // Gestisci la transizione da un bordo all'altro dello schermo
  head.x = (head.x + canvas.width / gridSize) % (canvas.width / gridSize);
  head.y = (head.y + canvas.height / gridSize) % (canvas.height / gridSize);

  // Verifica se il serpente colpisce sé stesso
  for (let i = 1; i < snake.length; i++) {
    if (snake[i].x === head.x && snake[i].y === head.y) {
      gameOver = true;
      return;
    }
  }

  // Verifica se il serpente mangia il cibo
  if (Math.floor(head.x) === food.x && Math.floor(head.y) === food.y) {
    // Genera nuovo cibo
    food = {
      x: Math.floor(Math.random() * (canvas.width / gridSize)),
      y: Math.floor(Math.random() * (canvas.height / gridSize)),
    };
    foodDrawn = false;
    logsPrinted = false;
    console.log("Serpente ha mangiato il cibo!");
  } else {
    // Rimuovi la coda
    snake.pop();
  }

  // Aggiungi una nuova testa al serpente
  snake.unshift(head);
  if (!logsPrinted) {
    console.log(`Testa del serpente a (${head.x}, ${head.y})`);
    logsPrinted = true;
  }
}

function resetGame() {
  snake.length = 0;
  snake.push({ x: 2, y: 2 });
  direction = { x: 0, y: 0 };
  food = {
    x: Math.floor(Math.random() * (canvas.width / gridSize)),
    y: Math.floor(Math.random() * (canvas.height / gridSize)),
  };
  foodDrawn = false;
  logsPrinted = false;
  gameOver = false;
}

function changeDirection(event) {
  const keyPressed = event.keyCode;
  const LEFT = 37;
  const UP = 38;
  const RIGHT = 39;
  const DOWN = 40;
  const ENTER = 13;
  const goingUp = direction.y === -1;
  const goingDown = direction.y === 1;
  const goingRight = direction.x === 1;
  const goingLeft = direction.x === -1;

  if (keyPressed === LEFT && !goingRight) {
    direction = { x: -1, y: 0 };
  } else if (keyPressed === RIGHT && !goingLeft) {
    direction = { x: 1, y: 0 };
  } else if (keyPressed === UP && !goingDown) {
    direction = { x: 0, y: -1 };
  } else if (keyPressed === DOWN && !goingUp) {
    direction = { x: 0, y: 1 };
  } else if (keyPressed === ENTER && gameOver) {
    resetGame();
  }
}

function gameLoop() {
  update(performance.now());
  draw();
  requestAnimationFrame(gameLoop);
}

// Aggiungi l'ascoltatore di eventi per i tasti
document.addEventListener("keydown", changeDirection);

// Avvia il loop del gioco
gameLoop();
