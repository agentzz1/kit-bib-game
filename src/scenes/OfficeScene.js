import { GlobalState } from '../GlobalState.js';
import { CoffeeSystem } from '../systems/CoffeeSystem.js';
import { BatterySystem } from '../systems/BatterySystem.js';
import { AINetwork } from '../systems/AINetwork.js';

export class OfficeScene extends Phaser.Scene {
    constructor() {
        super({ key: 'OfficeScene' });
        this.gameTime = 0;
        this.realTimeMultiplier = 10;
        this.nightDuration = 360000;
    }

    create() {
        console.log("OfficeScene geladen: Das Spiel beginnt!");
        this.cameras.main.setBackgroundColor('#0a0a0a');

        this.coffeeSystem = new CoffeeSystem(this);
        this.batterySystem = new BatterySystem(this);
        this.aiNetwork = new AINetwork(this);

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

        this.add.rectangle(100, 360, 150, 400, 0x222222).setStrokeStyle(2, 0x333333);
        this.add.rectangle(w - 100, 360, 150, 400, 0x222222).setStrokeStyle(2, 0x333333);

        this.add.rectangle(w/2 - 200, h/2 + 80, 250, 80, 0x2a2a2a).setStrokeStyle(1, 0x3a3a3a);
        
        this.laptopScreen = this.add.rectangle(w/2 - 200, h/2 + 40, 120, 70, 0x001100);
        this.add.rectangle(w/2 - 200, h/2 + 40, 115, 65, 0x002200).setStrokeStyle(1, 0x004400);

        this.add.rectangle(w/2 - 300, h/2 + 60, 30, 30, 0x8B4513);
        this.add.text(w/2 - 300, h/2 + 100, '☕', { fontSize: '16px' }).setOrigin(0.5);
    }

    createInteractiveElements() {
        const w = this.cameras.main.width;
        const h = this.cameras.main.height;

        this.doorLeft = this.add.rectangle(40, h/2, 20, 300, 0x333333);
        this.doorLeftText = this.add.text(40, h/2 - 170, 'LINKE TÜR\n[←]', {
            fontSize: '14px', fill: '#00ff00', fontFamily: 'Courier New', align: 'center'
        }).setOrigin(0.5);

        this.doorRight = this.add.rectangle(w - 40, h/2, 20, 300, 0x333333);
        this.doorRightText = this.add.text(w - 40, h/2 - 170, 'RECHTE TÜR\n[→]', {
            fontSize: '14px', fill: '#00ff00', fontFamily: 'Courier New', align: 'center'
        }).setOrigin(0.5);

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
        
        door.fillColor = isClosed ? 0x333333 : 0x00aa00;
        
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
            this.scene.start('GameOverScene', { reason: 'Du bist eingeschlafen! ☕' });
        });

        this.events.on('batteryDepleted', () => {
            this.scene.start('GameOverScene', { reason: 'Akku leer! 🔋' });
        });

        this.events.on('jumpscare', (data) => {
            this.triggerJumpscare(data.antagonist);
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
            this.scene.start('GameOverScene', { reason: `Von ${antagonist.name} erwischt!` });
        });
    }

    flashFeedback(originalColor, flashColor) {
        const mug = this.add.rectangle(640 - 300, 360 + 60, 30, 30, flashColor);
        this.time.delayedCall(100, () => mug.destroy());
    }

    nightCompleted() {
        GlobalState.currentNight++;
        if (GlobalState.currentNight > 3) {
            this.scene.start('VictoryScene');
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
    }
}