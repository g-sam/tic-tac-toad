import { takeMove, getMove } from '../ui/actions';

export default class Player {
  constructor(playerNumber, logic) {
    this.playerNumber = playerNumber;
    this.logic = logic;
  }

  static current = state =>
    state.players.filter(player => (player.playerNumber === state.gameState.player))[0];

  static switchPlayer = playerNumber =>
    (playerNumber === 1 ? 2 : 1);

  static getToken = playerNumber =>
    ['', 'x', 'o'][playerNumber];

  static getBoardData = state =>
    state.gameState.board.map(player => ({ text: Player.getToken(player) }));

  getName = () => 'human';

  getGameStatus = state => ({
    ...state,
    winner: Player.getToken(this.logic.getWinner(
      state.gameState.board,
      Player.switchPlayer(state.gameState.player),
    )),
    nextPlayer: Player.getToken(state.gameState.player),
    boardView: Player.getBoardData(state),
  })

  applyMove = (state, move) =>
    this.getGameStatus({
      ...state,
      gameState: {
        ...state.gameState,
        board: this.logic.movePlayerToIndex(state.gameState.board, state.gameState.player)(move),
        player: Player.switchPlayer(state.gameState.player),
      },
    });

  bindBoard = state => ({
    ...state,
    boardView: state.boardView
      .map((token, idx) =>
        (!token.text.length
          ? ({
            ...token,
            clickHandler: state.render.bind(null, state, { type: takeMove, data: idx }),
          })
            : token)),
  });

  getMove(state) {
    return (state.winner === undefined
      ? this.bindBoard(this.getGameStatus(state))
      : this.getGameStatus(state));
  }

  takeMove(state, move) {
    return {
      ...state,
      delayedRender: state.render.bind(null, this.applyMove(state, move), { type: getMove }),
    };
  }
}
