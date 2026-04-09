export class GameOverScene extends Phaser.Scene {
    create(data) {
        this.cameras.main.setBackgroundColor('#000000');

        this.add.text(640, 250, 'GAME OVER', {
            fontSize: '64px', fill: '#ff0000', fontFamily: 'Courier New'
        }).setOrigin(0.5);

        this.add.text(640, 350, data?.reason || 'Versucht!', {
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