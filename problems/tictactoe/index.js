const readline = require('readline');

// Enum equivalents
const Symbols = {
  X: 'X',
  O: 'O',
};

const GameStatus = {
  IN_PROGRESS: 'IN_PROGRESS',
  DRAW: 'DRAW',
  WIN: 'WIN',
};

// Abstract Player class
class Player {
  constructor(name, symbol) {
    if (new.target === Player) {
      throw new TypeError("Cannot construct Player instances directly");
    }
    this.name = name;
    this.symbol = symbol;
  }

  getName() {
    return this.name;
  }

  getSymbol() {
    return this.symbol;
  }

  getMoveFromUser() {
    throw new Error("Must override getMoveFromUser()");
  }
}

// Strategy interface
class HumanMoveStrategy {
  constructor(rl) {
    this.rl = rl;
  }

  async getMove(playerName) {
    return new Promise((resolve) => {
      this.rl.question(`${playerName}, enter your move (row col): `, (answer) => {
        const [row, col] = answer.split(" ").map(Number);
        resolve([row, col]);
      });
    });
  }
}

class HumanPlayer extends Player {
  constructor(name, symbol, strategy) {
    super(name, symbol);
    this.strategy = strategy;
  }

  getMoveFromUser() {
    return this.strategy.getMove(this.getName());
  }
}

class Cell {
  constructor(row, col) {
    this.row = row;
    this.col = col;
    this.symbol = null;
  }

  isEmpty() {
    return this.symbol === null;
  }

  getSymbol() {
    return this.symbol;
  }

  setSymbol(symbol) {
    this.symbol = symbol;
  }
}

class Board {
  constructor(size) {
    this.size = size;
    this.grid = Array.from({ length: size }, (_, i) =>
      Array.from({ length: size }, (_, j) => new Cell(i, j))
    );
  }

  getSize() {
    return this.size;
  }

  printBoard() {
    for (const row of this.grid) {
      console.log(row.map(cell => cell.getSymbol() || '-').join(' '));
    }
  }

  makeMove(row, col, symbol) {
    if (this.grid[row][col].isEmpty()) {
      this.grid[row][col].setSymbol(symbol);
      return true;
    }
    return false;
  }

  isFull() {
    return this.grid.every(row => row.every(cell => !cell.isEmpty()));
  }

  checkWin(symbol) {
    for (let i = 0; i < this.size; i++) {
      if (this.checkRow(i, symbol) || this.checkColumn(i, symbol)) return true;
    }
    return this.checkDiagonals(symbol);
  }

  checkRow(row, symbol) {
    return this.grid[row].every(cell => cell.getSymbol() === symbol);
  }

  checkColumn(col, symbol) {
    return this.grid.every(row => row[col].getSymbol() === symbol);
  }

  checkDiagonals(symbol) {
    const diag1 = this.grid.every((row, i) => row[i].getSymbol() === symbol);
    const diag2 = this.grid.every((row, i) => row[this.size - 1 - i].getSymbol() === symbol);
    return diag1 || diag2;
  }
}

class App {
  constructor(boardSize, player1, player2) {
    this.board = new Board(boardSize);
    this.players = [player1, player2];
    this.status = GameStatus.IN_PROGRESS;
    this.currentPlayerIndex = 0;
  }

  async play() {
    while (this.status === GameStatus.IN_PROGRESS) {
      this.board.printBoard();
      const currentPlayer = this.players[this.currentPlayerIndex];
      let moveMade = false;

      while (!moveMade) {
        const [row, col] = await currentPlayer.getMoveFromUser();
        if (
          row < 0 || row >= this.board.getSize() ||
          col < 0 || col >= this.board.getSize()
        ) {
          console.log(`Invalid input. Row and column must be between 0 and ${this.board.getSize() - 1}`);
          continue;
        }

        moveMade = this.board.makeMove(row, col, currentPlayer.getSymbol());
        if (!moveMade) console.log("Cell already taken. Try again.");
      }

      if (this.board.checkWin(currentPlayer.getSymbol())) {
        this.status = GameStatus.WIN;
        this.board.printBoard();
        console.log(`${currentPlayer.getName()} wins!`);
        return;
      }

      if (this.board.isFull()) {
        this.status = GameStatus.DRAW;
        this.board.printBoard();
        console.log("It's a draw!");
        return;
      }

      this.currentPlayerIndex = (this.currentPlayerIndex + 1) % 2;
    }
  }
}

class PlayerFactory {
  constructor(rl) {
    this.rl = rl;
  }

  createPlayer(type, name, symbol) {
    if (type.toLowerCase() === "human") {
      return new HumanPlayer(name, symbol, new HumanMoveStrategy(this.rl));
    }
    throw new Error("Unknown player type");
  }
}

// MAIN
(async function main() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const boardSize = 3;
  const pf = new PlayerFactory(rl);

  const p1 = pf.createPlayer("human", "Player 1", Symbols.X);
  const p2 = pf.createPlayer("human", "Player 2", Symbols.O);

  const game = new App(boardSize, p1, p2);
  await game.play();

  rl.close();
})();
