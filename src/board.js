export function getEmptyBoard() {
  return [0, 0, 0, 0, 0, 0, 0, 0, 0];
}

export const movePlayerToIndex = (board, player, idx) => [
  ...board.slice(0, idx),
  player,
  ...board.slice(idx + 1),
];

export default null;
