export default class UI {
  constructor(game, opts) {
    this.game = game;
    this.opts = opts;
    this.initialState = {
      gameState: {
        board: game.getEmptyBoard(),
        player: 1,
      },
    };
  }

  actionSeq = [
    'start',
    'set_gametype',
    'set_firstplayer',
    'begin_game',
    'take_move',
    'start',
  ];

  nextAction = type => this.actionSeq[this.actionSeq.indexOf(type) + 1];

  getNextView = (state, render) => ({
    options: this.opts.getData(state),
    board: this.game.getData(state),
    ...this.opts.getView(state, render),
    ...this.game.getView(state, render),
  });

  getNextState = (state = this.initialState, action = { type: 'start' }) => {
    switch (action.type) {
      case 'start': return {
        ...this.initialState,
        nextAction: this.nextAction(action.type),
      };
      case 'set_gametype': return {
        ...state,
        gameType: action.data,
        nextAction: this.nextAction(action.type),
      };
      case 'set_firstplayer': return {
        ...state,
        players: this.opts.setPlayers(state.gameType, action.data),
        nextAction: this.nextAction(action.type),
      };
      case 'begin_game': return {
        ...state,
        nextAction: this.nextAction(action.type),
      };
      case 'take_move': return {
        ...state,
        ...this.game.updateGame(state, action.data, this.nextAction(action.type)),
      };
      default: return state;
    }
  };
}
