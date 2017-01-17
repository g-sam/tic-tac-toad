import test from 'ava';
import { stub } from 'sinon';
import Game from '../../src/ui/game';
import Logic from '../../src/logic/';
import Player from '../../src/players/';

test.beforeEach((t) => {
  const logic = new Logic();
  t.context = new Game(logic, Player); // eslint-disable-line no-param-reassign
});

test('initialize updates gameState with empty board', (t) => {
  stub(t.context.logic, 'getEmptyBoard').returns('board');
  const state = t.context.initialize({ oldKey: true }, 1);
  t.context.initialize(1);
  t.deepEqual(state, { oldKey: true, gameState: { board: 'board', player: 1 } });
});

test('initialize gets empty board of correct size', (t) => {
  const getEmptyBoard = stub(t.context.logic, 'getEmptyBoard');
  t.context.initialize({}, 1);
  t.deepEqual(getEmptyBoard.args, [[4]]);
  t.context.initialize({}, 0);
  t.deepEqual(getEmptyBoard.args, [[4], [3]]);
});

test('setGameType merges players object into state', (t) => {
  const state = t.context.setGameType({ oldKey: true }, 0);
  t.truthy(state.oldKey && state.players);
  t.deepEqual(state.players, t.context.gameTypes[0].players);
});

test('setFirstPlayer switches game type if passed 1', (t) => {
  const state = t.context.setFirstPlayer({ oldKey: true }, 0);
  t.deepEqual(state, { oldKey: true });
  const newState = t.context.setFirstPlayer({ oldKey: true }, 1);
  t.deepEqual(newState.players, t.context.gameTypes[3].players);
});

test('getMove passes its arguments to getMove method of current player', (t) => {
  const getMove = stub(t.context.Player, 'current').returns({ getMove: arg => t.is(arg, 1) });
  t.context.getMove(1);
  getMove.restore();
});

test('takeMove passes its arguments to takeMove method of current player', (t) => {
  const takeMove = stub(t.context.Player, 'current').returns({ takeMove: (...args) => t.deepEqual(args, [1, 1]) });
  t.context.takeMove(1, 1);
  takeMove.restore();
});
