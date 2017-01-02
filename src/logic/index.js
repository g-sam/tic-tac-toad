import AI from './ai';
import {
  getEmptyBoard,
  isBoardFull,
  isWinner,
  movePlayerToIndex,
  switchPlayer,
} from './board';

export default class Logic {
  getBestMove = new AI().getBestMove;
  getEmptyBoard = getEmptyBoard;
  isBoardFull = isBoardFull;
  isWinner = isWinner;
  movePlayerToIndex = movePlayerToIndex;
  switchPlayer = switchPlayer;
}
