import test from 'ava';
import { spy, stub, useFakeTimers } from 'sinon';
import Logic from '../../src/logic/';
import Computer from '../../src/players/computer';
import { takeMove, getMove } from '../../src/ui/actions';

test.beforeEach((t) => {
  const logic = new Logic();
  t.context = new Computer(1, logic); // eslint-disable-line no-param-reassign
});

test('getName returns player name', (t) => {
  t.is(t.context.getName(), 'computer');
});

test('getMove returns state with bound render function if no winner', (t) => {
  const clock = useFakeTimers();
  const getStatus = stub(t.context, 'getGameStatus').returns({ gotStatus: true });
  const state = { winner: undefined, render: spy() };
  t.context.getMove(state).delayedRender();
  t.deepEqual(state.render.args, [[{
    gotStatus: true,
    thinkingStartTime: 0,
  }, { type: takeMove }]]);
  t.deepEqual(getStatus.args, [[state]]);
  clock.restore();
  state.winner = true;
  t.is(t.context.getMove(state).delayedRender, undefined);
});

test('takeMove returns state with bound render function', (t) => {
  const clock = useFakeTimers();
  stub(t.context.logic, 'getBestMove').returns('move');
  const applyMove = stub(t.context, 'applyMove').returns('state');
  const state = { render: spy(), gameState: { board: [0], player: 1 } };
  t.context.takeMove(state).delayedRender();
  clock.tick();
  t.deepEqual(state.render.args, [['state', { type: getMove }]]);
  t.deepEqual(applyMove.args, [[state, 'move']]);
});
