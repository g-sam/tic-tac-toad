import test from 'ava';
import * as board from '../src/board';

test('generates empty board', (t) => {
  t.deepEqual(
    board.getEmptyBoard(),
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
  );
});

