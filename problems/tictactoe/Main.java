package tictactoe;
//class diagram
// app has-a Board (composition)
// Board has-a 2D array of Cell
// HumanPlayer is-a Player (inheritance)
// Symbol and GameStatus are enums

import java.util.Scanner;

enum Symbols {
	X, O
}

enum GameStatus {
	IN_PROGRESS,
	DRAW,
	WIN
}

abstract class Player {
	private String name;
	private Symbols symbol;

	public Player(String name, Symbols symbol) {
		this.name = name;
		this.symbol = symbol;
	}

	public String getName() {
		return name;
	}

	public Symbols getSymbol() {
		return symbol;
	}

	abstract public int[] getmovefromuser();
}

interface MoveStrategy {
	int[] getMove(String player);
}

class HumanMoveStrategy implements MoveStrategy {
	private Scanner sc = new Scanner(System.in);

	public int[] getMove(String player) {
		System.out.print(player + " Enter your move (row col): ");
		return new int[] { sc.nextInt(), sc.nextInt() };
	}

}

class HumanPlayer extends Player {
	private MoveStrategy strategy;

	public HumanPlayer(String name, Symbols symbol, MoveStrategy strategy) {
		super(name, symbol);
		this.strategy = strategy;
	}

	@Override
	public int[] getmovefromuser() {
		return strategy.getMove(super.getName());
	}
}

class Cell {
	private int row;
	private int col;
	private Symbols symbol;

	public Cell(int row, int col) {
		this.row = row;
		this.col = col;
		this.symbol = null;
	}

	public boolean isEmpty() {
		return symbol == null;
	}

	// Getters and Setters
	public Symbols getSymbol() {
		return symbol;
	}

	public void setSymbol(Symbols symbol) {
		this.symbol = symbol;
	}
}

class Board {
	private int size;
	private Cell[][] grid;

	public int getSize() {
		return size;
	}

	public Board(int size) {
		this.size = size;
		this.grid = new Cell[size][size];
		for (int i = 0; i < size; i++)
			for (int j = 0; j < size; j++)
				grid[i][j] = new Cell(i, j);
	}

	public void printBoard() {
		for (Cell[] row : grid) {
			for (Cell cell : row) {
				System.out.print(cell.getSymbol() == null ? "-" : cell.getSymbol());
				System.out.print(" ");
			}
			System.out.println();
		}
	}

	public boolean makeMove(int row, int col, Symbols symbol) {

		if (grid[row][col].isEmpty()) {
			grid[row][col].setSymbol(symbol);
			return true;
		}
		return false;
	}

	public boolean isFull() {
		for (Cell[] row : grid)
			for (Cell cell : row)
				if (cell.isEmpty())
					return false;
		return true;
	}

	public boolean checkWin(Symbols symbol) {
		for (int i = 0; i < size; i++) {
			// Rows & Columns
			if (checkRow(i, symbol) || checkColumn(i, symbol))
				return true;
		}
		return checkDiagonals(symbol);
	}

	private boolean checkRow(int row, Symbols symbol) {
		for (int i = 0; i < size; i++)
			if (grid[row][i].getSymbol() != symbol)
				return false;
		return true;
	}

	private boolean checkColumn(int col, Symbols symbol) {
		for (int i = 0; i < size; i++)
			if (grid[i][col].getSymbol() != symbol)
				return false;
		return true;
	}

	private boolean checkDiagonals(Symbols symbol) {
		boolean diag1 = true, diag2 = true;
		for (int i = 0; i < size; i++) {
			diag1 &= (grid[i][i].getSymbol() == symbol);
			diag2 &= (grid[i][size - i - 1].getSymbol() == symbol);
		}
		return diag1 || diag2;
	}

}

class App {
	private Board b;
	private Player[] p;
	private GameStatus status;
	private int currplayer;

	public App(int boardsize, Player p1, Player p2) {
		b = new Board(boardsize);
		p = new Player[] { p1, p2 };
		status = GameStatus.IN_PROGRESS;
		currplayer = 0;
	}

	public void play() {

		while (status == GameStatus.IN_PROGRESS) {
			b.printBoard();
			Player cp = p[currplayer];
			boolean moveMade = false;

			while (!moveMade) {
				int[] input = cp.getmovefromuser();
				int row = input[0];
				int col = input[1];

				if (row < 0 || row >= b.getSize() || col < 0 || col >= b.getSize()) {
					System.out.println("Invalid input. Row and column must be between 0 and " + (b.getSize() - 1));
					continue;
				}

				moveMade = b.makeMove(row, col, cp.getSymbol());
				if (!moveMade)
					System.out.println("Cell already taken. Try again.");
			}

			if (b.checkWin(cp.getSymbol())) {
				status = GameStatus.WIN;
				b.printBoard();
				System.out.println(cp.getName() + " wins!");
				return;
			}
			// no need to check false because if false means continue the play;

			// check for draw(if board is fulled means draw only)
			if (b.isFull()) {
				status = GameStatus.DRAW;
				b.printBoard();
				System.out.println("It's a draw!");
				return;
			}
			currplayer = (currplayer + 1) % 2;
		}

	}

}

class PlayerFactory {
	public Player createPlayer(String type, String name, Symbols symbol) {
		if ("human".equalsIgnoreCase(type)) {
			return new HumanPlayer(name, symbol, new HumanMoveStrategy());
		}
		// else if ("ai".equalsIgnoreCase(type)) return new AIPlayer(...);
		throw new IllegalArgumentException("Unknown player type");
	}
}

public class Main {
	public static void main(String[] args) {
		int boardsize = 3;

		PlayerFactory pf = new PlayerFactory();
		Player p1 = pf.createPlayer("human", "Player 1", Symbols.X);
		Player p2 = pf.createPlayer("human", "Player 1", Symbols.O);
		App app = new App(boardsize, p1, p2);
		app.play();
	}
}