import { GlobalState } from '../GlobalState.js';

export class VictoryScene extends Phaser.Scene {
    constructor() {
        super({ key: 'VictoryScene' });
    }

    create() {
        this.cameras.main.setBackgroundColor('#000000');
        
        this.add.text(640, 200, '🎉 HERZLICHEN GLÜCKWUNSCH! 🎉', {
            fontSize: '48px', fill: '#00ff00', fontFamily: 'Courier New'
        }).setOrigin(0.5);

        this.add.text(640, 320, 'Du hast alle 3 Nächte überlebt!', {
            fontSize: '28px', fill: '#ffffff', fontFamily: 'Courier New'
        }).setOrigin(0.5);

        this.add.text(640, 400, 'Deine Bachelorarbeit ist fertig.\n\nDer Koffein-Zombie hat dich nie erwischt.\nDas Eduroam ist稳定 geblieben.\nDie Bibliothekarin war ruhig.', {
            fontSize: '18px', fill: '#aaaaaa', fontFamily: 'Courier New', align: 'center'
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