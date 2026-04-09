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
        this.isMuted = false;
    }

    preload() {}
    create() {}
    play() {}
    stop() {}
    setMuted(muted) { this.isMuted = muted; }
    resumeContext() {}
    destroy() {}
}