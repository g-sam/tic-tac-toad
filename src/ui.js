import * as fromBoard from './board';
import { getBestMove } from './ai';

export { getEmptyBoard } from './board';

export const getToken = (player) => {
  if (player === 1) return 'x';
  if (player === 2) return 'o';
  return '';
};

export const getBoardTokens = board =>
  board.map(player => ({ text: getToken(player) }));

export const getWinner = ({ board, player }) => {
  let winner;
  const lastPlayer = fromBoard.switchPlayer(player);
  if (fromBoard.isWinner(board, lastPlayer)) winner = lastPlayer;
  if (fromBoard.isBoardFull(board)) winner = 0;
  return {
    board,
    player,
    winner,
  };
};

export const nextBoard = (board, player) => idx => ({
  board: fromBoard.movePlayerToIndex(board, player)(idx),
  player: fromBoard.switchPlayer(player),
});


export const bindBoard = (boardTokens, resolve, getArg) =>
  boardTokens
    .map((token, idx) => (!token.text.length ? ({
      ...token,
      clickHandler: resolve.bind(null, getArg(idx)),
    }) : token));

export const getBoardData = (type, resolve, { player, board }) => {
  if (type === 'human') {
    return bindBoard(
      getBoardTokens(board),
      resolve,
      nextBoard(board, player),
    );
  }
  setTimeout(() => {
    const computerMove = getBestMove(board, player);
    resolve(nextBoard(board, player)(computerMove));
  }, 0);
  return getBoardTokens(board);
};

export const getOptionsData = (nextState, nextAction) => {
  switch (nextAction.type) {
    case 'start':
      return {
        title: 'Select game type',
        options: [
          { text: 'Human vs. human' },
          { text: 'Computer vs. human' },
          { text: 'Computer vs. computer' },
        ],
      }
    case 'player':
      return {
          title: 'Choose who goes first',
          options: [
            { text: 'Me!!!' },
            { text: 'Computer' },
          ],
        };
    case 'ready':
      return {
        title: [
          'human vs. human',
          'computer vs. human',
          'computer vs. computer',
        ][nextState.game],
        options: [],
      };
    case 'restart':
      return {
        title: `${nextState.winner ? `${getToken(nextState.winner)} wins!` : 'draw!'}`,
        options: [
          { text: 'Play again' },
        ],
      };
    default:
      return {
        title: '',
        options: [],
      };
  };
}

export const getOptionsHandler = (nextState, nextAction) => idx => ({
    ...nextState,
    [nextAction.type]: idx,
  });

export const bindOptions = (nextState, nextAction, render) => {
    const getArg = getOptionsHandler(nextState, nextAction); 
    const optionsData = getOptionsData(nextState, nextAction);
    return {
      ...optionsData,
      options: optionsData.options.map((option, idx) => ({
        ...option,
        clickHandler: render.bind(null, getArg(idx)),
      })),
    };
}


const getNextView = (nextAction, nextState, render) => {
  switch (nextAction.type) {
    case 'start':
    case 'game':
    case 'player':
      if (nextState.game !== 1) {
        return {
          options: getOptionsFor(),
          nowait: true,
        };
      }
      /* FALLTHROUGH */
    case 'reset':
      return {
        options: bindOptions(
          nextState,
          nextAction,
          render,
        ),
        nowait: false,
      };
    case 'ready':
      return {
        options: getOptionsFor(nextAction, nextState),
        nowait: true,
      };
    case 'play': 
      return {
        board: bindBoard(
          nextState,
          nextAction,
          render,
        ),
        nowait: nextState.player 
      }
    default: return {};

  }
};

export const getNextState = (state, action) => {
  switch (action.type) {
    case 'start': return {};
    case 'game': return {
      ...state,
      game: action.data,
    };
    case 'player': return {
      ...state,
      players: setPlayers(state.game, action.data),
    };
    case 'play': return {
      ...state,
      gameState: action.data,
    };
    default: return state;
  }
};

const setPlayers = (game, firstPlayer) => {
    if (game === 0) {
      return {
        first: 'human',
        second: 'human',
      };
    } else if (game === 1 && firstPlayer === 0) {
      return {
        first: 'human',
        second: 'computer',
      };
    } else if (game === 1 && firstPlayer === 1) {
      return {
        first: 'computer',
        second: 'human',
      };
    }
  return {
    first: 'computer',
    second: 'computer',
  };
}
