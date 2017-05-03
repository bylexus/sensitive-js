import Phaser from 'phaser';

export default class TitleState extends Phaser.State {
    create() {
        this.camera.flash('#000', 300);

        // BG tiled sprite
        let bgWidth = Math.max(this.world.width, this.world.height) * 1.3;
        this.bgTile = this.add.tileSprite(0, 0, bgWidth, bgWidth, 'galaxy2-bg');

        // Top info: banner
        const bannerText = 'S E N S I T I V E';
        this.titleText = this.add.text(this.world.centerX, 20, bannerText, {
            font: 'Russo One',
            fontSize: 40,
            fill: '#fcee83',
            shadowColor: '#fff',
            shadowBlur: 0,
            shadowOffsetX: 0,
            shadowOffsetY: 0,
            shadowFill: true
        });
        this.titleText.anchor.set(0.5, 0);
        this.add.tween(this.titleText).to({
            shadowBlur: 10
        }, 1000, Phaser.Easing.Quadratic.InOut, true, 0, -1, true);

        this.copyright = this.add.text(this.world.centerX, 70, 'Ⓒ 1991 Oliver Kirwa\nRemake by alexi.ch', {
            fontSize: 20,
            fill: '#fff'
        });
        this.copyright.anchor.set(0.5,0);


        let easyBtn = this.add.button(this.world.centerX - 10, this.world.centerY, 'difficulty_level_btn', btn => {
            this.startLevelChooser('easy');
        }, this, 1, 0, 0, 1);
        easyBtn.anchor.set(1, 0);

        let normalBtn = this.add.button(this.world.centerX + 10, this.world.centerY, 'difficulty_level_btn', btn => {
            this.startLevelChooser('normal');
        }, this, 3, 2, 2, 3);
        normalBtn.anchor.set(0, 0);
    }

    update() {
        this.animateBG();
    }

    animateBG() {
        // move BG 20 px / s
        this.bgTile.tilePosition.y += this.time.elapsedMS * 0.02;
    }

    startLevelChooser(difficulty) {
        this.camera.fade('#f00', 500);
        this.camera.onFadeComplete.addOnce(() => {
            this.state.start('Select', true, false, difficulty);
        });

    }

}

