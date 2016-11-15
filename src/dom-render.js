export default class DOMRenderer {
  constructor(context) {
    this.$ = context;
  }
  renderBoard(html) {
    this.$('.board').html(html);
  }
  renderOptions(options) {
    options.forEach(({ text, clickHandler }) =>
        this.$('<button>')
        .text(text)
        .click(clickHandler)
        .appendTo('.buttons'));
  }
}
