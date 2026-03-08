let boardState = Array(9).fill("");
let currentPlayer = "X";
let startingPlayer = "X";
let gameActive = true;

const board = document.getElementById("board");
const statusText = document.getElementById("statusText");
const modal = document.getElementById("modal");
const modalText = document.getElementById("modalText");
const clickSound = document.getElementById("clickSound");
const winSound = document.getElementById("winSound");

let scores = { X: 0, O: 0, draw: 0 };

function initializeGame() {
  board.innerHTML = "";
  boardState = Array(9).fill("");
  gameActive = true;

  currentPlayer = startingPlayer;

  for (let i = 0; i < 9; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.dataset.index = i;
    cell.setAttribute("role", "button");
    cell.setAttribute("tabindex", "0");
    board.appendChild(cell);
  }

  updateUI();
  renderScores();
}

function playAudio(audioElement) {
  try {
    audioElement.currentTime = 0;
    const playPromise = audioElement.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {});
    }
  } catch (error) {}
}

function handleCellClick(e) {
  const cell = e.target;
  if (!cell.classList.contains("cell")) return;

  const index = cell.dataset.index;
  if (boardState[index] !== "" || !gameActive) return;

  playAudio(clickSound);
  boardState[index] = currentPlayer;

  if (checkWinner()) return;

  switchPlayer();
  updateUI();
}

board.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    handleCellClick(e);
  }
});

function switchPlayer() {
  currentPlayer = currentPlayer === "X" ? "O" : "X";
}

const winPatterns = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function checkWinner() {
  for (const pattern of winPatterns) {
    const [a, b, c] = pattern;
    if (
      boardState[a] &&
      boardState[a] === boardState[b] &&
      boardState[a] === boardState[c]
    ) {
      gameActive = false;
      highlightWin(pattern);
      declareWinner(boardState[a]);
      return true;
    }
  }

  if (!boardState.includes("")) {
    gameActive = false;
    declareDraw();
    return true;
  }

  return false;
}

function updateUI() {
  const cells = document.querySelectorAll(".cell");
  cells.forEach((cell, i) => {
    cell.textContent = boardState[i];
    if (boardState[i] !== "") {
      cell.setAttribute("aria-label", `Cell ${i} diisi oleh ${boardState[i]}`);
    }
  });

  if (gameActive) {
    statusText.textContent = `Player ${currentPlayer} Turn`;
  }
}

function highlightWin(pattern) {
  const cells = document.querySelectorAll(".cell");
  pattern.forEach((i) => cells[i].classList.add("win"));
}

function declareWinner(player) {
  scores[player]++;
  playAudio(winSound);
  showModal(`Player ${player} Wins!`);
}

function declareDraw() {
  scores.draw++;
  showModal("It's a Draw!");
}

function showModal(text) {
  modalText.textContent = text;
  modal.classList.remove("hidden");
  modal.setAttribute("aria-hidden", "false");
  renderScores();
}

document.getElementById("playAgain").onclick = () => {
  modal.classList.add("hidden");
  modal.setAttribute("aria-hidden", "true");

  startingPlayer = startingPlayer === "X" ? "O" : "X";
  resetGame();
};

function resetGame() {
  board.style.opacity = 0;
  setTimeout(() => {
    initializeGame();
    board.style.opacity = 1;
  }, 250);
}

function renderScores() {
  document.getElementById("scoreX").textContent = scores.X;
  document.getElementById("scoreO").textContent = scores.O;
  document.getElementById("scoreDraw").textContent = scores.draw;
}

const themeToggle = document.getElementById("themeToggle");

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

board.addEventListener("click", handleCellClick);
document.getElementById("restartBtn").addEventListener("click", resetGame);

initializeGame();
