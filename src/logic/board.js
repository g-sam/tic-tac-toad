import { chain } from 'ramda';
import memoize from './memoize';

export default class Board {
  getEmptyBoard = size =>
    Array(size ** 2).fill(0);

  movePlayerToIndex = (board, player) => idx => [
    ...board.slice(0, idx),
    player,
    ...board.slice(idx + 1),
  ];

  getEmptyIndices = memoize(board =>
    board.reduce(
      (acc, curr, idx) =>
      (curr === 0 ? acc.concat(idx) : acc),
      [],
    ));

  isBoardEmpty = board =>
    (this.getEmptyIndices(board).length === board.length);

  isBoardFull = board =>
    (this.getEmptyIndices(board).length === 0);

  rows = size => i => j =>
    j + (i * size);

  cols = size => i => j =>
    (j * size) + i;

  downDiagIndices = size => j =>
    ((size - 1) * j) + (size - 1);

  upDiagIndices = size => j =>
    ((size - 1) * j) + (2 * j);

  generateIndicesOfLines = memoize((board) => {
    const size = Math.sqrt(board.length);
    const range = [...Array(size).keys()];
    const rowIndicesAt = this.rows(size);
    const colIndicesAt = this.cols(size);
    return chain((i => [
      range.map(rowIndicesAt(i)),
      range.map(colIndicesAt(i)),
    ]), range)
      .concat([range.map(this.downDiagIndices(size))])
      .concat([range.map(this.upDiagIndices(size))]);
  });

  isWinningLine = (board, player) => line =>
    line.every(i => board[i] === player);

  isWinner = (board, player) =>
    this.generateIndicesOfLines(board)
      .some(this.isWinningLine(board, player));

  isGameOver = memoize((board, player) =>
    this.isWinner(board, player) || this.isBoardFull(board));

  getWinner = (board, player) => {
    if (this.isWinner(board, player)) return player;
    if (this.isBoardFull(board)) return 0;
    return undefined;
  }

}
