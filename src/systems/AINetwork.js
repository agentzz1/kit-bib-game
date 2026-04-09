import { GlobalState } from '../GlobalState.js';

export const ANTAGONIST_STATES = {
    IDLE: 'idle',
    MOVING: 'moving',
    ATTACKING: 'attacking',
    DEFEATED: 'defeated'
};

export class AINetwork {
    constructor(scene) {
        this.scene = scene;
        this.antagonists = [];
        this.timeProgressionMultiplier = 1;
        
        this.setupAntagonists();
        this.setupListeners();
    }

    setupAntagonists() {
        this.antagonists = [
            {
                id: 'koffein_zombie',
                name: 'Koffein-Zombie',
                state: ANTAGONIST_STATES.IDLE,
                position: 'suedlesesaal',
                targetPosition: 'office_door',
                speed: 3,
                aggression: 0.4,
                attackThreshold: 50,
                defeated: false
            },
            {
                id: 'sortier_o_mat',
                name: 'Sortier-O-Mat 3000',
                state: ANTAGONIST_STATES.IDLE,
                position: 'erdgeschoss',
                targetPosition: 'office_door',
                speed: 1,
                aggression: 0.25,
                attackThreshold: 60,
                defeated: false
            },
            {
                id: 'eduroam_phantom',
                name: 'Eduroam-Phantom',
                state: ANTAGONIST_STATES.IDLE,
                position: 'system',
                targetPosition: 'network',
                speed: 0,
                aggression: 0.35,
                attackThreshold: 40,
                attackCooldown: 30000,
                lastAttack: 0,
                defeated: false
            },
            {
                id: 'bibliothekarin',
                name: 'Phantom-Bibliothekarin',
                state: ANTAGONIST_STATES.IDLE,
                position: 'referat',
                targetPosition: 'office',
                speed: 1.5,
                aggression: 0.3,
                attackThreshold: 70,
                noiseLevel: 0,
                defeated: false
            }
        ];
    }

    setupListeners() {
        this.scene.events.on('coffeeDrank', () => {
            this.handleNoiseEvent(30);
        });

        this.scene.events.on('doorClosed', () => {
            this.handleNoiseEvent(20);
        });

        this.scene.events.on('cameraUsed', () => {
            this.handleNoiseEvent(10);
        });

        GlobalState.addEventListener('nightChanged', () => {
            this.resetAntagonists();
        });
    }

    handleNoiseEvent(noiseAmount) {
        const bibliothekarin = this.antagonists.find(a => a.id === 'bibliothekarin');
        if (bibliothekarin) {
            bibliothekarin.noiseLevel += noiseAmount;
            if (bibliothekarin.noiseLevel >= bibliothekarin.attackThreshold) {
                this.triggerAttack('bibliothekarin');
            }
        }
    }

    triggerAttack(antagonistId) {
        const antagonist = this.antagonists.find(a => a.id === antagonistId);
        if (antagonist) {
            antagonist.state = ANTAGONIST_STATES.ATTACKING;
            this.scene.events.emit('antagonistAttacking', { antagonist });
        }
    }

    update(delta, currentTime) {
        if (GlobalState.isEduroamDown) return;

        const nightDifficulty = GlobalState.currentNight;
        const timeFactor = currentTime / 6;

        this.antagonists.forEach(antagonist => {
            if (antagonist.defeated) return;

            const attackChance = antagonist.aggression * nightDifficulty * timeFactor;

            if (Math.random() < attackChance * (delta / 1000)) {
                this.moveAntagonist(antagonist);
            }

            if (antagonist.position === 'office_door' || antagonist.position === 'office') {
                this.scene.events.emit('jumpscare', { antagonist });
            }
        });
    }

    moveAntagonist(antagonist) {
        const path = this.getPathToOffice(antagonist.position);
        if (path.length > 0) {
            antagonist.position = path[0];
            antagonist.state = ANTAGONIST_STATES.MOVING;
            this.scene.events.emit('antagonistMoved', { antagonist });
        }
    }

    getPathToOffice(currentPos) {
        const paths = {
            'suedlesesaal': ['treppenhaus', 'flur', 'office_door'],
            'erdgeschoss': ['aufzug', 'flur', 'office_door'],
            'referat': ['flur', 'office_door'],
            'system': [],
            'treppenhaus': ['flur', 'office_door'],
            'flur': ['office_door']
        };
        return paths[currentPos] || [];
    }

    resetAntagonists() {
        this.antagonists.forEach(a => {
            a.state = ANTAGONIST_STATES.IDLE;
            a.position = this.getStartPosition(a.id);
            a.defeated = false;
            a.noiseLevel = 0;
        });
    }

    getStartPosition(antagonistId) {
        const positions = {
            'koffein_zombie': 'suedlesesaal',
            'sortier_o_mat': 'erdgeschoss',
            'eduroam_phantom': 'system',
            'bibliothekarin': 'referat'
        };
        return positions[antagonistId] || 'suedlesesaal';
    }

    getAntagonist(id) {
        return this.antagonists.find(a => a.id === id);
    }
}