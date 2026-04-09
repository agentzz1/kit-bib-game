export class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BootScene' });
    }

    preload() {
        this.createPlaceholderAssets();
        
        const loadingText = this.add.text(640, 360, 'LADE...', {
            fontSize: '32px', fill: '#00ff00', fontFamily: 'Courier New'
        }).setOrigin(0.5);
        
        this.load.on('complete', () => {
            this.scene.start('MenuScene');
        });

        this.load.start();
    }

    createPlaceholderAssets() {
        this.createColoredRect('bg_black', 1280, 720, 0x000000);
        this.createColoredRect('bg_office', 1280, 720, 0x1a1a1a);
        
        this.createCharacterSprite('koffein_zombie', 0x8B4513, 64, 128);
        this.createCharacterSprite('sortier_o_mat', 0x444444, 80, 100);
        this.createCharacterSprite('eduroam_phantom', 0x00ff00, 64, 64);
        this.createCharacterSprite('bibliothekarin', 0xcccccc, 48, 128);
    }

    createColoredRect(key, width, height, color) {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#' + color.toString(16).padStart(6, '0');
        ctx.fillRect(0, 0, width, height);
        this.textures.addCanvas(key, canvas);
    }

    createCharacterSprite(key, color, width, height) {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        
        ctx.fillStyle = '#' + color.toString(16).padStart(6, '0');
        ctx.fillRect(width * 0.2, height * 0.1, width * 0.6, height * 0.3);
        
        ctx.fillStyle = '#000000';
        ctx.fillRect(width * 0.3, height * 0.2, width * 0.15, height * 0.1);
        ctx.fillRect(width * 0.55, height * 0.2, width * 0.15, height * 0.1);
        
        ctx.fillRect(width * 0.25, height * 0.5, width * 0.5, height * 0.4);
        
        this.textures.addCanvas(key, canvas);
    }

    create() {
        this.scene.start('MenuScene');
    }
}