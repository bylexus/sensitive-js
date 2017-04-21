import Phaser from 'phaser';
import { loadPlayedLevels,storePlayedLevel }  from '../utils';

export default class SelectState extends Phaser.State {
    init(difficulty) {
        this.stage.backgroundColor = "#000";
        this.difficulty = difficulty;

        this.levelBoxWidth = 80;

    }

    preload() {}

    create() {
        // BG tiled sprite
        let bgWidth = Math.max(this.world.width, this.world.height) * 1.3;
        this.bgTile = this.add.tileSprite(0, 0, bgWidth, bgWidth, 'galaxy2-bg');

        let levels = this.cache.getJSON('levelinfo');
        let levelArr = levels[this.difficulty];
        let levelGroup = this.add.group();


        // Top info: banner
        const bannerText = 'S E N S I T I V E';
        this.add.text(20, 20, bannerText, {
            font: 'Russo One',
            fontSize: 40,
            fill: '#fcee83',
            shadowColor: '#ccc',
            shadowBlur: 5,
            shadowOffsetX: 3,
            shadowOffsetY: 3,
            shadowFill: true
        });

        levelGroup.y = 80;

        // draw level select boxes
        let nrOfBoxesPerRow = Math.floor(this.world.width / (2 * this.levelBoxWidth));
        let playedLevels = loadPlayedLevels(this.difficulty,levelArr[0].id);

        levelArr.forEach((levelInfo, index) => {
            let row = Math.floor(index / nrOfBoxesPerRow);
            let col = index % nrOfBoxesPerRow;

            let x = 2 * this.levelBoxWidth * col + (this.levelBoxWidth / 2);
            let y = (this.levelBoxWidth * 1.5) * row;
            let button;

            if (playedLevels.indexOf(levelInfo.id) > -1) {
                // level already played, so available
                button = this.add.button(x, y, 'level_chooser', btn => {
                    this.initiateLevelStart(btn.levelIndex, levelArr);
                }, this, 1, 0, 0, 1, levelGroup);
            } else {
                // level not yet played, so not available:
                button = this.add.button(x, y, 'level_chooser', null,null, 2,2,2,2, levelGroup);
                button.alive = false;
            }

            button.levelInfo = levelInfo;
            button.levelIndex = index;


            let fontProps = {
                font: 'Russo One',
                fontSize: '60px',
                fill: '#fff',
                shadowColor: '#333',
                shadowBlur: 3,
                shadowOffsetX: 3,
                shadowOffsetY: 3,
                shadowFill: true
            };
            let btnText = this.add.text(button.centerX, button.centerY, levelInfo.id, fontProps, levelGroup);
            btnText.anchor.set(0.5);
        });
    }

    update() {
        this.animateBG();
    }

    animateBG() {
        this.bgTile.tilePosition.y += 0.2;
    }

    initiateLevelStart(levelIndex, levelArr) {
        this.camera.fade('#f00',350);
        storePlayedLevel(this.difficulty,levelArr[levelIndex].id);

        this.camera.onFadeComplete.addOnce(() => {
            this.state.start('Game', true, false, {
                levels: levelArr,
                levelIndex,
                difficulty: this.difficulty
            });
        });

    }
}

