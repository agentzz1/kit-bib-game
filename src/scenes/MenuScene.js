export class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
        this.selectedNight = 1;
        this.customDifficulty = 1;
        this.menuState = 'intro';
        this.currentMenu = 'main';
    }

    create() {
        this.cameras.main.setBackgroundColor('#000000');
        this.createIntro();
    }

    createIntro() {
        this.introText = this.add.text(640, 300, '', {
            fontSize: '18px', fill: '#00ff00', fontFamily: 'Courier New', align: 'center'
        }).setOrigin(0.5);

        this.loreTexts = [
            "...",
            "Es war einmal...",
            "Ein Student der Informatik...",
            "Seine Bachelorarbeit: 'KI-gestuetzte Bewaesserungsoptimierung'...",
            "Aber etwas ist schief gelaufen...",
            "Die Bibliothek hat ihn verschluckt...",
            "JETZT musst du ueberleben...",
            "6 Naechte. 6 Pruefungen.",
            "Werde fertig mit deiner Arbeit...",
            "...oder bleib fuer immer hier."
        ];

        this.loreIndex = 0;
        this.typewriterEvent = null;
        this.typeNextLine();
    }

    typeNextLine() {
        if (this.loreIndex >= this.loreTexts.length) {
            this.time.delayedCall(500, () => {
                this.cameras.main.fade(500, 0, 0, 0);
                this.time.delayedCall(500, () => {
                    this.createMainMenu();
                });
            });
            return;
        }

        const fullText = this.loreTexts[this.loreIndex];
        this.introText.setText('');
        let charIndex = 0;

        this.typewriterEvent = this.time.addEvent({
            delay: 30,
            callback: () => {
                this.introText.setText(fullText.substring(0, charIndex + 1));
                charIndex++;
                if (charIndex >= fullText.length) {
                    this.typewriterEvent.remove();
                    this.loreIndex++;
                    this.time.delayedCall(800, () => this.typeNextLine());
                }
            },
            repeat: fullText.length - 1
        });

        this.loreIndex++;
    }

    createMainMenu() {
        this.cameras.main.setBackgroundColor('#000000');
        this.scene.restart();
        this.createTitle();
        this.createMainMenuOptions();
        this.createSound();
    }

    createTitle() {
        this.titleText = this.add.text(640, 120, 'FIVE NIGHTS', {
            fontSize: '52px', fill: '#00ff00', fontFamily: 'Courier New', fontStyle: 'bold'
        }).setOrigin(0.5);

        this.subtitleText = this.add.text(640, 180, 'AT KIT BIB', {
            fontSize: '72px', fill: '#ff0000', fontFamily: 'Courier New', fontStyle: 'bold'
        }).setOrigin(0.5);

        this.titleGlowEvent = this.time.addEvent({
            delay: 100,
            callback: () => {
                const flicker = Math.random();
                if (flicker > 0.95) {
                    this.titleText.setFontSize(52 + Math.random() * 10);
                    this.subtitleText.setFontSize(72 + Math.random() * 15);
                    this.titleText.setAlpha(0.8 + Math.random() * 0.2);
                } else {
                    this.titleText.setFontSize(52);
                    this.subtitleText.setFontSize(72);
                    this.titleText.setAlpha(1);
                }
            },
            loop: true
        });

        this.time.addEvent({
            delay: 2000,
            callback: () => {
                if (this.titleGlowEvent) {
                    this.titleText.setFontSize(52);
                    this.subtitleText.setFontSize(72);
                    this.titleText.setAlpha(1);
                }
            },
            loop: true
        });
    }

    createMainMenuOptions() {
        this.menuItems = [];
        const menuOptions = [
            { text: '► START GAME', action: 'nights' },
            { text: '  CUSTOM NIGHT', action: 'custom' },
            { text: '  CONTROLS', action: 'controls' },
            { text: '  LORE', action: 'lore' }
        ];

        menuOptions.forEach((option, index) => {
            const menuItem = this.add.text(640, 350 + index * 60, option.text, {
                fontSize: '28px', fill: '#00ff00', fontFamily: 'Courier New'
            }).setOrigin(0.5).setInteractive({ useHandCursor: true });

            menuItem.setData('text', option.text);
            menuItem.setData('action', option.action);
            menuItem.setData('index', index);

            this.menuItems.push(menuItem);
        });

        this.selectedIndex = 0;
        this.updateMenuSelection();
        this.setupMenuInput();

        this.menuGlow = this.tweens.add({
            targets: this.menuItems[this.selectedIndex],
            alpha: 0.5,
            duration: 500,
            yoyo: true,
            repeat: -1
        });
    }

    updateMenuSelection() {
        this.menuItems.forEach((item, index) => {
            if (index === this.selectedIndex) {
                item.setFill('#ffff00');
                item.setText('► ' + item.getData('text').replace('► ', '').replace('  ', ''));
            } else {
                item.setFill('#00ff00');
                item.setText(item.getData('text'));
            }
        });
    }

    setupMenuInput() {
        this.input.keyboard.on('keydown-UP', () => {
            this.selectedIndex = (this.selectedIndex - 1 + this.menuItems.length) % this.menuItems.length;
            this.updateMenuSelection();
            this.playSelectSound();
        });

        this.input.keyboard.on('keydown-DOWN', () => {
            this.selectedIndex = (this.selectedIndex + 1) % this.menuItems.length;
            this.updateMenuSelection();
            this.playSelectSound();
        });

        this.input.keyboard.on('keydown-ENTER', () => {
            const action = this.menuItems[this.selectedIndex].getData('action');
            this.handleMenuAction(action);
        });

        this.menuItems.forEach(item => {
            item.on('pointerover', () => {
                this.selectedIndex = item.getData('index');
                this.updateMenuSelection();
            });
            item.on('pointerdown', () => {
                const action = item.getData('action');
                this.handleMenuAction(action);
            });
        });
    }

    handleMenuAction(action) {
        this.playSelectSound();
        this.clearMenuEvents();

        switch (action) {
            case 'nights':
                this.createNightsMenu();
                break;
            case 'custom':
                this.createCustomNightMenu();
                break;
            case 'controls':
                this.createControlsMenu();
                break;
            case 'lore':
                this.createLoreMenu();
                break;
        }
    }

    clearMenuEvents() {
        if (this.menuGlow) {
            this.menuGlow.stop();
            this.menuGlow = null;
        }
        this.menuItems.forEach(item => item.destroy());
        this.menuItems = [];
    }

    createNightsMenu() {
        this.currentMenu = 'nights';
        this.add.text(640, 100, 'SELECT NIGHT', {
            fontSize: '36px', fill: '#ff0000', fontFamily: 'Courier New'
        }).setOrigin(0.5);

        this.nightItems = [];
        for (let i = 1; i <= 6; i++) {
            const nightItem = this.add.text(640, 250 + (i - 1) * 70, `► NIGHT ${i}`, {
                fontSize: '32px', fontFamily: 'Courier New', fill: '#00ff00'
            }).setOrigin(0.5).setInteractive({ useHandCursor: true });

            nightItem.setData('night', i);
            nightItem.setData('text', `  NIGHT ${i}`);
            this.nightItems.push(nightItem);
        }

        this.nightItems.push(this.add.text(640, 700, '< BACK', {
            fontSize: '24px', fill: '#666666', fontFamily: 'Courier New'
        }).setOrigin(0.5).setInteractive({ useHandCursor: true }));

        this.selectedNightIndex = 0;
        this.updateNightSelection();
    }

    updateNightSelection() {
        this.nightItems.forEach((item, index) => {
            if (index === this.selectedNightIndex) {
                item.setFill('#ffff00');
                const text = item.getData('text') || item.text;
                item.setText(text.replace('< ', '► ').replace('> ', '► '));
            } else {
                item.setFill('#00ff00');
                const text = item.getData('text') || item.text;
                if (text.includes('BACK')) {
                    item.setFill('#666666');
                }
            }
        });
    }

    createCustomNightMenu() {
        this.currentMenu = 'custom';
        this.add.text(640, 100, 'CUSTOM NIGHT', {
            fontSize: '36px', fill: '#ff0000', fontFamily: 'Courier New'
        }).setOrigin(0.5);

        this.add.text(640, 180, 'Setze die Schwierigkeit:', {
            fontSize: '20px', fill: '#00ff00', fontFamily: 'Courier New'
        }).setOrigin(0.5);

        this.difficultyText = this.add.text(640, 280, `${this.customDifficulty}`, {
            fontSize: '64px', fill: '#ffff00', fontFamily: 'Courier New'
        }).setOrigin(0.5);

        this.add.text(640, 380, '< - >', {
            fontSize: '28px', fill: '#00ff00', fontFamily: 'Courier New'
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        this.add.text(640, 480, 'Nacht wird extrem schwer!', {
            fontSize: '18px', fill: '#ff0000', fontFamily: 'Courier New'
        }).setOrigin(0.5);

        const startBtn = this.add.text(640, 580, '► START', {
            fontSize: '32px', fill: '#00ff00', fontFamily: 'Courier New'
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        const backBtn = this.add.text(640, 700, '< BACK', {
            fontSize: '24px', fill: '#666666', fontFamily: 'Courier New'
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        this.setupCustomInput(startBtn, backBtn);
    }

    setupCustomInput(startBtn, backBtn) {
        this.input.keyboard.on('keydown-RIGHT', () => {
            if (this.customDifficulty < 20) {
                this.customDifficulty++;
                this.difficultyText.setText(`${this.customDifficulty}`);
            }
        });

        this.input.keyboard.on('keydown-LEFT', () => {
            if (this.customDifficulty > 1) {
                this.customDifficulty--;
                this.difficultyText.setText(`${this.customDifficulty}`);
            }
        });

        startBtn.on('pointerdown', () => {
            this.playStartSound();
            this.startGame(0, this.customDifficulty);
        });

        backBtn.on('pointerdown', () => {
            this.goBack();
        });
    }

    createControlsMenu() {
        this.currentMenu = 'controls';
        this.add.text(640, 80, 'CONTROLS', {
            fontSize: '36px', fill: '#ff0000', fontFamily: 'Courier New'
        }).setOrigin(0.5);

        const controls = [
            { key: 'SPACE', action: 'Kaffee trinken / Türen schließen' },
            { key: '← / →', action: 'Türen öffnen/schließen' },
            { key: 'C', action: 'Kamera umschalten' },
            { key: 'F', action: 'Taschenlampe' },
            { key: 'M', action: 'Musik an/aus' },
            { key: 'ESC', action: 'Pause' }
        ];

        controls.forEach((ctrl, index) => {
            this.add.text(200, 200 + index * 60, ctrl.key, {
                fontSize: '24px', fill: '#ffff00', fontFamily: 'Courier New'
            }).setOrigin(0.5);

            this.add.text(640, 200 + index * 60, ctrl.action, {
                fontSize: '20px', fill: '#00ff00', fontFamily: 'Courier New'
            }).setOrigin(0.5);
        });

        const backBtn = this.add.text(640, 700, '< ZURÜCK', {
            fontSize: '24px', fill: '#666666', fontFamily: 'Courier New'
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        backBtn.on('pointerdown', () => this.goBack());
    }

    createLoreMenu() {
        this.currentMenu = 'lore';
        this.add.text(640, 80, 'STORY', {
            fontSize: '36px', fill: '#ff0000', fontFamily: 'Courier New'
        }).setOrigin(0.5);

        this.storyTexts = [
            "Es war einmal ein Student...",
            "Er studierte Informatik an KIT.",
            "Seine Bachelorarbeit:",
            "'KI-gestuetzte Bewaesserungsoptimierung'",
            "",
            "Aber in der Nacht vor der Abgabe...",
            "etwas ging schief.",
            "",
            "Die Bibliothek hat ihn verschluckt.",
            "Jetzt ist er gefangen...",
            "zwischen den Regalen...",
            "zwischen den Buechern...",
            "",
            "Werde fertig mit deiner Arbeit...",
            "...oder bleib fuer immer hier.",
            "",
            "Ueberlebe die 6 Naechte.",
            "Dann bist du frei."
        ];

        this.storyTexts.forEach((text, index) => {
            this.add.text(640, 180 + index * 35, text, {
                fontSize: '18px', fill: index % 2 === 0 ? '#00ff00' : '#00aa00',
                fontFamily: 'Courier New'
            }).setOrigin(0.5);
        });

        const backBtn = this.add.text(640, 750, '< ZURÜCK', {
            fontSize: '24px', fill: '#666666', fontFamily: 'Courier New'
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        backBtn.on('pointerdown', () => this.goBack());
    }

    goBack() {
        this.clearMenuEvents();
        this.createMainMenu();
    }

    playSelectSound() {
    }

    playStartSound() {
    }

    createSound() {
        this.add.text(1180, 50, '[M]', {
            fontSize: '20px', fill: '#444444', fontFamily: 'Courier New'
        }).setOrigin(0.5).setInteractive({ useHandCursor: true }).on('pointerdown', () => {
        });
    }

    startGame(night, customDifficulty = 0) {
        this.cameras.main.fade(500, 0, 0, 0);
        this.time.delayedCall(500, () => {
            this.scene.start('OfficeScene', { night: night, customDifficulty: customDifficulty });
            this.scene.launch('UIScene');
        });
    }
}