import test from 'ava';
import { createStubInstance, stub } from 'sinon';
import Controller from '../src/controller';
import DOMRenderer from '../src/dom';

test.beforeEach((t) => {
  const dom = createStubInstance(DOMRenderer);
  t.context = { // eslint-disable-line no-param-reassign
    dom,
    controller: new Controller(dom),
  };
});

test('execute method calls dom.renderBoard', (t) => {
  t.context.controller.execute();
  t.true(t.context.dom.renderBoard.calledOnce);
});

test('getOptions returns an options reducer that calls dom.renderOptions and returns a promise', (t) => {
  const actual = t.context.controller.getOptions('game')({});
  t.truthy(actual.then);
  t.true(t.context.dom.renderOptions.calledOnce);
});

test('selecting game 0 or 1 returns promise and skips rendering of player options', (t) => {
  const actual = t.context.controller.getOptions('player')({ game: 0 });
  t.truthy(actual.then);
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

test.cb('if game is 1 the promise waits for user input', (t) => {
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

test('human goes first if correct option selected', async (t) => {
  const humanTurn = stub(t.context.controller, 'humanTurn');
  stub(t.context.controller, 'getAllOptions').returns(Promise.resolve({ game: 0, player: 0 }));
  await t.context.controller.execute();
  t.true(humanTurn.calledOnce);
});

test('human does NOT go first when computer selected', async (t) => {
  const humanTurn = stub(t.context.controller, 'humanTurn');
  stub(t.context.controller, 'getAllOptions').returns(Promise.resolve({ game: 1, player: 1 }));
  await t.context.controller.execute();
  t.false(humanTurn.called);
});

test('humanTurn calls dom.renderBoard and returns promise', (t) => {
  const actual = t.context.controller.humanTurn();
  t.truthy(actual.then);
  t.true(t.context.dom.renderBoard.calledOnce);
});

