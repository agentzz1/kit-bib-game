class GameState extends EventTarget {
    constructor() {
        super();
        this._coffeeLevel = 100;
        this._laptopBattery = 100;
        this._currentTime = 0;
        this._currentNight = 1;
        this._isEduroamDown = false;
        this._secretsFound = [];
    }

    get secretsFound() { return this._secretsFound; }
    set secretsFound(value) {
        this._secretsFound = value;
        this.dispatchEvent(new CustomEvent('secretsChanged', { detail: this._secretsFound }));
    }

    get coffeeLevel() { return this._coffeeLevel; }
    set coffeeLevel(value) {
        this._coffeeLevel = Math.max(0, Math.min(100, value));
        this.dispatchEvent(new CustomEvent('coffeeChanged', { detail: this._coffeeLevel }));
    }

    get laptopBattery() { return this._laptopBattery; }
    set laptopBattery(value) {
        this._laptopBattery = Math.max(0, Math.min(100, value));
        this.dispatchEvent(new CustomEvent('batteryChanged', { detail: this._laptopBattery }));
    }

    get currentTime() { return this._currentTime; }
    set currentTime(value) {
        this._currentTime = Math.min(6, value);
        this.dispatchEvent(new CustomEvent('timeChanged', { detail: this._currentTime }));
    }

    get currentNight() { return this._currentNight; }
    set currentNight(value) {
        this._currentNight = value;
        this.dispatchEvent(new CustomEvent('nightChanged', { detail: this._currentNight }));
    }

    get isEduroamDown() { return this._isEduroamDown; }
    set isEduroamDown(value) {
        this._isEduroamDown = value;
        this.dispatchEvent(new CustomEvent('eduroamStatusChanged', { detail: this._isEduroamDown }));
    }
}

export const GlobalState = new GameState();