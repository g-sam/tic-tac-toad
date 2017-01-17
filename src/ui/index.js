import { compose } from 'ramda';
import {
  start,
  setBoardSize,
  setGameType,
  setFirstPlayer,
  getMove,
  takeMove,
} from './actions';

export default class UI {
  constructor(game, opts) {
    this.doSetFirstPlayer = compose(opts.selectFirstPlayer, game.setGameType);
    this.skipSetFirstPlayer = compose(opts.showStatus, game.getMove, game.setGameType);
    this.reducers = {
      [start]: compose(opts.selectBoardSize, UI.clearState),
      [setBoardSize]: compose(opts.selectGameType, game.initialize),
      [setGameType]: (state, choice) =>
        (choice === 1
          ? this.doSetFirstPlayer(state, choice)
          : this.skipSetFirstPlayer(state, choice)),
      [setFirstPlayer]: compose(opts.showStatus, game.getMove, game.setFirstPlayer),
      [getMove]: compose(opts.showStatus, game.getMove),
      [takeMove]: compose(opts.showStatus, game.takeMove),
    };
  }

  static clearState(state) {
    return { render: state.render };
  }

  getNextState = (state, action) =>
    this.reducers[action.type](state, action.data);
}
