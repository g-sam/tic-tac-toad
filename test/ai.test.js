import test from 'ava';
import * as ai from '../src/ai';

test('scores a board for a player', (t) => {
  t.is(ai.score([
    1, 0, 0,
    2, 1, 2,
    2, 0, 1,
  ], 1), 1);
  t.is(ai.score([
    1, 0, 0,
    2, 1, 2,
    2, 0, 1,
  ], 2), 0);
});

