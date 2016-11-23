/* global window */
import $ from 'jquery';
import DOMRenderer from './dom';
import Controller from './controller';
import UI from './ui/';
import Game from './ui/game';
import Opts from './ui/options';
import Logic from './logic/';

const logic = new Logic();
const game = new Game(logic);
const opts = new Opts();
const ui = new UI(game, opts);
const dom = new DOMRenderer(window, $);
const controller = new Controller(dom, ui);

controller.render();
