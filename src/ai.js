import * as fromBoard from './board';

export const score = (board, player) =>
  (fromBoard.isWinner(board, player) ? 1 : 0);

export const getNextBoards = (board, player) =>
    fromBoard.getEmptyIndices(board, player)
    .map(fromBoard.movePlayerToIndex(board, player));

export const scoreNextMoves = (board, player) =>
  getNextBoards(board, player)
    .map(deeplyScoreMove(player)); // eslint-disable-line no-use-before-define

const switchPlayer = player =>
  (player === 1 ? 2 : 1);

export const deeplyScoreMove = player => board =>
  (fromBoard.isGameOver(board, player) ?
    score(board, player) :
    -Math.max(...scoreNextMoves(board, switchPlayer(player))));
