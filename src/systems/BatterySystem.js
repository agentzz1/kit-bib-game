import { GlobalState } from '../GlobalState.js';

export class BatterySystem {
    constructor(scene) {
        this.scene = scene;
        this.baseDrainRate = 1;
        this.cameraDrainMultiplier = 3;
        this.doorDrainRate = 2;
        
        this.isCameraActive = false;
        this.isDoorActive = false;
        
        this.setupListeners();
    }

    setupListeners() {
        GlobalState.addEventListener('batteryChanged', (e) => {
            if (e.detail <= 0) {
                this.scene.events.emit('batteryDepleted');
            }
        });
    }

    setCameraState(active) {
        this.isCameraActive = active;
    }

    setDoorState(active) {
        this.isDoorActive = active;
    }

    getCurrentDrainRate() {
        let drain = this.baseDrainRate;
        if (this.isCameraActive) drain += this.baseDrainRate * this.cameraDrainMultiplier;
        if (this.isDoorActive) drain += this.doorDrainRate;
        return drain;
    }

    update(delta) {
        const drainPerSecond = this.getCurrentDrainRate();
        const drainThisFrame = drainPerSecond * (delta / 1000);
        
        GlobalState.laptopBattery -= drainThisFrame;
    }

    resetBattery() {
        GlobalState.laptopBattery = 100;
        this.isCameraActive = false;
        this.isDoorActive = false;
    }
}