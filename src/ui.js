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
  const computerMove = getBestMove(board, player);
  resolve(nextBoard(board, player)(computerMove));
  return getBoardTokens(board);
};

export const prevTurnIsWinner = ({ player, board }) =>
  fromBoard.isWinner(board, fromBoard.switchPlayer(player));

export const getOptionsFor = (type, oldOptions) => {
  if (type === 'game') {
    return {
      title: 'Select game type',
      options: [
        { text: 'Human vs. human' },
        { text: 'Computer vs. human' },
        { text: 'Computer vs. computer' },
      ],
    };
  } else if (type === 'player') {
    return {
      title: 'Choose who goes first',
      options: [
        { text: 'Me!!!' },
        { text: 'Computer' },
      ],
    };
  } else if (type === 'ready') {
    return {
      title: [
        'human vs. human',
        'computer vs. human',
        'computer vs. computer',
      ][oldOptions.game],
      options: [],
    };
  } else if (type === 'restart') {
    return {
      title: `${getToken(fromBoard.switchPlayer(oldOptions.player))} wins!`,
      options: [
        { text: 'Play again' },
      ],
    };
  }
  return {
    title: '',
    options: [],
  };
};

export const getResolveArg = (type, oldOptions) => idx => ({
  ...oldOptions,
  [type]: idx,
});

export const bindOptions = (optionObj, resolve, getArg) => ({
  ...optionObj,
  options: optionObj.options.map((option, idx) => ({
    ...option,
    clickHandler: resolve.bind(null, getArg(idx)),
  })),
});


export const getOptionsData = (type, resolve, oldOptions) => {
  if (type === 'player') {
    if (oldOptions.game !== 1) {
      resolve(oldOptions);
      return getOptionsFor();
    }
  } else if (type === 'ready') {
    resolve(oldOptions);
    return getOptionsFor(type, oldOptions);
  }
  return bindOptions(
    getOptionsFor(type, oldOptions),
    resolve,
    getResolveArg(type, oldOptions),
  );
};
