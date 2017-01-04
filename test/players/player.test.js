import test from 'ava';
import { spy, stub } from 'sinon';
import Logic from '../../src/logic/';
import Player from '../../src/players/player';
import { takeMove, getMove } from '../../src/ui/actions';

test.beforeEach((t) => {
  const logic = new Logic();
  t.context = new Player(1, logic); // eslint-disable-line no-param-reassign
});

test('current returns current player from state', (t) => {
  const player1 = new Player(1, new Logic());
  const player2 = new Player(2, new Logic());
  const state = {
    players: [player1, player2],
    gameState: { player: 1 },
  };
  t.deepEqual(Player.current(state), player1);
  state.gameState.player = 2;
  t.deepEqual(Player.current(state), player2);
});

test('switchPlayer switches player', (t) => {
  t.is(Player.switchPlayer(1), 2);
  t.is(Player.switchPlayer(2), 1);
});

test('getToken returns x for player 1, o for player 2, or empty string for 0', (t) => {
  t.is(Player.getToken(1), 'x');
  t.is(Player.getToken(2), 'o');
  t.is(Player.getToken(0), '');
});

test('getBoardData maps board to array of token objects', (t) => {
  t.deepEqual(
    Player.getBoardData({ gameState: { board: [0, 1, 2] } }),
    [{ text: '' }, { text: 'x' }, { text: 'o' }],
  );
});

test('getName returns player name', (t) => {
  t.is(t.context.getName(), 'human');
});

test('getGameStatus updates state with status based on gameState', (t) => {
  stub(t.context.logic, 'getWinner').returns(1);
  const oldState = {
    oldKey: true,
    gameState: {
      board: [0],
      player: 1,
    },
  };
  t.deepEqual(t.context.getGameStatus(oldState), {
    oldKey: true,
    gameState: {
      board: [0],
      player: 1,
    },
    winner: 'x',
    nextPlayer: 'x',
    boardView: [{ text: '' }],
  });
});

test('applyMove updates gameState with next move and state with new game status', (t) => {
  stub(t.context.logic, 'movePlayerToIndex').returns(idx => [idx]);
  stub(t.context.logic, 'getWinner').returns(1);
  const oldState = {
    oldKey: true,
    gameState: {
      board: [0],
      player: 1,
    },
  };
  t.deepEqual(t.context.applyMove(oldState, 1), {
    oldKey: true,
    gameState: {
      board: [1],
      player: 2,
    },
    winner: 'x',
    nextPlayer: 'o',
    boardView: [{ text: 'x' }],
  });
});

test('bindBoard binds click handlers to board token objects', (t) => {
  const state = {
    oldKey: true,
    boardView: [{ text: 'x' }, { text: '' }],
    render: spy(),
  };
  t.context.bindBoard(state)
    .boardView
    .forEach((token, idx) => {
      if (token.clickHandler) {
        token.clickHandler();
        t.deepEqual(state.render.lastCall.args, [state, { type: takeMove, data: idx }]);
      } else {
        t.deepEqual(token, state.boardView[idx]);
      }
    });
});

test('getMove returns new state with bound board if no winner', (t) => {
  stub(t.context, 'getGameStatus', state => ({ ...state, status: true }));
  stub(t.context, 'bindBoard', state => ({ ...state, bound: true }));
  const state = { winner: undefined };
  t.deepEqual(t.context.getMove(state), {
    winner: undefined,
    status: true,
    bound: true,
  });
  state.winner = true;
  t.deepEqual(t.context.getMove(state), {
    winner: true,
    status: true,
  });
});

test('takeMove returns state with bound render function', (t) => {
  const applyMove = stub(t.context, 'applyMove').returns('state');
  const state = { render: spy() };
  t.context.takeMove(state, 'move').delayedRender();
  t.deepEqual(state.render.args, [['state', { type: getMove }]]);
  t.deepEqual(applyMove.args, [[state, 'move']]);
});

