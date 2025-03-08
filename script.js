const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = 800; // Aumento della larghezza
canvas.height = 600; // Aumento della altezza
const gridSize = 40; // Dimensione della griglia

const snake = [{ x: 10, y: 10 }];
let direction = { x: 0, y: 0 };
let food = {
  x: Math.floor(Math.random() * (canvas.width / gridSize)),
  y: Math.floor(Math.random() * (canvas.height / gridSize)),
};
let lastUpdate = 0;
const updateInterval = 400; // Intervallo di aggiornamento in millisecondi (ad esempio, 100 ms)

let imagesLoaded = 0; // Variabile per tracciare il caricamento delle immagini
let foodDrawn = false; // Variabile per tracciare se il cibo è stato disegnato

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
  } else {
    console.error("L'immagine del cibo non è ancora caricata.");
  }
}

function update(currentTime) {
  if (currentTime - lastUpdate < updateInterval) {
    requestAnimationFrame(update);
    return;
  }
  lastUpdate = currentTime;

  const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

  // Gestisci la transizione da un bordo all'altro dello schermo
  head.x = (head.x + canvas.width / gridSize) % (canvas.width / gridSize);
  head.y = (head.y + canvas.height / gridSize) % (canvas.height / gridSize);

  // Aggiungi una nuova testa al serpente
  snake.unshift(head);

  // Verifica se il serpente mangia il cibo
  if (head.x === food.x && head.y === food.y) {
    // Genera nuovo cibo
    food = {
      x: Math.floor(Math.random() * (canvas.width / gridSize)),
      y: Math.floor(Math.random() * (canvas.height / gridSize)),
    };
  } else {
    // Rimuovi la coda
    snake.pop();
  }
}

function resetGame() {
  snake.length = 0;
  snake.push({ x: 10, y: 10 });
  direction = { x: 0, y: 0 };
  food = {
    x: Math.floor(Math.random() * (canvas.width / gridSize)),
    y: Math.floor(Math.random() * (canvas.height / gridSize)),
  };
}

function changeDirection(event) {
  const keyPressed = event.keyCode;
  const LEFT = 37;
  const UP = 38;
  const RIGHT = 39;
  const DOWN = 40;
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
