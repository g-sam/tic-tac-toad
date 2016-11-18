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
    player: 2
  };
  t.context = { // eslint-disable-line no-param-reassign
    testGame,
    winningGame,
    dom,
    controller: new Controller(dom),
  };
});

test('execute method calls dom.renderBoard', (t) => {
  stub(t.context.controller, 'getAllOptions');
  stub(t.context.controller, 'playGame');
  t.context.controller.execute();
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

test('the options reducer calls ui.getOptionsData with correct arguments', (t) => {
  const getOptionsData = spy(ui, 'getOptionsData');
  const reducer = t.context.controller.getOptions('player');
  reducer({ game: 1 });
  t.is(getOptionsData.args[0][0], 'player');
  t.is(typeof getOptionsData.args[0][1], 'function');
  t.deepEqual(getOptionsData.args[0][2], { game: 1 });
});

test('the options reducer returns promise and skips rendering of player options when game is 0 or 2', (t) => {
  const reducer = t.context.controller.getOptions('player');
  const game0 = reducer({ game: 0 });
  t.truthy(game0.then);
  t.true(t.context.dom.renderOptions.notCalled);
  const game2 = reducer({ game: 2 });
  t.truthy(game2.then);
  t.true(t.context.dom.renderOptions.notCalled);
});

test('the promise returned from the options reducer resolves with player 1 when when game is 2', async (t) => {
  const reducer = t.context.controller.getOptions('player');
  t.deepEqual(
    await reducer({ game: 2 }),
    { game: 2, player: 1 },
  );
});

test('the promise returned from the options reducer resolves with player 0 when when game is 0', async (t) => {
  const reducer = t.context.controller.getOptions('player');
  t.deepEqual(
    await reducer({ game: 0 }),
    { game: 0, player: 0 },
  );
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
  const actual = await t.context.controller.getAllOptions({ game: 0 });
  t.deepEqual(actual, { game: 0, player: 0 });
});

test('human goes first if correct option selected', async (t) => {
  const takeTurn = stub(t.context.controller, 'takeTurn').returns(() => Promise.resolve(t.context.winningGame));
  stub(t.context.controller, 'getAllOptions').returns(Promise.resolve({ game: 0, player: 0 }));
  await t.context.controller.execute();
  t.true(takeTurn.firstCall.calledWith('human'));
});

test('computer goes first when correct option selected', async (t) => {
  const takeTurn = stub(t.context.controller, 'takeTurn').returns(() => Promise.resolve(t.context.winningGame));
  stub(t.context.controller, 'getAllOptions').returns(Promise.resolve({ game: 1, player: 1 }));
  await t.context.controller.execute();
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
  const winning = { board: [1, 1, 1, 0, 0, 0, 0, 0, 0], player: 2 };
  const actual = await t.context.controller.chainTurns(null)(winning);
  t.deepEqual(actual, winning);
});

test('otherwise chainTurns returns a function that calls chainTurns with its initial argument', async (t) => {
  const winning = { board: [1, 1, 1, 0, 0, 0, 0, 0, 0], player: 2 };
  const notWinning = { board: [0, 1, 1, 0, 0, 0, 0, 0, 0], player: 1 };
  const chainTurns = spy(t.context.controller, 'chainTurns');
  const nextTurn = () => Promise.resolve(winning);
  await chainTurns(nextTurn)(notWinning);
  t.true(chainTurns.secondCall.calledWith(...chainTurns.firstCall.args));
});

test('turn reducer calls ui.getBoardData with correct arguments', (t) => {
  const getBoardData = spy(ui, 'getBoardData');
  t.context.controller.takeTurn('human')(t.context.testGame);
  t.is(getBoardData.args[0][0], 'human');
  t.is(typeof getBoardData.args[0][1], 'function');
  t.deepEqual(getBoardData.args[0][2], t.context.testGame);
});

test('turn reducer calls dom.renderBoard and returns promise', (t) => {
  const actual = t.context.controller.takeTurn('human')(t.context.testGame);
  t.truthy(actual.then);
  t.true(t.context.dom.renderBoard.calledOnce);
});

