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
