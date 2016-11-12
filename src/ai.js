import * as fromBoard from './board';

export const score = (board, player) =>
  (fromBoard.isWinner(board, player) ? 1 : 0);

export const getNextBoards = (board, player) =>
    fromBoard.getEmptyIndices(board, player)
    .map(fromBoard.movePlayerToIndex(board, player));

