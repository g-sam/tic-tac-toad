import * as fromBoard from './board';

export const score = (board, player, depth) =>
  (fromBoard.isWinner(board, player) ? 100 - depth : 0);

export const deeplyScoreMove = (player, depth, currPlayerBest, otherPlayerBest) => board =>
  (fromBoard.isGameOver(board, player) ?
    score(board, player, depth) :
    // eslint-disable-next-line no-use-before-define
    -Math.max(...scoreNextMoves(
      board, fromBoard.switchPlayer(player),
      depth, currPlayerBest, otherPlayerBest,
    )));

export const otherPlayerWillNotTakeRoute = (currBest, otherBest) => (currBest >= otherBest);

export const prunedScoring = (player, depth, currPlayerBest, otherPlayerBest) =>
  (scores, currBoard) => {
    const newCurrPlayerBest = Math.max(...scores, currPlayerBest);
    if (otherPlayerWillNotTakeRoute(newCurrPlayerBest, otherPlayerBest)) {
      return [
        ...scores,
        newCurrPlayerBest,
      ];
    }
    return [
      ...scores,
      deeplyScoreMove(player, depth + 1, -otherPlayerBest, -newCurrPlayerBest)(currBoard),
    ];
  };

export const getNextBoards = (board, player) =>
    fromBoard.getEmptyIndices(board, player)
    .map(fromBoard.movePlayerToIndex(board, player));

export const scoreNextMoves = (board, player,
  depth = 0,
  currPlayerBest = -100,
  otherPlayerBest = 100,
) =>
  getNextBoards(board, player)
  .reduce(
    prunedScoring(player, depth, currPlayerBest, otherPlayerBest),
    [],
  );

export const getBestMove = (board, player) =>
  fromBoard.getEmptyIndices(board, player)[
    scoreNextMoves(board, player)
    .reduce((idxOfMax, crntScore, idx, scores) =>
        (crntScore > scores[idxOfMax] ? idx : idxOfMax), 0)
  ];
