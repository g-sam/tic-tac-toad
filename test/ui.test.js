import test from 'ava';
import { load } from 'cheerio';
import * as ui from '../src/ui';

test('renders board values', (t) => {
  const $ = load(ui.renderEmptyBoardHTML());
  const actual = $('td').map((idx, el) => $(el).text()).get();
  const expected = [0, 0, 0, 0, 0, 0, 0, 0, 0].map(String);
  t.deepEqual(actual, expected);
});

