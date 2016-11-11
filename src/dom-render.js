export default class DOMRenderer {
  constructor(context) {
    this.$ = context;
  }
  renderBoard(html) {
    this.$('.board').html(html);
  }
}
