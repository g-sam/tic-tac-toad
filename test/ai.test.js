import test from 'ava';
import * as ai from '../src/ai';

test('scores a board for a player', (t) => {
  t.is(ai.score(1)([
    1, 0, 0,
    2, 1, 2,
    2, 0, 1,
  ]), 1);
  t.is(ai.score(2)([
    1, 0, 0,
    2, 1, 2,
    2, 0, 1,
  ]), 0);
});

test('generates next possible boards', (t) => {
  const expected = [[
    1, 1, 2,
    2, 1, 2,
    2, 0, 0,
  ], [
    1, 1, 0,
    2, 1, 2,
    2, 2, 0,
  ], [
    1, 1, 0,
    2, 1, 2,
    2, 0, 2,
  ]];

  t.deepEqual(ai.getNextBoards([
    1, 1, 0,
    2, 1, 2,
    2, 0, 0,
  ], 2), expected);
});

test('scores moves looking one move ahead', (t) => {
  t.deepEqual(ai.scoreNextMoves([
    1, 1, 0,
    2, 1, 2,
    2, 0, 0,
  ], 2), [0, 0, 0]);

  t.deepEqual(ai.scoreNextMoves([
    1, 1, 0,
    2, 1, 0,
    2, 0, 0,
  ], 1), [1, 0, 1, 1]);
});
