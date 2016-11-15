import * as ui from './ui';

export default class Controller {
  constructor(renderer) {
    this.dom = renderer;
  }
  execute() {
    this.dom.renderBoard(ui.renderEmptyBoardHTML());
  }
  getGameType() {
    return new Promise(resolve =>
    this.dom.renderOptions(ui.getGameTypeOptions(resolve)));
  }
}
