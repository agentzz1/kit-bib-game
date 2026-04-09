import { GlobalState } from '../GlobalState.js';

export class CameraScene extends Phaser.Scene {
    constructor() {
        super({ key: 'CameraScene' });
        this.currentCamera = 0;
        this.signalStrength = 100;
        this.isGlitching = false;
    }

    create() {
        this.cameras.main.setBackgroundColor('#001100');
        
        this.add.text(640, 30, '📹 ILIAS ÜBERWACHUNG', {
            fontSize: '24px', fill: '#00ff00', fontFamily: 'Courier New'
        }).setOrigin(0.5);

        this.koeriWurstCount = 4;
        this.koeriWursts = [];

        this.cameraFeeds = [
            { id: 0, name: 'FOYER', info: 'Eingang: Geschlossen\nLeere Pfandflaschen', roomColor: 0x002211, enemyChance: 0.3 },
            { id: 1, name: 'SÜDLESESAAL', info: 'Viele leere Tische\nEin einsamer Student', roomColor: 0x001122, enemyChance: 0.5 },
            { id: 2, name: 'TREPPENHAUS', info: 'Aufzug im EG\nNiemand zu sehen', roomColor: 0x002020, enemyChance: 0.4 },
            { id: 3, name: 'ERDGESCHOSS', info: 'Sortier-O-Mat 3000:\nAKTIV - Sucht nach Opfern', roomColor: 0x001010, enemyChance: 0.7 },
            { id: 4, name: 'CAFETERIA', info: 'Koeri-Wurst:\n4 Stück übrig (warum auch immer)', roomColor: 0x002200, enemyChance: 0.2 }
        ];
        
        this.createKoeriWurstVisuals();
        
        this.feedDisplay = this.add.text(640, 100, this.cameraFeeds[0].name, {
            fontSize: '28px', fill: '#00ff00', fontFamily: 'Courier New'
        }).setOrigin(0.5);

        this.feedBackground = this.add.rectangle(640, 360, 900, 400, this.cameraFeeds[0].roomColor).setStrokeStyle(2, 0x004400);
        
        this.roomDecorations = this.createRoomDecorations();
        
        this.feedScanlines = this.add.rectangle(640, 360, 900, 400, 0x000000, 0.1);
        this.feedDisplay2 = this.add.text(640, 130, 'CAM 01 | 00:00:00', {
            fontSize: '14px', fill: '#00ff00', fontFamily: 'Courier New'
        }).setOrigin(0.5);
        
        this.recIndicator = this.add.text(1150, 100, '● REC', {
            fontSize: '16px', fill: '#ff0000', fontFamily: 'Courier New'
        }).setOrigin(0.5);
        
        this.timeEvent = this.time.addEvent({
            delay: 1000,
            callback: this.updateTimestamp,
            callbackScope: this,
            loop: true
        });
        
        this.recBlinkEvent = this.time.addEvent({
            delay: 500,
            callback: this.blinkRec,
            callbackScope: this,
            loop: true
        });

        this.signalContainer = this.add.container(150, 100);
        this.signalLabel = this.add.text(0, 0, 'SIGNAL:', {
            fontSize: '12px', fill: '#00ff00', fontFamily: 'Courier New'
        }).setOrigin(0, 0.5);
        this.signalContainer.add(this.signalLabel);
        
        this.signalBars = [];
        for (let i = 0; i < 5; i++) {
            const bar = this.add.rectangle(60 + i * 12, 0, 10, 20 - i * 3, 0x00ff00).setOrigin(0, 0.5);
            this.signalBars.push(bar);
            this.signalContainer.add(bar);
        }

        this.enemyContainer = this.add.container(640, 360);
        this.enemyShadow = this.add.rectangle(0, 100, 80, 120, 0x000000, 0.6);
        this.enemyEyes = this.add.container(0, 60);
        this.leftEye = this.add.circle(-15, 0, 8, 0xff0000);
        this.rightEye = this.add.circle(15, 0, 8, 0xff0000);
        this.enemyEyes.add(this.leftEye);
        this.enemyEyes.add(this.rightEye);
        this.enemyContainer.add(this.enemyShadow);
        this.enemyContainer.add(this.enemyEyes);
        this.enemyContainer.setVisible(false);

        this.routerMinigameContainer = this.add.container(0, 0);
        this.routerMinigameContainer.setVisible(false);
        
        this.routerBg = this.add.rectangle(640, 360, 600, 300, 0x001100).setStrokeStyle(3, 0x00ff00);
        this.routerMinigameContainer.add(this.routerBg);
        
        this.routerTitle = this.add.text(640, 250, 'ROUTER REBOOT', {
            fontSize: '24px', fill: '#00ff00', fontFamily: 'Courier New'
        }).setOrigin(0.5);
        this.routerMinigameContainer.add(this.routerTitle);
        
        this.routerInstructions = this.add.text(640, 300, 'Klicke 5x schnell auf den Button!\nDrücke [SPACE] zum Starten', {
            fontSize: '16px', fill: '#00ff00', fontFamily: 'Courier New', align: 'center'
        }).setOrigin(0.5);
        this.routerMinigameContainer.add(this.routerInstructions);
        
        this.routerButton = this.add.rectangle(640, 400, 150, 50, 0x004400).setInteractive({ useHandCursor: true });
        this.routerButtonText = this.add.text(640, 400, 'RESET', {
            fontSize: '20px', fill: '#00ff00', fontFamily: 'Courier New'
        }).setOrigin(0.5);
        this.routerMinigameContainer.add(this.routerButton);
        this.routerMinigameContainer.add(this.routerButtonText);
        
        this.routerProgressText = this.add.text(640, 480, '0/5', {
            fontSize: '18px', fill: '#00ff00', fontFamily: 'Courier New'
        }).setOrigin(0.5);
        this.routerMinigameContainer.add(this.routerProgressText);
        
        this.routerClicks = 0;
        this.routerActive = false;
        this.routerTimer = null;
        
        this.routerButton.on('pointerdown', () => this.handleRouterClick());
        
        this.input.keyboard.on('keydown-SPACE', () => this.startRouterMinigame());

        this.updateFeedContent(0);

        this.createCameraButtons();
        this.createBackButton();

        GlobalState.addEventListener('eduroamStatusChanged', (e) => {
            if (e.detail) {
                this.showEduroamDown();
            }
        });

        this.time.addEvent({
            delay: 2000 + Math.random() * 3000,
            callback: this.maybeShowEnemy,
            callbackScope: this,
            loop: true
        });
    }

    createRoomDecorations() {
        const decorations = [];
        
        const room1Shapes = [
            this.add.rectangle(300, 280, 60, 100, 0x003300),
            this.add.rectangle(980, 350, 80, 60, 0x002200),
            this.add.rectangle(500, 500, 200, 30, 0x004400)
        ];
        decorations.push(room1Shapes);
        
        const room2Shapes = [
            this.add.rectangle(350, 250, 120, 80, 0x003322),
            this.add.rectangle(600, 520, 80, 40, 0x002233),
            this.add.rectangle(900, 300, 40, 150, 0x003311)
        ];
        decorations.push(room2Shapes);
        
        const room3Shapes = [
            this.add.rectangle(280, 200, 30, 200, 0x002222),
            this.add.rectangle(640, 180, 30, 180, 0x002222),
            this.add.rectangle(1000, 200, 30, 200, 0x002222),
            this.add.rectangle(640, 520, 300, 20, 0x003333)
        ];
        decorations.push(room3Shapes);
        
        const room4Shapes = [
            this.add.rectangle(400, 400, 150, 100, 0x002222),
            this.add.rectangle(750, 450, 200, 80, 0x003333),
            this.add.rectangle(550, 280, 100, 80, 0x001111)
        ];
        decorations.push(room4Shapes);
        
        const room5Shapes = [
            this.add.rectangle(320, 350, 80, 60, 0x003300),
            this.add.rectangle(500, 450, 120, 40, 0x002200),
            this.add.rectangle(800, 320, 60, 80, 0x004400),
            this.add.rectangle(950, 480, 100, 30, 0x002200)
        ];
        decorations.push(room5Shapes);
        
        decorations.forEach(roomDecor => {
            roomDecor.forEach(dec => {
                dec.setFillStyle(dec.fillColor, 0.3);
                dec.setVisible(false);
            });
        });
        
        return decorations;
    }

    updateTimestamp() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        const camNum = String(this.currentCamera + 1).padStart(2, '0');
        this.feedDisplay2.setText(`CAM ${camNum} | ${hours}:${minutes}:${seconds}`);
    }

    blinkRec() {
        this.recIndicator.setAlpha(this.recIndicator.alpha === 1 ? 0.3 : 1);
    }

    updateSignalStrength(value) {
        this.signalStrength = Math.max(0, Math.min(100, value));
        
        const activeBars = Math.ceil(this.signalStrength / 20);
        
        this.signalBars.forEach((bar, i) => {
            if (i < activeBars) {
                if (this.signalStrength > 60) {
                    bar.fillColor = 0x00ff00;
                } else if (this.signalStrength > 30) {
                    bar.fillColor = 0xffff00;
                } else {
                    bar.fillColor = 0xff0000;
                }
                bar.alpha = 1;
            } else {
                bar.alpha = 0.2;
            }
        });
    }

    maybeShowEnemy() {
        if (GlobalState.isEduroamDown) return;
        
        const room = this.cameraFeeds[this.currentCamera];
        
        if (Math.random() < room.enemyChance) {
            this.showEnemy();
        }
    }

    showEnemy() {
        this.enemyContainer.setVisible(true);
        
        const baseX = 640;
        const targetX = 300 + Math.random() * 600;
        
        this.tweens.add({
            targets: this.enemyContainer,
            x: targetX,
            duration: 2000 + Math.random() * 2000,
            ease: 'Sine.easeInOut',
            yoyo: true,
            repeat: 1,
            onComplete: () => {
                this.enemyContainer.setVisible(false);
            }
        });
        
        this.tweens.add({
            targets: [this.leftEye, this.rightEye],
            scaleX: 0.5,
            duration: 100,
            yoyo: true,
            repeat: 3
        });
        
        this.tweens.add({
            targets: this.enemyContainer,
            alpha: 0.8,
            duration: 100,
            yoyo: true,
            repeat: 2
        });
    }

    startRouterMinigame() {
        if (this.routerActive) return;
        
        this.routerActive = true;
        this.routerClicks = 0;
        this.routerProgressText.setText('0/5');
        this.routerInstructions.setText('Klicke schnell auf RESET!');
        this.routerButton.fillColor = 0x006600;
        
        this.routerTimer = this.time.delayedCall(3000, () => {
            if (this.routerActive && this.routerClicks < 5) {
                this.routerFail();
            }
        });
    }

    handleRouterClick() {
        if (!this.routerActive) return;
        
        this.routerClicks++;
        this.routerProgressText.setText(`${this.routerClicks}/5`);
        
        this.routerButton.fillColor = 0x00ff00;
        this.time.delayedCall(100, () => {
            this.routerButton.fillColor = 0x006600;
        });
        
        if (this.routerClicks >= 5) {
            this.routerSuccess();
        }
    }

    routerSuccess() {
        this.routerActive = false;
        if (this.routerTimer) this.routerTimer.remove();
        
        this.routerInstructions.setText('✓ Router restart erfolgreich!');
        this.routerButton.fillColor = 0x00ff00;
        
        this.time.delayedCall(1500, () => {
            GlobalState.isEduroamDown = false;
            this.routerMinigameContainer.setVisible(false);
            this.feedBackground.fillColor = this.cameraFeeds[this.currentCamera].roomColor;
            this.switchCamera(this.currentCamera);
        });
    }

    routerFail() {
        this.routerActive = false;
        if (this.routerTimer) this.routerTimer.remove();
        
        this.routerInstructions.setText('✗ Timeout! Drücke [SPACE] für neuen Versuch');
        this.routerButton.fillColor = 0x440000;
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

    createKoeriWurstVisuals() {
        if (this.currentCamera !== 4) return;
        
        const positions = [
            { x: 350, y: 400 },
            { x: 500, y: 450 },
            { x: 750, y: 380 },
            { x: 900, y: 480 }
        ];
        
        positions.forEach((pos, i) => {
            const wurst = this.add.rectangle(pos.x, pos.y, 40, 12, 0xff6b6b);
            wurst.setStrokeStyle(2, 0xcc4444);
            this.koeriWursts.push(wurst);
        });
        
        this.time.addEvent({
            delay: 5000 + Math.random() * 15000,
            callback: this.maybeRemoveKoeriWurst,
            callbackScope: this,
            loop: true
        });
    }
    
    maybeRemoveKoeriWurst() {
        if (this.currentCamera !== 4 || this.koeriWursts.length === 0) return;
        
        if (Math.random() > 0.6) {
            const index = Math.floor(Math.random() * this.koeriWursts.length);
            const wurst = this.koeriWursts[index];
            
            this.tweens.add({
                targets: wurst,
                alpha: 0,
                scaleX: 0.1,
                duration: 500,
                onComplete: () => {
                    wurst.destroy();
                    this.koeriWursts.splice(index, 1);
                    this.koeriWurstCount--;
                    this.updateCafeteriaInfo();
                    
                    this.scene.events.emit('koeriWurstDisappear');
                }
            });
        }
    }
    
    updateCafeteriaInfo() {
        const infoText = `Koeri-Wurst:\n${this.koeriWurstCount} Stück übrig`;
        if (this.feedContent && this.currentCamera === 4) {
            this.feedContent.setText(infoText);
        }
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

        this.roomDecorations.forEach((roomDecor, i) => {
            roomDecor.forEach(dec => {
                dec.setVisible(i === index);
            });
        });
        
        this.feedBackground.fillColor = this.cameraFeeds[index].roomColor;
        
        this.updateFeedContent(index);
        this.updateSignalStrength(80 + Math.random() * 20);
        
        this.enemyContainer.setVisible(false);
        
        if (index === 4) {
            this.showKoeriWursts();
        } else {
            this.hideKoeriWursts();
        }
    }
    
    showKoeriWursts() {
        this.hideKoeriWursts();
        
        this.koeriWursts = [];
        const positions = [
            { x: 350, y: 400 },
            { x: 500, y: 450 },
            { x: 750, y: 380 },
            { x: 900, y: 480 }
        ];
        
        for (let i = 0; i < this.koeriWurstCount; i++) {
            const wurst = this.add.rectangle(positions[i].x, positions[i].y, 40, 12, 0xff6b6b);
            wurst.setStrokeStyle(2, 0xcc4444);
            this.koeriWursts.push(wurst);
        }
    }
    
    hideKoeriWursts() {
        this.koeriWursts.forEach(w => w.destroy());
        this.koeriWursts = [];
    }

    updateFeedContent(cameraIndex) {
        if (this.feedContent) this.feedContent.destroy();
        
        this.feedContent = this.add.text(640, 360, this.cameraFeeds[cameraIndex].info, {
            fontSize: '18px', fill: '#00ff00', fontFamily: 'Courier New', align: 'center'
        }).setOrigin(0.5);
    }

    showEduroamDown() {
        this.isGlitching = true;
        
        if (this.feedContent) this.feedContent.destroy();
        
        this.feedBackground.fillColor = 0x330000;
        this.feedDisplay.setText('⚠ KEIN SIGNAL');
        
        this.routerMinigameContainer.setVisible(true);
        
        this.roomDecorations.forEach(roomDecor => {
            roomDecor.forEach(dec => dec.setVisible(false));
        });
        
        this.enemyContainer.setVisible(false);
        
        this.glitchEffect = this.time.addEvent({
            delay: 50,
            callback: this.triggerGlitch,
            callbackScope: this,
            loop: true
        });
        
        this.updateSignalStrength(0);
    }

    triggerGlitch() {
        if (!this.isGlitching) return;
        
        this.feedBackground.x = 640 + (Math.random() - 0.5) * 20;
        this.feedBackground.alpha = 0.8 + Math.random() * 0.2;
        
        this.feedScanlines.alpha = 0.2 + Math.random() * 0.3;
        
        if (Math.random() > 0.7) {
            this.feedDisplay.setFill(Math.random() > 0.5 ? '#ff0000' : '#00ff00');
        }
        
        if (Math.random() > 0.8) {
            this.cameras.main.setBackgroundColor(Math.random() > 0.5 ? '#110000' : '#001100');
        }
        
        this.time.delayedCall(80, () => {
            if (this.isGlitching) {
                this.feedBackground.x = 640;
                this.feedBackground.alpha = 1;
                this.feedScanlines.alpha = 0.1;
                this.feedDisplay.setFill('#ff0000');
                this.cameras.main.setBackgroundColor('#001100');
            }
        });
    }

    stopGlitch() {
        this.isGlitching = false;
        if (this.glitchEffect) {
            this.glitchEffect.remove();
        }
        this.feedBackground.x = 640;
        this.feedBackground.alpha = 1;
        this.feedScanlines.alpha = 0.1;
        this.feedDisplay.setFill('#00ff00');
        this.cameras.main.setBackgroundColor('#001100');
    }

    update() {
    }

    destroy() {
        this.stopGlitch();
        if (this.timeEvent) this.timeEvent.remove();
        if (this.recBlinkEvent) this.recBlinkEvent.remove();
        if (this.routerKey) {
            this.input.keyboard.off('keydown-E', this.routerKey);
        }
        super.destroy();
    }
}