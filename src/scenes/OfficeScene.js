import { GlobalState } from '../GlobalState.js';
import { CoffeeSystem } from '../systems/CoffeeSystem.js';
import { BatterySystem } from '../systems/BatterySystem.js';
import { AINetwork } from '../systems/AINetwork.js';
import { EasterEggSystem } from '../systems/EasterEggSystem.js';

export class OfficeScene extends Phaser.Scene {
    constructor() {
        super({ key: 'OfficeScene' });
        this.gameTime = 0;
        this.realTimeMultiplier = 10;
        this.nightDuration = 360000;
        this.flickerTimer = 0;
        this.blinkTimer = 0;
    }

    create() {
        console.log("OfficeScene geladen: Das Spiel beginnt!");
        this.cameras.main.setBackgroundColor('#0a0a0a');

        this.coffeeSystem = new CoffeeSystem(this);
        this.batterySystem = new BatterySystem(this);
        this.aiNetwork = new AINetwork(this);
        this.easterEggSystem = new EasterEggSystem(this);

        this.createOfficeVisuals();
        this.createInteractiveElements();
        this.setupControls();
        this.setupEventListeners();

        this.time.addEvent({
            delay: this.nightDuration,
            callback: this.nightCompleted,
            callbackScope: this,
            loop: false
        });
    }

    createOfficeVisuals() {
        const w = this.cameras.main.width;
        const h = this.cameras.main.height;

        this.add.rectangle(w/2, h/2, w, h, 0x0d0d0d);

        for (let x = 0; x < w; x += 64) {
            this.add.rectangle(x, h/2, 2, h, 0x1a1a1a);
        }

        this.createFloorPattern(w, h);
        this.createWallDetails(w, h);
        this.createWindows(w, h);
        this.createBookshelves(w, h);
        this.createPlant(w, h);
        this.createPosters(w, h);
        this.createDeskWithLaptop(w, h);
        this.createCoffeeStation(w, h);
        this.createWallClock(w, h);
        this.createVendingMachine(w, h);
        this.createLamps(w, h);
        this.createDoors(w, h);
    }

    createFloorPattern(w, h) {
        for (let i = 0; i < 20; i++) {
            const x = 100 + i * 60;
            this.add.rectangle(x, h - 50, 50, 5, 0x2a2a2a).setOrigin(0.5, 1);
        }
    }

    createWallDetails(w, h) {
        this.add.rectangle(w/2, 30, w, 60, 0x1a1a1a);
        
        const baseboard = this.add.rectangle(w/2, h - 40, w, 20, 0x151515);
        baseboard.setStrokeStyle(1, 0x252525);
    }

    createWindows(w, h) {
        for (let i = 0; i < 3; i++) {
            const x = 180 + i * 250;
            
            const windowFrame = this.add.rectangle(x, 120, 200, 180, 0x2a2a2a);
            windowFrame.setStrokeStyle(4, 0x404040);
            
            const windowGlass = this.add.rectangle(x, 120, 190, 170, 0x1a2a3a);
            
            const windowGlow = this.add.rectangle(x, 120, 180, 160, 0x0a1520);
            
            this.add.rectangle(x - 90, 120, 5, 180, 0x3a3a3a);
            this.add.rectangle(x + 90, 120, 5, 180, 0x3a3a3a);
            this.add.rectangle(x, 35, 200, 5, 0x3a3a3a);
            this.add.rectangle(x, 205, 200, 5, 0x3a3a3a);
            
            const shelf = this.add.rectangle(x, 180, 180, 8, 0x3a3a3a);
            this.add.rectangle(x - 60, 165, 20, 15, 0x224466);
            this.add.rectangle(x, 160, 20, 15, 0x224466);
            this.add.rectangle(x + 50, 168, 20, 12, 0x224466);
            
            this.add.text(x, 70, 'BIBLIOTHEK', {
                fontSize: '10px', fill: '#4a6a8a', fontFamily: 'Arial'
            }).setOrigin(0.5);
        }
    }

    createBookshelves(w, h) {
        const leftShelfX = 80;
        const rightShelfX = w - 120;
        
        this.createSingleShelf(leftShelfX, 250);
        this.createSingleShelf(leftShelfX, 350);
        this.createSingleShelf(leftShelfX, 450);
        
        this.createSingleShelf(rightShelfX, 250);
        this.createSingleShelf(rightShelfX, 350);
        this.createSingleShelf(rightShelfX, 450);
        
        this.add.rectangle(leftShelfX - 40, 350, 10, 220, 0x3a2a1a).setStrokeStyle(1, 0x4a3a2a);
        this.add.rectangle(leftShelfX + 40, 350, 10, 220, 0x3a2a1a).setStrokeStyle(1, 0x4a3a2a);
        
        this.add.rectangle(rightShelfX - 40, 350, 10, 220, 0x3a2a1a).setStrokeStyle(1, 0x4a3a2a);
        this.add.rectangle(rightShelfX + 40, 350, 10, 220, 0x3a2a1a).setStrokeStyle(1, 0x4a3a2a);
    }

    createSingleShelf(x, y) {
        const shelf = this.add.rectangle(x, y, 80, 8, 0x4a3a2a);
        shelf.setStrokeStyle(1, 0x5a4a3a);
        
        const colors = [0x8b0000, 0x006400, 0x00008b, 0x4a4a00, 0x4a004a, 0x006444];
        for (let i = 0; i < 6; i++) {
            const bookWidth = 8 + Math.random() * 4;
            const bookHeight = 25 + Math.random() * 15;
            const book = this.add.rectangle(x - 30 + i * 12, y - bookHeight/2 - 4, bookWidth, bookHeight, colors[i % colors.length]);
            book.setStrokeStyle(1, 0x222222);
        }
    }

    createPlant(w, h) {
        const plantX = w - 220;
        
        this.add.rectangle(plantX, h - 65, 40, 50, 0x3a2a1a);
        this.add.rectangle(plantX, h - 85, 50, 10, 0x2a1a0a).setStrokeStyle(2, 0x5a4a3a);
        
        const pot = this.add.rectangle(plantX, h - 65, 35, 40, 0x8b4513);
        pot.setStrokeStyle(2, 0x654321);
        
        this.add.ellipse(plantX, h - 120, 30, 40, 0x228b22);
        this.add.ellipse(plantX - 15, h - 110, 25, 35, 0x2e8b2e);
        this.add.ellipse(plantX + 15, h - 115, 25, 35, 0x3cb371);
        this.add.ellipse(plantX, h - 130, 20, 30, 0x32cd32);
        
        const leaf1 = this.add.ellipse(plantX - 20, h - 140, 15, 25, 0x228b22).setRotation(-0.3);
        const leaf2 = this.add.ellipse(plantX + 20, h - 135, 15, 25, 0x2e8b2e).setRotation(0.3);
    }

    createPosters(w, h) {
        this.add.rectangle(300, 120, 80, 100, 0x1a1a1a).setStrokeStyle(3, 0x333333);
        this.add.rectangle(300, 120, 70, 90, 0x252525);
        this.add.text(300, 100, '咖啡', { fontSize: '20px', fill: '#ff6b35' }).setOrigin(0.5);
        this.add.text(300, 140, '☕', { fontSize: '32px' }).setOrigin(0.5);
        
        this.add.rectangle(w - 350, 130, 90, 120, 0x1a1a1a).setStrokeStyle(3, 0x333333);
        this.add.rectangle(w - 350, 130, 80, 110, 0x0a1a2a);
        
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                this.add.rectangle(w - 370 + i * 25, 110 + j * 30, 20, 25, 0x1a3050).setStrokeStyle(1, 0x2a4a70);
            }
        }
        
        this.add.text(w - 350, 100, '深夜勉強', { fontSize: '8px', fill: '#6a8aaa' }).setOrigin(0.5);
    }

    createDeskWithLaptop(w, h) {
        const deskX = w/2 - 180;
        const deskY = h/2 + 50;
        
        this.add.rectangle(deskX, deskY, 300, 80, 0x3a2a1a).setStrokeStyle(2, 0x5a4a3a);
        
        this.add.rectangle(deskX - 130, deskY + 45, 30, 70, 0x2a1a0a);
        this.add.rectangle(deskX + 130, deskY + 45, 30, 70, 0x2a1a0a);
        
        this.add.rectangle(deskX, deskY - 40, 20, 40, 0x1a1a1a);
        
        const screenFrame = this.add.rectangle(deskX - 80, deskY - 80, 140, 90, 0x1a1a1a);
        screenFrame.setStrokeStyle(3, 0x2a2a2a);
        
        const screen = this.add.rectangle(deskX - 80, deskY - 80, 130, 80, 0x001a00);
        
        this.add.rectangle(deskX - 80, deskY - 125, 120, 10, 0x2a2a2a);
        
        const codeLines = [
            'function work() {',
            '  while(awake) {',
            '    study();',
            '    return true;',
            '  }',
            '}'
        ];
        codeLines.forEach((line, i) => {
            this.add.text(deskX - 140, deskY - 110 + i * 12, line, {
                fontSize: '8px', fill: '#00ff00', fontFamily: 'Courier'
            });
        });
        
        this.add.rectangle(deskX + 80, deskY - 20, 60, 40, 0x222222).setStrokeStyle(2, 0x333333);
        this.add.rectangle(deskX + 80, deskY - 35, 50, 20, 0x001133);
        
        this.add.rectangle(deskX - 20, deskY - 25, 80, 15, 0x8b4513);
        
        this.add.rectangle(deskX - 20, deskY - 25, 70, 10, 0x5a3a2a);
        
        this.add.rectangle(deskX - 30, deskY + 20, 15, 10, 0x333333);
        
        this.add.text(deskX + 110, deskY - 60, '📚', { fontSize: '24px' }).setOrigin(0.5);
        
        this.add.rectangle(deskX + 120, deskY - 80, 40, 50, 0x4a3a2a);
        this.add.rectangle(deskX + 120, deskY - 105, 35, 5, 0x3a2a1a);
        this.add.rectangle(deskX + 105, deskY - 80, 5, 50, 0x3a2a1a);
        this.add.rectangle(deskX + 135, deskY - 80, 5, 50, 0x3a2a1a);
    }

    createCoffeeStation(w, h) {
        const coffeeX = w/2 + 180;
        
        this.add.rectangle(coffeeX, h/2 + 80, 100, 80, 0x2a2a2a).setStrokeStyle(2, 0x3a3a3a);
        
        this.add.rectangle(coffeeX, h/2 + 40, 80, 60, 0x1a1a1a);
        
        const coffeeLabel = this.add.rectangle(coffeeX, h/2 + 30, 60, 20, 0x3a2a1a);
        this.add.text(coffeeX, h/2 + 30, 'KAFFEE', { fontSize: '10px', fill: '#8b4513', fontFamily: 'Arial' }).setOrigin(0.5);
        
        this.add.rectangle(coffeeX - 25, h/2 + 60, 15, 30, 0x666666);
        this.add.rectangle(coffeeX + 25, h/2 + 60, 15, 30, 0x666666);
        
        this.coffeeLight = this.add.circle(coffeeX, h/2 + 15, 8, 0x00ff00);
        this.coffeeLight.setStrokeStyle(2, 0x00aa00);
    }

    createWallClock(w, h) {
        const clockX = w/2;
        const clockY = 80;
        
        const clockFace = this.add.circle(clockX, clockY, 40, 0xf5f5dc);
        clockFace.setStrokeStyle(4, 0x2a2a2a);
        
        this.add.circle(clockX, clockY, 35, 0xfffaf0);
        
        for (let i = 0; i < 12; i++) {
            const angle = (i * 30 - 90) * Math.PI / 180;
            const x = clockX + Math.cos(angle) * 28;
            const y = clockY + Math.sin(angle) * 28;
            this.add.circle(x, y, 3, 0x000000);
        }
        
        this.clockHourHand = this.add.rectangle(clockX, clockY, 4, 20, 0x000000).setOrigin(0.5, 1);
        this.clockMinuteHand = this.add.rectangle(clockX, clockY, 2, 28, 0x000000).setOrigin(0.5, 1);
        
        this.add.circle(clockX, clockY, 4, 0x333333);
        
        this.add.text(w/2, clockY + 60, '12:00', { fontSize: '12px', fill: '#aaaaaa', fontFamily: 'Courier' }).setOrigin(0.5);
    }

    createVendingMachine(w, h) {
        const vmX = w - 80;
        const vmY = h - 120;
        
        this.add.rectangle(vmX, vmY, 100, 180, 0x2a3a4a).setStrokeStyle(3, 0x4a5a6a);
        
        const display = this.add.rectangle(vmX, vmY - 60, 80, 40, 0x001a00);
        this.add.text(vmX, vmY - 60, 'GETRÄNKE', { fontSize: '10px', fill: '#00ff00', fontFamily: 'Courier' }).setOrigin(0.5);
        
        const snackColors = [0xff6b6b, 0x6bff6b, 0x6b6bff, 0xffff6b, 0xff6bff, 0x6bffff];
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 2; col++) {
                const shelfX = vmX - 25 + col * 50;
                const shelfY = vmY - 20 + row * 40;
                this.add.rectangle(shelfX, shelfY, 40, 30, 0x1a1a1a).setStrokeStyle(1, 0x3a3a3a);
                this.add.rectangle(shelfX, shelfY - 5, 30, 20, snackColors[row * 2 + col]);
            }
        }
        
        this.add.rectangle(vmX, vmY + 60, 60, 30, 0x333333);
        this.add.text(vmX, vmY + 75, '🪙', { fontSize: '16px' }).setOrigin(0.5);
        
        this.vendingLight = this.add.circle(vmX, vmY - 85, 5, 0xff0000);
    }

    createLamps(w, h) {
        const lampX1 = 250;
        const lampX2 = w - 300;
        
        this.createDeskLamp(lampX1, h/2 + 20);
        
        this.createCeilingLamp(w/2 - 150, 60);
        this.createCeilingLamp(w/2 + 150, 60);
        
        this.flickerLamp = this.add.rectangle(w/2, 40, 80, 15, 0xffffff);
        this.flickerLamp.setStrokeStyle(2, 0xaaaaaa);
        
        this.flickerLight = this.add.rectangle(w/2, 100, 200, 150, 0xffffcc);
        this.flickerLight.setAlpha(0.1);
    }

    createDeskLamp(x, y) {
        this.add.rectangle(x, y + 30, 8, 40, 0x333333);
        
        const shade = this.add.rectangle(x, y + 10, 40, 25, 0x2a5a2a);
        shade.setStrokeStyle(2, 0x3a6a3a);
        
        this.deskLampGlow = this.add.rectangle(x, y + 20, 35, 20, 0xffffaa);
        this.deskLampGlow.setAlpha(0.3);
        
        this.add.circle(x, y + 10, 8, 0x1a3a1a);
    }

    createCeilingLamp(x, y) {
        this.add.rectangle(x, y, 60, 10, 0x4a4a4a);
        
        const bulb = this.add.rectangle(x, y + 10, 30, 15, 0xffffee);
        bulb.setStrokeStyle(1, 0xcccccc);
        
        this.ceilingLight = this.add.circle(x, y + 40, 50, 0xffffcc);
        this.ceilingLight.setAlpha(0.15);
    }

    createDoors(w, h) {
        this.doorLeft = this.add.rectangle(40, h/2, 30, 280, 0x3a2a1a);
        this.doorLeft.setStrokeStyle(3, 0x5a4a3a);
        
        this.add.rectangle(55, h/2 - 100, 15, 50, 0x4a3a2a);
        
        this.add.rectangle(25, h/2 + 120, 8, 40, 0x666666);
        this.add.circle(25, h/2 + 120, 4, 0x888888);
        
        this.add.rectangle(40, h/2 - 170, 50, 25, 0x2a2a2a).setStrokeStyle(1, 0x4a4a4a);
        this.add.text(40, h/2 - 170, 'RAUM 101', { fontSize: '10px', fill: '#aaaaaa', fontFamily: 'Arial' }).setOrigin(0.5);
        
        this.doorLeftText = this.add.text(40, h/2 - 190, '[←] LINKE TÜR', {
            fontSize: '14px', fill: '#00ff00', fontFamily: 'Courier New'
        }).setOrigin(0.5);
        
        this.add.rectangle(40, h/2 + 20, 20, 20, 0x1a1a1a);
        this.add.rectangle(40, h/2 + 60, 20, 20, 0x1a1a1a);
        
        this.doorRight = this.add.rectangle(w - 40, h/2, 30, 280, 0x3a2a1a);
        this.doorRight.setStrokeStyle(3, 0x5a4a3a);
        
        this.add.rectangle(w - 55, h/2 - 100, 15, 50, 0x4a3a2a);
        
        this.add.rectangle(w - 25, h/2 + 120, 8, 40, 0x666666);
        this.add.circle(w - 25, h/2 + 120, 4, 0x888888);
        
        this.add.rectangle(w - 40, h/2 - 170, 50, 25, 0x2a2a2a).setStrokeStyle(1, 0x4a4a4a);
        this.add.text(w - 40, h/2 - 170, 'RAUM 102', { fontSize: '10px', fill: '#aaaaaa', fontFamily: 'Arial' }).setOrigin(0.5);
        
        this.doorRightText = this.add.text(w - 40, h/2 - 190, '[→] RECHTE TÜR', {
            fontSize: '14px', fill: '#00ff00', fontFamily: 'Courier New'
        }).setOrigin(0.5);
        
        this.add.rectangle(w - 40, h/2 + 20, 20, 20, 0x1a1a1a);
        this.add.rectangle(w - 40, h/2 + 60, 20, 20, 0x1a1a1a);
    }

    createInteractiveElements() {
        const w = this.cameras.main.width;
        const h = this.cameras.main.height;

        this.doorLeft.setInteractive({ useHandCursor: true });
        this.doorRight.setInteractive({ useHandCursor: true });
        this.doorLeft.on('pointerdown', () => this.toggleDoor('left'));
        this.doorRight.on('pointerdown', () => this.toggleDoor('right'));

        this.cameraBtn = this.add.text(w/2, h - 100, '[C] KAMERAS', {
            fontSize: '24px', fill: '#ffffff', fontFamily: 'Courier New',
            backgroundColor: '#333333', padding: { x: 20, y: 10 }
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });
        this.cameraBtn.on('pointerdown', () => this.toggleCamera());

        this.helpText = this.add.text(w/2, h - 30, 'SPACE=Kaffee | C=Kamera | ←→=Türen', {
            fontSize: '12px', fill: '#555555', fontFamily: 'Courier New'
        }).setOrigin(0.5);
    }

    setupControls() {
        this.input.keyboard.on('keydown-SPACE', () => this.drinkCoffee());
        this.input.keyboard.on('keydown-LEFT', () => this.toggleDoor('left'));
        this.input.keyboard.on('keydown-RIGHT', () => this.toggleDoor('right'));
        this.input.keyboard.on('keydown-C', () => this.toggleCamera());
        this.input.keyboard.on('keydown-ONE', () => this.skipHour(1));
        this.input.keyboard.on('keydown-TWO', () => this.skipHour(2));
        this.input.keyboard.on('keydown-THREE', () => this.skipHour(3));
        this.input.keyboard.on('keydown-FOUR', () => this.skipHour(4));
        this.input.keyboard.on('keydown-FIVE', () => this.skipHour(5));
        this.input.keyboard.on('keydown-SIX', () => this.skipHour(6));
    }

    skipHour(hour) {
        this.gameTime = (hour / 6) * this.nightDuration;
        GlobalState.currentTime = hour;
    }

    drinkCoffee() {
        const success = this.coffeeSystem.drinkCoffee();
        if (success) {
            this.flashFeedback(0x8B4513, 0xffffff);
        }
    }

    toggleDoor(side) {
        const door = side === 'left' ? this.doorLeft : this.doorRight;
        const isClosed = door.fillColor === 0x00aa00;
        
        door.fillColor = isClosed ? 0x3a2a1a : 0x00aa00;
        
        if (side === 'left') {
            this.batterySystem.setDoorState(!isClosed);
        }
        
        this.events.emit('doorClosed', { side, closed: !isClosed });
    }

    toggleCamera() {
        this.scene.pause('OfficeScene');
        this.scene.launch('CameraScene');
    }

    setupEventListeners() {
        this.events.on('playerFellAsleep', () => {
            this.scene.start('GameOverScene', { 
                antagonist: 'coffee_machine',
                survivalTime: this.gameTime / 1000,
                coffeeConsumed: 100 - GlobalState.coffeeLevel,
                night: GlobalState.currentNight
            });
        });

        this.events.on('batteryDepleted', () => {
            this.scene.start('GameOverScene', { 
                antagonist: 'laptop',
                survivalTime: this.gameTime / 1000,
                coffeeConsumed: 100 - GlobalState.coffeeLevel,
                night: GlobalState.currentNight
            });
        });

        this.events.on('jumpscare', (data) => {
            this.triggerJumpscare(data.antagonist);
        });
        
        this.events.on('koeriWurstDisappear', () => {
            if (this.easterEggSystem) {
                this.easterEggSystem.onKoeriWurstDisappear();
            }
        });
    }

    triggerJumpscare(antagonist) {
        this.cameras.main.shake(300, 0.02);
        this.cameras.main.flash(100, 255, 0, 0);
        
        const jumpscareText = this.add.text(640, 360, `👻 ${antagonist.name} 👻`, {
            fontSize: '72px', fill: '#ff0000', stroke: '#000000', strokeThickness: 6,
            fontFamily: 'Courier New'
        }).setOrigin(0.5);
        
        this.tweens.add({
            targets: jumpscareText,
            scale: 1.5,
            duration: 200,
            yoyo: true
        });

        this.time.delayedCall(1500, () => {
            this.scene.start('GameOverScene', { 
                antagonist: antagonist.id,
                survivalTime: this.gameTime / 1000,
                coffeeConsumed: 100 - GlobalState.coffeeLevel,
                night: GlobalState.currentNight
            });
        });
    }

    flashFeedback(originalColor, flashColor) {
        const mug = this.add.rectangle(640 - 300, 360 + 60, 30, 30, flashColor);
        this.time.delayedCall(100, () => mug.destroy());
    }

    nightCompleted() {
        this.easterEggSystem.onNightComplete();
        const eggsFound = Array.from(this.easterEggSystem.foundEggs);
        GlobalState.secretsFound = [...(GlobalState.secretsFound || []), ...eggsFound];
        
        GlobalState.currentNight++;
        if (GlobalState.currentNight > 6) {
            this.scene.start('VictoryScene', { nightStats: this.nightStats });
        } else {
            this.scene.start('OfficeScene');
            this.scene.stop('UIScene');
            this.scene.launch('UIScene');
        }
    }

    update(time, delta) {
        this.gameTime += delta * this.realTimeMultiplier;
        
        const progress = this.gameTime / this.nightDuration;
        const hour = Math.floor(progress * 6);
        
        if (hour !== GlobalState.currentTime && hour <= 6) {
            GlobalState.currentTime = hour;
        }

        this.coffeeSystem.update(delta);
        this.batterySystem.update(delta);
        this.aiNetwork.update(delta, GlobalState.currentTime);
        
        this.updateAnimations(delta);
        this.updateClock(progress);
    }

    updateAnimations(delta) {
        this.flickerTimer += delta;
        if (this.flickerTimer > 2000 + Math.random() * 3000) {
            this.flickerTimer = 0;
            const flickerDuration = 100 + Math.random() * 200;
            this.tweens.add({
                targets: this.flickerLight,
                alpha: 0.05,
                duration: 50,
                yoyo: true,
                repeat: Math.floor(Math.random() * 5)
            });
        }
        
        this.blinkTimer += delta;
        if (this.blinkTimer > 500) {
            this.blinkTimer = 0;
            
            if (this.vendingLight) {
                this.vendingLight.fillColor = this.vendingLight.fillColor === 0xff0000 ? 0x330000 : 0xff0000;
            }
            
            if (this.coffeeLight) {
                this.coffeeLight.fillColor = this.coffeeLight.fillColor === 0x00ff00 ? 0x003300 : 0x00ff00;
            }
        }
        
        if (this.deskLampGlow) {
            this.deskLampGlow.setAlpha(0.25 + Math.sin(time / 200) * 0.05);
        }
        
        if (this.ceilingLight) {
            this.ceilingLight.setAlpha(0.12 + Math.sin(time / 300) * 0.03);
        }
    }

    updateClock(progress) {
        if (this.clockHourHand && this.clockMinuteHand) {
            const hours = (progress * 6 + 6) % 12;
            const minutes = ((progress * 6 * 60) % 60);
            
            this.clockHourHand.setRotation((hours * 30 - 90) * Math.PI / 180);
            this.clockMinuteHand.setRotation((minutes - 90) * Math.PI / 180);
        }
    }
}