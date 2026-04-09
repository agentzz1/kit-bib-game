import { BootScene } from './scenes/BootScene.js';
import { MenuScene } from './scenes/MenuScene.js';
import { OfficeScene } from './scenes/OfficeScene.js';
import { UIScene } from './scenes/UIScene.js';
import { CameraScene } from './scenes/CameraScene.js';
import { GameOverScene } from './scenes/GameOverScene.js';
import { VictoryScene, PostCreditsScene } from './scenes/VictoryScene.js';

const config = {
    type: Phaser.AUTO,
    width: 1280,
    height: 720,
    parent: 'game-container',
    pixelArt: true,
    backgroundColor: '#000',
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    },
    scene: [BootScene, MenuScene, OfficeScene, UIScene, CameraScene, GameOverScene, VictoryScene, PostCreditsScene]
};

const game = new Phaser.Game(config);