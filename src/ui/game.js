export default class Game {
  constructor(logic, { Player, Computer }) {
    this.logic = logic;
    this.Player = Player;
    this.gameTypes = [
      { players: [new Player(1, logic), new Player(2, logic)] },
      { players: [new Player(1, logic), new Computer(2, logic)] },
      { players: [new Computer(1, logic), new Computer(2, logic)] },
      { players: [new Computer(1, logic), new Player(2, logic)] },
    ];
  }

  initialize = (state, sizeOpt) => ({
    ...state,
    gameState: {
      board: this.logic.getEmptyBoard(sizeOpt === 1 ? 4 : 3),
      player: 1,
    },
  })

  setGameType = (state, gameType) => ({
    ...state,
    ...this.gameTypes[gameType],
  })

  setFirstPlayer = (state, firstPlayer) =>
    (firstPlayer === 1
      ? this.setGameType(state, 3)
      : state);

  getMove = state =>
    this.Player.current(state).getMove(state);

  takeMove = (state, move) =>
    this.Player.current(state).takeMove(state, move);
}
