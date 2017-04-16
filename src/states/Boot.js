import Phaser from 'phaser';
import WebFont from 'webfontloader';

export default class BootState extends Phaser.State {
    init() {
        this.stage.backgroundColor = '#EDEEC9';
        this.fontsReady = false;
        this.fontsLoaded = this.fontsLoaded.bind(this);

        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    }

    preload() {
        WebFont.load({
            google: {
                families: ['Russo One']
            },
            active: this.fontsLoaded
        });

        let text = this.add.text(this.world.centerX, this.world.centerY, 'loading fonts', {
            font: '16px Arial',
            fill: '#dddddd',
            align: 'center'
        });
        text.anchor.setTo(0.5, 0.5);

        // this.load.image('loaderBg', './assets/images/loader-bg.png')
        this.load.image('loaderBar', './assets/images/loaderBar.png');
    }

    render() {
        if (this.fontsReady) {
            this.state.start('Splash');
        }
    }

    fontsLoaded() {
        this.fontsReady = true;
    }
}

