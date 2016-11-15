import * as ui from './ui';

export default class Controller {
  constructor(renderer) {
    this.dom = renderer;
  }
  execute() {
    this.dom.renderBoard(ui.getBoardData());
  }
  getOptions(type) {
    return new Promise(resolve =>
    this.dom.renderOptions(ui.getOptionsData(type, resolve)));
  }
}
