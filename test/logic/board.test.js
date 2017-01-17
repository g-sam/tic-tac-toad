import { stub } from 'sinon';
import test from 'ava';
import Board from '../../src/logic/board';

const board = new Board();

test('generates empty board of correct size', (t) => {
  t.deepEqual(
    board.getEmptyBoard(3),
    [
      0, 0, 0,
      0, 0, 0,
      0, 0, 0,
    ],
  );
  t.deepEqual(
    board.getEmptyBoard(4),
    [
      0, 0, 0, 0,
      0, 0, 0, 0,
      0, 0, 0, 0,
      0, 0, 0, 0,
    ],
  );
});

test('move player to index', (t) => {
  const newBoard = board.movePlayerToIndex(board.getEmptyBoard(3), 1)(3);
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

test('checks if board is empty', (t) => {
  t.false(board.isBoardEmpty([
    0, 0, 0,
    1, 0, 0,
    0, 0, 0,
  ]));
  t.true(board.isBoardEmpty([
    0, 0, 0,
    0, 0, 0,
    0, 0, 0,
  ]));
});

test('generate indices of winning lines', (t) => {
  const testBoard = [
    0, 2, 0,
    1, 0, 0,
    2, 0, 0,
  ];
  t.deepEqual(
    board.generateIndicesOfLines(testBoard),
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

test('getWinner returns winning player', (t) => {
  stub(board, 'isWinner').returns(true);
  t.is(board.getWinner('board', 'player'), 'player');
});

test('getWinner returns 0 if draw', (t) => {
  const board1 = new Board();
  stub(board1, 'isWinner').returns(false);
  stub(board1, 'isBoardFull').returns(true);
  t.is(board1.getWinner('board', 'player'), 0);
});

test('getWinner returns undefined if game not over', (t) => {
  const board1 = new Board();
  stub(board1, 'isWinner').returns(false);
  stub(board1, 'isBoardFull').returns(false);
  t.is(board1.getWinner('board', 'player'), undefined);
});
