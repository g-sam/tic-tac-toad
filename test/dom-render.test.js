import test from 'ava';
import jquery from 'jquery';
import { jsdom } from 'jsdom';
import { spy } from 'sinon';
import { readFileSync } from 'fs';
import DOMRenderer from '../src/dom-render';

const html = readFileSync('../public/index.html', 'utf8');

test.beforeEach((t) => {
  const window = jsdom(html).defaultView;
  const $ = jquery(window);
  t.context = new DOMRenderer($); // eslint-disable-line no-param-reassign
});

test('tests can access mock dom', (t) => {
  t.truthy(t.context.$);
});

test('board is inserted into dom', (t) => {
  t.context.renderBoard(['', '', '', '', '', '', '', '', '']);
  const actual = t.context.$('td').map((idx, el) => t.context.$(el).text()).get();
  const expected = ['', '', '', '', '', '', '', '', ''];
  t.deepEqual(actual, expected);
});

test('options inserted into dom with correct attributes', (t) => {
  const spyer = spy();
  const optionData = {
    title: 'test',
    options: [{
      text: 'option 1',
      clickHandler: spyer,
    }],
  };
  t.context.renderOptions(optionData);

  const labels = t.context.$('button').map((idx, el) => t.context.$(el).text()).get();
  const title = t.context.$('.buttons h4').text();
  t.context.$('button').each((idx, el) => t.context.$(el).click());

  t.deepEqual(labels, ['option 1']);
  t.deepEqual(title, 'test');
  t.is(spyer.callCount, 1);
});
