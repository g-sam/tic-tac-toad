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

test('get empty indices', (t) => {
  t.deepEqual(
    board.getEmptyIndices([0, 2, 0, 1, 0, 0, 2, 0, 0]),
    [0, 2, 4, 5, 7, 8],
  );
});
