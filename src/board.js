export function getEmptyBoard() {
  return [0, 0, 0, 0, 0, 0, 0, 0, 0];
}

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

export default null;
