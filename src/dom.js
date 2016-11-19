export default class DOMRenderer {
  constructor(context) {
    this.$ = context;
  }
  static getBoardHTML(boardData) {
    return `<table>
  <tbody>${boardData.map(({ text }, idx) => `\
    ${idx % 3 === 0 ? '\n   <tr>' : ''}
    <td><div>${text}</div></td>\
    ${idx % 3 === 2 ? '\n   </tr>' : ''}`)
    .join('')}
  </tbody>
</table>`;
  }
  renderBoard(boardData) {
    this.$('.board')
      .html(DOMRenderer.getBoardHTML(boardData));
    boardData.forEach(({ clickHandler }, idx) => {
      if (clickHandler) {
        this.$('.board td').eq(idx)
          .click(clickHandler)
          .addClass('clickable');
      }
    });
  }
  renderOptions(optionData) {
    this.$('.buttons').html(`<h4>${optionData.title}</h4>`);
    optionData.options.forEach(({ text, clickHandler }) =>
        this.$('<button>')
        .text(text)
        .click(clickHandler)
        .appendTo('.buttons'));
  }
}
