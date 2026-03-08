/* =========================
   GAME STATE
========================= */

let boardState = Array(9).fill("");
let currentPlayer = "X";
let gameActive = true;

const board = document.getElementById("board");
const statusText = document.getElementById("statusText");

const modal = document.getElementById("modal");
const modalText = document.getElementById("modalText");

const clickSound = document.getElementById("clickSound");
const winSound = document.getElementById("winSound");

/* SCORE */
let scores = JSON.parse(localStorage.getItem("tttScores")) || {
  X:0,
  O:0,
  draw:0
};

/* =========================
   INITIALIZE GAME
========================= */

function initializeGame(){
  board.innerHTML = "";

  boardState = Array(9).fill("");
  gameActive = true;
  currentPlayer = "X";

  for(let i=0;i<9;i++){
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.dataset.index = i;
    board.appendChild(cell);
  }

  updateUI();
  renderScores();
}

/* =========================
   HANDLE CLICK (EVENT DELEGATION)
========================= */

function handleCellClick(e){
  const cell = e.target;
  if(!cell.classList.contains("cell")) return;

  const index = cell.dataset.index;

  if(boardState[index] !== "" || !gameActive) return;

  clickSound.currentTime = 0;
  clickSound.play();

  boardState[index] = currentPlayer;

  checkWinner();
  switchPlayer();
  updateUI();
}

/* =========================
   SWITCH PLAYER
========================= */

function switchPlayer(){
  currentPlayer = currentPlayer === "X" ? "O" : "X";
}

/* =========================
   WIN CHECK
========================= */

const winPatterns = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

function checkWinner(){

  for(const pattern of winPatterns){
    const [a,b,c] = pattern;

    if(
      boardState[a] &&
      boardState[a] === boardState[b] &&
      boardState[a] === boardState[c]
    ){
      gameActive = false;
      highlightWin(pattern);
      declareWinner(boardState[a]);
      return;
    }
  }

  if(!boardState.includes("")){
    gameActive = false;
    declareDraw();
  }
}

/* =========================
   UI UPDATE
========================= */

function updateUI(){
  const cells = document.querySelectorAll(".cell");

  cells.forEach((cell,i)=>{
    cell.textContent = boardState[i];
  });

  if(gameActive){
    statusText.textContent = `Player ${currentPlayer} Turn`;
  }
}

/* =========================
   WIN / DRAW
========================= */

function highlightWin(pattern){
  const cells = document.querySelectorAll(".cell");
  pattern.forEach(i => cells[i].classList.add("win"));
}

function declareWinner(player){
  scores[player]++;
  saveScores();

  winSound.currentTime = 0;
  winSound.play();

  showModal(`Player ${player} Wins!`);
}

function declareDraw(){
  scores.draw++;
  saveScores();
  showModal("It's a Draw!");
}

/* =========================
   MODAL
========================= */

function showModal(text){
  modalText.textContent = text;
  modal.classList.remove("hidden");
  renderScores();
}

document.getElementById("playAgain").onclick = () =>{
  modal.classList.add("hidden");
  resetGame();
};

/* =========================
   RESET GAME
========================= */

function resetGame(){
  board.style.opacity = 0;

  setTimeout(()=>{
    initializeGame();
    board.style.opacity = 1;
  },250);
}

/* =========================
   SCORE STORAGE
========================= */

function saveScores(){
  localStorage.setItem("tttScores", JSON.stringify(scores));
}

function renderScores(){
  document.getElementById("scoreX").textContent = scores.X;
  document.getElementById("scoreO").textContent = scores.O;
  document.getElementById("scoreDraw").textContent = scores.draw;
}

/* =========================
   DARK MODE
========================= */

const themeToggle = document.getElementById("themeToggle");

if(localStorage.getItem("theme")==="dark"){
  document.body.classList.add("dark");
}

themeToggle.addEventListener("click",()=>{
  document.body.classList.toggle("dark");

  localStorage.setItem(
    "theme",
    document.body.classList.contains("dark") ? "dark":"light"
  );
});

/* =========================
   EVENTS
========================= */

board.addEventListener("click", handleCellClick);
document.getElementById("restartBtn").addEventListener("click", resetGame);

/* =========================
   START
========================= */

initializeGame();