import test from 'ava';
import { load } from 'cheerio';
import * as ui from '../src/ui';

test('renders board values', (t) => {
  const input = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  const $ = load(ui.renderBoard(input));
  const actual = $('td').map((idx, el) => $(el).text()).get();
  const expected = input.map(String);
  t.deepEqual(actual, expected);
});
