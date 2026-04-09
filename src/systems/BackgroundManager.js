export const BACKGROUND_CONFIG = {
    'bib_aussen': { key: 'bib_aussen' },
    'suedlesesaal': { key: 'suedlesesaal' },
    'treppenhaus': { key: 'treppenhaus' },
    'flur': { key: 'flur' },
    'erdgeschoss': { key: 'erdgeschoss' },
    'referat': { key: 'referat' },
    'cafeteria': { key: 'cafeteria' },
    'carrel': { key: 'carrel' }
};

export class BackgroundManager {
    constructor(scene) {
        this.scene = scene;
        this.currentBackground = null;
        this.backgrounds = BACKGROUND_CONFIG;
    }

    preload() {
    }

    createPlaceholderBackground(key) {
        const canvas = document.createElement('canvas');
        canvas.width = 1280;
        canvas.height = 720;
        const ctx = canvas.getContext('2d');
        
        const colors = {
            'bib_aussen': '#1a2a1a',
            'suedlesesaal': '#1a1a1a',
            'treppenhaus': '#0d1a0d',
            'flur': '#151515',
            'erdgeschoss': '#1a1515',
            'referat': '#15101a',
            'cafeteria': '#1a1a0d',
            'carrel': '#0d0d0d'
        };
        
        ctx.fillStyle = colors[key] || '#000000';
        ctx.fillRect(0, 0, 1280, 720);
        
        ctx.strokeStyle = '#002200';
        ctx.lineWidth = 1;
        for (let i = 0; i < 1280; i += 64) {
            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(i, 720);
            ctx.stroke();
        }
        
        this.scene.textures.addCanvas(key, canvas);
    }

    setBackground(backgroundKey) {
        if (this.currentBackground) {
            this.currentBackground.destroy();
        }

        if (!this.scene.textures.exists(backgroundKey)) {
            this.createPlaceholderBackground(backgroundKey);
        }

        this.currentBackground = this.scene.add.image(640, 360, backgroundKey);
        this.currentBackground.setDepth(-1);
    }
}