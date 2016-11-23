export default class Opts {
  selectGameType = () => ({
    title: 'Select game type',
    options: [
      { text: 'Human vs. human' },
      { text: 'Computer vs. human' },
      { text: 'Computer vs. computer' },
    ],
  });

  selectFirstPlayer = () => ({
    title: 'Choose who goes first',
    options: [
      { text: 'Me!!!' },
      { text: 'Computer' },
    ],
  });

  showGameType = state => ({
    title: `${state.players.first} vs. ${state.players.second}`,
    options: [],
  });

  showWinner = state => ({
    title: `${state.gameState.winner ? `${state.gameState.winner} wins!` : 'draw!'}`,
    options: [
      { text: 'Play again' },
    ],
  })

  getData = (state) => {
    switch (state.nextAction) {
      case 'set_gametype': return this.selectGameType();
      case 'set_firstplayer': return this.selectFirstPlayer();
      case 'take_move': return this.showGameType(state);
      case 'begin_game': return this.showGameType(state);
      case 'start': return this.showWinner(state);
      default:
        return {
          title: '',
          options: [],
        };
    }
  };

  getAction = state => idx => ({
    type: state.nextAction,
    data: idx,
  });

  bindOptions = (state, render) => {
    const action = this.getAction(state);
    const data = this.getData(state);
    return {
      ...data,
      options: data.options.map((option, idx) => ({
        ...option,
        clickHandler: render.bind(null, state, action(idx)),
      })),
    };
  };

  getView = (state, render) => {
    if (state.nextAction === 'set_firstplayer' && state.gameType !== 1) {
      return {
        options: this.getData({}),
        render: render.bind(null, state, { type: state.nextAction }),
      };
    }
    if (state.nextAction === 'begin_game') {
      return {
        options: this.getData(state),
        render: render.bind(null, state, { type: state.nextAction }),
      };
    }
    return {
      options: this.bindOptions(state, render),
    };
  };


  setPlayers = (gameType, firstPlayer) => {
    if (gameType === 0) {
      return {
        first: 'human',
        second: 'human',
      };
    } else if (gameType === 1 && firstPlayer === 0) {
      return {
        first: 'human',
        second: 'computer',
      };
    } else if (gameType === 1 && firstPlayer === 1) {
      return {
        first: 'computer',
        second: 'human',
      };
    }
    return {
      first: 'computer',
      second: 'computer',
    };
  };
}
