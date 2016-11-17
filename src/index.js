import $ from 'jquery';
import DOMRenderer from './dom';
import Controller from './controller';

const dom = new DOMRenderer($);
const controller = new Controller(dom);
controller.execute();
