import { GlobalState } from '../GlobalState.js';

export class UIScene extends Phaser.Scene {
    constructor() {
        super({ key: 'UIScene' });
        this.warningAlpha = 1;
        this.warningDirection = -1;
    }

    create() {
        this.createScanlines();
        this.createTerminalBorder();
        this.createStatusPanel();
        this.createResourceBars();
        this.createTimeDisplay();
        this.createNightProgress();
        this.createWarnings();

        GlobalState.addEventListener('coffeeChanged', (e) => this.updateCoffee(e.detail));
        GlobalState.addEventListener('batteryChanged', (e) => this.updateBattery(e.detail));
        GlobalState.addEventListener('timeChanged', (e) => this.updateTime(e.detail));
        GlobalState.addEventListener('nightChanged', (e) => this.updateNight(e.detail));
        GlobalState.addEventListener('eduroamStatusChanged', (e) => this.updateEduroam(e.detail));
        GlobalState.addEventListener('doorStatusChanged', (e) => this.updateDoorStatus(e.detail));
        GlobalState.addEventListener('cameraStatusChanged', (e) => this.updateCameraStatus(e.detail));
    }

    createScanlines() {
        const graphics = this.add.graphics();
        graphics.setDepth(1000);
        
        for (let y = 0; y < this.scale.height; y += 4) {
            graphics.lineStyle(1, 0x000000, 0.15);
            graphics.lineBetween(0, y, this.scale.width, y);
        }

        this.scanlineGraphics = graphics;
    }

    createTerminalBorder() {
        const graphics = this.add.graphics();
        graphics.lineStyle(2, 0x00ff00, 0.5);
        graphics.strokeRect(10, 10, this.scale.width - 20, this.scale.height - 20);

        const corners = [
            { x: 10, y: 10 },
            { x: this.scale.width - 10, y: 10 },
            { x: 10, y: this.scale.height - 10 },
            { x: this.scale.width - 10, y: this.scale.height - 10 }
        ];
        
        corners.forEach(corner => {
            graphics.fillStyle(0x00ff00, 0.3);
            graphics.fillTriangle(
                corner.x, corner.y,
                corner.x + (corner.x === 10 ? 15 : -15), corner.y,
                corner.x, corner.y + (corner.y === 10 ? 15 : -15)
            );
        });

        const scanText = this.add.text(this.scale.width / 2, this.scale.height - 25, '>> SYSTEM ONLINE <<', {
            fontSize: '12px', fill: '#00ff00', fontFamily: 'Courier New'
        }).setOrigin(0.5).setAlpha(0.5);
    }

    createStatusPanel() {
        this.doorIcon = this.add.text(20, 150, '🚪 [GESCHLOSSEN]', {
            fontSize: '16px', fill: '#00ff00', fontFamily: 'Courier New'
        });

        this.cameraIcon = this.add.text(20, 180, '📷 [KAMERA: AUS]', {
            fontSize: '16px', fill: '#00ff00', fontFamily: 'Courier New'
        });

        this.wifiIcon = this.add.text(20, 210, '📶 [EDUROAM: OK]', {
            fontSize: '16px', fill: '#00ff00', fontFamily: 'Courier New'
        });
    }

    createResourceBars() {
        this.coffeeLabel = this.add.text(20, 250, '☕ KAFFEE:', {
            fontSize: '18px', fill: '#00ff00', fontFamily: 'Courier New', stroke: '#003300', strokeThickness: 1
        });
        this.coffeeBarBg = this.add.rectangle(140, 260, 200, 20, 0x0a0a0a).setStrokeStyle(1, 0x00ff00);
        this.coffeeBar = this.add.rectangle(40, 260, 196, 16, 0x8B4513);
        this.coffeePercentText = this.add.text(350, 253, '100%', {
            fontSize: '14px', fill: '#00ff00', fontFamily: 'Courier New'
        });

        this.batteryLabel = this.add.text(20, 290, '🔋 AKKU:', {
            fontSize: '18px', fill: '#00ff00', fontFamily: 'Courier New', stroke: '#003300', strokeThickness: 1
        });
        this.batteryBarBg = this.add.rectangle(140, 300, 200, 20, 0x0a0a0a).setStrokeStyle(1, 0x00ff00);
        this.batteryBar = this.add.rectangle(40, 300, 196, 16, 0x00ff00);
        this.batteryPercentText = this.add.text(350, 293, '100%', {
            fontSize: '14px', fill: '#00ff00', fontFamily: 'Courier New'
        });

        this.coffeeTween = null;
        this.batteryTween = null;
    }

    createTimeDisplay() {
        this.timeLabel = this.add.text(this.scale.width - 30, 30, '12:00', {
            fontSize: '36px', fill: '#00ff00', fontFamily: 'Courier New',
            stroke: '#003300', strokeThickness: 2
        }).setOrigin(1, 0);

        this.add.text(this.scale.width - 30, 70, '🕐 SYSTEM TIME', {
            fontSize: '14px', fill: '#00aa00', fontFamily: 'Courier New'
        }).setOrigin(1, 0);
    }

    createNightProgress() {
        this.nightLabel = this.add.text(this.scale.width - 30, 100, '🌙 NACHT 1', {
            fontSize: '18px', fill: '#00ff00', fontFamily: 'Courier New'
        }).setOrigin(1, 0);

        this.nightBarBg = this.add.rectangle(this.scale.width - 130, 130, 200, 15, 0x0a0a0a).setStrokeStyle(1, 0x00ff00);
        this.nightBar = this.add.rectangle(this.scale.width - 230, 130, 0, 11, 0x00ff00);

        this.nightProgressText = this.add.text(this.scale.width - 30, 145, '0%', {
            fontSize: '12px', fill: '#00aa00', fontFamily: 'Courier New'
        }).setOrigin(1, 0);
    }

    createWarnings() {
        this.eduroamWarning = this.add.text(this.scale.width / 2, 50, '⚠ WARNUNG: EDUROAM AUSFALL!', {
            fontSize: '22px', fill: '#ff0000', fontFamily: 'Courier New',
            stroke: '#330000', strokeThickness: 2
        }).setOrigin(0.5).setVisible(false);

        this.lowCoffeeWarning = this.add.text(400, 250, '⚠ NIEDRIG!', {
            fontSize: '14px', fill: '#ff0000', fontFamily: 'Courier New'
        }).setVisible(false);

        this.lowBatteryWarning = this.add.text(400, 290, '⚠ KRITISCH!', {
            fontSize: '14px', fill: '#ff0000', fontFamily: 'Courier New'
        }).setVisible(false);

        this.warningTweens = [];
    }

    updateCoffee(level) {
        const width = (level / 100) * 196;
        this.coffeeBar.width = Math.max(0, width);
        this.coffeeBar.x = 40 + width / 2;
        this.coffeePercentText.setText(`${Math.round(level)}%`);

        if (level < 30) {
            this.coffeeBar.fillColor = 0xff0000;
            this.coffeeLabel.setColor('#ff0000');
            this.lowCoffeeWarning.setVisible(true);

            if (!this.coffeeTween) {
                this.coffeeTween = this.tweens.add({
                    targets: [this.coffeeBar, this.coffeeLabel],
                    alpha: 0.3,
                    duration: 300,
                    yoyo: true,
                    repeat: -1
                });
            }
        } else {
            this.coffeeBar.fillColor = 0x8B4513;
            this.coffeeLabel.setColor('#00ff00');
            this.lowCoffeeWarning.setVisible(false);

            if (this.coffeeTween) {
                this.coffeeTween.stop();
                this.coffeeTween = null;
                this.coffeeBar.alpha = 1;
                this.coffeeLabel.alpha = 1;
            }
        }

        this.triggerWarningBlink(level < 20, this.lowCoffeeWarning);
    }

    updateBattery(level) {
        const width = (level / 100) * 196;
        this.batteryBar.width = Math.max(0, width);
        this.batteryBar.x = 40 + width / 2;
        this.batteryPercentText.setText(`${Math.round(level)}%`);

        if (level < 20) {
            this.batteryBar.fillColor = 0xff0000;
            this.batteryLabel.setColor('#ff0000');
            this.lowBatteryWarning.setVisible(true);

            if (!this.batteryTween) {
                this.batteryTween = this.tweens.add({
                    targets: [this.batteryBar, this.batteryLabel],
                    alpha: 0.3,
                    duration: 200,
                    yoyo: true,
                    repeat: -1
                });
            }
        } else {
            this.batteryBar.fillColor = 0x00ff00;
            this.batteryLabel.setColor('#00ff00');
            this.lowBatteryWarning.setVisible(false);

            if (this.batteryTween) {
                this.batteryTween.stop();
                this.batteryTween = null;
                this.batteryBar.alpha = 1;
                this.batteryLabel.alpha = 1;
            }
        }

        this.triggerWarningBlink(level < 20, this.lowBatteryWarning);
    }

    triggerWarningBlink(active, textObject) {
        if (active && !textObject.getData('blinking')) {
            textObject.setData('blinking', true);
            this.tweens.add({
                targets: textObject,
                alpha: 0,
                duration: 150,
                yoyo: true,
                repeat: -1
            });
        } else if (!active && textObject.getData('blinking')) {
            this.tweens.killTweensOf(textObject);
            textObject.setAlpha(1);
            textObject.setData('blinking', false);
        }
    }

    updateTime(hour) {
        const displayHour = hour === 0 ? 12 : hour;
        const paddedHour = displayHour.toString().padStart(2, '0');
        this.timeLabel.setText(`${paddedHour}:00`);
    }

    updateNight(night) {
        this.nightLabel.setText(`🌙 NACHT ${night}`);
    }

    updateNightProgress(progress) {
        const maxWidth = 196;
        const width = (progress / 100) * maxWidth;
        this.nightBar.width = Math.max(0, width);
        this.nightBar.x = this.scale.width - 230 + width / 2;
        this.nightProgressText.setText(`${Math.round(progress)}%`);
    }

    updateEduroam(isDown) {
        this.eduroamWarning.setVisible(isDown);
        this.wifiIcon.setText(isDown ? '📶 [EDUROAM: AUSFALL]' : '📶 [EDUROAM: OK]');
        this.wifiIcon.setColor(isDown ? '#ff0000' : '#00ff00');

        if (isDown && !this.eduroamWarning.getData('blinking')) {
            this.eduroamWarning.setData('blinking', true);
            this.tweens.add({
                targets: this.eduroamWarning,
                alpha: 0.2,
                duration: 250,
                yoyo: true,
                repeat: -1
            });
        } else if (!isDown) {
            this.tweens.killTweensOf(this.eduroamWarning);
            this.eduroamWarning.setAlpha(1);
            this.eduroamWarning.setData('blinking', false);
        }
    }

    updateDoorStatus(isOpen) {
        this.doorIcon.setText(isOpen ? '🚪 [OFFEN]' : '🔒 [GESCHLOSSEN]');
        this.doorIcon.setColor(isOpen ? '#ffff00' : '#00ff00');
    }

    updateCameraStatus(isOn) {
        this.cameraIcon.setText(isOn ? '📷 [KAMERA: AN]' : '📷 [KAMERA: AUS]');
        this.cameraIcon.setColor(isOn ? '#00ff00' : '#ff0000');
    }

    update() {
    }
}