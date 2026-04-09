export const BACKGROUND_CONFIG = {
    'bib_aussen': {
        key: 'bib_aussen',
        path: 'assets/backgrounds/bib_aussen.png',
        width: 1280,
        height: 720
    },
    'suedlesesaal': {
        key: 'suedlesesaal',
        path: 'assets/backgrounds/suedlesesaal.png',
        width: 1280,
        height: 720
    },
    'treppenhaus': {
        key: 'treppenhaus',
        path: 'assets/backgrounds/treppenhaus.png',
        width: 1280,
        height: 720
    },
    'flur': {
        key: 'flur',
        path: 'assets/backgrounds/flur.png',
        width: 1280,
        height: 720
    },
    'erdgeschoss': {
        key: 'erdgeschoss',
        path: 'assets/backgrounds/erdgeschoss.png',
        width: 1280,
        height: 720
    },
    'referat': {
        key: 'referat',
        path: 'assets/backgrounds/referat.png',
        width: 1280,
        height: 720
    },
    'cafeteria': {
        key: 'cafeteria',
        path: 'assets/backgrounds/cafeteria.png',
        width: 1280,
        height: 720
    },
    'carrel': {
        key: 'carrel',
        path: 'assets/backgrounds/carrel.png',
        width: 1280,
        height: 720
    }
};

export class BackgroundManager {
    constructor(scene) {
        this.scene = scene;
        this.currentBackground = null;
        this.backgrounds = BACKGROUND_CONFIG;
    }

    preload() {
        Object.values(this.backgrounds).forEach(bg => {
            this.scene.load.image(bg.key, bg.path);
        });
    }

    setBackground(backgroundKey) {
        if (this.currentBackground) {
            this.currentBackground.destroy();
        }

        const bgConfig = this.backgrounds[backgroundKey];
        if (bgConfig) {
            this.currentBackground = this.scene.add.image(640, 360, bgConfig.key);
            this.currentBackground.setDepth(-1);
        }
    }
}