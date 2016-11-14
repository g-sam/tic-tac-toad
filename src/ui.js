import * as board from './board';

export function getToken(datum) {
  if (datum === 0) return '';
  if (datum === 1) return 'x';
  return 'o';
}

export const renderBoardHTML = boardData =>
`<table>
  <tbody>${boardData.map((el, idx) => `\
    ${idx % 3 === 0 ? '\n   <tr>' : ''}
    <td>${el}</td>\
    ${idx % 3 === 2 ? '\n   </tr>' : ''}`)
    .join('')}
  </tbody>
</table>`;

export const renderEmptyBoardHTML = () =>
renderBoardHTML(board.getEmptyBoard().map(getToken));

const getOptions = () => ({
  title: 'Select game type',
  options: [
    { text: 'Human vs. human' },
    { text: 'Computer vs. human' },
    { text: 'Computer vs. computer' },
  ],
});

export const bindOptions = (optionObj, awaitSelection) => ({
  ...optionObj,
  options: optionObj.options.map((option, idx) => ({
    ...option,
    clickHandler: () =>
      awaitSelection.then((() => idx).bind(null, idx)),
  })),
});

export const getGameTypeOptions = awaitSelection =>
  bindOptions(
    getOptions(),
    awaitSelection,
  );

