import Phaser from 'phaser';
import {
    centerGameObjects
} from '../utils';

export default class SplashState extends Phaser.State {
    init() {
        this.stage.backgroundColor = "#f22";
    }

    preload() {
        // this.loaderBg = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBg')
        this.loaderBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBar');
        centerGameObjects([this.loaderBar]);

        this.load.setPreloadSprite(this.loaderBar);
        //
        // load your assets
        //
        this.load.image('tiles', 'assets/bricks/tiles.png');
        this.load.image('player', './assets/bricks/002_player-40.png');
        this.load.image('gray-1', './assets/bricks/001_gray-1.png');
        this.load.image('normal', './assets/bricks/003_brick-normal.png');
        this.load.image('horizontal', './assets/bricks/006_brick-horizontal.png');
        this.load.image('vertical', './assets/bricks/007_brick-vertical.png');

        this.load.spritesheet('explosion-1', './assets/images/explosion_transparent.png',64,64);
        this.load.spritesheet('2times', './assets/bricks/004_brick-2times.png',40,40);
        this.load.spritesheet('target', './assets/bricks/005_brick-target.png',40,40);
        this.load.spritesheet('teleport', './assets/bricks/008_brick-teleport.png',40,40);
        this.load.spritesheet('level_chooser', './assets/images/level_chooser.png',80,80);

        // BG
        this.load.image('galaxy-bg', 'assets/images/galaxy-1.jpg');
        this.load.image('galaxy2-bg', 'assets/images/galaxy-2.jpg');

        this.load.json('levelinfo', 'assets/levels/info.json');
    }

    create() {
        // let levels = this.cache.getJSON('levelinfo');
        // let normalLevels = levels.normal;
        // this.state.start('Game',true,false,{
        //     levels: normalLevels,
        //     levelIndex: 0
        // });
            //
            //
        this.state.start('Select',true,false,'normal');
    }
}

