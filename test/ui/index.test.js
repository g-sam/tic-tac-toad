import test from 'ava';
import { stub } from 'sinon';
import UI from '../../src/ui/';
import Game from '../../src/ui/game';
import Opts from '../../src/ui/options';
import Logic from '../../src/logic/';
import players from '../../src/players/';
import { start, setGameType } from '../../src/ui/actions';

test.beforeEach((t) => {
  const logic = new Logic();
  const game = new Game(logic, players);
  const opts = new Opts();
  t.context = new UI(game, opts);  // eslint-disable-line no-param-reassign
});

test('getNextState calls reducer for action type with state and action data', (t) => {
  const stubbed = stub(t.context.reducers, start);
  t.context.getNextState({ oldKey: true }, { type: start, data: 'data' });
  t.deepEqual(stubbed.args[0], [{ oldKey: true }, 'data']);
});

test('setGameType reducer calls correct reducer depending on action data', (t) => {
  const doSet = stub(t.context, 'doSetFirstPlayer');
  const skip = stub(t.context, 'skipSetFirstPlayer');
  t.context.reducers[setGameType]({ oldKey: true }, 0);
  t.deepEqual(doSet.args[0], undefined);
  t.deepEqual(skip.args[0], [{ oldKey: true }, 0]);
  t.context.reducers[setGameType]({ oldKey: true }, 1);
  t.deepEqual(doSet.args[0], [{ oldKey: true }, 1]);
  t.deepEqual(skip.args[1], undefined);
});

test('clearState returns state with render prop only', (t) => {
  t.deepEqual(UI.clearState({ oldKey: true, render: 'render' }), { render: 'render' });
});
