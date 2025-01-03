const boardSize = 5;
const totalCells = boardSize * boardSize;
let bombCount = 5;
let maxMultiplier = 100;
let gameBoard = [];
let isGameOver = false;
let betAmount = 0;
let multiplier = 1;
let mode = "Easy";

const cashoutButton = document.getElementById('cashout-button');
const startButton = document.getElementById('start-button'); // Ambil referensi tombol Start

document.getElementById('easy').addEventListener('click', () => setMode("Easy", 5));
document.getElementById('normal').addEventListener('click', () => setMode("Normal", 10));
document.getElementById('hard').addEventListener('click', () => setMode("Hard", 15));
document.getElementById('evil').addEventListener('click', () => setMode("Evil", 24));
startButton.addEventListener('click', startGame);
cashoutButton.addEventListener('click', cashout);

function setMode(newMode, newBombCount) {
    mode = newMode;
    bombCount = newBombCount;
    document.getElementById('game-mode').textContent = `Mode: ${mode}`;
    document.getElementById('bombs-left').textContent = `Bombs: ${bombCount}`;
}

function startGame() {
    isGameOver = false;
    multiplier = 1;
    document.getElementById('status').textContent = "";
    document.getElementById('multiplier').textContent = "Multiplier: x1";

    betAmount = parseInt(document.getElementById('bet').value);

    if (isNaN(betAmount) || betAmount <= 0) {
        alert("Enter a valid bet amount!");
        return;
    }

    // Menonaktifkan tombol Start Game setelah permainan dimulai
    startButton.disabled = true;

    cashoutButton.disabled = false;
    document.getElementById('game-board').innerHTML = '';
    gameBoard = Array.from({ length: totalCells }, (_, i) => ({ id: i, isBomb: false, revealed: false }));

    placeBombs();
    renderBoard();
}

function placeBombs() {
    let bombsPlaced = 0;
    while (bombsPlaced < bombCount) {
        const randomIndex = Math.floor(Math.random() * totalCells);
        if (!gameBoard[randomIndex].isBomb) {
            gameBoard[randomIndex].isBomb = true;
            bombsPlaced++;
        }
    }
}

function renderBoard() {
    const gameBoardDiv = document.getElementById('game-board');
    gameBoard.forEach(cell => {
        const cellDiv = document.createElement('div');
        cellDiv.classList.add('game-cell');
        cellDiv.dataset.id = cell.id;
        cellDiv.addEventListener('click', handleCellClick);
        gameBoardDiv.appendChild(cellDiv);
    });
}

function handleCellClick(event) {
    if (isGameOver) return;

    const cellId = event.target.dataset.id;
    const cell = gameBoard[cellId];

    if (cell.revealed) return;

    cell.revealed = true;

    if (cell.isBomb) {
        event.target.style.backgroundColor = 'red';
        event.target.textContent = '💣';
        endGame(false);
    } else {
        event.target.style.backgroundColor = 'lightgreen';
        updateMultiplier();
        if (checkWin()) {
            endGame(true);
        }
    }
}

function updateMultiplier() {
    const revealedCells = gameBoard.filter(cell => cell.revealed && !cell.isBomb).length;
    multiplier = 1 + (revealedCells / (totalCells - bombCount)) * (maxMultiplier - 1);
    document.getElementById('multiplier').textContent = `Multiplier: x${multiplier.toFixed(2)}`;
}

function checkWin() {
    return gameBoard.every(cell => cell.isBomb || cell.revealed);
}

function endGame(won) {
    isGameOver = true;
    cashoutButton.disabled = true;
    const status = document.getElementById('status');
    if (won) {
        const totalWin = betAmount * multiplier;
        status.textContent = `You Win! Your earnings: $${totalWin.toFixed(2)}`;
    } else {
        status.textContent = "Game Over!";
    }
    // Aktifkan kembali tombol Start setelah permainan selesai
    startButton.disabled = false;
}

function cashout() {
    if (!isGameOver) {
        const totalWin = betAmount * multiplier;
        document.getElementById('status').textContent = `You cashed out! Total earnings: $${totalWin.toFixed(2)}`;
        cashoutButton.disabled = true;
        isGameOver = true;
    }
    // Aktifkan kembali tombol Start setelah cashout
    startButton.disabled = false;
}
