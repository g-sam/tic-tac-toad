import * as fromBoard from './board';

export const getToken = (player) => {
  if (player === 1) return 'x';
  if (player === 2) return 'o';
  return '';
};

export const getBoardData = (board = fromBoard.getEmptyBoard()) =>
  board.map(getToken);

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
  return {};
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

