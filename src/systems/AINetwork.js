import { GlobalState } from '../GlobalState.js';

export const ANTAGONIST_STATES = {
    IDLE: 'idle',
    PATROLLING: 'patrolling',
    STALKING: 'stalking',
    ATTACKING: 'attacking',
    DEFEATED: 'defeated'
};

export const PATROL_BEHAVIORS = {
    FIXED_PATH: 'fixed_path',
    RANDOM_WAYPOINTS: 'random_waypoints',
    AREA_SEARCH: 'area_search'
};

export const ATTACK_PATTERNS = {
    DIRECT: 'direct',
    SURPRISE: 'surprise',
    DISTRACTION: 'distraction',
    PHASE: 'phase'
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
                name: 'Der 15. Semester',
                state: ANTAGONIST_STATES.IDLE,
                position: 'suedlesesaal',
                targetPosition: 'office_door',
                speed: 3,
                aggression: 0.4,
                attackThreshold: 50,
                defeated: false,
                behavior: {
                    type: PATROL_BEHAVIORS.RANDOM_WAYPOINTS,
                    waypoints: ['suedlesesaal', 'treppenhaus', 'flur', 'lesesaaal'],
                    currentWaypointIndex: 0,
                    stalkDistance: 8,
                    stalkSpeed: 4
                },
                attackPattern: ATTACK_PATTERNS.DIRECT,
                sound: 'zombie_groan',
                visual: 'glitch_effect',
                defenseWeakness: 'bright_light',
                defenseStrength: 0.6
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
                defeated: false,
                behavior: {
                    type: PATROL_BEHAVIORS.FIXED_PATH,
                    waypoints: ['erdgeschoss', 'aufzug', 'flur', 'erdgeschoss'],
                    currentWaypointIndex: 0,
                    stalkDistance: 5,
                    stalkSpeed: 2
                },
                attackPattern: ATTACK_PATTERNS.DISTRACTION,
                sound: 'mechanical_whir',
                visual: 'static_noise',
                defenseWeakness: 'power_outage',
                defenseStrength: 0.4
            },
            {
                id: 'scanner',
                name: 'Der Scanner',
                state: ANTAGONIST_STATES.IDLE,
                position: 'kopierer',
                targetPosition: 'office_door',
                speed: 2.5,
                aggression: 0.35,
                attackThreshold: 45,
                defeated: false,
                behavior: {
                    type: PATROL_BEHAVIORS.AREA_SEARCH,
                    waypoints: ['kopierer', 'flur', 'lesesaaal', 'kopierer'],
                    currentWaypointIndex: 0,
                    stalkDistance: 6,
                    stalkSpeed: 3,
                    phaseInTime: 5000,
                    isPhasing: false
                },
                attackPattern: ATTACK_PATTERNS.SURPRISE,
                sound: 'scanner_beep',
                visual: 'ghost_scan',
                defenseWeakness: 'camera_flash',
                defenseStrength: 0.5,
                appearsAt: 'kopierer'
            },
            {
                id: 'mathe_hilfe',
                name: 'Die Mathe-Hilfe',
                state: ANTAGONIST_STATES.IDLE,
                position: 'mathebereich',
                targetPosition: 'office_door',
                speed: 1.8,
                aggression: 0.45,
                attackThreshold: 55,
                defeated: false,
                behavior: {
                    type: PATROL_BEHAVIORS.RANDOM_WAYPOINTS,
                    waypoints: ['mathebereich', 'flur', 'treppenhaus', 'referat', 'mathebereich'],
                    currentWaypointIndex: 0,
                    stalkDistance: 10,
                    stalkSpeed: 2.5,
                    dialogueTrigger: 'Kann ich helfen?',
                    isStalking: false
                },
                attackPattern: ATTACK_PATTERNS.PHASE,
                sound: 'whisper_math',
                visual: 'distortion_shadow',
                defenseWeakness: 'ignore_conversation',
                defenseStrength: 0.7,
                dialogueCooldown: 15000,
                lastDialogueTime: 0
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
                defeated: false,
                behavior: {
                    type: PATROL_BEHAVIORS.AREA_SEARCH,
                    waypoints: [],
                    currentWaypointIndex: 0,
                    stalkDistance: 0,
                    stalkSpeed: 0,
                    isDigital: true
                },
                attackPattern: ATTACK_PATTERNS.SURPRISE,
                sound: 'wifi_interference',
                visual: 'glitch_screen',
                defenseWeakness: 'ethernet_cable',
                defenseStrength: 0.8
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
                defeated: false,
                behavior: {
                    type: PATROL_BEHAVIORS.FIXED_PATH,
                    waypoints: ['referat', 'flur', 'lesesaaal', 'referat'],
                    currentWaypointIndex: 0,
                    stalkDistance: 7,
                    stalkSpeed: 2
                },
                attackPattern: ATTACK_PATTERNS.DIRECT,
                sound: 'shushing',
                visual: 'fog_appear',
                defenseWeakness: 'quiet_behavior',
                defenseStrength: 0.5
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

        this.scene.events.on('lightUsed', (data) => {
            this.handleDefenseAttempt(data);
        });

        this.scene.events.on('playerMoved', (data) => {
            this.handlePlayerMovement(data);
        });

        GlobalState.addEventListener('nightChanged', () => {
            this.resetAntagonists();
        });
    }

    handleNoiseEvent(noiseAmount) {
        this.antagonists.forEach(antagonist => {
            if (antagonist.defeated) return;
            
            if (antagonist.id === 'bibliothekarin') {
                antagonist.noiseLevel += noiseAmount;
                if (antagonist.noiseLevel >= antagonist.attackThreshold) {
                    this.triggerAttack('bibliothekarin');
                }
            }

            if (antagonist.behavior && antagonist.behavior.stalkDistance > 0) {
                if (noiseAmount > 15) {
                    this.initiateStalking(antagonist);
                }
            }
        });
    }

    handleDefenseAttempt(data) {
        const { defenseType, antagonistId } = data;
        
        this.antagonists.forEach(antagonist => {
            if (antagonist.defeated) return;
            if (antagonist.id !== antagonistId && antagonistId !== 'all') return;
            
            if (antagonist.defenseWeakness === defenseType) {
                this.defeatAntagonist(antagonist);
                this.scene.events.emit('defenseSuccess', { 
                    antagonist, 
                    defenseType 
                });
            } else if (defenseType === 'camera_flash' && antagonist.id === 'scanner') {
                this.antagonistPhasesOut(antagonist);
            }
        });
    }

    handlePlayerMovement(data) {
        const { position, time } = data;
        
        this.antagonists.forEach(antagonist => {
            if (antagonist.defeated) return;
            if (!antagonist.behavior) return;
            
            const distance = this.calculateDistance(position, antagonist.position);
            
            if (distance < antagonist.behavior.stalkDistance && distance > 0) {
                this.initiateStalking(antagonist);
            }
            
            if (antagonist.id === 'mathe_hilfe') {
                this.handleMatheHilfeDialogue(antagonist, time);
            }
        });
    }

    initiateStalking(antagonist) {
        if (antagonist.state !== ANTAGONIST_STATES.STALKING) {
            antagonist.state = ANTAGONIST_STATES.STALKING;
            this.scene.events.emit('antagonistStalking', { antagonist });
            
            if (antagonist.id === 'mathe_hilfe') {
                this.scene.events.emit('playSound', { 
                    sound: 'whisper_math',
                    subtitle: antagonist.behavior.dialogueTrigger
                });
            }
        }
    }

    handleMatheHilfeDialogue(antagonist, currentTime) {
        if (currentTime - antagonist.lastDialogueTime > antagonist.dialogueCooldown) {
            const playerPosition = this.getPlayerPosition();
            const distance = this.calculateDistance(playerPosition, antagonist.position);
            
            if (distance < 15 && distance > 0) {
                antagonist.lastDialogueTime = currentTime;
                this.scene.events.emit('playSound', { 
                    sound: 'whisper_math',
                    subtitle: antagonist.behavior.dialogueTrigger
                });
            }
        }
    }

    antagonistPhasesOut(antagonist) {
        antagonist.behavior.isPhasing = true;
        antagonist.state = ANTAGONIST_STATES.IDLE;
        
        setTimeout(() => {
            antagonist.behavior.isPhasing = false;
            antagonist.behavior.currentWaypointIndex = 0;
            antagonist.position = antagonist.behavior.waypoints[0];
            this.scene.events.emit('antagonistTeleported', { antagonist });
        }, antagonist.behavior.phaseInTime);
    }

    calculateDistance(pos1, pos2) {
        const positions = {
            'suedlesesaal': { x: 0, y: 100 },
            'erdgeschoss': { x: 50, y: 50 },
            'referat': { x: 100, y: 100 },
            'flur': { x: 50, y: 100 },
            'treppenhaus': { x: 25, y: 75 },
            'lesesaaal': { x: 75, y: 125 },
            'mathebereich': { x: 125, y: 50 },
            'kopierer': { x: 50, y: 25 },
            'office_door': { x: 50, y: 125 },
            'office': { x: 50, y: 130 },
            'system': { x: 0, y: 0 },
            'network': { x: 0, y: 0 }
        };
        
        const p1 = positions[pos1] || { x: 0, y: 0 };
        const p2 = positions[pos2] || { x: 0, y: 0 };
        
        return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
    }

    getPlayerPosition() {
        return this.scene.player?.position || 'office';
    }

    triggerAttack(antagonistId) {
        const antagonist = this.antagonists.find(a => a.id === antagonistId);
        if (antagonist) {
            antagonist.state = ANTAGONIST_STATES.ATTACKING;
            this.scene.events.emit('antagonistAttacking', { antagonist });
            
            if (antagonist.attackPattern === ATTACK_PATTERNS.SURPRISE) {
                this.playAttackSound(antagonist);
            }
        }
    }

    playAttackSound(antagonist) {
        this.scene.events.emit('playSound', { sound: antagonist.sound });
        this.scene.events.emit('showVisual', { 
            visual: antagonist.visual,
            antagonist: antagonist.id 
        });
    }

    defeatAntagonist(antagonist) {
        antagonist.defeated = true;
        antagonist.state = ANTAGONIST_STATES.DEFEATED;
        this.scene.events.emit('antagonistDefeated', { antagonist });
    }

    update(delta, currentTime) {
        if (GlobalState.isEduroamDown) return;

        const nightDifficulty = GlobalState.currentNight;
        const timeFactor = currentTime / 6;

        this.antagonists.forEach(antagonist => {
            if (antagonist.defeated) return;

            if (antagonist.state === ANTAGONIST_STATES.STALKING) {
                this.updateStalking(antagonist, delta);
                return;
            }

            if (antagonist.state === ANTAGONIST_STATES.PATROLLING) {
                this.updatePatrol(antagonist, delta);
            }

            const attackChance = antagonist.aggression * nightDifficulty * timeFactor;

            if (Math.random() < attackChance * (delta / 1000)) {
                if (antagonist.behavior && antagonist.behavior.isPhasing) return;
                this.moveAntagonist(antagonist);
            }

            if (antagonist.position === 'office_door' || antagonist.position === 'office') {
                this.scene.events.emit('jumpscare', { antagonist });
            }
        });
    }

    updateStalking(antagonist, delta) {
        const playerPos = this.getPlayerPosition();
        const path = this.getPathToOffice(antagonist.position);
        
        const nextPosition = path[0];
        if (nextPosition) {
            const moveChance = antagonist.behavior.stalkSpeed * (delta / 1000);
            if (Math.random() < moveChance) {
                antagonist.position = nextPosition;
                this.scene.events.emit('antagonistStalkingMove', { 
                    antagonist, 
                    position: nextPosition 
                });
            }
        }

        if (antagonist.position === 'office_door' || antagonist.position === 'office') {
            this.scene.events.emit('jumpscare', { antagonist });
        }
    }

    updatePatrol(antagonist, delta) {
        if (!antagonist.behavior || !antagonist.behavior.waypoints) return;
        
        const waypoints = antagonist.behavior.waypoints;
        const currentIndex = antagonist.behavior.currentWaypointIndex;
        
        if (waypoints.length === 0) return;

        const moveChance = antagonist.speed * (delta / 1000) * 0.3;
        
        if (Math.random() < moveChance) {
            let nextIndex;
            
            if (antagonist.behavior.type === PATROL_BEHAVIORS.RANDOM_WAYPOINTS) {
                nextIndex = Math.floor(Math.random() * waypoints.length);
            } else {
                nextIndex = (currentIndex + 1) % waypoints.length;
            }
            
            antagonist.behavior.currentWaypointIndex = nextIndex;
            antagonist.position = waypoints[nextIndex];
            
            this.scene.events.emit('antagonistPatrolled', { 
                antagonist,
                waypoint: waypoints[nextIndex]
            });
        }
    }

    moveAntagonist(antagonist) {
        const path = this.getPathToOffice(antagonist.position);
        if (path.length > 0) {
            antagonist.position = path[0];
            antagonist.state = ANTAGONIST_STATES.MOVING;
            this.scene.events.emit('antagonistMoved', { antagonist });
            
            if (Math.random() < 0.3) {
                this.playAttackSound(antagonist);
            }
        }
    }

    getPathToOffice(currentPos) {
        const paths = {
            'suedlesesaal': ['treppenhaus', 'flur', 'office_door'],
            'erdgeschoss': ['aufzug', 'flur', 'office_door'],
            'referat': ['flur', 'office_door'],
            'system': [],
            'treppenhaus': ['flur', 'office_door'],
            'flur': ['office_door'],
            'lesesaaal': ['flur', 'office_door'],
            'kopierer': ['flur', 'office_door'],
            'mathebereich': ['flur', 'office_door'],
            'aufzug': ['flur', 'office_door']
        };
        return paths[currentPos] || [];
    }

    resetAntagonists() {
        this.antagonists.forEach(a => {
            a.state = ANTAGONIST_STATES.IDLE;
            a.position = this.getStartPosition(a.id);
            a.defeated = false;
            a.noiseLevel = 0;
            if (a.behavior) {
                a.behavior.currentWaypointIndex = 0;
                a.behavior.isPhasing = false;
            }
            if (a.id === 'mathe_hilfe') {
                a.lastDialogueTime = 0;
            }
        });
    }

    getStartPosition(antagonistId) {
        const positions = {
            'koffein_zombie': 'suedlesesaal',
            'sortier_o_mat': 'erdgeschoss',
            'scanner': 'kopierer',
            'mathe_hilfe': 'mathebereich',
            'eduroam_phantom': 'system',
            'bibliothekarin': 'referat'
        };
        return positions[antagonistId] || 'suedlesesaal';
    }

    getAntagonist(id) {
        return this.antagonists.find(a => a.id === id);
    }

    getAllAntagonists() {
        return this.antagonists;
    }

    getActiveAntagonists() {
        return this.antagonists.filter(a => !a.defeated);
    }
}