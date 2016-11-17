import * as ui from './ui';

export default class Controller {
  constructor(renderer) {
    this.dom = renderer;
  }

  initialGame = {
    board: ui.getEmptyBoard(),
    player: 1,
  };

  setTurnSequence = (options) => {
    if (options.player === 0) return this.takeTurn('human');
    return this.takeTurn('computer');
  }

  startGame = firstTurn =>
    firstTurn(this.initialGame);

  takeTurn = type => game =>
      new Promise(resolve =>
          this.dom.renderBoard(ui.getBoardData(type, resolve, game)));

  getAllOptions = (defaults = {}) =>
    Promise.resolve(defaults)
      .then(this.getOptions('game'))
      .then(this.getOptions('player'));

  getOptions = type => (options) => {
    if (options.game === 0 || options.game === 2) {
      return Promise.resolve({
        ...options,
        player: options.game === 2 ? 1 : 0,
      });
    }
    return new Promise(resolve =>
        this.dom.renderOptions(ui.getOptionsData(type, resolve, options)));
  };

  execute() {
    this.dom.renderBoard(ui.getBoardTokens(this.initialGame.board));
    return Promise.resolve()
      .then(this.getAllOptions)
      .then(this.setTurnSequence)
      .then(this.startGame);
  }
}
