export const renderBoard = board =>
`<table>
  <tbody>${board.map((el, idx) => `\
    ${idx % 3 === 0 ? '\n   <tr>' : ''}
    <td>${el}</td>\
    ${idx % 3 === 2 ? '\n   </tr>' : ''}`)
    .join('')}
  </tbody>
</table>`;
