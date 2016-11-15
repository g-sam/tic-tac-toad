import test from 'ava';
import { load } from 'cheerio';
import { readFileSync } from 'fs';
import DOMRenderer from '../src/dom-render';

const html = readFileSync('../public/index.html', 'utf8');

test.beforeEach((t) => {
  const $ = load(html);
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

/*
test('options inserted into dom as buttons with correct labels', (t) => {
  t.context.renderOptions({
    title: 'test',
    options: [{
      text: 'option 1',
      clickHandler: () => null,
    }],
  });
  const actual = t.context.$('button').map((idx, el) => t.context.$(el).text()).get();

  t.deepEqual(actual, ['option 1']);
});
*/
