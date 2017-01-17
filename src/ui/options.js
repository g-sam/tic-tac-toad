import {
  start,
  setBoardSize,
  setGameType,
  setFirstPlayer,
} from './actions';

export default class Opts {
  bindOptions = (state, nextAction, data) => ({
    ...state,
    optionView: {
      ...data,
      options: data.options.map((option, idx) => ({
        ...option,
        clickHandler: state.render.bind(null, state, { type: nextAction, data: idx }),
      })),
    },
  });

  selectBoardSize = state =>
    this.bindOptions(state, setBoardSize, {
      title: 'Select board size',
      options: [
        { text: '3x3' },
        { text: '4x4' },
      ],
    });

  selectGameType = state =>
    this.bindOptions(state, setGameType, {
      title: 'Select game type',
      options: [
        { text: 'Human vs. human' },
        { text: 'Computer vs. human' },
        { text: 'Computer vs. computer' },
      ],
    });

  selectFirstPlayer = state =>
    this.bindOptions(state, setFirstPlayer, {
      title: 'Choose who goes first',
      options: [
        { text: 'Me!!!' },
        { text: 'Computer' },
      ],
    });

  showStatus = state =>
    this.bindOptions(
      state,
      start,
      (state.winner === undefined
        ? {
          title: `${state.nextPlayer} to move`,
          options: [],
        } : {
          title: `${state.winner ? `${state.winner} wins!` : 'draw!'}`,
          options: [{ text: 'Play again' }],
        }));
}
