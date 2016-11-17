import * as fromBoard from './board';

export { getEmptyBoard } from './board';

export const getToken = (player) => {
  if (player === 1) return 'x';
  if (player === 2) return 'o';
  return '';
};

export const getBoardTokens = board =>
  board.map(player => ({ text: getToken(player) }));

export const bindBoard = (boardTokens, resolve, getArg) =>
  boardTokens
    .map((token, idx) => (!token.text.length ? ({
      ...token,
      clickHandler: resolve.bind(null, getArg(idx)),
    }) : token));

export const getBoardData = (player, resolve, board) =>
  bindBoard(
    getBoardTokens(board),
    resolve,
    fromBoard.movePlayerToIndex(board, player),
  );

export const getOptionsFor = (type) => {
  if (type === 'game') {
    return {
      title: 'Select game type',
      options: [
        { text: 'Human vs. human' },
        { text: 'Computer vs. human' },
        { text: 'Computer vs. computer' },
      ],
    };
  }
  if (type === 'player') {
    return {
      title: 'Choose who goes first',
      options: [
        { text: 'Me!!!' },
        { text: 'Computer' },
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


export const getOptionsData = (type, resolve, oldOptions) =>
  bindOptions(
    getOptionsFor(type),
    resolve,
    getResolveArg(type, oldOptions),
  );

