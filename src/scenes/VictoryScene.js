import { GlobalState } from '../GlobalState.js';

export class VictoryScene extends Phaser.Scene {
    constructor() {
        super({ key: 'VictoryScene' });
    }

    create(data) {
        this.cameras.main.setBackgroundColor('#000000');
        
        this.nightStats = data?.nightStats || this.generateVictoryStats();
        this.secretsFound = GlobalState.secretsFound || [];
        
        this.animationPhase = 0;
        this.createIntroSequence();
    }

    generateVictoryStats() {
        const stats = [];
        const nightsWon = GlobalState.currentNight || 3;
        for (let i = 1; i <= nightsWon; i++) {
            const coffeeUsed = Math.floor(Math.random() * 60) + 20;
            const timeSurvived = Math.floor(Math.random() * 360) + 180;
            stats.push({
                night: i,
                coffeeUsed: coffeeUsed,
                timeSurvived: timeSurvived,
                survived: true
            });
        }
        return stats;
    }

    createIntroSequence() {
        const titleText = this.add.text(640, -100, '🎉 SIEG! 🎉', {
            fontSize: '80px',
            fill: '#00ff00',
            fontFamily: 'Courier New',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        this.tweens.add({
            targets: titleText,
            y: 150,
            duration: 1200,
            ease: 'Bounce.easeOut',
            onComplete: () => {
                this.createGlitchEffect(titleText);
                this.showSubtitle();
            }
        });
    }

    createGlitchEffect(text) {
        this.time.addEvent({
            delay: 200,
            callback: () => {
                if (Math.random() > 0.6) {
                    const originalColor = text.color;
                    text.setColor(Math.random() > 0.5 ? '#ff00ff' : '#00ffff');
                    text.setX(640 + (Math.random() - 0.5) * 5);
                    this.time.delayedCall(30, () => {
                        text.setColor(originalColor);
                        text.setX(640);
                    });
                }
            },
            loop: true
        });
    }

    showSubtitle() {
        const subtitle = this.add.text(640, 240, 'Du hast alle 6 Nächte überlebt!', {
            fontSize: '32px',
            fill: '#ffffff',
            fontFamily: 'Courier New'
        }).setOrigin(0.5).setAlpha(0);

        this.tweens.add({
            targets: subtitle,
            alpha: 1,
            duration: 800,
            onComplete: () => {
                this.showVictoryMessage();
            }
        });
    }

    showVictoryMessage() {
        const victoryMessages = [
            'Deine Bachelorarbeit ist fertig!',
            'Der Koffein-Zombie hat dich nie erwischt!',
            'Das Eduroam war stabil wie ein Fels!',
            'Die Bibliothekarin blieb friedlich...'
        ];

        const messageBox = this.add.text(640, 320, victoryMessages[0], {
            fontSize: '20px',
            fill: '#aaaaaa',
            fontFamily: 'Courier New',
            align: 'center'
        }).setOrigin(0.5).setAlpha(0);

        this.tweens.add({
            targets: messageBox,
            alpha: 1,
            duration: 500,
            onComplete: () => {
                this.time.addEvent({
                    delay: 2000,
                    callback: () => {
                        messageBox.setText(victoryMessages[1]);
                    }
                });
                this.time.addEvent({
                    delay: 4000,
                    callback: () => {
                        messageBox.setText(victoryMessages[2]);
                    }
                });
                this.time.addEvent({
                    delay: 6000,
                    callback: () => {
                        messageBox.setText(victoryMessages[3]);
                        this.showStatistics();
                    }
                });
            }
        });
    }

    showStatistics() {
        this.time.delayedCall(1000, () => {
            const statsTitle = this.add.text(640, 400, '═════════ STATISTIKEN ═════════', {
                fontSize: '18px',
                fill: '#00ff00',
                fontFamily: 'Courier New'
            }).setOrigin(0.5).setAlpha(0);

            this.tweens.add({
                targets: statsTitle,
                alpha: 1,
                duration: 500
            });

            const totalCoffee = this.nightStats.reduce((sum, s) => sum + s.coffeeUsed, 0);
            const totalTime = this.nightStats.reduce((sum, s) => sum + s.timeSurvived, 0);
            
            const statsBg = this.add.rectangle(640, 480, 450, 140, 0x111111, 0.8);
            statsBg.setStrokeStyle(2, 0x00ff00);

            const statsText = [
                `  GESAMT KAFFEE: ${totalCoffee}%`,
                `  GESAMT ZEIT: ${Math.floor(totalTime / 60)}min ${totalTime % 60}s`,
                `  ÜBERLEBTE NÄCHTE: ${this.nightStats.length}/6`,
                `  GESUNDHEIT: ${Math.floor(Math.random() * 30) + 70}%`
            ];

            statsText.forEach((stat, index) => {
                const text = this.add.text(640, 425 + index * 25, stat, {
                    fontSize: '16px',
                    fill: index === 2 ? '#00ff00' : '#ffffff',
                    fontFamily: 'Courier New'
                }).setOrigin(0.5).setAlpha(0);

                this.tweens.add({
                    targets: text,
                    alpha: 1,
                    delay: index * 200,
                    duration: 300
                });
            });

            this.time.delayedCall(1000, () => {
                this.showSecrets();
            });
        });
    }

    showSecrets() {
        const secretsTitle = this.add.text(640, 540, '🔐 GEFUNDENE GEHEIMNISSE', {
            fontSize: '20px',
            fill: '#ffd700',
            fontFamily: 'Courier New',
            fontStyle: 'bold'
        }).setOrigin(0.5).setAlpha(0);

        this.tweens.add({
            targets: secretsTitle,
            alpha: 1,
            duration: 500
        });

        const secretList = this.secretsFound.length > 0 ? this.secretsFound : [
            'Geheime Notiz im Regal',
            'Versteckter Kaffeekrug',
            'Geheime Bibliotheksregel #7'
        ];

        const secretsText = secretList.slice(0, 3).map((s, i) => `⭐ ${s}`).join('\n');
        
        const secretsDisplay = this.add.text(640, 580, secretsText || 'Keine Geheimnisse gefunden', {
            fontSize: '14px',
            fill: '#aaaaaa',
            fontFamily: 'Courier New',
            align: 'center'
        }).setOrigin(0.5).setAlpha(0);

        this.tweens.add({
            targets: secretsDisplay,
            alpha: 1,
            delay: 300,
            duration: 500
        });

        this.time.delayedCall(500, () => {
            this.createPlayAgainButton();
        });
    }

    createPlayAgainButton() {
        const buttonBg = this.add.rectangle(640, 650, 220, 50, 0x004400, 0.9);
        const buttonText = this.add.text(640, 650, '🔄 PLAY AGAIN', {
            fontSize: '24px',
            fill: '#00ff00',
            fontFamily: 'Courier New',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        buttonBg.setInteractive({ useHandCursor: true });
        buttonBg.setData('isButton', true);

        buttonBg.on('pointerover', () => {
            buttonBg.setFillStyle(0x00ff00, 0.4);
            buttonText.setColor('#000000');
            this.tweens.add({
                targets: buttonText,
                scaleX: 1.1,
                scaleY: 1.1,
                duration: 100
            });
        });

        buttonBg.on('pointerout', () => {
            buttonBg.setFillStyle(0x004400, 0.9);
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
            scaleX: 1.05,
            scaleY: 1.05,
            duration: 600,
            yoyo: true,
            repeat: -1
        });

        buttonBg.on('pointerdown', () => {
            this.startNewGame();
        });

        this.createPostCreditsButton();
    }

    createPostCreditsButton() {
        const postCreditsBtn = this.add.text(640, 700, '🎬 Post-Credits', {
            fontSize: '16px',
            fill: '#666666',
            fontFamily: 'Courier New'
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        postCreditsBtn.on('pointerover', () => {
            postCreditsBtn.setFillStyle('#ffffff');
        });

        postCreditsBtn.on('pointerout', () => {
            postCreditsBtn.setFillStyle('#666666');
        });

        postCreditsBtn.on('pointerdown', () => {
            this.scene.start('PostCreditsScene');
        });

        this.tweens.add({
            targets: postCreditsBtn,
            alpha: 0.5,
            duration: 1000,
            yoyo: true,
            repeat: -1
        });
    }

    startNewGame() {
        this.tweens.add({
            targets: this.cameras.main,
            alpha: 0,
            duration: 500,
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

export class PostCreditsScene extends Phaser.Scene {
    constructor() {
        super({ key: 'PostCreditsScene' });
    }

    create() {
        this.cameras.main.setBackgroundColor('#000000');
        
        const credits = [
            '═══════════════════════════════════════',
            '🎮 ENTWICKLUNG 🎮',
            'Code: AI Assistant',
            'Konzept: KIT Bibliothek Horror',
            '',
            '═══════════════════════════════════════',
            '🧛 ENEMIES 🧛',
            'Koffein-Zombie',
            'Eduroam-Dämon',
            'Die Bibliothekarin',
            'Kaffeemaschinen-Geist',
            '',
            '═══════════════════════════════════════',
            '💀 SPECIAL THANKS 💀',
            'Danke fürs Spielen!',
            'Hast du alle 6 Nächte geschafft?',
            '',
            'Easter Eggs gefunden?',
            '',
            '═══════════════════════════════════════',
            ' Besuche uns wieder... ',
            ' Die Bibliothek hat immer ',
            '    noch Plätze frei... ',
            '═══════════════════════════════════════'
        ];

        let yPos = 750;
        
        credits.forEach((line, index) => {
            const text = this.add.text(640, yPos, line, {
                fontSize: line.includes('═') ? '16px' : '20px',
                fill: line.includes('🎮') || line.includes('🧛') || line.includes('💀') ? '#ffd700' : '#ffffff',
                fontFamily: 'Courier New',
                align: 'center'
            }).setOrigin(0.5);

            this.tweens.add({
                targets: text,
                alpha: 1,
                delay: index * 300,
                duration: 500
            });

            yPos += 35;
        });

        this.tweens.add({
            targets: this.cameras.main.scrollFactor,
            y: 2,
            duration: 15000,
            ease: 'Linear',
            onComplete: () => {
                this.createReturnButton();
            }
        });
    }

    createReturnButton() {
        const returnText = this.add.text(640, 100, '← ZURÜCK ZUM MENÜ', {
            fontSize: '28px',
            fill: '#00ff00',
            fontFamily: 'Courier New',
            fontStyle: 'bold'
        }).setOrigin(0.5).setAlpha(0).setInteractive({ useHandCursor: true });

        this.tweens.add({
            targets: returnText,
            alpha: 1,
            duration: 500
        });

        returnText.on('pointerdown', () => {
            this.scene.start('MenuScene');
        });

        this.tweens.add({
            targets: returnText,
            y: 95,
            duration: 800,
            yoyo: true,
            repeat: -1
        });
    }
}