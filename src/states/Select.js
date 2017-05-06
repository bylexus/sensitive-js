import Phaser from 'phaser';
import {
    loadPlayedLevels,
    storePlayedLevel
} from '../utils';

export default class SelectState extends Phaser.State {
    init(difficulty) {
        this.stage.backgroundColor = "#000";
        this.difficulty = difficulty;

        this.levelBoxWidth = 80;

    }

    preload() {}

    create() {
        this.camera.flash('#000', 300);

        // BG tiled sprite
        let bgWidth = Math.max(this.world.width, this.world.height) * 1.3;
        this.bgTile = this.add.tileSprite(0, 0, bgWidth, bgWidth, 'galaxy2-bg');

        let levels = this.cache.getJSON('levelinfo');
        let levelArr = levels[this.difficulty];
        let levelGroup = this.add.group();

        // Back button:
        this.add.button(5, 20, 'back_btn', btn => {
            this.backToTitleScreen();
        }, this, 0, 1, 1, 0);

        // Top info: banner
        const bannerText = 'S E N S I T I V E';
        this.add.text(50, 20, bannerText, {
            font: 'Russo One',
            fontSize: 40,
            fill: '#fcee83',
            shadowColor: '#ccc',
            shadowBlur: 5,
            shadowOffsetX: 3,
            shadowOffsetY: 3,
            shadowFill: true
        });

        // draw level select boxes
        let topMargin = 80;
        let nrOfLevelsPerScreen = 15;
        let nrOfLevels = Math.ceil(levelArr.length / nrOfLevelsPerScreen);
        let screenHeight = this.world.height - topMargin;
        let nrOfBoxesPerRow = Math.floor(this.world.width / (2 * this.levelBoxWidth));
        let playedLevels = loadPlayedLevels(this.difficulty, levelArr[0].id);

        levelGroup.y = topMargin;

        levelArr.forEach((levelInfo, index) => {
            let screenNr = Math.floor(index / nrOfLevelsPerScreen);
            let row = Math.floor(index / nrOfBoxesPerRow) % (nrOfLevelsPerScreen / nrOfBoxesPerRow);
            let col = index % nrOfBoxesPerRow;
            let screenOffsetY = screenNr * this.world.height;
            let x = 2 * this.levelBoxWidth * col + (this.levelBoxWidth / 2);
            let y = (this.levelBoxWidth * 1.5) * row + screenOffsetY;
            let button;

            if (playedLevels.indexOf(levelInfo.id) > -1) {
                // level already played, so available
                button = this.add.button(x, y, 'level_chooser', btn => {
                    this.initiateLevelStart(btn.levelIndex, levelArr);
                }, this, 1, 0, 0, 1, levelGroup);
            } else {
                // level not yet played, so not available:
                button = this.add.button(x, y, 'level_chooser', null, null, 2, 2, 2, 2, levelGroup);
                button.alive = false;
            }

            button.levelInfo = levelInfo;
            button.levelIndex = index;

            if (screenNr < (nrOfLevels - 1)) {
                // add down btn
                let downBtn = this.add.button(this.world.centerX,screenHeight - 5 + screenOffsetY,'down_btn', btn => {
                    this.add.tween(levelGroup).to({y: levelGroup.y - this.world.height},300,Phaser.Easing.Cubic.InOut,true);
                },this,1,0,0,1,levelGroup);
                downBtn.anchor.set(0.5,1);
            }
            if (screenNr > 0) {
                // add up btn
                let upBtn = this.add.button(this.world.centerX,screenHeight - 40 + screenOffsetY,'up_btn', btn => {
                    this.add.tween(levelGroup).to({y: levelGroup.y + this.world.height},300,Phaser.Easing.Cubic.InOut,true);
                },this,1,0,0,1,levelGroup);
                upBtn.anchor.set(0.5,1);
            }


            let fontProps = {
                font: 'Russo One',
                fontSize: '40px',
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
        // move BG 20 px / s
        this.bgTile.tilePosition.y += this.time.elapsedMS * 0.02;
    }

    initiateLevelStart(levelIndex, levelArr) {
        this.camera.fade('#f00', 350);
        storePlayedLevel(this.difficulty, levelArr[levelIndex].id);

        this.camera.onFadeComplete.addOnce(() => {
            this.state.start('Game', true, false, {
                levels: levelArr,
                levelIndex,
                difficulty: this.difficulty
            });
        });

    }

    backToTitleScreen() {
        this.camera.fade('#f00', 500);
        this.camera.onFadeComplete.addOnce(() => {
            this.state.start('Title', true, false);
        });
    }
}

