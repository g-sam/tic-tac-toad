export default class DOMRenderer {
  constructor(window, jquery) {
    this.window = window;
    this.$ = jquery;
  }
  static getBoardHTML(boardData) {
    const size = Math.sqrt(boardData.length);
    return `<table style="width: ${size * 80}px;">
  <tbody>${boardData.map(({ text }, idx) => `\
    ${idx % size === 0 ? '\n   <tr>' : ''}
    <td><div>${text}</div></td>\
    ${idx % size === size - 1 ? '\n   </tr>' : ''}`)
    .join('')}
  </tbody>
</table>`;
  }
  renderBoard(boardData) {
    if (!boardData) return this.$('.board').html('<h3>CONFIGURE</h3>');
    this.$('.board')
      .html(DOMRenderer.getBoardHTML(boardData));
    return boardData.forEach(({ clickHandler }, idx) => {
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
  delayedRender(render) {
    if (render) this.window.requestAnimationFrame(render);
  }
}
