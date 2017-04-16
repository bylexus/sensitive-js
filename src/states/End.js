import Phaser from 'phaser';

export default class EndState extends Phaser.State {
    init() {
        this.stage.backgroundColor = "#000";
    }

    preload() {
    }

    create() {
        let fontProps = {
            font: 'Russo One',
            fontSize: '80px',
            fill: '#fff',
            shadowColor: '#333',
            shadowBlur: 3,
            shadowOffsetX: 3,
            shadowOffsetY: 3,
            shadowFill: true
        };
        let stageText = this.add.text(this.world.centerX, this.world.centerY, 'THE END', fontProps);
        stageText.anchor.setTo(0.5);
    }
}

