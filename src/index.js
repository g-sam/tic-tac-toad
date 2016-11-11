import $ from 'jquery';
import DOMRenderer from './dom-render';
import * as ui from './ui';

const renderer = new DOMRenderer($);
renderer.renderBoard(ui.renderEmptyBoardHTML());
