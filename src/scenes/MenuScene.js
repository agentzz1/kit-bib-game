export class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
    }

    create() {
        this.cameras.main.setBackgroundColor('#000000');
        
        this.titleText = this.add.text(640, 200, 'FIVE NIGHTS', {
            fontSize: '48px', fill: '#00ff00', fontFamily: 'Courier New', fontStyle: 'bold'
        }).setOrigin(0.5);
        
        this.subtitleText = this.add.text(640, 280, 'AT KIT BIB', {
            fontSize: '64px', fill: '#ff0000', fontFamily: 'Courier New', fontStyle: 'bold'
        }).setOrigin(0.5);

        this.warningText = this.add.text(640, 400, '⚠️ ÜBERLEBE DIE NÄCHTE ⚠️', {
            fontSize: '20px', fill: '#ffff00', fontFamily: 'Courier New'
        }).setOrigin(0.5);

        this.startText = this.add.text(640, 500, '> Klicke zum Starten <', {
            fontSize: '24px', fill: '#00ff00', fontFamily: 'Courier New'
        }).setOrigin(0.5);

        this.add.text(640, 600, 'Steuerung:\nSPACE = Kaffee | L/R = Türen | C = Kamera', {
            fontSize: '14px', fill: '#666666', fontFamily: 'Courier New', align: 'center'
        }).setOrigin(0.5);

        this.tweens.add({
            targets: this.startText,
            alpha: 0.3,
            duration: 800,
            yoyo: true,
            repeat: -1
        });

        this.input.once('pointerdown', () => {
            this.cameras.main.fade(500, 0, 0, 0);
            this.time.delayedCall(500, () => {
                this.scene.start('OfficeScene');
                this.scene.launch('UIScene');
            });
        });

        this.input.keyboard.on('keydown-ENTER', () => {
            this.cameras.main.fade(500, 0, 0, 0);
            this.time.delayedCall(500, () => {
                this.scene.start('OfficeScene');
                this.scene.launch('UIScene');
            });
        });
    }
}