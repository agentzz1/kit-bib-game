import { GlobalState } from '../GlobalState.js';

export class CoffeeSystem {
    constructor(scene) {
        this.scene = scene;
        this.drinkCooldown = false;
        this.drinkAmount = 15;
        this.decayRate = 1;
        
        this.setupListeners();
    }

    setupListeners() {
        GlobalState.addEventListener('nightChanged', () => {
            this.resetCoffee();
        });
    }

    resetCoffee() {
        GlobalState.coffeeLevel = 100;
        this.drinkCooldown = false;
    }

    drinkCoffee() {
        if (this.drinkCooldown) return false;
        if (GlobalState.coffeeLevel >= 100) return false;

        GlobalState.coffeeLevel += this.drinkAmount;
        this.drinkCooldown = true;

        this.scene.sound.play('coffee_sip', { volume: 0.3 });

        this.scene.time.delayedCall(2000, () => {
            this.drinkCooldown = false;
            this.scene.events.emit('coffeeCooldownReady');
        });

        this.scene.events.emit('coffeeDrank');
        return true;
    }

    update(delta) {
        const decayPerSecond = this.decayRate * (delta / 1000);
        GlobalState.coffeeLevel -= decayPerSecond;

        if (GlobalState.coffeeLevel <= 0) {
            this.scene.events.emit('playerFellAsleep');
        }
    }
}