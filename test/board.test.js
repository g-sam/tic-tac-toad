import test from 'ava';
import * as board from '../src/board';

test('generates empty board', (t) => {
  t.deepEqual(
    board.getEmptyBoard(),
    [
      0, 0, 0,
      0, 0, 0,
      0, 0, 0,
    ],
  );
});

test('move player to index', (t) => {
  const newBoard = board.movePlayerToIndex(board.getEmptyBoard(), 1)(3);
  t.deepEqual(
    newBoard,
    [
      0, 0, 0,
      1, 0, 0,
      0, 0, 0,
    ],
  );
});

test('get empty indices', (t) => {
  t.deepEqual(
    board.getEmptyIndices([
      0, 2, 0,
      1, 0, 0,
      2, 0, 0,
    ]),
    [0, 2, 4, 5, 7, 8],
  );
});

test('checks if board is full', (t) => {
  t.false(board.isBoardFull([
    0, 2, 0,
    1, 0, 0,
    2, 0, 0,
  ]));
  t.true(board.isBoardFull([
    1, 2, 2,
    1, 1, 2,
    2, 1, 2,
  ]));
});

test('generate indices of winning lines', (t) => {
  t.deepEqual(
    board.generateIndicesOfLines(),
    [
      [0, 1, 2],
      [0, 3, 6],
      [3, 4, 5],
      [1, 4, 7],
      [6, 7, 8],
      [2, 5, 8],
      [2, 4, 6],
      [0, 4, 8],
    ],
  );
});

test('check if player has won', (t) => {
  t.false(board.isWinner([
    0, 2, 0,
    1, 0, 0,
    2, 0, 0,
  ], 2));
  t.true(board.isWinner([
    1, 2, 0,
    1, 2, 0,
    1, 0, 0,
  ], 1));
  t.false(board.isWinner([
    1, 2, 0,
    1, 2, 0,
    1, 0, 0,
  ], 2));
});

test('checks if game is over', (t) => {
  t.true(board.isGameOver([
    1, 2, 0,
    1, 2, 0,
    1, 0, 0,
  ], 1));
  t.true(board.isGameOver([
    1, 2, 1,
    1, 2, 2,
    2, 1, 2,
  ], 2));
  t.false(board.isGameOver([
    1, 2, 1,
    1, 0, 2,
    2, 1, 2,
  ], 2));
});
