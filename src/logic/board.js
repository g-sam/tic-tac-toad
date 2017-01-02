import { chain, memoize } from 'ramda';

export const getEmptyBoard = size =>
  Array(size ** 2).fill(0);

export const switchPlayer = player =>
  (player === 1 ? 2 : 1);

export const movePlayerToIndex = (board, player) => idx => [
  ...board.slice(0, idx),
  player,
  ...board.slice(idx + 1),
];

export const getEmptyIndices = board =>
  board.reduce(
    (acc, curr, idx) =>
      (curr === 0 ? acc.concat(idx) : acc),
      [],
  );

export const isBoardFull = board =>
  (getEmptyIndices(board).length === 0);

const rows = size => i => j =>
  j + (i * size);

const cols = size => i => j =>
  (j * size) + i;

const downDiagIndices = size => j =>
  ((size - 1) * j) + (size - 1);

const upDiagIndices = size => j =>
  ((size - 1) * j) + (2 * j);

export const generateIndicesOfLines = memoize((board) => {
  const size = Math.sqrt(board.length);
  const range = [...Array(size).keys()];
  const rowIndicesAt = rows(size);
  const colIndicesAt = cols(size);
  return chain((i => [
    range.map(rowIndicesAt(i)),
    range.map(colIndicesAt(i)),
  ]), range)
    .concat([range.map(downDiagIndices(size))])
    .concat([range.map(upDiagIndices(size))]);
});

const isWinningLine = (board, player) => line =>
  line.every(i => board[i] === player);

export const isWinner = (board, player) =>
  generateIndicesOfLines(board)
    .some(isWinningLine(board, player));

export const isGameOver = (board, player) =>
  isWinner(board, player) || isBoardFull(board);

export default null;
