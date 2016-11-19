import * as ui from './ui';

export default class Controller {
  constructor(renderer) {
    this.dom = renderer;
  }

  initialGame = {
    board: ui.getEmptyBoard(),
    player: 1,
  };

  getNextTurn = (firstPlayer, secondPlayer) => game => (
    game.player === 1 ?
    this.takeTurn(firstPlayer)(game) :
    this.takeTurn(secondPlayer)(game)
  );

  setTurnSequence = ({ player, game }) => {
    if (game === 0) {
      return this.getNextTurn('human', 'human');
    } else if (game === 1 && player === 0) {
      return this.getNextTurn('human', 'computer');
    } else if (game === 1 && player === 1) {
      return this.getNextTurn('computer', 'human');
    }
    return this.getNextTurn('computer', 'computer');
  }

  chainTurns = nextTurn => game => (
    ui.isGameOver(game) ? Promise.resolve(game) :
    nextTurn(game).then(this.chainTurns(nextTurn))
  );

  endGame = (game) => {
    this.dom.renderBoard(ui.getBoardTokens(game.board));
    return game;
  }

  playGame = (options) => {
    const nextTurn = this.setTurnSequence(options);
    const turnSequence = this.chainTurns(nextTurn);
    return Promise.resolve(this.initialGame)
      .then(turnSequence);
  }

  takeTurn = type => game =>
      new Promise(resolve =>
          this.dom.renderBoard(ui.getBoardData(type, resolve, game)));

  getAllOptions = (defaults = {}) =>
    Promise.resolve(defaults)
      .then(this.getOptions('game'))
      .then(this.getOptions('player'))
      .then(this.getOptions('ready'));

  getOptions = type => options =>
    new Promise(resolve =>
        this.dom.renderOptions(ui.getOptionsData(type, resolve, options)));

  execute = () => {
    this.dom.renderBoard(ui.getBoardTokens(this.initialGame.board));
    return Promise.resolve()
      .then(this.getAllOptions)
      .then(this.playGame)
      .then(this.endGame)
      .then(this.getOptions('restart'))
      .then(this.execute);
  }
}
