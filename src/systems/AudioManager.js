export const AUDIO_CONFIG = {
    'coffee_sip': { key: 'coffee_sip', path: 'assets/audio/coffee_sip.mp3', volume: 0.3 },
    'door_close': { key: 'door_close', path: 'assets/audio/door_close.mp3', volume: 0.5 },
    'door_open': { key: 'door_open', path: 'assets/audio/door_open.mp3', volume: 0.5 },
    'camera_switch': { key: 'camera_switch', path: 'assets/audio/camera_switch.mp3', volume: 0.4 },
    'jumpscare': { key: 'jumpscare', path: 'assets/audio/jumpscare.mp3', volume: 1.0 },
    'eduroam_down': { key: 'eduroam_down', path: 'assets/audio/eduroam_down.mp3', volume: 0.6 },
    'clock_tick': { key: 'clock_tick', path: 'assets/audio/clock_tick.mp3', volume: 0.2 },
    'ambient_hum': { key: 'ambient_hum', path: 'assets/audio/ambient_hum.mp3', volume: 0.3, loop: true },
    'footsteps': { key: 'footsteps', path: 'assets/audio/footsteps.mp3', volume: 0.4 },
    'door_rattle': { key: 'door_rattle', path: 'assets/audio/door_rattle.mp3', volume: 0.5 }
};

export const SOUND_EVENTS = {
    DOOR_OPEN: 'door_open',
    DOOR_CLOSE: 'door_close',
    DOOR_RATTLE: 'door_rattle',
    FOOTSTEP: 'footstep',
    CAMERA_SWITCH: 'camera_switch',
    JUMPSCARE: 'jumpscare',
    COFFEE_SIP: 'coffee_sip',
    CLOCK_TICK: 'clock_tick',
    EDUROAM_GLITCH: 'eduroam_glitch',
    AMBIENT_START: 'ambient_start',
    AMBIENT_STOP: 'ambient_stop'
};

export class AudioManager {
    constructor(scene) {
        this.scene = scene;
        this.sounds = {};
        this.music = {};
        this.config = AUDIO_CONFIG;
        this.isMuted = false;
        
        this.audioContext = null;
        this.ambientNodes = {};
        this.activeAmbients = new Set();
        this.eventListeners = new Map();
        
        this.footstepInterval = null;
        this.clockTickInterval = null;
        this.ambientLayers = {};
    }

    preload() {
    }

    create() {
        this.initWebAudio();
        this.setupEventListeners();
    }

    initWebAudio() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.masterGain = this.audioContext.createGain();
            this.masterGain.connect(this.audioContext.destination);
            this.masterGain.gain.value = 0.7;
        } catch (e) {
            console.warn('Web Audio API not supported');
        }
    }

    setupEventListeners() {
        this.on(SOUND_EVENTS.DOOR_OPEN, () => this.playDoorOpen());
        this.on(SOUND_EVENTS.DOOR_CLOSE, () => this.playDoorClose());
        this.on(SOUND_EVENTS.DOOR_RATTLE, () => this.playDoorRattle());
        this.on(SOUND_EVENTS.CAMERA_SWITCH, () => this.playCameraSwitch());
        this.on(SOUND_EVENTS.JUMPSCARE, () => this.playJumpscare());
        this.on(SOUND_EVENTS.COFFEE_SIP, () => this.playCoffeeSip());
        this.on(SOUND_EVENTS.CLOCK_TICK, () => this.playClockTick());
        this.on(SOUND_EVENTS.EDUROAM_GLITCH, () => this.playEduroamGlitch());
        this.on(SOUND_EVENTS.AMBIENT_START, () => this.startAmbience());
        this.on(SOUND_EVENTS.AMBIENT_STOP, () => this.stopAmbience());
    }

    on(event, callback) {
        if (!this.eventListeners.has(event)) {
            this.eventListeners.set(event, []);
        }
        this.eventListeners.get(event).push(callback);
    }

    emit(event, ...args) {
        const listeners = this.eventListeners.get(event);
        if (listeners) {
            listeners.forEach(cb => cb(...args));
        }
    }

    generatePlaceholderSound(type, duration = 1) {
        if (!this.audioContext) return null;
        
        const sampleRate = this.audioContext.sampleRate;
        const buffer = this.audioContext.createBuffer(2, sampleRate * duration, sampleRate);
        
        for (let channel = 0; channel < 2; channel++) {
            const data = buffer.getChannelData(channel);
            for (let i = 0; i < data.length; i++) {
                data[i] = 0;
            }
        }
        
        return buffer;
    }

    playGeneratedSound(type, options = {}) {
        if (!this.audioContext || this.isMuted) return;
        
        const {
            duration = 1,
            frequency = 440,
            volume = 0.5,
            decay = 0.1,
            type: waveType = 'sine'
        } = options;

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.type = waveType;
        oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
        
        gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration);
        
        oscillator.connect(gainNode);
        gainNode.connect(this.masterGain);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + duration);
    }

    playDoorOpen() {
        if (this.sounds['door_open']) {
            this.play('door_open');
        } else {
            this.playGeneratedSound('door_open', {
                duration: 0.8,
                frequency: 150,
                volume: 0.4,
                decay: 0.3,
                type: 'sawtooth'
            });
        }
    }

    playDoorClose() {
        if (this.sounds['door_close']) {
            this.play('door_close');
        } else {
            this.playGeneratedSound('door_close', {
                duration: 0.6,
                frequency: 100,
                volume: 0.5,
                decay: 0.2,
                type: 'square'
            });
        }
    }

    playDoorRattle() {
        if (this.sounds['door_rattle']) {
            this.play('door_rattle');
        } else {
            for (let i = 0; i < 3; i++) {
                setTimeout(() => {
                    this.playGeneratedSound('door_rattle', {
                        duration: 0.15,
                        frequency: 200 + Math.random() * 100,
                        volume: 0.3,
                        type: 'square'
                    });
                }, i * 200);
            }
        }
    }

    playFootstep(isHeavy = false) {
        if (this.sounds['footsteps']) {
            this.play('footsteps');
        } else {
            this.playGeneratedSound('footstep', {
                duration: 0.15,
                frequency: isHeavy ? 80 : 120,
                volume: isHeavy ? 0.6 : 0.3,
                type: 'triangle'
            });
        }
    }

    startFootsteps(interval = 600) {
        if (this.footstepInterval) return;
        this.footstepInterval = setInterval(() => {
            this.playFootstep(true);
        }, interval);
    }

    stopFootsteps() {
        if (this.footstepInterval) {
            clearInterval(this.footstepInterval);
            this.footstepInterval = null;
        }
    }

    playCameraSwitch() {
        if (this.sounds['camera_switch']) {
            this.play('camera_switch');
        } else {
            this.playGeneratedSound('camera_switch', {
                duration: 0.3,
                frequency: 800,
                volume: 0.4,
                type: 'square'
            });
            setTimeout(() => {
                this.playGeneratedSound('camera_switch', {
                    duration: 0.2,
                    frequency: 1200,
                    volume: 0.3,
                    type: 'sine'
                });
            }, 100);
        }
    }

    playJumpscare() {
        if (this.sounds['jumpscare']) {
            this.play('jumpscare');
        } else {
            this.playGeneratedSound('jumpscare', {
                duration: 1.5,
                frequency: 200,
                volume: 1.0,
                type: 'sawtooth'
            });
            
            for (let i = 0; i < 10; i++) {
                setTimeout(() => {
                    this.playGeneratedSound('jumpscare_burst', {
                        duration: 0.1,
                        frequency: 300 + Math.random() * 500,
                        volume: 0.8,
                        type: 'square'
                    });
                }, i * 100);
            }
        }
    }

    playCoffeeSip() {
        if (this.sounds['coffee_sip']) {
            this.play('coffee_sip');
        } else {
            this.playGeneratedSound('coffee_sip', {
                duration: 0.5,
                frequency: 300,
                volume: 0.3,
                type: 'sine'
            });
        }
    }

    playClockTick() {
        if (this.sounds['clock_tick']) {
            this.play('clock_tick');
        } else {
            this.playGeneratedSound('clock_tick', {
                duration: 0.1,
                frequency: 1000,
                volume: 0.2,
                type: 'square'
            });
        }
    }

    startClockTick(interval = 1000) {
        if (this.clockTickInterval) return;
        this.clockTickInterval = setInterval(() => {
            this.playClockTick();
        }, interval);
    }

    stopClockTick() {
        if (this.clockTickInterval) {
            clearInterval(this.clockTickInterval);
            this.clockTickInterval = null;
        }
    }

    playEduroamGlitch() {
        if (this.sounds['eduroam_down']) {
            this.play('eduroam_down');
        } else {
            for (let i = 0; i < 5; i++) {
                setTimeout(() => {
                    this.playGeneratedSound('glitch', {
                        duration: 0.1 + Math.random() * 0.2,
                        frequency: 200 + Math.random() * 800,
                        volume: 0.5,
                        type: Math.random() > 0.5 ? 'sawtooth' : 'square'
                    });
                }, i * 150);
            }
            
            setTimeout(() => {
                this.playGeneratedSound('glitch_end', {
                    duration: 0.3,
                    frequency: 150,
                    volume: 0.4,
                    type: 'sine'
                });
            }, 800);
        }
    }

    createAmbientNoise(type, options = {}) {
        if (!this.audioContext) return null;
        
        const {
            duration = 10,
            frequency = 100,
            volume = 0.1
        } = options;

        const bufferSize = 2 * this.audioContext.sampleRate;
        const noiseBuffer = this.audioContext.createBuffer(2, bufferSize, this.audioContext.sampleRate);
        
        for (let channel = 0; channel < 2; channel++) {
            const data = noiseBuffer.getChannelData(channel);
            for (let i = 0; i < bufferSize; i++) {
                if (type === 'white') {
                    data[i] = Math.random() * 2 - 1;
                } else if (type === 'pink') {
                    data[i] = (Math.random() * 2 - 1) * 0.5;
                } else if (type === 'brown') {
                    data[i] = (Math.random() * 2 - 1) * 0.3;
                }
            }
        }

        const source = this.audioContext.createBufferSource();
        source.buffer = noiseBuffer;
        source.loop = true;

        const filter = this.audioContext.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = frequency;

        const gain = this.audioContext.createGain();
        gain.gain.value = volume;

        source.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);

        return { source, filter, gain };
    }

    startAmbience() {
        if (this.activeAmbients.size > 0) return;

        const hum = this.createAmbientNoise('brown', { frequency: 60, volume: 0.15 });
        if (hum) {
            hum.source.start();
            this.ambientNodes['hum'] = hum;
            this.activeAmbients.add('hum');
        }

        const ac = this.createAmbientNoise('pink', { frequency: 200, volume: 0.08 });
        if (ac) {
            ac.source.start();
            this.ambientNodes['ac'] = ac;
            this.activeAmbients.add('ac');
        }

        const creaks = this.createAmbientNoise('white', { frequency: 400, volume: 0.02 });
        if (creaks) {
            creaks.source.start();
            this.ambientNodes['creaks'] = creaks;
            this.activeAmbients.add('creaks');
        }

        this.scheduleRandomCreaks();
    }

    scheduleRandomCreaks() {
        if (!this.activeAmbients.has('creaks')) return;
        
        const randomDelay = 5000 + Math.random() * 15000;
        
        setTimeout(() => {
            if (this.activeAmbients.has('creaks') && !this.isMuted) {
                this.playGeneratedSound('creak', {
                    duration: 0.3 + Math.random() * 0.4,
                    frequency: 300 + Math.random() * 200,
                    volume: 0.15,
                    type: 'sawtooth'
                });
                this.scheduleRandomCreaks();
            }
        }, randomDelay);
    }

    stopAmbience() {
        Object.values(this.ambientNodes).forEach(node => {
            try {
                node.gain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 1);
                setTimeout(() => node.source.stop(), 1000);
            } catch (e) {}
        });

        this.ambientNodes = {};
        this.activeAmbients.clear();
    }

    setAmbientVolume(type, volume) {
        if (this.ambientNodes[type]) {
            this.ambientNodes[type].gain.gain.value = volume;
        }
    }

    play(key) {
        if (this.isMuted || !this.sounds[key]) return;
        this.sounds[key].play();
    }

    stop(key) {
        if (!this.sounds[key]) return;
        this.sounds[key].stop();
    }

    playMusic(key) {
        if (this.isMuted || !this.sounds[key]) return;
        this.sounds[key].play();
        this.sounds[key].setLoop(true);
    }

    stopMusic() {
        Object.keys(this.music).forEach(key => this.stop(key));
    }

    setMuted(muted) {
        this.isMuted = muted;
        this.scene.sound.mute = muted;
        
        if (this.masterGain) {
            this.masterGain.gain.value = muted ? 0 : 0.7;
        }
    }

    resumeContext() {
        if (this.audioContext && this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
    }

    destroy() {
        this.stopFootsteps();
        this.stopClockTick();
        this.stopAmbience();
        
        if (this.audioContext) {
            this.audioContext.close();
        }
        
        this.eventListeners.clear();
    }
}