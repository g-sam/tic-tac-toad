import { start } from './ui/actions';

export default class Controller {
  constructor(renderer, ui) {
    this.dom = renderer;
    this.ui = ui;
  }
  render = (state = { render: this.render }, action = { type: start }) => {
    const nextState = this.ui.getNextState(state, action);
    this.dom.renderOptions(nextState.optionView);
    this.dom.renderBoard(nextState.boardView);
    this.dom.delayedRender(nextState.delayedRender);
  }
}
