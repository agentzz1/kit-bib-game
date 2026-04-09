export class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
    }

    create() {
        this.cameras.main.setBackgroundColor('#000000');

        this.add.text(640, 150, 'FIVE NIGHTS', {
            fontSize: '64px', fill: '#00ff00', fontFamily: 'Courier New', fontStyle: 'bold'
        }).setOrigin(0.5);

        this.add.text(640, 230, 'AT KIT BIB', {
            fontSize: '48px', fill: '#ff0000', fontFamily: 'Courier New'
        }).setOrigin(0.5);

        this.add.text(640, 350, '=== KLICKEN ZUM STARTEN ===', {
            fontSize: '32px', fill: '#00ff00', fontFamily: 'Courier New'
        }).setOrigin(0.5);

        this.add.text(640, 500, 'Steuerung:\nSPACE = Kaffee\nPfeile = Tueren\nC = Kamera', {
            fontSize: '16px', fill: '#666666', fontFamily: 'Courier New', align: 'center'
        }).setOrigin(0.5);

        this.input.on('pointerdown', () => {
            this.scene.start('OfficeScene');
            this.scene.launch('UIScene');
        });

        this.input.keyboard.on('keydown-ENTER', () => {
            this.scene.start('OfficeScene');
            this.scene.launch('UIScene');
        });
    }
}