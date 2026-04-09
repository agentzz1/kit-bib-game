export const SPRITE_CONFIG = {
    'koffein_zombie': {
        key: 'koffein_zombie',
        path: 'assets/sprites/koffein_zombie.png',
        frames: { idle: 2, walk: 4, attack: 6 },
        width: 64,
        height: 128
    },
    'sortier_o_mat': {
        key: 'sortier_o_mat',
        path: 'assets/sprites/sortier_o_mat.png',
        frames: { idle: 1, moving: 4 },
        width: 80,
        height: 100
    },
    'eduroam_phantom': {
        key: 'eduroam_phantom',
        path: 'assets/sprites/eduroam_phantom.png',
        frames: { idle: 4, glitch: 8 },
        width: 64,
        height: 64
    },
    'bibliothekarin': {
        key: 'bibliothekarin',
        path: 'assets/sprites/bibliothekarin.png',
        frames: { idle: 2, walk: 6, attack: 4 },
        width: 48,
        height: 128
    }
};

export class SpriteManager {
    constructor(scene) {
        this.scene = scene;
        this.sprites = {};
        this.config = SPRITE_CONFIG;
    }

    preload() {
        Object.values(this.config).forEach(sprite => {
            this.scene.load.spritesheet(
                sprite.key,
                sprite.path,
                { frameWidth: sprite.width, frameHeight: sprite.height }
            );
        });
    }

    create(key, x, y) {
        const config = this.config[key];
        if (!config) return null;

        const sprite = this.scene.physics.add.sprite(x, y, config.key);
        sprite.setCollideWorldBounds(true);
        this.sprites[key] = sprite;
        return sprite;
    }

    playAnimation(key, animName, loop = true) {
        const sprite = this.sprites[key];
        const config = this.config[key];
        
        if (sprite && config.frames[animName]) {
            const anim = this.scene.anims.create({
                key: `${key}_${animName}`,
                frames: this.scene.anims.generateFrameNumbers(key, {
                    start: 0,
                    end: config.frames[animName] - 1
                }),
                frameRate: 10,
                repeat: loop ? -1 : 0
            });
            sprite.play(anim);
        }
    }
}