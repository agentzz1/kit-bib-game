export class VictoryScene extends Phaser.Scene {
    create() {
        this.cameras.main.setBackgroundColor('#000000');

        this.add.text(640, 250, 'SIEG!', {
            fontSize: '64px', fill: '#00ff00', fontFamily: 'Courier New'
        }).setOrigin(0.5);

        this.add.text(640, 350, 'Du hast alle Naechte ueberlebt!', {
            fontSize: '24px', fill: '#ffffff', fontFamily: 'Courier New'
        }).setOrigin(0.5);

        this.add.text(640, 450, 'KLICKEN FUER NEUSTART', {
            fontSize: '20px', fill: '#00ff00', fontFamily: 'Courier New'
        }).setOrigin(0.5);

        this.input.on('pointerdown', () => {
            this.scene.start('MenuScene');
        });
    }
}