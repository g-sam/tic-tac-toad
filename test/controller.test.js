import test from 'ava';
import { createStubInstance } from 'sinon';
import Controller from '../src/controller';
import DOMRenderer from '../src/dom-render';

test.beforeEach((t) => {
  const dom = createStubInstance(DOMRenderer);
  t.context = { // eslint-disable-line no-param-reassign
    dom,
    controller: new Controller(dom),
  };
});

test('execute method calls renderBoard', (t) => {
  t.context.controller.execute();
  t.true(t.context.dom.renderBoard.calledOnce);
});

test('getOptions returns a function that calls renderOptions and returns promise', (t) => {
  const actual = t.context.controller.getOptions('game')();
  t.truthy(actual.then);
  t.true(t.context.dom.renderOptions.calledOnce);
});

test('selecting game 0 or 1 returns promise and skips rendering of player options', (t) => {
  const actual = t.context.controller.getOptions('player')({ game: 0 });
  t.truthy(actual.then);
  t.true(t.context.dom.renderOptions.notCalled);
});
