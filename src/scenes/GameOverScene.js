import { GlobalState } from '../GlobalState.js';

export class GameOverScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameOverScene' });
    }

    create(data) {
        this.jumpscareTriggered = false;
        this.cameras.main.setBackgroundColor('#000000');
        
        this.antagonistInfo = data?.antagonist || 'Unbekannt';
        this.survivalTime = data?.survivalTime || 0;
        this.coffeeConsumed = data?.coffeeConsumed || 0;
        this.night = data?.night || GlobalState.currentNight;
        
        this.triggerJumpscare();
    }

    triggerJumpscare() {
        const flashCamera = this.cameras.main;
        
        this.time.delayedCall(300, () => {
            if (this.jumpscareTriggered) return;
            this.jumpscareTriggered = true;
            
            for (let i = 0; i < 8; i++) {
                this.time.delayedCall(i * 50, () => {
                    flashCamera.setBackgroundColor(i % 2 === 0 ? '#ff0000' : '#000000');
                    flashCamera.shake(50, 0.05);
                });
            }
            
            this.time.delayedCall(500, () => {
                flashCamera.setBackgroundColor('#000000');
                this.showGameOverContent();
            });
        });
    }

    showGameOverContent() {
        this.createGlitchText();
        this.showAntagonist();
        this.showStatistics();
        this.createRetryButton();
        this.setupClickHandler();
    }

    createGlitchText() {
        const gameOverText = this.add.text(640, 150, 'GAME OVER', {
            fontSize: '72px',
            fill: '#ff0000',
            fontFamily: 'Courier New',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        this.tweens.add({
            targets: gameOverText,
            alpha: 0.7,
            duration: 100,
            yoyo: true,
            repeat: -1,
            ease: 'Stepped',
            easeParams: [2]
        });

        this.time.addEvent({
            delay: 150,
            callback: () => {
                if (Math.random() > 0.7) {
                    gameOverText.setX(640 + (Math.random() - 0.5) * 10);
                    gameOverText.setY(150 + (Math.random() - 0.5) * 5);
                    this.time.delayedCall(50, () => {
                        gameOverText.setX(640);
                        gameOverText.setY(150);
                    });
                }
            },
            loop: true
        });

        const scanline = this.add.rectangle(640, 300, 800, 2, 0x00ff00, 0.3);
        this.tweens.add({
            targets: scanline,
            y: 600,
            duration: 2000,
            repeat: -1,
            yoyo: true
        });
    }

    showAntagonist() {
        const antagonistNames = {
            'koffein_zombie': '☠️ DER 15. SEMESTER ☠️',
            'sortier_o_mat': '🤖 SORTIER-O-MAT 3000 🤖',
            'scanner': '🖨️ DER SCANNER 🖨️',
            'mathe_hilfe': '📐 MATHE-HILFE 📐',
            'laptop': '💻 LAPTOP ABGESCHMIERT 💻',
            'coffee_machine': '☕ ÜBERMÜDUNG ☕'
        };

        const antagonistName = antagonistNames[this.antagonistInfo] || `👹 ${this.antagonistInfo.toUpperCase()} 👹`;

        const antagonistText = this.add.text(640, 260, antagonistName, {
            fontSize: '28px',
            fill: '#ff4444',
            fontFamily: 'Courier New',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        this.tweens.add({
            targets: antagonistText,
            scaleX: 1.05,
            scaleY: 1.05,
            duration: 300,
            yoyo: true,
            repeat: -1
        });

        const deathMessages = {
            'koffein_zombie': 'Der 15. Semester hat dich geholt! Zu viele Semester...',
            'sortier_o_mat': 'Der Sortier-O-Mat hat dich aussortiert!',
            'scanner': 'Der Scanner hat dich gescannt... und gelöscht!',
            'mathe_hilfe': 'Die Mathe-Hilfe hat dich in eine Gleichung gezogen!',
            'laptop': 'Dein Laptop hat aufgegeben. Keine Bachelorarbeit mehr.',
            'coffee_machine': 'Du bist eingeschlafen... zu wenig Kaffee!'
        };

        this.add.text(640, 310, deathMessages[this.antagonistInfo] || 'Du wurdest erwischt!', {
            fontSize: '18px',
            fill: '#aaaaaa',
            fontFamily: 'Courier New',
            align: 'center'
        }).setOrigin(0.5);
    }

    showStatistics() {
        const bgStats = this.add.rectangle(640, 420, 400, 120, 0x222222, 0.8);
        bgStats.setStrokeStyle(2, 0xff0000);

        const minutes = Math.floor(this.survivalTime / 60);
        const seconds = Math.floor(this.survivalTime % 60);
        const timeStr = `${minutes}:${seconds.toString().padStart(2, '0')}`;

        this.add.text(640, 370, '╔══════════════════════════════╗', {
            fontSize: '16px', fill: '#00ff00', fontFamily: 'Courier New'
        }).setOrigin(0.5);
        
        this.add.text(640, 395, `  ÜBERLEBTE ZEIT: ${timeStr}`, {
            fontSize: '18px', fill: '#ffffff', fontFamily: 'Courier New'
        }).setOrigin(0.5);

        this.add.text(640, 425, `  VERBRAUCHTER KAFFEE: ${this.coffeeConsumed}%`, {
            fontSize: '18px', fill: '#ffa500', fontFamily: 'Courier New'
        }).setOrigin(0.5);

        this.add.text(640, 455, `  GESCHEITERTE NACHT: ${this.night}`, {
            fontSize: '18px', fill: '#ff4444', fontFamily: 'Courier New'
        }).setOrigin(0.5);

        this.add.text(640, 485, '╚══════════════════════════════╝', {
            fontSize: '16px', fill: '#00ff00', fontFamily: 'Courier New'
        }).setOrigin(0.5);
    }

    createRetryButton() {
        const buttonBg = this.add.rectangle(640, 560, 200, 50, 0x333333, 0.9);
        const buttonText = this.add.text(640, 560, '↻ RETRY', {
            fontSize: '24px',
            fill: '#00ff00',
            fontFamily: 'Courier New',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        buttonBg.setInteractive({ useHandCursor: true });

        buttonBg.on('pointerover', () => {
            buttonBg.setFillStyle(0x00ff00, 0.3);
            buttonText.setColor('#000000');
            this.tweens.add({
                targets: buttonText,
                scaleX: 1.1,
                scaleY: 1.1,
                duration: 100
            });
        });

        buttonBg.on('pointerout', () => {
            buttonBg.setFillStyle(0x333333, 0.9);
            buttonText.setColor('#00ff00');
            this.tweens.add({
                targets: buttonText,
                scaleX: 1,
                scaleY: 1,
                duration: 100
            });
        });

        this.tweens.add({
            targets: buttonText,
            y: 558,
            duration: 800,
            yoyo: true,
            repeat: -1,
            ease: 'Sine'
        });

        buttonBg.on('pointerdown', () => {
            this.startRetry();
        });
    }

    setupClickHandler() {
        this.input.on('pointerdown', (pointer, gameObjects) => {
            if (gameObjects.length === 0 || !gameObjects[0].getData('isButton')) {
                this.startRetry();
            }
        });
    }

    startRetry() {
        this.cameras.main.flash(500, 0, 0, 0);
        
        this.tweens.add({
            targets: this.cameras.main,
            alpha: 0,
            duration: 300,
            onComplete: () => {
                GlobalState.currentNight = 1;
                GlobalState.coffeeLevel = 100;
                GlobalState.laptopBattery = 100;
                GlobalState.currentTime = 0;
                GlobalState.secretsFound = GlobalState.secretsFound || [];
                this.scene.start('MenuScene');
            }
        });
    }
}