import test from 'ava';
import { load } from 'cheerio';
import { readFileSync } from 'fs';
import DOMRenderer from '../src/dom-render';
import * as ui from '../src/ui';

const html = readFileSync('../public/index.html', 'utf8');

test.beforeEach((t) => {
  const $ = load(html);
  t.context = new DOMRenderer($); // eslint-disable-line no-param-reassign
});

test('tests can access mock dom', (t) => {
  t.truthy(t.context.$);
});

test('rendered board is inserted into dom', (t) => {
  t.context.renderBoard(ui.renderEmptyBoardHTML());
  const actual = t.context.$('td').map((idx, el) => t.context.$(el).text()).get();
  const expected = [0, 0, 0, 0, 0, 0, 0, 0, 0].map(String);
  t.deepEqual(actual, expected);
});

