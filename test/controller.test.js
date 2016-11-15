import test from 'ava';
import { createStubInstance } from 'sinon';
import Controller from '../src/controller';
import DOMRenderer from '../src/dom-render';

test.beforeEach((t) => {
  const stub = createStubInstance(DOMRenderer);
  t.context = { // eslint-disable-line no-param-reassign
    stub,
    controller: new Controller(stub),
  };
});

test('execute method calls renderBoard', (t) => {
  t.context.controller.execute();
  t.true(t.context.stub.renderBoard.calledOnce);
});

test('getGameType calls renderOptions and returns promise', (t) => {
  const actual = t.context.controller.getGameType();
  t.truthy(actual.then);
  t.true(t.context.stub.renderOptions.calledOnce);
});
