import { GlobalState } from '../GlobalState.js';

export class CameraScene extends Phaser.Scene {
    constructor() {
        super({ key: 'CameraScene' });
        this.currentCamera = 0;
    }

    create() {
        this.cameras.main.setBackgroundColor('#001100');
        
        this.add.text(640, 30, '📹 ILIAS ÜBERWACHUNG', {
            fontSize: '24px', fill: '#00ff00', fontFamily: 'Courier New'
        }).setOrigin(0.5);

        this.cameraFeeds = [
            { id: 0, name: 'FOYER', info: 'Eingang: Geschlossen\nLeere Pfandflaschen' },
            { id: 1, name: 'SÜDLESESAAL', info: 'Viele leere Tische\nEin einsamer Student' },
            { id: 2, name: 'TREPPENHAUS', info: 'Aufzug im EG\nNiemand zu sehen' },
            { id: 3, name: 'ERDGESCHOSS', info: 'Sortier-O-Mat 3000:\nAKTIV - Sucht nach Opfern' },
            { id: 4, name: 'CAFETERIA', info: 'Koeri-Wurst:\n4 Stück übrig (warum auch immer)' }
        ];
        
        this.feedDisplay = this.add.text(640, 100, this.cameraFeeds[0].name, {
            fontSize: '28px', fill: '#00ff00', fontFamily: 'Courier New'
        }).setOrigin(0.5);

        this.feedBackground = this.add.rectangle(640, 360, 900, 400, 0x002200).setStrokeStyle(2, 0x004400);
        
        this.updateFeedContent(0);

        this.createCameraButtons();
        this.createBackButton();

        GlobalState.addEventListener('eduroamStatusChanged', (e) => {
            if (e.detail) {
                this.showEduroamDown();
            }
        });
    }

    createCameraButtons() {
        const startX = 240;
        const y = 620;
        const spacing = 160;

        this.cameraButtons = [];
        
        for (let i = 0; i < this.cameraFeeds.length; i++) {
            const btn = this.add.text(startX + i * spacing, y, `${i+1}: ${this.cameraFeeds[i].name}`, {
                fontSize: '14px', fill: i === this.currentCamera ? '#00ff00' : '#006600',
                fontFamily: 'Courier New',
                backgroundColor: '#001100', padding: { x: 8, y: 4 }
            }).setOrigin(0.5).setInteractive({ useHandCursor: true });

            btn.setName(`camera_${i}`);
            this.cameraButtons.push(btn);
            
            btn.on('pointerdown', () => this.switchCamera(i));
        }

        this.input.keyboard.on('keydown-ONE', () => this.switchCamera(0));
        this.input.keyboard.on('keydown-TWO', () => this.switchCamera(1));
        this.input.keyboard.on('keydown-THREE', () => this.switchCamera(2));
        this.input.keyboard.on('keydown-FOUR', () => this.switchCamera(3));
        this.input.keyboard.on('keydown-FIVE', () => this.switchCamera(4));
    }

    createBackButton() {
        this.backButton = this.add.text(50, 30, '← ZURÜCK [ESC]', {
            fontSize: '16px', fill: '#00ff00', fontFamily: 'Courier New'
        }).setInteractive({ useHandCursor: true });

        this.backButton.on('pointerdown', () => this.goBack());
        this.input.keyboard.on('keydown-ESC', () => this.goBack());
    }

    goBack() {
        this.scene.stop();
        this.scene.resume('OfficeScene');
    }

    switchCamera(index) {
        if (GlobalState.isEduroamDown) return;
        
        this.currentCamera = index;
        this.feedDisplay.setText(this.cameraFeeds[index].name);
        
        this.cameraButtons.forEach((btn, i) => {
            btn.setFill(i === index ? '#00ff00' : '#006600');
        });

        this.updateFeedContent(index);
    }

    updateFeedContent(cameraIndex) {
        if (this.feedContent) this.feedContent.destroy();
        
        this.feedContent = this.add.text(640, 360, this.cameraFeeds[cameraIndex].info, {
            fontSize: '18px', fill: '#00ff00', fontFamily: 'Courier New', align: 'center'
        }).setOrigin(0.5);
    }

    showEduroamDown() {
        if (this.feedContent) this.feedContent.destroy();
        
        this.feedDisplay.setText('⚠ KEIN SIGNAL');
        this.feedBackground.fillColor = 0x330000;
        
        this.feedContent = this.add.text(640, 360, 'EDUROAM AUSGEFALLEN!\n\nRouter im Keller ausgefallen.\nDrücke [E] für Reset-Versuch...', {
            fontSize: '20px', fill: '#ff0000', fontFamily: 'Courier New', align: 'center'
        }).setOrigin(0.5);

        this.routerKey = this.input.keyboard.on('keydown-E', () => {
            GlobalState.isEduroamDown = false;
            this.feedBackground.fillColor = 0x002200;
            this.switchCamera(this.currentCamera);
        });
    }

    update() {
    }

    destroy() {
        if (this.routerKey) {
            this.input.keyboard.off('keydown-E', this.routerKey);
        }
        super.destroy();
    }
}