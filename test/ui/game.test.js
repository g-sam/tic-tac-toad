import test from 'ava';
import { spy, stub } from 'sinon';
import Game from '../../src/ui/game';
import Logic from '../../src/logic/';

test.beforeEach((t) => {
  const logic = new Logic();
  t.context = new Game(logic); // eslint-disable-line no-param-reassign
});

test('gets empty board', (t) => {
  stub(t.context.logic, 'getEmptyBoard').returns('board');
  t.is(t.context.getEmptyBoard(), 'board');
});

test('getToken returns x for player 1, o for player 2, or default empty string', (t) => {
  t.is(t.context.getToken(1), 'x');
  t.is(t.context.getToken(2), 'o');
  t.is(t.context.getToken(3), '');
});

test("getWinner returns winning player's token", (t) => {
  stub(t.context.logic, 'isWinner').returns(true);
  stub(t.context, 'getToken').returns('x');
  t.is(t.context.getWinner({ board: 'b', player: 'p' }), 'x');
});

test('getWinner returns null if draw', (t) => {
  stub(t.context.logic, 'isWinner').returns(false);
  stub(t.context.logic, 'isBoardFull').returns(true);
  t.is(t.context.getWinner({ board: 'b', player: 'p' }), null);
});

test('getWinner returns undefined if game not over', (t) => {
  stub(t.context.logic, 'isWinner').returns(false);
  stub(t.context.logic, 'isBoardFull').returns(false);
  t.is(t.context.getWinner({ board: 'b', player: 'p' }), undefined);
});

test('updateGame returns new game state and "take_move" action if no winner', (t) => {
  stub(t.context.logic, 'movePlayerToIndex').returns(idx => idx);
  stub(t.context, 'getWinner').returns(undefined);
  stub(t.context.logic, 'switchPlayer').returns(1);
  t.deepEqual(t.context.updateGame({ gameState: {} }, 0, 'action'), {
    gameState: {
      board: 0,
      winner: undefined,
      player: 1,
    },
    nextAction: 'take_move',
  });
});

test('updateGame returns new game state and next action if winner', (t) => {
  stub(t.context.logic, 'movePlayerToIndex').returns(idx => idx);
  stub(t.context, 'getWinner').returns('x');
  stub(t.context.logic, 'switchPlayer').returns(1);
  t.deepEqual(t.context.updateGame({ gameState: {} }, 0, 'action'), {
    gameState: {
      board: 0,
      winner: 'x',
      player: 1,
    },
    nextAction: 'action',
  });
});

test('getData returns array of board tokens', (t) => {
  stub(t.context, 'getToken').returns('x');
  t.context.getData({ gameState: { board: [1, 1] } }, [
    { text: 'x' },
    { text: 'x' },
  ]);
});

test('getAction creates action from state and idx', (t) => {
  t.deepEqual(t.context.getAction({ nextAction: 'type' }, 'idx'), {
    type: 'type',
    data: 'idx',
  });
});

test('bindBoard binds click handlers to board data', (t) => {
  const render = spy();
  const data = [{ text: 'x' }, { text: '' }];
  stub(t.context, 'getData').returns(data);
  stub(t.context, 'getAction').returnsArg(1);
  t.context.bindBoard('state', render)
    .forEach((token, idx) => {
      if (token.clickHandler) {
        token.clickHandler();
        t.deepEqual(render.lastCall.args, ['state', idx]);
      } else {
        t.deepEqual(token, data[idx]);
      }
    });
});

test.cb('renderCompTurn returns a function that calls render after a delay', (t) => {
  const render = spy();
  const state = {
    gameState: { board: 'b', player: 'p' },
  };
  stub(t.context.logic, 'getBestMove');
  stub(t.context, 'getAction').returns('action');
  t.context.renderCompTurn(state, render)();
  setTimeout(() => {
    t.deepEqual(render.args[0], [state, 'action']);
    t.end();
  }, 600);
});

test('playerType returns first player when current is 1 or second player when current is 2', (t) => {
  t.is(t.context.playerType({
    gameState: { player: 1 },
    players: {
      first: 1,
      second: 2,
    },
  }), 1);
  t.is(t.context.playerType({
    gameState: { player: 2 },
    players: {
      first: 1,
      second: 2,
    },
  }), 2);
});

test('getView returns object with board when next action is "take_move" and player is human', (t) => {
  stub(t.context, 'playerType').returns('human');
  stub(t.context, 'bindBoard').returns('board');
  t.deepEqual(t.context.getView({ nextAction: 'take_move' }), { board: 'board' });
});

test('getView returns object with render function when next action is "take_move" and player is computer', (t) => {
  stub(t.context, 'playerType').returns('computer');
  stub(t.context, 'renderCompTurn').returns('function');
  t.deepEqual(t.context.getView({ nextAction: 'take_move' }), { render: 'function' });
});

test('getView returns an empty object by default', (t) => {
  t.deepEqual(t.context.getView({ nextAction: 'anything' }), {});
});
