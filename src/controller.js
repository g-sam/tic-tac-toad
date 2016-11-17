import * as ui from './ui';

export default class Controller {
  constructor(renderer) {
    this.dom = renderer;
  }
  execute() {
    this.dom.renderBoard(ui.getBoardTokens(ui.getEmptyBoard()));
    return this.getAllOptions()
      .then(options => (
        options.player === 0 ? this.humanTurn() : undefined
      ));
  }
  humanTurn(board = ui.getEmptyBoard()) {
    const player = 1;
    return new Promise(resolve =>
      this.dom.renderBoard(ui.getBoardData(player, resolve, board)));
  }
  getAllOptions(defaults = {}) {
    return Promise.resolve(defaults)
      .then(this.getOptions('game'))
      .then(this.getOptions('player'));
  }
  getOptions(type) {
    const that = this;
    return function optionsReducer(options) {
      if (options.game === 0 || options.game === 2) {
        return Promise.resolve({
          ...options,
          player: options.game === 2 ? 1 : 0,
        });
      }
      return new Promise(resolve =>
          that.dom.renderOptions(ui.getOptionsData(type, resolve, options)));
    };
  }
}
