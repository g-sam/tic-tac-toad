import * as ui from './ui';

export default class Controller {
  constructor(renderer) {
    this.dom = renderer;
  }
  execute() {
    this.dom.renderBoard(ui.getBoardData());
    this.getAllOptions();
  }
  getAllOptions() {
    return Promise.resolve()
      .then(this.getOptions('game'))
      .then(this.getOptions('player'));
  }
  getOptions(type) {
    const that = this;
    return function optionsReducer(options = {}) {
      if (options.game === 0 || options.game === 2) {
        return Promise.resolve({
          ...options,
          player: 0,
        });
      }
      return new Promise(resolve =>
          that.dom.renderOptions(ui.getOptionsData(type, resolve, options)));
    };
  }
}
