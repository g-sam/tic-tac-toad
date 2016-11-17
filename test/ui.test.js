import test from 'ava';
import { spy } from 'sinon';
import * as ui from '../src/ui';

test('converts board to array of tokens', (t) => {
  const actual = ui.getBoardTokens([1, 0, 1, 2, 0, 0, 0, 0, 2]);
  const expected = [{ text: 'x' }, { text: '' }, { text: 'x' }, { text: 'o' }, { text: '' }, { text: '' }, { text: '' }, { text: '' }, { text: 'o' }];
  t.deepEqual(actual, expected);
});

test('gets game type options with bound click handlers', (t) => {
  const resolve = spy();
  ui.getOptionsData('game', resolve)
    .options
    .forEach((opt, idx) => {
      opt.clickHandler();
      t.deepEqual(...resolve.args[idx], { game: idx });
    });
});

test('gets either player or game options', (t) => {
  const has = Object.prototype.hasOwnProperty;
  ['game', 'player', undefined]
    .map(ui.getOptionsFor)
    .forEach((optionData) => {
      t.true(has.call(optionData, 'title'));
      t.true(has.call(optionData, 'options'));
      optionData.options.forEach(option => t.true(has.call(option, 'text')));
    });
});

test('constructs an argument for binding that merges new options with previous', (t) => {
  const addSecondOption = ui.getResolveArg('second', { first: 1 });
  t.deepEqual(addSecondOption(2), { first: 1, second: 2 });
});

test("gets board tokens with bound click handlers if it is human's turn", (t) => {
  const resolve = spy();
  const game = {
    board: [0, 1, 1, 2, 2, 0, 1, 2],
    player: 1,
  };
  ui.getBoardData('human', resolve, game)
    .forEach(({ clickHandler }) =>
      (clickHandler ? clickHandler() : undefined));
  t.deepEqual(...resolve.args[0], {
    board: [1, 1, 1, 2, 2, 0, 1, 2],
    player: 2,
  });
  t.deepEqual(...resolve.args[1], {
    board: [0, 1, 1, 2, 2, 1, 1, 2],
    player: 2,
  });
  t.is(resolve.callCount, 2);
});

test("calls resolve immediately and gets board tokens without click handlers if it is computer's turn", (t) => {
  const resolve = spy();
  const game = {
    board: [0, 1, 1, 2, 2, 0, 1, 2],
    player: 1,
  };
  t.false(ui.getBoardData('computer', resolve, game).some(el => el.clickHandler));
  t.true(resolve.calledWith({
    board: [1, 1, 1, 2, 2, 0, 1, 2],
    player: 2,
  }));
});
