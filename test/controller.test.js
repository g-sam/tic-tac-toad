import test from 'ava';
import { createStubInstance, stub, spy } from 'sinon';
import Controller from '../src/controller';
import DOMRenderer from '../src/dom';
import * as ui from '../src/ui';

test.beforeEach((t) => {
  const dom = createStubInstance(DOMRenderer);
  const testGame = {
    board: [0, 1, 0, 0, 0, 0, 0, 0, 0],
    player: 1,
  };
  const winningGame = {
    board: [1, 1, 1, 0, 0, 0, 0, 0, 0],
    player: 2,
    winner: 1,
  };
  t.context = { // eslint-disable-line no-param-reassign
    testGame,
    winningGame,
    dom,
    controller: new Controller(dom),
  };
});

test('execute method calls dom.renderBoard', async (t) => {
  stub(t.context.controller, 'getAllOptions');
  stub(t.context.controller, 'playGame');
  stub(t.context.controller, 'endGame');
  stub(t.context.controller, 'getOptions').returns(() => { throw new Error('escape infinite loop'); });
  await t.context.controller.execute().catch(() => null);
  t.true(t.context.dom.renderBoard.calledOnce);
});

test('getOptions returns an options reducer that calls dom.renderOptions and returns a promise when game is undefined or 1', (t) => {
  const gameUndefined = t.context.controller.getOptions('game')({});
  t.truthy(gameUndefined.then);
  t.true(t.context.dom.renderOptions.calledOnce);
  const game1 = t.context.controller.getOptions('player')({ game: 1 });
  t.truthy(game1.then);
  t.true(t.context.dom.renderOptions.calledTwice);
});

test.serial('the options reducer calls ui.getOptionsData with correct arguments', (t) => {
  const getOptionsData = spy(ui, 'getOptionsData');
  const reducer = t.context.controller.getOptions('player');
  reducer({ game: 1 });
  t.is(getOptionsData.args[0][0], 'player');
  t.is(typeof getOptionsData.args[0][1], 'function');
  t.deepEqual(getOptionsData.args[0][2], { game: 1 });
  ui.getOptionsData.restore();
});

test.cb('if game is 1 the promise does not resolve without user input', (t) => {
  const reducer = t.context.controller.getOptions('player');
  setTimeout(() => {
    t.pass();
    t.end();
  }, 500);
  reducer({ game: 1 }).then(() => {
    t.fail();
    t.end();
  });
});

test('getAllOptions passes default options down to getOptionsData', async (t) => {
  stub(t.context.controller, 'getOptions', () => (arg) => {
    t.is(arg, 'test');
    return arg;
  });
  await t.context.controller.getAllOptions('test');
});

test.serial('human goes first if correct option selected', async (t) => {
  const takeTurn = stub(t.context.controller, 'takeTurn').returns(() => Promise.resolve(t.context.winningGame));
  stub(ui, 'getWinner').returns(Promise.resolve(t.context.winningGame));
  await t.context.controller.playGame({ game: 0, player: 0 });
  t.true(takeTurn.firstCall.calledWith('human'));
  ui.getWinner.restore();
});

test('computer goes first when correct option selected', async (t) => {
  const takeTurn = stub(t.context.controller, 'takeTurn').returns(() => Promise.resolve(t.context.winningGame));
  await t.context.controller.playGame({ game: 1, player: 1 });
  t.true(takeTurn.firstCall.calledWith('computer'));
});

test('setTurnSequence calls getNextTurn with correct arguments', (t) => {
  const nextTurn = stub(t.context.controller, 'getNextTurn');
  t.context.controller.setTurnSequence({ game: 0 });
  t.deepEqual(nextTurn.args[0], ['human', 'human']);
  t.context.controller.setTurnSequence({ game: 1, player: 0 });
  t.deepEqual(nextTurn.args[1], ['human', 'computer']);
  t.context.controller.setTurnSequence({ game: 1, player: 1 });
  t.deepEqual(nextTurn.args[2], ['computer', 'human']);
  t.context.controller.setTurnSequence({ game: 2 });
  t.deepEqual(nextTurn.args[3], ['computer', 'computer']);
});

test('getNextTurn calls takeTurn with the next player', (t) => {
  const takeTurn = stub(t.context.controller, 'takeTurn').returns(() => null);
  t.context.controller.getNextTurn('first', 'second')({ player: 1 });
  t.deepEqual(takeTurn.args[0], ['first']);
  t.context.controller.getNextTurn('first', 'second')({ player: 2 });
  t.deepEqual(takeTurn.args[1], ['second']);
});

test('chainTurns returns resolved promise when game has been won', async (t) => {
  const winning = { winner: 1 };
  const actual = await t.context.controller.chainTurns(null)(winning);
  t.deepEqual(actual, winning);
});

test('otherwise chainTurns returns a function that calls chainTurns with its initial argument', async (t) => {
  const winning = { winner: 1 };
  const notWinning = { test: 'test' };
  const chainTurns = spy(t.context.controller, 'chainTurns');
  const nextTurn = () => Promise.resolve(winning);
  await chainTurns(nextTurn)(notWinning);
  t.true(chainTurns.secondCall.calledWith(...chainTurns.firstCall.args));
});

test.serial('turn reducer calls ui.getBoardData with correct arguments', (t) => {
  const getBoardData = spy(ui, 'getBoardData');
  t.context.controller.takeTurn('human')(t.context.testGame);
  t.is(getBoardData.args[0][0], 'human');
  t.is(typeof getBoardData.args[0][1], 'function');
  t.deepEqual(getBoardData.args[0][2], t.context.testGame);
  ui.getBoardData.restore();
});

test('turn reducer calls dom.renderBoard and returns promise', (t) => {
  const actual = t.context.controller.takeTurn('human')(t.context.testGame);
  t.truthy(actual.then);
  t.true(t.context.dom.renderBoard.calledOnce);
});

test('endGame calls dom.renderBoard with result of ui.getBoardTokens and returns its argument', (t) => {
  stub(ui, 'getBoardTokens').returns('test2');
  const actual = t.context.controller.endGame('test1');
  t.is(...t.context.dom.renderBoard.args[0], 'test2');
  t.is(actual, 'test1');
  ui.getBoardTokens.restore();
});

test('execute calls getAllOptions, playGame, endGame and getOptions', async (t) => {
  const getAllOptions = stub(t.context.controller, 'getAllOptions').returns(1);
  const playGame = stub(t.context.controller, 'playGame').returns(2);
  const endGame = stub(t.context.controller, 'endGame').returns(3);
  const getOption = stub(t.context.controller, 'getOptions').returns((arg) => {
    t.is(arg, 3);
    throw new Error('escape infinite loop');
  });
  await t.context.controller.execute().catch(() => null);
  t.true(getAllOptions.called);
  t.true(playGame.calledWith(1));
  t.true(endGame.calledWith(2));
  t.true(getOption.calledWith('restart'));
});

test.serial('checkTurn calls its provided function and maps ui.getWinner over the result', async (t) => {
  stub(ui, 'getWinner').withArgs('test').returns('mapped-test');
  const actual = await t.context.controller.checkTurn(arg => Promise.resolve(arg))('test');
  t.is(actual, 'mapped-test');
  ui.getWinner.restore();
});
