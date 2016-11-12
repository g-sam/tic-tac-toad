import { chain } from 'ramda';

export const getEmptyBoard = () =>
  Array(9).fill(0);

export const movePlayerToIndex = (board, player, idx) => [
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

export const rowIndicesAt = i => j =>
  j + (i * 3);

export const colIndicesAt = i => j =>
  (j * 3) + i;

export const downDiagIndices = i => j =>
  (i * j) + i;

export const upDiagIndices = i => j =>
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

export const isWinner = (board, player) => {

};


export default null;
