const fs = require('fs');
require('babel-register');
const AI = require('./src/logic/ai').default;
const Board = require('./src/logic/board').default;
const Player = require('./src/players/player').default;

class Cache {
  constructor() {
    this.board = new Board();
    this.cache = {};
    this.notFirstIdx = {};
    this.writeAll = () => {
      fs.writeFileSync('static-cache-all.json', JSON.stringify(this.cache));
      return this;
    };
    this.writeNotFirstIdx = () => {
      console.log('Not first index:', this.notFirstIdx);
      fs.writeFileSync('static-cache-not-first-idx.json', JSON.stringify(this.notFirstIdx));
      return this;
    };
    this.getNextBoards = (board, player) =>
      this.board.getEmptyIndices(board, player)
        .map(this.board.movePlayerToIndex(board, player));
    this.play = (board, player, limit, depth = 0) => {
      if (depth === limit) return;
      const key = JSON.stringify([board, player]);
      if (!this.cache[key]) {
        this.cache[key] = new AI().getBestMove(board, player);
        const firstEmptyIdx = this.board.getEmptyIndices(board, player)[0];
        console.log(board, player, firstEmptyIdx, this.cache[key]);
        if (firstEmptyIdx !== undefined && firstEmptyIdx !== this.cache[key]) {
          this.notFirstIdx[key] = this.cache[key];
        }
      }
      this.getNextBoards(board, player)
        .forEach(nextBoard => this.play(nextBoard, Player.switchPlayer(player), limit, depth + 1));
    };
    this.create = (board, player, limit, depth) => {
      this.play(board, player, limit, depth);
      return this;
    };
  }
}

new Cache()
  .create([
    0, 0, 0, 0,
    0, 0, 0, 0,
    0, 0, 0, 0,
    0, 0, 0, 0,
  ], 1, 5)
  .writeAll()
  .writeNotFirstIdx();

