const ROWS = 10;
const COLS = 17;
let grid = [];
let score = 0;
let isSelecting = false;
let startRow, startCol, endRow, endCol;

const gridTable = document.getElementById('grid');
const scoreDiv = document.getElementById('score');
const timerDiv = document.getElementById('timer');
const lightColorsCheckbox = document.getElementById('light-colors');
const newGameButton = document.getElementById('new-game');
const refreshCellsButton = document.getElementById('refresh-cells');

function initGame() {
    generateGrid();
    renderGrid();
    score = 0;
    timeLeft = 120;
    updateScore();
    gridTable.classList.remove('disabled');
}

function generateGrid() {
    grid = Array.from({ length: ROWS }, () => Array.from({ length: COLS }, () => Math.floor(Math.random() * 9) + 1));
    let totalSum = grid.flat().reduce((a, b) => a + b, 0);
    let remainder = totalSum % 10;
    if (remainder !== 0) {
        for (let i = 0; i < ROWS; i++) {
            for (let j = 0; j < COLS; j++) {
                let val = grid[i][j];
                if (val - remainder >= 1) {
                    grid[i][j] -= remainder;
                    return;
                } else if (val + (10 - remainder) <= 9) {
                    grid[i][j] += (10 - remainder);
                    return;
                }
            }
        }
    }
}

function renderGrid() {
    gridTable.innerHTML = '';
    for (let i = 0; i < ROWS; i++) {
        let row = document.createElement('tr');
        for (let j = 0; j < COLS; j++) {
            let cell = document.createElement('td');
            cell.dataset.row = i;
            cell.dataset.col = j;
            cell.textContent = grid[i][j] > 0 ? grid[i][j] : '';
            row.appendChild(cell);
        }
        gridTable.appendChild(row);
    }
}

function updateScore() {
    scoreDiv.textContent = `Điểm: ${score}`;
}

gridTable.addEventListener('mousedown', (e) => {
    if (e.target.tagName === 'TD' && !gridTable.classList.contains('disabled')) {
        isSelecting = true;
        startRow = parseInt(e.target.dataset.row);
        startCol = parseInt(e.target.dataset.col);
        endRow = startRow;
        endCol = startCol;
        highlightSelection();
    }
});

gridTable.addEventListener('mousemove', (e) => {
    if (isSelecting && e.target.tagName === 'TD') {
        endRow = parseInt(e.target.dataset.row);
        endCol = parseInt(e.target.dataset.col);
        highlightSelection();
    }
});

gridTable.addEventListener('mouseup', () => {
    if (isSelecting) {
        isSelecting = false;
        checkSelection();
        clearSelection();
    }
});

function highlightSelection() {
    // Xác định vùng chọn
    let minRow = Math.min(startRow, endRow);
    let maxRow = Math.max(startRow, endRow);
    let minCol = Math.min(startCol, endCol);
    let maxCol = Math.max(startCol, endCol);

    // Lặp qua tất cả các ô trong lưới
    for (let i = 0; i < ROWS; i++) {
        for (let j = 0; j < COLS; j++) {
            let cell = gridTable.rows[i].cells[j];
            // Chỉ tô đen các ô trong vùng chọn
            if (i >= minRow && i <= maxRow && j >= minCol && j <= maxCol) {
                cell.classList.add('selected');
            } else {
                // Xóa tô đen khỏi các ô ngoài vùng chọn
                cell.classList.remove('selected');
            }
        }
    }
}

function clearSelection() {
    for (let i = 0; i < ROWS; i++) {
        for (let j = 0; j < COLS; j++) {
            gridTable.rows[i].cells[j].classList.remove('selected');
        }
    }
}
function refreshUnsolvedCells() {
    let hasRemainingCells = false;

    // Tạo một mảng tạm để lưu các ô có giá trị mới
    let newValues = Array.from({ length: ROWS }, () =>
        Array.from({ length: COLS }, () => Math.floor(Math.random() * 9) + 1)
    );

    // Chỉ cập nhật những ô còn giá trị > 0
    for (let i = 0; i < ROWS; i++) {
        for (let j = 0; j < COLS; j++) {
            if (grid[i][j] > 0) {
                grid[i][j] = newValues[i][j];
                hasRemainingCells = true;
            }
        }
    }

    // Nếu có ô còn lại, cập nhật lại giao diện
    if (hasRemainingCells) {
        renderGrid();
    } else {
        alert("Không còn ô nào để đổi. Tất cả đã được giải!");
    }
}

function checkSelection() {
    let minRow = Math.min(startRow, endRow);
    let maxRow = Math.max(startRow, endRow);
    let minCol = Math.min(startCol, endCol);
    let maxCol = Math.max(startCol, endCol);

    let sum = 0;
    for (let i = minRow; i <= maxRow; i++) {
        for (let j = minCol; j <= maxCol; j++) {
            sum += grid[i][j]; // grid là mảng chứa giá trị của các ô
        }
    }

    if (sum === 10) {
        // Xử lý khi tổng bằng 10, ví dụ: xóa các ô và cộng điểm
        removeCells(minRow, minCol, maxRow, maxCol);
        score += (maxRow - minRow + 1) * (maxCol - minCol + 1);
        updateScore();
    }
}

function openRules() {
    document.getElementById('rulesModal').style.display = 'block';
}

function closeRules() {
    document.getElementById('rulesModal').style.display = 'none';
}


window.onclick = function(event) {
    const modal = document.getElementById('rulesModal');
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}

function removeCells(minRow, minCol, maxRow, maxCol) {
    for (let i = minRow; i <= maxRow; i++) {
        for (let j = minCol; j <= maxCol; j++) {
            if (grid[i][j] > 0) {
                grid[i][j] = 0;
                gridTable.rows[i].cells[j].textContent = '';
            }
        }
    }
}

lightColorsCheckbox.addEventListener('change', () => {
    if (lightColorsCheckbox.checked) {
        gridTable.classList.add('light');
    } else {
        gridTable.classList.remove('light');
    }
});

newGameButton.addEventListener('click', initGame);
refreshCellsButton.addEventListener('click', refreshUnsolvedCells);
initGame();