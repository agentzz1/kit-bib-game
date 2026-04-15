export class VHSPostFX extends Phaser.Renderer.WebGL.Pipelines.PostFXPipeline {
    constructor(game) {
        super({
            game: game,
            renderTarget: true,
            fragShader: `
                precision mediump float;
                uniform sampler2D uMainSampler;
                uniform float uTime;
                uniform vec2 uResolution;
                varying vec2 outTexCoord;

                float random(vec2 st) {
                    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
                }

                void main() {
                    vec2 uv = outTexCoord;
                    
                    // Time-based offsets for various effects
                    float time = uTime * 0.5;
                    
                    // VHS noise
                    float noise = random(uv + time) * 0.15;
                    
                    // Vertical hold distortion (rolling)
                    float roll = sin(uv.y * 8.0 + time * 1.3) * 0.003;
                    uv.x += roll;
                    
                    // Occasional vertical jump
                    float jump = sin(time * 0.3) * 0.02;
                    if (abs(jump) > 0.015) {
                        uv.y += jump * 0.5;
                    }
                    
                    // Color bleeding / chromatic aberration with offset
                    float bleed = sin(time * 0.7) * 0.004;
                    vec2 uvR = uv + vec2(bleed, 0.0);
                    vec2 uvG = uv;
                    vec2 uvB = uv - vec2(bleed, 0.0);
                    
                    float r = texture2D(uMainSampler, uvR).r;
                    float g = texture2D(uMainSampler, uvG).g;
                    float b = texture2D(uMainSampler, uvB).b;
                    
                    vec3 color = vec3(r, g, b);
                    
                    // Saturation shift over time
                    float saturation = 0.8 + 0.2 * sin(time * 0.2);
                    float luminance = dot(color, vec3(0.299, 0.587, 0.114));
                    color = vec3(luminance) + (color - vec3(luminance)) * saturation;
                    
                    color += noise;
                    
                    // Scanlines
                    float scanline = sin(uv.y * uResolution.y * 2.0) * 0.03;
                    color -= scanline;
                    
                    // Vignette
                    float vignette = 1.0 - length((uv - 0.5) * 1.4);
                    color *= clamp(vignette, 0.0, 1.0);
                    
                    // Occasionally reduce brightness (signal drop)
                    float drop = sin(time * 0.1) * 0.1;
                    if (drop < -0.05) {
                        color *= 0.7;
                    }
                    
                    gl_FragColor = vec4(color, 1.0);
                }
            `
        });
    }

    onPreRender() {
        this.set1f('uTime', this.game.loop.time / 1000);
        this.set2f('uResolution', this.game.config.width, this.game.config.height);
    }
}