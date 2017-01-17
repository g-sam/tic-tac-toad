import test from 'ava';
import { spy, stub } from 'sinon';
import Opts from '../../src/ui/options';
import {
  start,
  setBoardSize,
  setGameType,
  setFirstPlayer,
} from '../../src/ui/actions';

test.beforeEach((t) => {
  t.context = new Opts(); // eslint-disable-line no-param-reassign
});

test('selectBoardSize, selectGameType, selectFirstPlayer and showStatus pass correct actions and objects with title and options to bindOptions', (t) => {
  const state = { nextPlayer: 'x' };
  const bind = stub(t.context, 'bindOptions');
  const actions = [
    setBoardSize,
    setGameType,
    setFirstPlayer,
    start,
  ];
  t.context.selectBoardSize(state);
  t.context.selectGameType(state);
  t.context.selectFirstPlayer(state);
  t.context.showStatus(state);
  bind.args.forEach((args, idx) => {
    t.deepEqual(args[0], state);
    t.is(args[1], actions[idx]);
    t.deepEqual(Object.keys(args[2]), ['title', 'options']);
    t.true(Array.isArray(args[2].options));
    t.is(typeof args[2].title, 'string');
  });
});

test('showStatus builds title from winner if game over', (t) => {
  t.is(t.context.showStatus({
    winner: 'x',
    render: spy(),
  }).optionView.title, 'x wins!');
  t.is(t.context.showStatus({
    winner: '',
    render: spy(),
  }).optionView.title, 'draw!');
});

test('showStatus builds title from next player if game not over', (t) => {
  t.is(t.context.showStatus({
    nextPlayer: 'x',
    render: spy(),
  }).optionView.title, 'x to move');
});

test('bindOptions binds click handlers to options data with correct arguments', (t) => {
  const state = { render: spy() };
  t.context.bindOptions(state, 'action', { options: [{}] })
    .optionView
    .options
    .forEach((opt, idx) => {
      opt.clickHandler();
      t.deepEqual(state.render.args[idx], [state, { type: 'action', data: idx }]);
    });
});
