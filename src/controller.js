export default class Controller {
  constructor(renderer, ui) {
    this.dom = renderer;
    this.ui = ui;
  }
  render = (state, action) => {
    const nextState = this.ui.getNextState(state, action);
    const nextView = this.ui.getNextView(nextState, this.render);
    this.dom.renderOptions(nextView.options);
    this.dom.renderBoard(nextView.board);
    if (nextView.render) this.dom.delayedRender(nextView.render);
  }
}
