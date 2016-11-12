import * as fromBoard from './board';

export const score = (board, player) =>
  (fromBoard.isWinner(board, player) ? 1 : 0);
