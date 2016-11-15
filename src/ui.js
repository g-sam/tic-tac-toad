import * as fromBoard from './board';

export const getToken = (player) => {
  if (player === 1) return 'x';
  if (player === 2) return 'o';
  return '';
};

export const getBoardData = (board = fromBoard.getEmptyBoard()) =>
  board.map(getToken);

const getOptions = () => ({
  title: 'Select game type',
  options: [
    { text: 'Human vs. human' },
    { text: 'Computer vs. human' },
    { text: 'Computer vs. computer' },
  ],
});

export const bindOptions = (optionObj, resolve) => ({
  ...optionObj,
  options: optionObj.options.map((option, idx) => ({
    ...option,
    clickHandler: resolve.bind(null, idx),
  })),
});

export const getGameTypeOptions = resolve =>
  bindOptions(
    getOptions(),
    resolve,
  );

