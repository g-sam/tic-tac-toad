import AI from './ai';
import Board from './board';

export default class Logic {
  getBestMove = new AI().getBestMove;
  board = new Board();
  getEmptyBoard = this.board.getEmptyBoard;
  isBoardFull = this.board.isBoardFull;
  isWinner = this.board.isWinner;
  getWinner = this.board.getWinner;
  movePlayerToIndex = this.board.movePlayerToIndex;
  switchPlayer = this.board.switchPlayer;
}
