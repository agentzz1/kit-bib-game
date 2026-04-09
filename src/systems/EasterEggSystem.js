import { GlobalState } from '../GlobalState.js';

export class EasterEggSystem {
    constructor(scene) {
        this.scene = scene;
        this.foundEggs = new Set();
        this.totalEggs = 7;
        this.nightsSurvived = 0;
        this.debugMode = false;
        
        this.notes = [
            "Mathe 1 ist unfair",
            "Wo ist die Bib?",
            "ILIAS down = Leben down",
            "3x Kaffee = 1x Herzinfarkt",
            "Wer hat meinen Snack geklaut?",
            "Lerne jetzt oder stirb später",
            "9CP = 9 Cent Punsch",
            "Prokrastination Niveau: 100",
            "Warum ist die Tür zu?",
            "Ich brauche mehr Kaffee..."
        ];
        
        this.secretMessages = [
            { combo: 'KONAMI', message: "🎮 KONAMI CODE ACTIVATED!\nDu hast das Geheimnis des KIT gefunden!" },
            { combo: 'ILIAS', message: "📚 ILIAS: Im Lernen Ist Alles Scheiße\nAber du hast es trotzdem geschafft!" },
            { combo: 'BIB', message: "🏛️ Die Bibliothek birgt dunkle Geheimnisse...\nAber du warst mutig genug, sie zu suchen!" },
            { combo: 'KAFFEE', message: "☕ Kaffee ist die Antwort.\nAber was war die Frage?" },
            { combo: 'Nacht', message: "🌙 In der Nacht sind alle Katzen grau...\nAber die Bibliothek ist immer noch creepy!" },
            { combo: 'PUNKTE', message: "📊 Deine Punkte: Unendlich!\nWeil du die Konsole gefunden hast!" }
        ];
        
        this.debugCommands = {
            'GOD': () => this.activateGodMode(),
            'SKIP': () => this.skipNight(),
            'FULLBATTERY': () => this.fullBattery(),
            'FULLCOFFEE': () => this.fullCoffee(),
            'SHOWEGGS': () => this.showFoundEggs(),
            'KILL': () => this.triggerJumpscare(),
            'FNAF': () => this.funFNAFReference()
        };
        
        this.fnafReferences = [
            "I am 87%",
            "It\'s me",
            "Die in the dark",
            "You can\'t escape",
            "6 AM",
            "Night shift",
            "Payment required"
        ];
        
        this.init();
    }
    
    init() {
        this.setupKeyboardInput();
        this.createEliteCertificate();
        this.scheduleRandomEvents();
    }
    
    setupKeyboardInput() {
        this.keyBuffer = '';
        this.maxBufferLength = 20;
        this.bufferTimeout = null;
        
        this.scene.input.keyboard.on('keydown', (event) => {
            this.handleKeyInput(event);
        });
    }
    
    handleKeyInput(event) {
        if (event.key === 'F12') {
            event.preventDefault();
            this.toggleDebugMenu();
            return;
        }
        
        if (event.key.length === 1 && event.key.match(/[a-zA-Z]/)) {
            this.keyBuffer += event.key.toUpperCase();
            
            if (this.keyBuffer.length > this.maxBufferLength) {
                this.keyBuffer = this.keyBuffer.slice(-this.maxBufferLength);
            }
            
            this.checkSecretCodes();
            
            if (this.bufferTimeout) {
                this.scene.time.removeEvent(this.bufferTimeout);
            }
            
            this.bufferTimeout = this.scene.time.delayedCall(1000, () => {
                this.keyBuffer = '';
            });
        }
    }
    
    checkSecretCodes() {
        for (const secret of this.secretMessages) {
            if (this.keyBuffer.includes(secret.combo)) {
                this.showSecretMessage(secret.message);
                this.keyBuffer = '';
                break;
            }
        }
        
        if (this.debugMode) {
            const cmd = this.keyBuffer.split(' ')[0].trim();
            if (this.debugCommands[cmd]) {
                this.debugCommands[cmd]();
                this.keyBuffer = '';
            }
        }
    }
    
    showSecretMessage(message) {
        const container = this.scene.add.container(640, 360);
        
        const bg = this.scene.add.rectangle(0, 0, 500, 150, 0x000000, 0.9);
        bg.setStrokeStyle(3, 0x00ff00);
        container.add(bg);
        
        const text = this.scene.add.text(0, 0, message, {
            fontSize: '16px',
            fill: '#00ff00',
            fontFamily: 'Courier New',
            align: 'center'
        }).setOrigin(0.5);
        container.add(text);
        
        container.setScale(0);
        this.scene.tweens.add({
            targets: container,
            scale: 1,
            duration: 300,
            ease: 'Back.easeOut',
            onComplete: () => {
                this.scene.time.delayedCall(4000, () => {
                    this.scene.tweens.add({
                        targets: container,
                        alpha: 0,
                        duration: 500,
                        onComplete: () => container.destroy()
                    });
                });
            }
        });
        
        this.recordEggFind('SECRET');
    }
    
    toggleDebugMenu() {
        this.debugMode = !this.debugMode;
        
        if (this.debugMode) {
            this.createDebugMenu();
        } else {
            this.closeDebugMenu();
        }
    }
    
    createDebugMenu() {
        this.debugContainer = this.scene.add.container(0, 0);
        
        const overlay = this.scene.add.rectangle(640, 360, 1280, 720, 0x000000, 0.85);
        this.debugContainer.add(overlay);
        
        const menuBg = this.scene.add.rectangle(640, 360, 600, 500, 0x1a1a2e).setStrokeStyle(3, 0xff00ff);
        this.debugContainer.add(menuBg);
        
        const title = this.scene.add.text(640, 120, '🎮 DEBUG KONSOLE', {
            fontSize: '32px',
            fill: '#ff00ff',
            fontFamily: 'Courier New'
        }).setOrigin(0.5);
        this.debugContainer.add(title);
        
        const commands = [
            'GOD - God Mode aktivieren',
            'SKIP - Nacht überspringen',
            'FULLBATTERY - Volle Batterie',
            'FULLCOFFEE - Voller Kaffee',
            'SHOWEGGS - Gefundene Easter Eggs',
            'KILL - Jumpscare auslösen',
            'FNAF - Zufällige FNAF Referenz',
            '',
            'Drücke [ESC] zum Schließen'
        ];
        
        let yPos = 180;
        commands.forEach(cmd => {
            const text = this.scene.add.text(340, yPos, cmd, {
                fontSize: '14px',
                fill: cmd.startsWith(' ') || cmd === '' ? '#666666' : '#00ff00',
                fontFamily: 'Courier New'
            });
            this.debugContainer.add(text);
            yPos += 30;
        });
        
        this.scene.input.keyboard.once('keydown-ESC', () => {
            this.toggleDebugMenu();
        });
    }
    
    closeDebugMenu() {
        if (this.debugContainer) {
            this.debugContainer.destroy();
            this.debugContainer = null;
        }
    }
    
    activateGodMode() {
        GlobalState.coffeeLevel = 100;
        GlobalState.laptopBattery = 100;
        this.showDebugFeedback('GOD MODE: ACTIVATED', 0x00ff00);
        this.recordEggFind('DEBUG');
    }
    
    skipNight() {
        this.nightsSurvived++;
        this.scene.gameTime = this.scene.nightDuration;
        this.showDebugFeedback('NACHT ÜBERSPRUNGEN', 0xffff00);
        this.checkAllEggsFound();
    }
    
    fullBattery() {
        GlobalState.laptopBattery = 100;
        this.showDebugFeedback('AKKU VOLL', 0x00ff00);
    }
    
    fullCoffee() {
        GlobalState.coffeeLevel = 100;
        this.showDebugFeedback('KAFFEE VOLL', 0x00ff00);
    }
    
    showFoundEggs() {
        let eggList = 'GEFUNDENE EASTER EGGS:\n\n';
        const eggNames = {
            'KOERI': '🌭 Koeri-Wurst',
            'NOTES': '📝 Verzweifelte Notizen',
            'CERT': '📜 Elite-Zertifikat',
            'DEBUG': '🎮 Debug-Menü',
            'SECRET': '🔐 Geheime Messages',
            'FNAF': '👾 FNAF Referenzen',
            'ALL': '⭐ Alle Easter Eggs'
        };
        
        this.foundEggs.forEach(egg => {
            eggList += `${eggNames[egg] || egg}\n`;
        });
        
        eggList += `\n${this.foundEggs.size}/${this.totalEggs} gefunden`;
        
        this.showDebugFeedback(eggList, 0xff00ff);
    }
    
    triggerJumpscare() {
        this.scene.events.emit('jumpscare', { antagonist: { name: 'Easter Egg Boss' } });
    }
    
    funFNAFReference() {
        const ref = this.fnafReferences[Math.floor(Math.random() * this.fnafReferences.length)];
        this.showDebugFeedback(ref, 0xff0000);
        
        this.scene.cameras.main.flash(100, 255, 0, 0);
        this.scene.time.delayedCall(200, () => {
            this.scene.cameras.main.flash(100, 0, 0, 0);
        });
        
        this.recordEggFind('FNAF');
    }
    
    showDebugFeedback(text, color) {
        const feedback = this.scene.add.text(640, 500, text, {
            fontSize: '18px',
            fill: `#${color.toString(16).padStart(6, '0')}`,
            fontFamily: 'Courier New',
            backgroundColor: '#000000',
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5);
        
        this.scene.tweens.add({
            targets: feedback,
            alpha: 0,
            y: 450,
            duration: 2000,
            onComplete: () => feedback.destroy()
        });
    }
    
    createEliteCertificate() {
        const w = this.scene.cameras.main.width;
        const h = this.scene.cameras.main.height;
        
        this.certX = w - 200;
        this.certY = 150;
        
        this.certificateFrame = this.scene.add.rectangle(this.certX, this.certY, 120, 160, 0x2a1a0a);
        this.certificateFrame.setStrokeStyle(3, 0x8b7355);
        
        this.certificateInner = this.scene.add.rectangle(this.certX, this.certY, 100, 140, 0xf5f5dc);
        
        this.certTitle = this.scene.add.text(this.certX, this.certY - 50, 'EXZELLENZ', {
            fontSize: '10px',
            fill: '#000000',
            fontFamily: 'Arial',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        this.certSubtitle = this.scene.add.text(this.certX, this.certY - 30, 'ZERTIFIKAT', {
            fontSize: '8px',
            fill: '#333333',
            fontFamily: 'Arial'
        }).setOrigin(0.5);
        
        this.certStar = this.scene.add.text(this.certX, this.certY, '★', {
            fontSize: '32px',
            fill: '#ffd700'
        }).setOrigin(0.5);
        
        this.certText = this.scene.add.text(this.certX, this.certY + 30, 'KIT BIB', {
            fontSize: '8px',
            fill: '#000000',
            fontFamily: 'Arial'
        }).setOrigin(0.5);
        
        this.certCreepiness = 0;
        this.updateCertificateAppearance();
    }
    
    updateCertificateAppearance() {
        const creepLevel = Math.min(this.certCreepiness, 5);
        
        const creepColors = [0xf5f5dc, 0xe8e0c0, 0xd4c896, 0xb8a060, 0x8b0000, 0x2a0000];
        const starColors = ['#ffd700', '#d4a000', '#b8860b', '#8b0000', '#ff0000', '#000000'];
        
        this.certificateInner.fillColor = creepColors[creepLevel];
        this.certStar.setFill(starColors[creepLevel]);
        
        if (creepLevel >= 2) {
            this.certStar.setText('☠');
        }
        if (creepLevel >= 4) {
            this.certStar.setScale(1.5);
            this.scene.tweens.add({
                targets: this.certStar,
                scale: 1.8,
                duration: 500,
                yoyo: true,
                repeat: -1
            });
        }
        
        if (creepLevel >= 3 && !this.certEyes) {
            this.certEyes = this.scene.add.container(this.certX, this.certY + 20);
            
            const leftEye = this.scene.add.circle(-15, 0, 8, 0x000000);
            const rightEye = this.scene.add.circle(15, 0, 8, 0x000000);
            const leftPupil = this.scene.add.circle(-15, 0, 3, 0xff0000);
            const rightPupil = this.scene.add.circle(15, 0, 3, 0xff0000);
            
            this.certEyes.add(leftEye);
            this.certEyes.add(rightEye);
            this.certEyes.add(leftPupil);
            this.certEyes.add(rightPupil);
            this.certEyes.setVisible(false);
        }
        
        if (this.certEyes && creepLevel >= 4) {
            this.certEyes.setVisible(true);
            
            this.scene.tweens.add({
                targets: this.certEyes,
                alpha: 0.5,
                duration: 300,
                yoyo: true,
                repeat: -1
            });
        }
    }
    
    increaseCertificateCreepiness() {
        this.certCreepiness++;
        this.updateCertificateAppearance();
        
        if (this.certCreepiness >= 2) {
            this.recordEggFind('CERT');
        }
    }
    
    scheduleRandomEvents() {
        this.scene.time.addEvent({
            delay: 30000 + Math.random() * 60000,
            callback: this.maybeShowRandomNote,
            callbackScope: this,
            loop: true
        });
        
        this.scene.time.addEvent({
            delay: 45000 + Math.random() * 45000,
            callback: this.maybeShowFNAFReference,
            callbackScope: this,
            loop: true
        });
    }
    
    maybeShowRandomNote() {
        if (Math.random() > 0.4) return;
        
        const note = this.notes[Math.floor(Math.random() * this.notes.length)];
        
        const w = this.scene.cameras.main.width;
        const h = this.scene.cameras.main.height;
        
        const x = 100 + Math.random() * (w - 200);
        const y = 150 + Math.random() * (h - 300);
        
        const noteBg = this.scene.add.rectangle(x, y, 140, 60, 0xf5deb3);
        noteBg.setStrokeStyle(1, 0x8b4513);
        
        const noteText = this.scene.add.text(x, y, note, {
            fontSize: '10px',
            fill: '#2f2f2f',
            fontFamily: 'Courier New',
            wordWrap: { width: 120 }
        }).setOrigin(0.5);
        
        this.scene.tweens.add({
            targets: [noteBg, noteText],
            alpha: 0,
            delay: 5000,
            duration: 1000,
            onComplete: () => {
                noteBg.destroy();
                noteText.destroy();
            }
        });
        
        this.recordEggFind('NOTES');
    }
    
    maybeShowFNAFReference() {
        if (Math.random() > 0.25) return;
        
        const ref = this.fnafReferences[Math.floor(Math.random() * this.fnafReferences.length)];
        
        const w = this.scene.cameras.main.width;
        const h = this.scene.cameras.main.height;
        
        const refText = this.scene.add.text(
            Math.random() > 0.5 ? 100 : w - 100,
            200 + Math.random() * 200,
            ref,
            {
                fontSize: '12px',
                fill: '#ff0000',
                fontFamily: 'Courier New',
                fontStyle: 'italic'
            }
        ).setOrigin(0.5);
        
        refText.setAlpha(0);
        
        this.scene.tweens.add({
            targets: refText,
            alpha: 1,
            duration: 500,
            onComplete: () => {
                this.scene.tweens.add({
                    targets: refText,
                    alpha: 0,
                    delay: 3000,
                    duration: 1000,
                    onComplete: () => refText.destroy()
                });
            }
        });
    }
    
    recordEggFind(eggType) {
        if (!this.foundEggs.has(eggType)) {
            this.foundEggs.add(eggType);
            console.log(`🎉 Easter Egg gefunden: ${eggType} (${this.foundEggs.size}/${this.totalEggs})`);
            
            if (this.scene.events) {
                this.scene.events.emit('eggFound', { type: eggType, total: this.foundEggs.size });
            }
            
            this.checkAllEggsFound();
        }
    }
    
    checkAllEggsFound() {
        if (this.foundEggs.size >= this.totalEggs) {
            this.triggerEasterEggScene();
        }
    }
    
    triggerEasterEggScene() {
        if (this.easterEggSceneTriggered) return;
        this.easterEggSceneTriggered = true;
        
        this.recordEggFind('ALL');
        
        const container = this.scene.add.container(640, 360);
        
        const overlay = this.scene.add.rectangle(0, 0, 1280, 720, 0x000000, 0.9);
        container.add(overlay);
        
        const title = this.scene.add.text(0, -100, '🎉 ALLE EASTER EGGS GEFUNDEN! 🎉', {
            fontSize: '36px',
            fill: '#ffd700',
            fontFamily: 'Courier New',
            stroke: '#ff0000',
            strokeThickness: 4
        }).setOrigin(0.5);
        container.add(title);
        
        const message = this.scene.add.text(0, 50, 'Du hast alle versteckten Geheimnisse gefunden!\n\nBonus-Szene freigeschaltet:', {
            fontSize: '20px',
            fill: '#00ff00',
            fontFamily: 'Courier New',
            align: 'center'
        }).setOrigin(0.5);
        container.add(message);
        
        const bonusText = this.scene.add.text(0, 150, '🏆 EASTER EGG MASTER 🏆', {
            fontSize: '28px',
            fill: '#ff00ff',
            fontFamily: 'Courier New'
        }).setOrigin(0.5);
        container.add(bonusText);
        
        container.setScale(0);
        this.scene.tweens.add({
            targets: container,
            scale: 1,
            duration: 500,
            ease: 'Back.easeOut',
            onComplete: () => {
                this.scene.tweens.add({
                    targets: [title, message, bonusText],
                    y: '+=20',
                    duration: 1000,
                    yoyo: true,
                    repeat: -1
                });
                
                this.scene.time.delayedCall(8000, () => {
                    this.scene.tweens.add({
                        targets: container,
                        alpha: 0,
                        duration: 1000,
                        onComplete: () => container.destroy()
                    });
                });
            }
        });
    }
    
    onNightComplete() {
        this.nightsSurvived++;
        this.increaseCertificateCreepiness();
    }
    
    onKoeriWurstDisappear() {
        this.recordEggFind('KOERI');
    }
    
    update(delta) {
    }
}