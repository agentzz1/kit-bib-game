import { GlobalState } from '../GlobalState.js';

export class OfficeScene extends Phaser.Scene {
    constructor() {
        super({ key: 'OfficeScene' });
    }

    create() {
        this.cameras.main.setBackgroundColor('#111111');

        this.add.text(640, 100, 'KIT BIB - OFFICE', {
            fontSize: '32px', fill: '#00ff00', fontFamily: 'Courier New'
        }).setOrigin(0.5);

        this.add.text(640, 200, 'Dein Arbeitsplatz', {
            fontSize: '20px', fill: '#00ff00', fontFamily: 'Courier New'
        }).setOrigin(0.5);

        this.add.text(640, 300, 'Tisch mit Laptop', {
            fontSize: '16px', fill: '#666666', fontFamily: 'Courier New'
        }).setOrigin(0.5);

        this.add.text(640, 400, 'Tuer Links | Tuer Rechts', {
            fontSize: '16px', fill: '#00ff00', fontFamily: 'Courier New'
        }).setOrigin(0.5);

        this.add.text(640, 500, 'Steuerung:', {
            fontSize: '18px', fill: '#00ff00', fontFamily: 'Courier New'
        }).setOrigin(0.5);

        this.add.text(640, 540, 'SPACE = Kaffee | C = Kamera | PFEILE = Tueren', {
            fontSize: '14px', fill: '#666666', fontFamily: 'Courier New'
        }).setOrigin(0.5);

        this.coffeeLevel = 100;
        this.batteryLevel = 100;
        this.currentHour = 0;

        this.coffeeText = this.add.text(50, 50, 'Kaffee: 100%', {
            fontSize: '20px', fill: '#00ff00', fontFamily: 'Courier New'
        });

        this.batteryText = this.add.text(50, 80, 'Akku: 100%', {
            fontSize: '20px', fill: '#00ff00', fontFamily: 'Courier New'
        });

        this.timeText = this.add.text(1100, 50, '12:00', {
            fontSize: '24px', fill: '#00ff00', fontFamily: 'Courier New'
        }).setOrigin(1, 0);

        this.input.keyboard.on('keydown-SPACE', () => {
            this.coffeeLevel = Math.min(100, this.coffeeLevel + 15);
            this.updateUI();
        });

        this.input.keyboard.on('keydown-C', () => {
            this.scene.launch('CameraScene');
        });

        this.input.keyboard.on('keydown-LEFT', () => {
            this.scene.start('GameOverScene', { reason: 'Tuer zu frueh geschlossen!' });
        });

        this.input.keyboard.on('keydown-RIGHT', () => {
            this.scene.start('GameOverScene', { reason: 'Tuer zu frueh geschlossen!' });
        });

        this.time.addEvent({
            delay: 10000,
            callback: () => {
                this.currentHour++;
                if (this.currentHour >= 6) {
                    this.scene.start('VictoryScene');
                }
                this.updateUI();
            },
            loop: true
        });

        this.time.addEvent({
            delay: 1000,
            callback: () => {
                this.coffeeLevel -= 0.5;
                this.batteryLevel -= 0.3;
                if (this.coffeeLevel <= 0) {
                    this.scene.start('GameOverScene', { reason: 'Du bist eingeschlafen!' });
                }
                if (this.batteryLevel <= 0) {
                    this.scene.start('GameOverScene', { reason: 'Akku leer!' });
                }
                this.updateUI();
            },
            loop: true
        });
    }

    updateUI() {
        this.coffeeText.setText('Kaffee: ' + Math.floor(this.coffeeLevel) + '%');
        this.batteryText.setText('Akku: ' + Math.floor(this.batteryLevel) + '%');
        this.timeText.setText((this.currentHour + 12) + ':00');
    }
}