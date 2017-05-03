import Phaser from 'phaser';
import GameState from './states/Game';
import BootState from './states/Boot';
import SplashState from './states/Splash';
import TitleState from './states/Title';
import SelectState from './states/Select';
import EndState from './states/End';
import config from './config';

class Game extends Phaser.Game {
    constructor() {
        const docElement = document.documentElement;
        const width = docElement.clientWidth > config.gameWidth ? config.gameWidth : docElement.clientWidth;
        const height = docElement.clientHeight > config.gameHeight ? config.gameHeight : docElement.clientHeight;

        super(width, height, Phaser.AUTO, '', null);

        this.state.add('Boot', BootState, false);
        this.state.add('Splash', SplashState, false);
        this.state.add('Title', TitleState, false);
        this.state.add('Select', SelectState, false);
        this.state.add('Game', GameState, false);
        this.state.add('End', EndState, false);

        this.state.start('Boot');
    }
}

export default new Game();
