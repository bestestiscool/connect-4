let activeGame = null; // Variable to store the active game instance

class Player {
  constructor(color) {
    this.color = color;
  }

  // Add a method to update the player's color
  setColor(newColor) {
    this.color = newColor;
  }
}

class Game {
  constructor(p1, p2, height = 6, width = 7) {
    this.players = [p1, p2];
    this.height = height;
    this.width = width;
    this.currPlayer = p1;
    this.makeBoard();
    this.makeHtmlBoard();
  }

  makeBoard() {
    this.board = [];
    for (let y = 0; y < this.height; y++) {
      this.board.push(Array.from({ length: this.width }));
    }
  }

  makeHtmlBoard() {
    const board = document.getElementById('board');
    board.innerHTML = ''; // Clear any existing board

    const top = document.createElement('tr');
    top.setAttribute('id', 'column-top');
    this.handleGameClick = this.handleClick.bind(this);
    top.addEventListener("click", this.handleGameClick);

    for (let x = 0; x < this.width; x++) {
      const headCell = document.createElement('td');
      headCell.setAttribute('id', x);
      top.append(headCell);
    }

    board.append(top);

    for (let y = 0; y < this.height; y++) {
      const row = document.createElement('tr');

      for (let x = 0; x < this.width; x++) {
        const cell = document.createElement('td');
        cell.setAttribute('id', `${y}-${x}`);
        row.append(cell);
      }

      board.append(row);
    }
  }

  findSpotForCol(x) {
    for (let y = this.height - 1; y >= 0; y--) {
      if (!this.board[y][x]) {
        return y;
      }
    }
    return null;
  }

  placeInTable(y, x) {
    const piece = document.createElement('div');
    piece.classList.add('piece');
    piece.style.backgroundColor = this.currPlayer.color;

    const spot = document.getElementById(`${y}-${x}`);
    spot.append(piece);
  }

  endGame(msg) {
    alert(msg);
    const top = document.getElementById('column-top');
    top.removeEventListener('click', this.handleGameClick);
    activeGame = null;
    document.getElementById('start-game').textContent = 'Start Game!';
  }

  handleClick(evt) {
    const x = +evt.target.id;
    const y = this.findSpotForCol(x);
    if (y === null) {
      return;
    }

    this.board[y][x] = this.currPlayer;
    this.placeInTable(y, x);

    if (this.checkForWin()) {
      return this.endGame(`The ${this.currPlayer.color} player won!`);
    }

    if (this.board.every(row => row.every(cell => cell))) {
      return this.endGame('Tie!');
    }

    this.currPlayer = this.currPlayer === this.players[0] ? this.players[1] : this.players[0];
  }

  checkForWin() {
    const _win = cells => cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < this.height &&
        x >= 0 &&
        x < this.width &&
        this.board[y][x] === this.currPlayer
    );

    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
        const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
        const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
        const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

        if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
          return true;
        }
      }
    }
  }

  resetGame() {
    this.clearBoard();
    this.makeBoard();
    this.makeHtmlBoard();

    // Set new colors from the input fields for both players
    this.players[0].setColor(document.getElementById('p1-color').value);
    this.players[1].setColor(document.getElementById('p2-color').value);

    // Reset the current player to the first player
    this.currPlayer = this.players[0];
  }

  clearBoard() {
    const board = document.getElementById('board');
    board.innerHTML = '';
  }
}

document.getElementById('start-game').addEventListener('click', () => {
  let p1Color = document.getElementById('p1-color').value;
  let p2Color = document.getElementById('p2-color').value;

  // Check if the colors are entered before starting the game
  if (!p1Color || !p2Color) {
    alert('Please enter colors for both players.');
    return;
  }

  // If there's an active game, reset it; otherwise, start a new game
  if (activeGame) {
    activeGame.resetGame();
  } else {
    let p1 = new Player(p1Color);
    let p2 = new Player(p2Color);
    activeGame = new Game(p1, p2);
  }
  // Update the button text to 'Reset Game' after the game is started or reset
  document.getElementById('start-game').textContent = 'Reset Game';
});