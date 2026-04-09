export class CameraScene extends Phaser.Scene {
    create() {
        this.cameras.main.setBackgroundColor('#001100');

        this.add.text(640, 50, 'KAMERA SYSTEM', {
            fontSize: '28px', fill: '#00ff00', fontFamily: 'Courier New'
        }).setOrigin(0.5);

        this.add.text(640, 150, 'FOYER - Blick auf Eingang', {
            fontSize: '18px', fill: '#00ff00', fontFamily: 'Courier New'
        }).setOrigin(0.5);

        this.add.text(640, 250, 'Alles ruhig...', {
            fontSize: '16px', fill: '#006600', fontFamily: 'Courier New'
        }).setOrigin(0.5);

        this.add.text(640, 350, '[1] Foyer | [2] Lesesaal | [3] Treppenhaus', {
            fontSize: '14px', fill: '#00ff00', fontFamily: 'Courier New'
        }).setOrigin(0.5);

        this.add.text(640, 400, 'ESC oder KLICKEN = ZURUECK', {
            fontSize: '16px', fill: '#ff0000', fontFamily: 'Courier New'
        }).setOrigin(0.5);

        this.input.on('pointerdown', () => {
            this.scene.stop();
            this.scene.resume('OfficeScene');
        });

        this.input.keyboard.on('keydown-ESC', () => {
            this.scene.stop();
            this.scene.resume('OfficeScene');
        });
    }
}