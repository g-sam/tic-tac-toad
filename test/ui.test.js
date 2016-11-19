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

test('gets options of a given type', (t) => {
  const has = Object.prototype.hasOwnProperty;
  ['game', 'player', 'ready', 'restart', undefined]
    .map(ui.getOptionsFor)
    .forEach((optionData) => {
      t.true(has.call(optionData, 'title'));
      t.true(has.call(optionData, 'options'));
      optionData.options.forEach(option => t.true(has.call(option, 'text')));
    });
});

test('if option type is "player" when game is 0 or 2 or option type is "ready", clickhandlers are not bound and resolve is called immediately', (t) => {
  const resolve = spy();
  const options0 = { game: 0 };
  const options1 = { game: 2 };
  t.false(ui.getOptionsData('player', resolve, options0).options.some(el => el.clickHandler));
  t.false(ui.getOptionsData('player', resolve, options1).options.some(el => el.clickHandler));
  t.false(ui.getOptionsData('ready', resolve, options0).options.some(el => el.clickHandler));
  t.is(...resolve.args[0], options0);
  t.is(...resolve.args[1], options1);
  t.is(...resolve.args[2], options0);
});

test('constructs an argument for binding that merges new options with previous', (t) => {
  const addSecondOption = ui.getResolveArg('second', { first: 1 });
  t.deepEqual(addSecondOption(2), { first: 1, second: 2 });
});

test("gets board tokens with bound click handlers if it is human's turn", (t) => {
  const resolve = spy();
  const game = {
    board: [0, 1, 1, 2, 2, 0, 1, 2, 0],
    player: 1,
  };
  ui.getBoardData('human', resolve, game)
    .forEach(({ clickHandler }) =>
      (clickHandler ? clickHandler() : undefined));
  t.deepEqual(...resolve.args[0], {
    board: [1, 1, 1, 2, 2, 0, 1, 2, 0],
    player: 2,
  });
  t.deepEqual(...resolve.args[1], {
    board: [0, 1, 1, 2, 2, 1, 1, 2, 0],
    player: 2,
  });
  t.deepEqual(...resolve.args[2], {
    board: [0, 1, 1, 2, 2, 0, 1, 2, 1],
    player: 2,
  });
  t.is(resolve.callCount, 3);
});

test.cb("calls resolve after setTimeout and gets board tokens without click handlers if it is computer's turn", (t) => {
  const resolve = spy();
  const game = {
    board: [0, 1, 1, 2, 2, 0, 1, 2, 0],
    player: 1,
  };
  t.false(ui.getBoardData('computer', resolve, game).some(el => el.clickHandler));
  setTimeout(() => {
    t.true(resolve.calledWith({
      board: [1, 1, 1, 2, 2, 0, 1, 2, 0],
      player: 2,
    }));
    t.end();
  }, 100);
});

test('getOptionsFor "restart" returns title with winning player', (t) => {
  const first = ui.getOptionsFor('restart', {
    winner: 1,
  });
  t.is(first.title, 'x wins!');
  const second = ui.getOptionsFor('restart', {
    winner: 2,
  });
  t.is(second.title, 'o wins!');
  const draw = ui.getOptionsFor('restart', {
    winner: 0,
  });
  t.is(draw.title, 'draw!');
});

test('getWinner returns new game object with winner set to winning player, 0 or undefined', (t) => {
  const first = ui.getWinner({
    board: [1, 1, 1, 2, 2, 0, 1, 2, 0],
    player: 2,
  });
  t.is(first.winner, 1);
  const second = ui.getWinner({
    board: [2, 2, 2, 1, 1, 0, 1, 2, 0],
    player: 1,
  });
  t.is(second.winner, 2);
  const unfinished = ui.getWinner({
    board: [2, 2, 0, 1, 1, 0, 1, 2, 0],
    player: 1,
  });
  t.is(unfinished.winner, undefined);
  const draw = ui.getWinner({
    board: [2, 2, 1, 1, 1, 2, 2, 1, 1],
    player: 1,
  });
  t.is(draw.winner, 0);
});
