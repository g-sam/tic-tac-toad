export default class DOMRenderer {
  constructor(context) {
    this.$ = context;
  }
  static getBoardHTML(boardData) {
    return `<table>
  <tbody>${boardData.map((el, idx) => `\
    ${idx % 3 === 0 ? '\n   <tr>' : ''}
    <td>${el}</td>\
    ${idx % 3 === 2 ? '\n   </tr>' : ''}`)
    .join('')}
  </tbody>
</table>`;
  }
  renderBoard(boardData) {
    this.$('.board')
      .html(DOMRenderer.getBoardHTML(boardData));
  }
  renderOptions(optionData) {
    this.$('.buttons').append(`<h4>${optionData.title}</h4>`);
    optionData.options.forEach(({ text, clickHandler }) =>
        this.$('<button>')
        .text(text)
        .click(clickHandler)
        .appendTo('.buttons'));
  }
}
