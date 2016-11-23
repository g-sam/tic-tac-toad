import * as fromBoard from './board';

export const score = (board, player, depth) =>
  (fromBoard.isWinner(board, player) ? 100 - depth : 0);

export const getNextBoards = (board, player) =>
    fromBoard.getEmptyIndices(board, player)
    .map(fromBoard.movePlayerToIndex(board, player));

export const scoreNextMoves = (board, player, depth = 0) =>
  getNextBoards(board, player)
    .map(deeplyScoreMove(player, depth)); // eslint-disable-line no-use-before-define

export const deeplyScoreMove = (player, depth) => board =>
  (fromBoard.isGameOver(board, player) ?
    score(board, player, depth) :
    -Math.max(...scoreNextMoves(board, fromBoard.switchPlayer(player), depth + 1)));

export const getBestMove = (board, player) =>
  fromBoard.getEmptyIndices(board, player)[
    scoreNextMoves(board, player)
    .reduce((idxOfMax, crntScore, idx, scores) =>
        (crntScore > scores[idxOfMax] ? idx : idxOfMax), 0)
  ];
