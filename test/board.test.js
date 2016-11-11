import test from 'ava';
import * as board from '../src/board';

test('generates empty board', (t) => {
  t.deepEqual(
    board.getEmptyBoard(),
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
  );
});

test('move player to index', (t) => {
  const newBoard = board.movePlayerToIndex(board.getEmptyBoard(), 1, 3);
  t.deepEqual(
    newBoard,
    [0, 0, 0, 1, 0, 0, 0, 0, 0],
  );
});
