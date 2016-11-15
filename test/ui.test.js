import test from 'ava';
import { spy } from 'sinon';
import * as ui from '../src/ui';

test('converts board to array of tokens', (t) => {
  const actual = ui.getBoardData([1, 0, 1, 2, 0, 0, 0, 0, 2]);
  const expected = ['x', '', 'x', 'o', '', '', '', '', 'o'];
  t.deepEqual(actual, expected);
});

test('gets game type options with bound click handlers', (t) => {
  const resolve = spy();
  ui.getGameTypeOptions(resolve)
    .options
    .forEach((opt, idx) => {
      opt.clickHandler();
      t.true(resolve.calledWith(idx));
    });
});
