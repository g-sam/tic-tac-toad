import test from 'ava';
import { load } from 'cheerio';
import * as ui from '../src/ui';

test('renders board values', (t) => {
  const $ = load(ui.renderEmptyBoardHTML());
  const actual = $('td').map((idx, el) => $(el).text()).get();
  const expected = ['', '', '', '', '', '', '', '', ''];
  t.deepEqual(actual, expected);
});

test('convert data to board token', (t) => {
  t.is(ui.getToken(0), '');
  t.is(ui.getToken(1), 'x');
  t.is(ui.getToken(2), 'o');
});

test('gets game type options with bound click handlers', (t) => {
  ui.getGameTypeOptions(Promise.resolve())
    .options
    .map(opt => opt.clickHandler())
    .forEach((p, idx) =>
        p.then(actual => t.is(actual, idx)),
    );
});
