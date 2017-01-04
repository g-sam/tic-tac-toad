import test from 'ava';
import { spy } from 'sinon';
import AI from '../../src/logic/ai';
import Game from '../../src/ui/game';
import Logic from '../../src/logic/';
import players from '../../src/players/';

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

test('getBestMove returns 0 without scoring on first and second moves for 4x4 grid', (t) => {
  const scorer = spy(ai, 'scoreNextMoves');
  t.deepEqual(ai.getBestMove([
    0, 0, 0, 0,
    0, 0, 0, 0,
    0, 0, 0, 0,
    0, 0, 0, 0,
  ], 1), 0);
  t.deepEqual(ai.getBestMove([
    1, 0, 0, 0,
    0, 0, 0, 0,
    0, 0, 0, 0,
    0, 0, 0, 0,
  ], 2), 1);
  t.false(scorer.called);
  scorer.restore();
});

/* There follow tests for all distinct strategic situations (on 3x3 grid). See https://en.wikipedia.org/wiki/Tic-tac-toe#Strategy. Strategy 6 (picks corner opposite opponent) is excluded because I cannot understand its heuristic. Strategies 5, 7 and 8 are not relevant to a 3x3 grid . */

test('strategy 1: picks winning move', (t) => {
  t.is(ai.getBestMove([
    1, 0, 1,
    2, 0, 2,
    2, 0, 0,
  ], 1), 1);
  t.is(ai.getBestMove([
    2, 2, 0, 1,
    0, 0, 0, 1,
    1, 0, 2, 1,
    0, 0, 1, 2,
  ], 2), 5);
});

test('strategy 2: picks blocking move', (t) => {
  t.is(ai.getBestMove([
    0, 0, 1,
    2, 0, 2,
    0, 0, 0,
  ], 1), 4);
  t.is(ai.getBestMove([
    2, 2, 0, 1,
    0, 0, 0, 1,
    1, 0, 2, 1,
    0, 0, 0, 0,
  ], 2), 15);
});

test('strategy 3: picks forking move', (t) => {
  t.is(ai.getBestMove([
    0, 0, 2,
    2, 1, 0,
    1, 0, 0,
  ], 1), 7);
  t.is(ai.getBestMove([
    0, 2, 0, 1,
    1, 2, 1, 1,
    2, 0, 2, 0,
    1, 0, 0, 0,
  ], 2), 9);
});

test('strategy 4: picks move blocking fork', (t) => {
  t.is(ai.getBestMove([
    0, 0, 2,
    2, 1, 0,
    1, 0, 0,
  ], 2), 0);
  t.is(ai.getBestMove([
    0, 2, 0, 1,
    1, 2, 1, 1,
    2, 0, 2, 0,
    0, 0, 0, 0,
  ], 1), 9);
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
  t.is(ai.getBestMove([
    1, 2, 1, 1,
    2, 0, 2, 0,
    1, 0, 1, 0,
    2, 2, 2, 0,
  ], 2), 15);
});

test('determines whether the other player will take a route', (t) => {
  t.true(ai.otherPlayerWillBlock(10, 0));
  t.false(ai.otherPlayerWillBlock(0, 10));
});

// Sinon is too slow for the next test
const fastSpy = (ctx, fn) =>
  (function spyFunc(...args) {
    spyFunc.calls = spyFunc.calls + 1 || 1;
    return fn.apply(ctx, args);
  });

test('pruning results in fewer calls to scorer', (t) => {
  const aiTemp = new AI();
  aiTemp.scoreNextMoves = fastSpy(aiTemp, aiTemp.scoreNextMoves);
  aiTemp.scoreNextMoves([
    0, 0, 0,
    0, 0, 0,
    0, 0, 0,
  ], 1);
  const prunedCalls = aiTemp.scoreNextMoves.calls;
  t.true(prunedCalls < 6000);
  // console.log(`    ai-log: scorer called ${prunedCalls} times`);
});

test('ai never loses to opponent playing randomly', (t) => {
  class Random extends players.Player {
    getMove(state) {
      const moves = this.logic.board.getEmptyIndices(state.gameState.board, state.gameState.player);
      const randomIdx = Math.floor(Math.random() * moves.length);
      return moves[randomIdx];
    }
    takeMove(state) {
      return this.applyMove(state, this.getMove(state));
    }
  }
  class testComputer extends players.Player {
    takeMove(state) {
      return this.applyMove(
        state,
        this.logic.getBestMove(state.gameState.board, state.gameState.player),
      );
    }
  }

  const playGame = (sizeOpt) => {
    const logic = new Logic();
    const testPlayers = { Player: Random, Computer: testComputer };
    const game = new Game(logic, testPlayers);
    let state = game.setGameType(game.initialize({}, sizeOpt), 1);
    while (state.winner === undefined) {
      state = game.takeMove(state);
    }
    return state;
  };
  for (let i = 0; i < 100; i += 1) {
    const state = playGame(0);
    t.true(state.winner === '' || state.winner === 'o');
  }
});
