// sudoku.js

const sudokuBoard = document.getElementById('sudoku-board');
const checkBtn = document.getElementById('check');
const messageDiv = document.getElementById('message');
const newGameBtn = document.getElementById('newGame');
const levelSelector = document.getElementById('level');

let puzzle = [];

function generateCompleteSudoku() {
  const grid = Array.from({ length: 9 }, () => Array(9).fill(0));

  function isSafe(row, col, num) {
    for (let x = 0; x < 9; x++) {
      if (grid[row][x] === num || grid[x][col] === num) return false;
    }
    const startRow = row - row % 3;
    const startCol = col - col % 3;
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        if (grid[startRow + r][startCol + c] === num) return false;
      }
    }
    return true;
  }

  function solve() {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (grid[row][col] === 0) {
          const nums = shuffle([...Array(9).keys()].map(n => n + 1));
          for (let num of nums) {
            if (isSafe(row, col, num)) {
              grid[row][col] = num;
              if (solve()) return true;
              grid[row][col] = 0;
            }
          }
          return false;
        }
      }
    }
    return true;
  }

  solve();
  return grid;
}

function createPuzzleFromSolution(solution, emptyCount) {
  const puzzle = solution.map(row => row.slice());
  let removed = 0;
  while (removed < emptyCount) {
    const row = Math.floor(Math.random() * 9);
    const col = Math.floor(Math.random() * 9);
    if (puzzle[row][col] !== 0) {
      puzzle[row][col] = 0;
      removed++;
    }
  }
  return puzzle;
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function buildBoard() {
  sudokuBoard.innerHTML = '';
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      const cell = document.createElement('input');
      cell.type = 'number';
      cell.classList.add('cell');
      cell.max = 9;
      cell.min = 1;
      cell.dataset.row = row;
      cell.dataset.col = col;

      if (puzzle[row][col] !== 0) {
        cell.value = puzzle[row][col];
        cell.readOnly = true;
        cell.classList.add('prefilled');
      }

      sudokuBoard.appendChild(cell);
    }
  }
}

function checkBoard() {
  const grid = Array.from({ length: 9 }, () => Array(9).fill(0));
  const cells = document.querySelectorAll('.cell');
  let valid = true;

  for (let cell of cells) {
    const val = parseInt(cell.value);
    const r = parseInt(cell.dataset.row);
    const c = parseInt(cell.dataset.col);
    if (!val || val < 1 || val > 9) {
      valid = false;
      break;
    }
    grid[r][c] = val;
  }

  if (!valid || !isSudokuValid(grid)) {
    messageDiv.textContent = "❌ Il y a une erreur dans ta grille, essaie encore !";
    messageDiv.style.color = "#c0392b";
  } else {
    messageDiv.innerHTML = `
      🎉 Bravo Alain ! Tu as résolu le Sudoku comme un roi de la logique !<br><br>
      <p>
        Alain,<br/><br/>
        Tu as été un véritable pilier pour moi au sein de cette entreprise. Je ne pourrai jamais assez te remercier pour le temps et l'énergie que tu as consacrés à m'expliquer, me montrer et m'apprendre ce métier. C'est un vrai privilège d'apprendre auprès d'une personne passionnée !<br/><br/>
        Je suis aussi très reconnaissante pour cette belle amitié qui s'est construite au fil du temps. J'espère sincèrement qu'on aura l'occasion de se revoir, même après mon départ, autour d'un bon déjeuner avec des personnes comme Théo !<br/><br/>
        Je te souhaite de réaliser tous ces voyages dont tu as rêvé… et que tu viennes me les raconter sur Discord, bien sûr 😄<br/><br/>
        Encore un immense merci pour tout, Alain.<br/><br/>

        Anaïs ✈️
      </p>
    `;
    messageDiv.style.color = "#27ae60";
  }
}

function isSudokuValid(grid) {
  for (let i = 0; i < 9; i++) {
    const row = new Set();
    const col = new Set();
    const box = new Set();
    for (let j = 0; j < 9; j++) {
      let r = grid[i][j];
      let c = grid[j][i];
      let br = 3 * Math.floor(i / 3) + Math.floor(j / 3);
      let bc = 3 * (i % 3) + (j % 3);
      let b = grid[br][bc];

      if (row.has(r) || col.has(c) || box.has(b)) return false;
      row.add(r);
      col.add(c);
      box.add(b);
    }
  }
  return true;
}

newGameBtn.addEventListener('click', () => {
  const emptyCount = parseInt(levelSelector.value);
  const solution = generateCompleteSudoku();
  puzzle = createPuzzleFromSolution(solution, emptyCount);
  buildBoard();
  messageDiv.textContent = '';
});

checkBtn.addEventListener('click', checkBoard);

// Initial load
newGameBtn.click();
