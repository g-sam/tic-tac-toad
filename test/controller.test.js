import test from 'ava';
import { createStubInstance, stub, spy } from 'sinon';
import Controller from '../src/controller';
import DOMRenderer from '../src/dom';
import UI from '../src/ui/';
import { start } from '../src/ui/actions';

test.beforeEach((t) => {
  const dom = createStubInstance(DOMRenderer);
  const ui = createStubInstance(UI);
  ui.getNextState = () => ({ optionView: 'o', boardView: 'b' });
  t.context = new Controller(dom, ui);  // eslint-disable-line no-param-reassign
});

test('render calls getNextState with its own arguments', (t) => {
  const getNextState = spy(t.context.ui, 'getNextState');
  t.context.render('state', 'action');
  t.deepEqual(getNextState.args[0], ['state', 'action']);
});

test('render passes getNextState correct default arguments', (t) => {
  const getNextState = spy(t.context.ui, 'getNextState');
  t.context.render();
  t.deepEqual(getNextState.args[0], [{ render: t.context.render }, { type: start }]);
});

test('render calls dom rendering functions with correct state', (t) => {
  t.context.render();
  t.deepEqual(t.context.dom.renderOptions.args[0], ['o']);
  t.deepEqual(t.context.dom.renderBoard.args[0], ['b']);
});

test('if nextState has an delayedRender function, render passes it to dom.delayedRender', (t) => {
  stub(t.context.ui, 'getNextState').returns({ delayedRender: () => 'passed' });
  t.context.render();
  t.is(t.context.dom.delayedRender.args[0][0](), 'passed');
});
