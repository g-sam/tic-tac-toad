import test from 'ava';
import { createStubInstance, stub, spy } from 'sinon';
import Controller from '../src/controller';
import DOMRenderer from '../src/dom';
import UI from '../src/ui/';

test.beforeEach((t) => {
  const dom = createStubInstance(DOMRenderer);
  const ui = createStubInstance(UI);
  ui.getNextState = () => 'nextstate';
  ui.getNextView = () => ({ options: 'o', board: 'b' });
  t.context = new Controller(dom, ui);  // eslint-disable-line no-param-reassign
});

test('render calls getNextState with its own arguments', (t) => {
  const getNextState = spy(t.context.ui, 'getNextState');
  t.context.render('state', 'action');
  t.deepEqual(getNextState.args[0], ['state', 'action']);
});

test('render calls getNextView with next state and itself', (t) => {
  const getNextView = spy(t.context.ui, 'getNextView');
  t.context.render();
  t.deepEqual(getNextView.args[0][0], 'nextstate');
  t.is(typeof getNextView.args[0][1], 'function');
});

test('render calls dom rendering functions with correct views', (t) => {
  t.context.render();
  t.deepEqual(t.context.dom.renderOptions.args[0], ['o']);
  t.deepEqual(t.context.dom.renderBoard.args[0], ['b']);
});

test('if nextView has a render function, render passes it to dom.delayedRender', (t) => {
  stub(t.context.ui, 'getNextView').returns({ render: () => 'passed' });
  t.context.render();
  t.is(t.context.dom.delayedRender.args[0][0](), 'passed');
});
