import { chain } from 'ramda';

export const getEmptyBoard = () =>
  Array(9).fill(0);

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

export const isBoardFull = board => (getEmptyIndices(board).length === 0);

const rowIndicesAt = i => j =>
  j + (i * 3);

const colIndicesAt = i => j =>
  (j * 3) + i;

const downDiagIndices = i => j =>
  (i * j) + i;

const upDiagIndices = i => j =>
  (i * j) + (2 * j);

export const generateIndicesOfLines = () => {
  const range = [...Array(3).keys()];
  return chain((i => [
    range.map(rowIndicesAt(i)),
    range.map(colIndicesAt(i)),
  ]), range)
    .concat([range.map(downDiagIndices(2))])
    .concat([range.map(upDiagIndices(2))]);
};

const indicesOfWinningLines = generateIndicesOfLines();

const isWinningLine = (board, player) => line =>
  line.every(i => board[i] === player);

export const isWinner = (board, player) =>
  indicesOfWinningLines
    .some(isWinningLine(board, player));

export const isGameOver = (board, player) =>
  isWinner(board, player) || isBoardFull(board);

export default null;
