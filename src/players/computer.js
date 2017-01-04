import Player from './player';
import { getMove, takeMove } from '../ui/actions';

export default class Computer extends Player {

  getName = () => 'computer';

  getMove = state => ({
    ...state,
    delayedRender: state.winner === undefined
      ? state.render.bind(
        null,
        { ...this.getGameStatus(state), thinkingStartTime: Date.now() },
        { type: takeMove },
      ) : undefined,
  });

  takeMove = state => ({
    ...state,
    delayedRender: () => setTimeout(
      state.render.bind(
        null,
        this.applyMove(
          state,
          this.logic.getBestMove(state.gameState.board, state.gameState.player),
        ),
        { type: getMove },
      ),
      600 - (Date.now() - state.thinkingStartTime),
    ),
  })
}
