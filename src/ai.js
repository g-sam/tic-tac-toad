import * as fromBoard from './board';

export const score = player => board =>
  (fromBoard.isWinner(board, player) ? 1 : 0);

export const getNextBoards = (board, player) =>
    fromBoard.getEmptyIndices(board, player)
    .map(fromBoard.movePlayerToIndex(board, player));

export const scoreNextMoves = (board, player) => getNextBoards(board, player).map(score(player));

