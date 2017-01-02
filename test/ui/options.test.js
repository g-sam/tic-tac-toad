import test from 'ava';
import { spy, stub } from 'sinon';
import Opts from '../../src/ui/options';

test.beforeEach((t) => {
  t.context = new Opts(); // eslint-disable-line no-param-reassign
});

test('gets correct options data when nextAction is "set_boardsize"', (t) => {
  stub(t.context, 'selectBoardSize').returns('correct');
  t.is(t.context.getData({ nextAction: 'set_boardsize' }), 'correct');
});

test('gets correct options data when nextAction is "set_gametype"', (t) => {
  stub(t.context, 'selectGameType').returns('correct');
  t.is(t.context.getData({ nextAction: 'set_gametype' }), 'correct');
});

test('gets correct options data when nextAction is "set_firstplayer"', (t) => {
  stub(t.context, 'selectFirstPlayer').returns('correct');
  t.is(t.context.getData({ nextAction: 'set_firstplayer' }), 'correct');
});

test('gets correct options data when nextAction is "take_move"', (t) => {
  stub(t.context, 'showGameType').returns('correct');
  t.is(t.context.getData({ nextAction: 'take_move' }), 'correct');
});

test('gets correct options data when nextAction is "begin_game"', (t) => {
  stub(t.context, 'showGameType').returns('correct');
  t.is(t.context.getData({ nextAction: 'begin_game' }), 'correct');
});

test('gets correct options data when nextAction is "start"', (t) => {
  stub(t.context, 'showWinner').returns('correct');
  t.is(t.context.getData({ nextAction: 'start' }), 'correct');
});

test('gets correct options data when no nextAction is provided', (t) => {
  t.deepEqual(t.context.getData({}), {
    title: '',
    options: [],
  });
});

test('selectBoardSize, selectGameType and selectFirstPlayer return objects with title and options', (t) => {
  [
    t.context.selectGameType(),
    t.context.selectFirstPlayer(),
    t.context.selectBoardSize(),
  ].forEach((obj) => {
    t.deepEqual(Object.keys(obj), ['title', 'options']);
    t.true(Array.isArray(obj.options));
    t.is(typeof obj.title, 'string');
  });
});

test('showGameType builds title from players', (t) => {
  t.is(t.context.showGameType({
    players: {
      first: 'first',
      second: 'second',
    },
  }).title, 'first vs. second');
});

test('showWinner builds title from winner', (t) => {
  t.is(t.context.showWinner({
    gameState: {
      winner: 'x',
    },
  }).title, 'x wins!');
  t.is(t.context.showWinner({
    gameState: {
      winner: null,
    },
  }).title, 'draw!');
});

test('creates action from state and idx', (t) => {
  t.deepEqual(t.context.getAction({ nextAction: 'type' })('idx'), {
    type: 'type',
    data: 'idx',
  });
});

test('binds click handlers to options data with correct arguments', (t) => {
  const render = spy();
  stub(t.context, 'getAction').returns(idx => idx);
  stub(t.context, 'getData').returns({ options: [{}, {}, {}] });
  t.context.bindOptions('state', render).options
    .forEach((opt, idx) => {
      opt.clickHandler();
      t.deepEqual(render.args[idx], ['state', idx]);
    });
});

test('getView returns object with options and bound render when nextAction is "set_player" and gameType is not 1 ', (t) => {
  const render = spy();
  const state = { nextAction: 'set_firstplayer' };
  stub(t.context, 'getData').returns('opts');
  const actual = t.context.getView(state, render);
  t.deepEqual(Object.keys(actual), ['options', 'render']);
  t.is(actual.options, 'opts');
  actual.render();
  t.deepEqual(render.args[0], [state, { type: state.nextAction }]);
});

test('getView returns correct object with options and bound render when nextAction is "begin_game"', (t) => {
  const render = spy();
  const state = { nextAction: 'begin_game' };
  stub(t.context, 'getData').returns('opts');
  const actual = t.context.getView(state, render);
  t.deepEqual(Object.keys(actual), ['options', 'render']);
  t.is(actual.options, 'opts');
  actual.render();
  t.deepEqual(render.args[0], [state, { type: state.nextAction }]);
});

test('getView returns object with bound options by default', (t) => {
  const state = { nextAction: 'anything else' };
  stub(t.context, 'bindOptions').returns('opts');
  t.deepEqual(t.context.getView(state), { options: 'opts' });
});

test('setPlayers sets first to human and second to human when gameType is 0', (t) => {
  t.deepEqual(t.context.setPlayers(0), {
    first: 'human',
    second: 'human',
  });
});

test('setPlayers sets first to human and second to computer when gameType is 1 and firstPlayer is 0', (t) => {
  t.deepEqual(t.context.setPlayers(1, 0), {
    first: 'human',
    second: 'computer',
  });
});

test('setPlayers sets first to computer and second to human when gameType is 1 and firstPlayer is 1', (t) => {
  t.deepEqual(t.context.setPlayers(1, 1), {
    first: 'computer',
    second: 'human',
  });
});

test('setPlayers sets first to computer and second to computer by default', (t) => {
  t.deepEqual(t.context.setPlayers(2, 2), {
    first: 'computer',
    second: 'computer',
  });
});
