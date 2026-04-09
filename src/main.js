import { BootScene } from './scenes/BootScene.js';
import { MenuScene } from './scenes/MenuScene.js';
import { OfficeScene } from './scenes/OfficeScene.js';
import { CameraScene } from './scenes/CameraScene.js';
import { GameOverScene } from './scenes/GameOverScene.js';
import { VictoryScene } from './scenes/VictoryScene.js';

const config = {
    type: Phaser.AUTO,
    width: 1280,
    height: 720,
    parent: 'game-container',
    backgroundColor: '#000',
    scene: [BootScene, MenuScene, OfficeScene, CameraScene, GameOverScene, VictoryScene]
};

const game = new Phaser.Game(config);