export default class Game {
  constructor(logic) {
    this.logic = logic;
  }

  getEmptyBoard = () => this.logic.getEmptyBoard();

  getToken = (player) => {
    if (player === 1) return 'x';
    if (player === 2) return 'o';
    return '';
  };

  getWinner = ({ board, player }) => {
    if (this.logic.isWinner(board, player)) return this.getToken(player);
    if (this.logic.isBoardFull(board)) return null;
    return undefined;
  };

  updateGame = (state, move, nextAction) => {
    const newGameState = {
      ...state.gameState,
      board: this.logic.movePlayerToIndex(state.gameState.board, state.gameState.player)(move),
    };
    newGameState.winner = this.getWinner(newGameState);
    newGameState.player = this.logic.switchPlayer(state.gameState.player);
    return {
      gameState: newGameState,
      nextAction: newGameState.winner === undefined ? 'take_move' : nextAction,
    };
  };

  getData = state =>
    state.gameState.board.map(player => ({ text: this.getToken(player) }));

  getAction = (state, idx) => ({
    data: idx,
    type: state.nextAction,
  });

  bindBoard = (state, render) =>
    this.getData(state)
      .map((token, idx) => (!token.text.length ? ({
        ...token,
        clickHandler: render.bind(null, state, this.getAction(state, idx)),
      }) : token));

  renderCompTurn = (state, render) => () => {
    const compMove = this.logic.getBestMove(state.gameState.board, state.gameState.player);
    const action = this.getAction(state, compMove);
    setTimeout(render.bind(null, state, action), 500);
  };

  playerType = state => (
    state.gameState.player === 1 ? state.players.first : state.players.second);

  getView = (state, render) => {
    if (state.nextAction === 'take_move' && this.playerType(state) === 'human') {
      return {
        board: this.bindBoard(state, render),
      };
    }
    if (state.nextAction === 'take_move' && this.playerType(state) === 'computer') {
      return {
        render: this.renderCompTurn(state, render),
      };
    }
    return {};
  };
}
