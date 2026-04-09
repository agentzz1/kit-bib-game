import { GlobalState } from '../GlobalState.js';

export class UIScene extends Phaser.Scene {
    constructor() {
        super({ key: 'UIScene' });
    }

    create() {
        console.log("UIScene geladen: HUD aktiv.");

        this.coffeeLabel = this.add.text(20, 20, '☕ KAFFEE', {
            fontSize: '18px', fill: '#00ff00', fontFamily: 'Courier New'
        });
        this.coffeeBarBg = this.add.rectangle(20, 50, 200, 20, 0x222222);
        this.coffeeBar = this.add.rectangle(20, 50, 200, 20, 0x8B4513);

        this.batteryLabel = this.add.text(20, 80, '🔋 AKKU', {
            fontSize: '18px', fill: '#00ff00', fontFamily: 'Courier New'
        });
        this.batteryBarBg = this.add.rectangle(20, 110, 200, 20, 0x222222);
        this.batteryBar = this.add.rectangle(20, 110, 200, 20, 0x00ff00);

        this.timeLabel = this.add.text(1060, 20, '12:00', {
            fontSize: '32px', fill: '#00ff00', fontFamily: 'Courier New'
        }).setOrigin(1, 0);
        
        this.nightLabel = this.add.text(1060, 60, 'Nacht 1', {
            fontSize: '18px', fill: '#ff0000', fontFamily: 'Courier New'
        }).setOrigin(1, 0);

        this.eduroamWarning = this.add.text(640, 50, '⚠ EDUROAM AUSFALL!', {
            fontSize: '24px', fill: '#ff0000', fontFamily: 'Courier New',
            backgroundColor: '#000000', padding: { x: 10, y: 5 }
        }).setOrigin(0.5).setVisible(false);

        GlobalState.addEventListener('coffeeChanged', (e) => this.updateCoffee(e.detail));
        GlobalState.addEventListener('batteryChanged', (e) => this.updateBattery(e.detail));
        GlobalState.addEventListener('timeChanged', (e) => this.updateTime(e.detail));
        GlobalState.addEventListener('nightChanged', (e) => this.updateNight(e.detail));
        GlobalState.addEventListener('eduroamStatusChanged', (e) => this.updateEduroam(e.detail));
    }

    updateCoffee(level) {
        const width = (level / 100) * 200;
        this.coffeeBar.width = Math.max(0, width);
        
        if (level < 30) {
            this.coffeeBar.fillColor = 0xff0000;
            this.coffeeLabel.setColor('#ff0000');
        } else {
            this.coffeeBar.fillColor = 0x8B4513;
            this.coffeeLabel.setColor('#00ff00');
        }
    }

    updateBattery(level) {
        const width = (level / 100) * 200;
        this.batteryBar.width = Math.max(0, width);
        
        if (level < 20) {
            this.batteryBar.fillColor = 0xff0000;
            this.batteryLabel.setColor('#ff0000');
        } else {
            this.batteryBar.fillColor = 0x00ff00;
            this.batteryLabel.setColor('#00ff00');
        }
    }

    updateTime(hour) {
        const displayHour = hour === 0 ? 12 : hour;
        const amPm = hour < 12 ? 'AM' : '';
        this.timeLabel.setText(`${displayHour}:00 ${amPm}`);
    }

    updateNight(night) {
        this.nightLabel.setText(`Nacht ${night}`);
    }

    updateEduroam(isDown) {
        this.eduroamWarning.setVisible(isDown);
    }

    update() {
    }
}