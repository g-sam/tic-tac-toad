import test from 'ava';
import { stub } from 'sinon';
import UI from '../../src/ui/';
import Game from '../../src/ui/game';
import Opts from '../../src/ui/options';
import Logic from '../../src/logic/';

test.beforeEach((t) => {
  const logic = new Logic();
  const game = new Game(logic);
  const opts = new Opts();
  t.context = new UI(game, opts);  // eslint-disable-line no-param-reassign
});

test('nextAction returns value next in array of actions', (t) => {
  t.is(t.context.nextAction('start'), 'set_boardsize');
  t.is(t.context.nextAction('end'), 'start');
});

test('getNextState returns initial state with next action for "start" action', (t) => {
  stub(t.context, 'nextAction').returns('action');
  t.deepEqual(t.context.getNextState({}, { type: 'start' }), {
    ...t.context.initialState,
    nextAction: 'action',
  });
});

test('getNextState receives correct default values', (t) => {
  stub(t.context, 'nextAction').returns('action');
  t.deepEqual(t.context.getNextState(), {
    ...t.context.initialState,
    nextAction: 'action',
  });
});

test('getNextState merges new board and next action into state for "set_boardsize" action', (t) => {
  stub(t.context, 'nextAction').returns('action');
  stub(t.context.game, 'getEmptyBoard', arg => arg);
  t.deepEqual(t.context.getNextState({ prev: 'state' }, { type: 'set_boardsize', data: 'newstate' }), {
    prev: 'state',
    gameState: { board: 'newstate' },
    nextAction: 'action',
  });
});

test('getNextState merges gameType and next action into state for "set_gametype" action', (t) => {
  stub(t.context, 'nextAction').returns('action');
  t.deepEqual(t.context.getNextState({ prev: 'state' }, { type: 'set_gametype', data: 'newstate' }), {
    prev: 'state',
    gameType: 'newstate',
    nextAction: 'action',
  });
});

test('getNextState merges players and next action into state for "set_firstplayer" action', (t) => {
  stub(t.context, 'nextAction').returns('action');
  stub(t.context.opts, 'setPlayers').returns('players');
  t.deepEqual(t.context.getNextState({ prev: 'state' }, { type: 'set_firstplayer' }), {
    prev: 'state',
    players: 'players',
    nextAction: 'action',
  });
});

test('getNextState merges next action into state for "begin_game" action', (t) => {
  stub(t.context, 'nextAction').returns('action');
  t.deepEqual(t.context.getNextState({ prev: 'state' }, { type: 'begin_game' }), {
    prev: 'state',
    nextAction: 'action',
  });
});

test('getNextState merges result of game.updateGame into state for "take_move" action', (t) => {
  stub(t.context.game, 'updateGame').returns({ new: 'state' });
  t.deepEqual(t.context.getNextState({ prev: 'state' }, { type: 'take_move' }), {
    prev: 'state',
    new: 'state',
  });
});

test('getNextState returns the state provided if no actions match that provided', (t) => {
  t.is(t.context.getNextState('state', { type: 'anything' }), 'state');
});

test('getNextView returns an object with the results of opts.getData and game.getData', (t) => {
  stub(t.context.opts, 'getData').returns('state1');
  stub(t.context.game, 'getData').returns('state2');
  stub(t.context.game, 'getView').returns({});
  stub(t.context.opts, 'getView').returns({});
  t.deepEqual(t.context.getNextView(), {
    options: 'state1',
    board: 'state2',
  });
});

test('getNextView merges opts.getView and game.getView into its returned object', (t) => {
  stub(t.context.opts, 'getData').returns('state1');
  stub(t.context.game, 'getData').returns('state2');
  stub(t.context.opts, 'getView').returns({ options: 'newstate1' });
  stub(t.context.game, 'getView').returns({ board: 'newstate2' });
  t.deepEqual(t.context.getNextView(), {
    options: 'newstate1',
    board: 'newstate2',
  });
});
