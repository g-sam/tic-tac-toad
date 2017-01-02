import * as fromBoard from './board';

function memoize(fn) {
  const cache = {};
  const hash = JSON.stringify;
  return function (...args) {
    const key = hash(args);
    if (!cache[key]) cache[key] = fn.apply(this, args);
    return cache[key];
  };
}

export default class AI {
  score = memoize((board, player, depth) =>
    (fromBoard.isWinner(board, player) ? 100 - depth : 0));

  deeplyScoreMove = memoize((player, depth, currPlayerBest, otherPlayerBest) => board =>
    (fromBoard.isGameOver(board, player) ?
      this.score(board, player, depth) :
      // eslint-disable-next-line no-use-before-define
      -Math.max(...this.scoreNextMoves(
        board, fromBoard.switchPlayer(player),
        depth, currPlayerBest, otherPlayerBest,
      ))));

  otherPlayerWillBlock = memoize((currBest, otherBest) =>
    (currBest >= otherBest));

  prunedScoring = memoize((player, depth, currPlayerBest, otherPlayerBest) =>
    (scores, currBoard) => {
      const newCurrPlayerBest = Math.max(...scores, currPlayerBest);
      if (this.otherPlayerWillBlock(newCurrPlayerBest, otherPlayerBest)) {
        return [
          ...scores,
          newCurrPlayerBest,
        ];
      }
      return [
        ...scores,
        this.deeplyScoreMove(player, depth + 1, -otherPlayerBest, -newCurrPlayerBest)(currBoard),
      ];
    });

  getNextBoards = memoize((board, player) =>
    fromBoard.getEmptyIndices(board, player)
    .map(fromBoard.movePlayerToIndex(board, player)));

  scoreNextMoves = memoize((
    board, player,
    depth = 0,
    currPlayerBest = -100,
    otherPlayerBest = 100,
  ) =>
    this.getNextBoards(board, player)
    .reduce(
      this.prunedScoring(player, depth, currPlayerBest, otherPlayerBest),
      [],
    ));

  getBestMove = (board, player) =>
    fromBoard.getEmptyIndices(board, player)[
      this.scoreNextMoves(board, player)
      .reduce((idxOfMax, crntScore, idx, scores) =>
        (crntScore > scores[idxOfMax] ? idx : idxOfMax), 0)
    ];
}
