import test from 'ava';
import AI from '../../src/logic/ai';

const ai = new AI();

test('scores a board for a player', (t) => {
  t.is(ai.score([
    1, 0, 0,
    2, 1, 2,
    2, 0, 1,
  ], 1, 0), 100);
  t.is(ai.score([
    1, 0, 0,
    2, 1, 2,
    2, 0, 1,
  ], 2, 0), 0);
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
    2, 0, 2,
  ], 2), [99, 99]);

  t.deepEqual(ai.scoreNextMoves([
    1, 2, 1,
    2, 1, 1,
    2, 0, 2,
  ], 1), [0]);
});

test('scores moves looking ahead to endgame', (t) => {
  t.deepEqual(ai.scoreNextMoves([
    1, 0, 1,
    2, 1, 2,
    2, 0, 0,
  ], 2), [-98, -98, -98]);
  t.deepEqual(ai.scoreNextMoves([
    1, 0, 1,
    2, 1, 2,
    2, 0, 0,
  ], 1), [99, 97, 99]);
});

/* There follow tests for all distinct strategic situations. See https://en.wikipedia.org/wiki/Tic-tac-toe#Strategy. Strategy 6 (picks corner opposite opponent) is excluded because I cannot understand its heuristic */

test('strategy 1: picks winning move', (t) => {
  t.is(ai.getBestMove([
    1, 0, 1,
    2, 0, 2,
    2, 0, 0,
  ], 1), 1);
});

test('strategy 2: picks blocking move', (t) => {
  t.is(ai.getBestMove([
    0, 0, 1,
    2, 0, 2,
    0, 0, 0,
  ], 1), 4);
});

test('strategy 3: picks forking move', (t) => {
  t.is(ai.getBestMove([
    0, 0, 2,
    2, 1, 0,
    1, 0, 0,
  ], 1), 7);
});

test('strategy 4: picks move blocking fork', (t) => {
  t.is(ai.getBestMove([
    0, 0, 2,
    2, 1, 0,
    1, 0, 0,
  ], 2), 0);
});

test('strategy 5: picks centre when corner taken', (t) => {
  t.is(ai.getBestMove([
    1, 0, 0,
    0, 0, 0,
    0, 0, 0,
  ], 2), 4);
});

test('strategy 7: picks corner when centre taken', (t) => {
  t.is(ai.getBestMove([
    0, 0, 0,
    0, 1, 0,
    0, 0, 0,
  ], 2), 0);
});

test('strategy 8: picks empty side', (t) => {
  t.is(ai.getBestMove([
    0, 0, 1,
    0, 2, 0,
    1, 0, 0,
  ], 2), 1);
});

test('picks move than wins most quickly', (t) => {
  t.is(ai.getBestMove([
    1, 0, 0,
    0, 1, 0,
    2, 0, 2,
  ], 2), 7);
});

test('determines whether the other player will take a route', (t) => {
  t.true(ai.otherPlayerWillBlock(10, 0));
  t.false(ai.otherPlayerWillBlock(0, 10));
});

test('pruning produces expected scores', (t) => {
  t.deepEqual(ai.scoreNextMoves([
    1, 0, 1,
    2, 0, 2,
    2, 0, 0,
  ], 1), [99, 97, 0, 97]);
});

// Sinon is too slow for the next test
const fastSpy = (ctx, fn) =>
  function spy(...args) {
    spy.calls = spy.calls + 1 || 1;
    return fn.apply(ctx, args);
  };

test('pruning results in fewer function calls', (t) => {
  const aiTemp = new AI();
  aiTemp.scoreNextMoves = fastSpy(aiTemp, aiTemp.scoreNextMoves);
  aiTemp.scoreNextMoves([
    0, 0, 0,
    0, 1, 0,
    0, 0, 0,
  ], 2);
  const prunedCalls = aiTemp.scoreNextMoves.calls;

  const unprunedScorer = (board, player, depth = 0) =>
    aiTemp.getNextBoards(board, player)
      .map(aiTemp.deeplyScoreMove(player, depth + 1));

  aiTemp.scoreNextMoves = fastSpy(aiTemp, unprunedScorer);
  aiTemp.scoreNextMoves([
    0, 0, 0,
    0, 1, 0,
    0, 0, 0,
  ], 2);
  const unprunedCalls = aiTemp.scoreNextMoves.calls;

  t.true(unprunedCalls > prunedCalls);
// eslint-disable-next-line no-console
  console.log(`    ai-log: ${unprunedCalls} calls pruned to ${prunedCalls}`);
});

test.skip('performance', (t) => {
  const t0 = process.hrtime();
  ai.scoreNextMoves([
    1, 0, 0, 1,
    0, 1, 0, 0,
    1, 0, 2, 0,
    0, 2, 0, 2,
  ], 2);
  const dt = process.hrtime(t0);
  console.log(dt);
  t.pass();
});
