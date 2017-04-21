import Phaser from 'phaser';
import config from '../config';
import { storePlayedLevel } from '../utils';

class GameState extends Phaser.State {
    init(levelInfo) {
        this.stage.backgroundColor = "#22f";
        this.physics.startSystem(Phaser.Physics.ARCADE);

        this.keysEnabled = true;
        this.gameState = 'running';

        this.levelInfo = levelInfo;
        this.actLevel = this.levelInfo.levels[this.levelInfo.levelIndex];
    }

    preload() {
        this.load.tilemap('level-map', this.actLevel.data, null, Phaser.Tilemap.TILED_JSON);
    }

    setPlayerToTopLeftOfTile(tile) {
        this.player.body.x = tile.x;
        this.player.body.y = tile.y;
    }

    create() {
        this.camera.flash('#000',300);

        // BG tiled sprite
        let bgWidth = Math.max(this.world.width, this.world.height) * 1.3;
        this.bgTile = this.add.tileSprite(0, 0, bgWidth, bgWidth, 'galaxy-bg');
        this.bgTile.anchor.set(0.5);
        this.bgTile.x = this.world.width / 2;
        this.bgTile.y = this.world.height / 2;

        // Top info: banner, time, level
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

        this.levelText = this.add.text(this.world.width, 20, 'Level: ' + this.actLevel.id, {
            font: 'Courier',
            fontSize: 15,
            smoothed: false,
            fill: '#fff'
        });
        this.levelText.anchor.set(1, 0);

        this.timeText = this.add.text(this.world.width, 40, 'Time: 0:00', {
            font: 'Courier',
            fontSize: 15,
            smoothed: false,
            fill: '#fff'
        });
        this.timeText.anchor.set(1, 0);

        this.teleportInfoText = this.add.text(20, 65, 'Press -space/tap- to teleport', {
            font: 'Courier',
            fontSize: 18,
            fill: '#fff',
            shadowColor: '#333',
            shadowBlur: 3,
            shadowOffsetX: 1,
            shadowOffsetY: 1,
            shadowFill: true
        });
        this.add.tween(this.teleportInfoText).to({
            alpha: 0
        }, 350, null, true, 0, -1, true);


        this.map = this.add.tilemap('level-map');
        this.bricks = this.add.group();
        this.sprites = this.add.group();

        // Create solid bricks:
        this.createBrickTilesFromTilemap(this.map, this.bricks);

        // create target sprite:
        this.map.createFromObjects('sprites', 'target', 'target', undefined, true, false, this.sprites);
        this.target = this.sprites.getByName('target');
        this.target.animations.add('glow', [0, 1, 2, 3, 4, 5, 6, 7, 8, 7, 6, 5, 4, 3, 2, 1], 12, true, true);
        this.target.animations.play('glow');

        // create player sprite:
        this.map.createFromObjects('sprites', 'player', 'player', undefined, true, false, this.sprites);
        this.player = this.sprites.getByName('player');
        this.playerDir = Phaser.NONE;

        this.physics.arcade.enable([this.player, this.bricks, this.target]);
        this.player.body.collideWorldBounds = true;

        // enable keyboard controls:
        this.cursors = this.input.keyboard.createCursorKeys();
        this.spaceBar = this.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);

        // Show start text animation
        this.showStartTextAnim();

        // Save start time
        this.startTime = new Date().getTime();
    }

    showBgDim(duration, after) {
        // background dim
        let bg = this.add.graphics(0, 0);
        let bgTween = this.add.tween(bg);

        bg.alpha = 0.7;
        bg.beginFill('#000');
        bg.drawRect(0, 0, this.world.width, this.world.height);
        bg.endFill();

        bgTween
            .to({
                alpha: 0
            }, duration)
            .delay(after)
            .onComplete.addOnce(bg.destroy, bg);
        bgTween.start();
    }

    showStartTextAnim() {

        this.showBgDim(300, 1800);

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
        let stageText = this.add.text(0, this.world.centerY, 'STAGE ' + this.actLevel.id, fontProps);
        stageText.anchor.setTo(0.5, 1);
        stageText.alpha = 0;

        let readyText = this.add.text(this.world.width, this.world.centerY + 90, 'Get Ready!', fontProps);
        readyText.anchor.setTo(0.5, 1);
        readyText.alpha = 0;

        let onTweenStageText = this.add.tween(stageText);
        let onTweenReadyText = this.add.tween(readyText);

        onTweenStageText
            .to({
                alpha: 1,
                x: this.world.centerX
            }, 300)
            .to({
                alpha: 0,
                x: 0
            }, 300)
            .delay(1500, 1)
            .onComplete.addOnce(() => {
                stageText.destroy();
            });
        onTweenStageText.start();

        onTweenReadyText
            .to({
                alpha: 1,
                x: this.world.centerX
            }, 300)
            .to({
                alpha: 0,
                x: this.world.width
            }, 300)
            .delay(1500, 1)
            .onComplete.addOnce(() => {
                readyText.destroy();
            });
        onTweenReadyText.start();

    }

    showLooseAnim() {
        this.showBgDim(300, 2800);
        let text = this.add.text(this.world.centerX, this.world.centerY + 50, 'Oh No!\nYou loose.\nTry Again!', {
            font: 'Russo One',
            fontSize: '80px',
            fill: '#f88',
            align: 'center',
            shadowColor: '#333',
            shadowBlur: 2,
            shadowOffsetX: 5,
            shadowOffsetY: 5,
            shadowFill: true
        });
        let onTween = this.add.tween(text);

        text.alpha = 0;
        text.anchor.setTo(0.5, 0.5);
        onTween
            .to({
                alpha: 1,
                y: this.world.centerY
            }, 300)
            .to({
                alpha: 0,
                y: this.world.centerY + 50
            }, 300)
            .delay(2500, 1)
            .onComplete.addOnce(() => {
                text.destroy();
            });
        return onTween.start();
    }

    showSuccessAnim() {
        this.showBgDim(300, 2800);
        let text = this.add.text(this.world.centerX, this.world.centerY + 50, 'You got it!', {
            font: 'Russo One',
            fontSize: '80px',
            fill: '#8f8',
            align: 'center',
            shadowColor: '#333',
            shadowBlur: 2,
            shadowOffsetX: 5,
            shadowOffsetY: 5,
            shadowFill: true
        });
        let onTween = this.add.tween(text);

        text.alpha = 0;
        text.anchor.setTo(0.5, 0.5);
        onTween
            .to({
                alpha: 1,
                y: this.world.centerY
            }, 300)
            .to({
                alpha: 0,
                y: this.world.centerY + 50
            }, 300)
            .delay(2500, 1)
            .onComplete.addOnce(() => {
                text.destroy();
            });
        return onTween.start();

    }
    createBrickTilesFromTilemap(tilemap, group) {
        // Solid grays:
        tilemap.createFromTiles([1], null, 'gray-1', 'bricks', group, {
            alive: false
        });

        // normal explodes:
        tilemap.createFromTiles([3], null, 'normal', 'bricks', group, {
            removeDelay: config.tileDestroyDelay
        });

        // horizontal traversal:
        tilemap.createFromTiles([6], null, 'horizontal', 'bricks', group, {
            alive: false,
            traversal: 'horizontal'
        });

        // vertical traversal:
        tilemap.createFromTiles([7], null, 'vertical', 'bricks', group, {
            alive: false,
            traversal: 'vertical'
        });

        // 2times explodes:
        tilemap.createFromTiles([4], null, '2times', 'bricks', group, {
            changeDelay: config.tileDestroyDelay
        });
        group
            .filter(child => {
                return child.key === '2times';
            })
            .list.forEach(sprite => {
                sprite.animations.add('scroll');
                sprite.animations.play('scroll', 12, true);
            });

        // teleports:
        tilemap.createFromObjects('sprites', 'teleport', 'teleport', undefined, true, false, group);
        group
            .filter(child => {
                return child.name === 'teleport';
            })
            .list.forEach(sprite => {
                sprite.alive = false;
                sprite.animations.add('blink');
                sprite.animations.play('blink', 2, true);
            });
    }

    findBrickAt(x, y, brickGroup) {
        for (let i = 0; i < brickGroup.children.length; i++) {
            let child = brickGroup.children[i];
            if (child.getBounds().contains(x, y)) {
                return child;
            }
        }
        return null;
    }

    update() {
        this.animateBG();
        this.updateTime();
        this.checkTargetReached();
        let brickUnderPlayer = this.findBrickAt(this.player.centerX, this.player.centerY, this.bricks);
        this.actTile = brickUnderPlayer;
        if (!this.actTile && this.player.alive) {
            this.playerDies();
        }
        this.updatePlayerMovement();
        this.updateTeleportText();
        this.checkInput();
    }

    animateBG() {
        this.bgTile.tilePosition.x -= 0.2;
        this.bgTile.tilePosition.y += 0.05;
        this.bgTile.angle += 0.01;
    }

    updateTime() {
        let time = (new Date().getTime() - this.startTime) / 1000;
        let min = String('00' + Math.floor(time / 60)).slice(-2);
        let sec = String('00' + Math.floor(time % 60)).slice(-2);
        this.timeText.text = `Time: ${min}:${sec}`;
    }

    updateTeleportText() {
        if (this.actTile) {
            this.teleportInfoText.visible = this.actTile.teleportNr > 0;
        }
    }


    updatePlayerMovement() {
        if (this.player.alive !== true) {
            this.stopPlayerMovement();
            return;
        }
        let onTile = this.actTile;
        if (onTile && onTile !== this.prevTile) {

            // initiate tile explosion sequence for single tiles:
            if (onTile.removeDelay > 0 && onTile.stage !== 'removeDelay') {
                onTile.stage = 'removeDelay';
                this.time.events.add(onTile.removeDelay, this.destroyTileSprite.bind(this, onTile));
            }

            // initiate change delay for 2-times bricks: change to a normal tile after the delay:
            if (onTile.changeDelay > 0 && onTile.stage !== 'changeDelay') {
                onTile.stage = 'changeDelay';
                this.time.events.add(onTile.changeDelay, () => {
                    // after first delay time is over, make it to a normal stone.
                    // If the player still is on that tile, initiate the "death sequence" here:
                    onTile.stage = null;
                    onTile.removeDelay = onTile.changeDelay;
                    onTile.changeDelay = 0;
                    onTile.animations.stop('scroll');
                    if (onTile.getBounds().contains(this.player.centerX, this.player.centerY)) {
                        onTile.stage = 'removeDelay';
                        this.time.events.add(onTile.removeDelay, this.destroyTileSprite.bind(this, onTile));
                    }
                });
            }

            // Check special stones:
            // Horizontal Traversal: last stone must be on same col:
            if (onTile.traversal === 'horizontal' && this.prevTile.y !== onTile.y) {
                this.setPlayerToTopLeftOfTile(this.prevTile);
            }
            // vertical Traversal: last stone must be on same row:
            if (onTile.traversal === 'vertical' && this.prevTile.x !== onTile.x) {
                this.setPlayerToTopLeftOfTile(this.prevTile);
            }

            // check if we are in transition to the next brick: If so, we stop when we reach the center of the
            // new brick:
            let centerTileX = onTile.centerX;
            let centerTileY = onTile.centerY;
            let downKey = null;
            if (this.playerDir === Phaser.RIGHT) {
                downKey = this.cursors.right;
                if (this.player.centerX >= centerTileX) {
                    this.prevTile = onTile;
                    this.stopPlayerMovement();
                }
            }
            if (this.playerDir === Phaser.LEFT) {
                downKey = this.cursors.left;
                if (this.player.centerX <= centerTileX) {
                    this.prevTile = onTile;
                    this.stopPlayerMovement();
                }
            }
            if (this.playerDir === Phaser.DOWN) {
                downKey = this.cursors.down;
                if (this.player.centerY >= centerTileY) {
                    this.prevTile = onTile;
                    this.stopPlayerMovement();
                }
            }
            if (this.playerDir === Phaser.UP) {
                downKey = this.cursors.up;
                if (this.player.centerY <= centerTileY) {
                    this.prevTile = onTile;
                    this.stopPlayerMovement();
                }
            }

            // Only reset the player to the center if the actual direction's
            // down key is not hold (prevents player flickering forth and back)
            if (this.playerDir === Phaser.NONE && (!downKey || !downKey.isDown)) {
                this.setPlayerToTopLeftOfTile(onTile);
            }
        }
    }

    findTeleportPeer(origSprite, group) {
        let peerNr = origSprite.teleportTo;
        if (peerNr) {
            let peers = group
                .filter(child => {
                    return origSprite !== child && child.teleportNr === peerNr;
                });
            if (peers.list.length > 0) {
                return peers.list[0];
            }
        }
        return null;
    }

    checkTargetReached() {
        if (this.gameState === 'running') {
            if (this.target.getBounds().contains(this.player.centerX, this.player.centerY)) {
                // check if all bricks are gone:
                if (this.bricks.countLiving() === 0) {
                    this.initiateSuccessSequence();
                }
            }
        }
    }

    stopPlayerMovement() {
            this.player.body.velocity.x = 0;
            this.player.body.velocity.y = 0;
            this.playerDir = Phaser.NONE;

        }
        //
    checkInput() {
        if (this.player.alive !== true) {
            return;
        }
        if (!this.keysEnabled) {
            return;
        }
        // Teleports: transport player to the matching pair teleport:
        if (this.actTile.teleportNr && this.spaceBar.justDown) {
            let peer = this.findTeleportPeer(this.actTile, this.bricks);
            if (peer) {
                let offTween = this.add.tween(this.player);
                let onTween = this.add.tween(this.player);

                // teleport animation
                onTween.to({
                    alpha: 1
                }, 200);
                offTween
                    .to({
                        alpha: 0
                    }, 200)
                    .onComplete.addOnce(() => {
                        this.stopPlayerMovement();
                        this.setPlayerToTopLeftOfTile(peer);
                        this.actTile = peer;
                        onTween.start();
                    }, this);
                offTween.start();
            }
        }

        // decide how to move - but can only be done if not in an actual movement:
        if (this.playerDir === Phaser.NONE) {
            if (this.cursors.right.isDown) {
                if (!this.actTile.traversal || (this.actTile.traversal === 'horizontal')) {
                    this.player.body.velocity.x = config.playerSpeed;
                    this.player.body.velocity.y = 0;
                    this.playerDir = Phaser.RIGHT;
                }
            }
            if (this.cursors.left.isDown) {
                if (!this.actTile.traversal || (this.actTile.traversal === 'horizontal')) {
                    this.player.body.velocity.x = -1 * config.playerSpeed;
                    this.player.body.velocity.y = 0;
                    this.playerDir = Phaser.LEFT;
                }
            }
            if (this.cursors.up.isDown) {
                if (!this.actTile.traversal || (this.actTile.traversal === 'vertical')) {
                    this.player.body.velocity.x = 0;
                    this.player.body.velocity.y = -1 * config.playerSpeed;
                    this.playerDir = Phaser.UP;
                }
            }
            if (this.cursors.down.isDown) {
                if (!this.actTile.traversal || (this.actTile.traversal === 'vertical')) {
                    this.player.body.velocity.x = 0;
                    this.player.body.velocity.y = config.playerSpeed;
                    this.playerDir = Phaser.DOWN;
                }
            }
        }
    }

    destroyTileSprite(tile) {
        if (tile.getBounds().contains(this.player.centerX, this.player.centerY)) {
            this.playerDies();
        }
        this.playExplosionAt(tile.centerX, tile.centerY);
        tile.alive = false;
        tile.destroy();
    }

    playerDies() {
        if (this.gameState === 'failed') {
            return;
        }
        this.player.alive = false;
        this.player.visible = false;
        this.keysEnabled = false;
        this.gameState = 'failed';
        this.playExplosionAt(this.player.centerX, this.player.centerY);
        this.showLooseAnim().onComplete.add(this.restartLevel, this);
        this.camera.shake(0.01,400);
    }

    initiateSuccessSequence() {
        this.keysEnabled = false;
        this.gameState = 'success';
        this.showSuccessAnim().onComplete.addOnce(() => {
            this.initiateNextLevel();
        });
    }

    restartLevel() {
        this.state.start(this.state.current, true, false, this.levelInfo);
    }

    initiateNextLevel() {
        if (this.levelInfo.levelIndex+1 >= this.levelInfo.levels.length) {
            this.state.start('End');
        } else {
            this.levelInfo.levelIndex++;
            storePlayedLevel(this.levelInfo.difficulty,this.levelInfo.levels[this.levelInfo.levelIndex].id);
            this.state.start(this.state.current, true, false, this.levelInfo);
        }
    }

    playExplosionAt(x, y) {
        let expl = this.add.sprite(x, y, 'explosion-1');
        expl.anchor.set(0.5);
        expl.animations.add('explode');
        return expl.animations.play('explode', 25, 25, false, true);
    }
}

export default GameState;

