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

export class AudioManager {
    constructor(scene) {
        this.scene = scene;
        this.sounds = {};
        this.music = {};
        this.config = AUDIO_CONFIG;
        this.isMuted = false;
    }

    preload() {
        Object.values(this.config).forEach(audio => {
            this.scene.load.audio(audio.key, audio.path);
        });
    }

    create() {
        Object.values(this.config).forEach(audio => {
            const sound = this.scene.sound.add(audio.key, {
                volume: audio.volume,
                loop: audio.loop || false
            });
            this.sounds[audio.key] = sound;
        });
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
    }
}