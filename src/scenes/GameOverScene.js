import { GlobalState } from '../GlobalState.js';

export class GameOverScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameOverScene' });
    }

    create(data) {
        this.cameras.main.setBackgroundColor('#000000');
        
        this.add.text(640, 280, 'GAME OVER', {
            fontSize: '64px', fill: '#ff0000', fontFamily: 'Courier New'
        }).setOrigin(0.5);

        this.add.text(640, 380, data?.reason || 'Du hast überlebt... nicht.', {
            fontSize: '24px', fill: '#ffffff', fontFamily: 'Courier New'
        }).setOrigin(0.5);

        this.add.text(640, 480, `Nacht: ${GlobalState.currentNight}`, {
            fontSize: '20px', fill: '#00ff00', fontFamily: 'Courier New'
        }).setOrigin(0.5);

        this.add.text(640, 550, 'Klicke für neues Spiel', {
            fontSize: '18px', fill: '#666666', fontFamily: 'Courier New'
        }).setOrigin(0.5);

        this.input.once('pointerdown', () => {
            GlobalState.currentNight = 1;
            GlobalState.coffeeLevel = 100;
            GlobalState.laptopBattery = 100;
            GlobalState.currentTime = 0;
            this.scene.start('MenuScene');
        });
    }
}