import { map, transduce, reduced } from 'ramda';
import Board from './board';
import Player from '../players/player';
import memoize from './memoize';

export default class AI {
  board = new Board();

  score = (board, player, depth) =>
    (this.board.isWinner(board, player) ? 100 - depth : 0);

  deeplyScoreMove = (board, player, depth, currPlayerBest, otherPlayerBest) =>
    (this.board.isGameOver(board, player) ?
      this.score(board, player, depth) :
      -Math.max(
        ...this.scoreNextMoves(        // eslint-disable-line no-use-before-define
          board,
          Player.switchPlayer(player),
          depth,
          currPlayerBest,
          otherPlayerBest,
        )));

  otherPlayerWillBlock = (currBest, otherBest) =>
    (currBest >= otherBest);

  prunedScoring = (player, depth, currPlayerBest, otherPlayerBest) =>
    (scores, currBoard) => {
      const newCurrPlayerBest = Math.max(...scores, currPlayerBest);
      if (this.otherPlayerWillBlock(newCurrPlayerBest, otherPlayerBest)) {
        return reduced([
          ...scores,
          newCurrPlayerBest,
        ]);
      }
      return [
        ...scores,
        this.deeplyScoreMove(currBoard, player, depth + 1, -otherPlayerBest, -newCurrPlayerBest),
      ];
    };

  takeMove = (board, player) =>
    map(this.board.movePlayerToIndex(board, player));

  scoreNextMoves = memoize((
    board,
    player,
    depth = 0,
    currPlayerBest = -100,
    otherPlayerBest = 100,
  ) =>
    transduce(
      this.takeMove(board, player),
      this.prunedScoring(player, depth, currPlayerBest, otherPlayerBest),
      [],
      this.board.getEmptyIndices(board, player),
    ));

  shouldPickQuick = (board, player) =>
    (this.board.getEmptyIndices(board, player).length >= 15);

  getBestMove = (board, player) =>
    (this.shouldPickQuick(board, player)
      ? this.board.getEmptyIndices(board, player)[0]
      : this.board.getEmptyIndices(board, player)[
        this.scoreNextMoves(board, player)
        .reduce((idxOfMax, crntScore, idx, scores) =>
          (crntScore > scores[idxOfMax] ? idx : idxOfMax), 0)
        ]);
}

