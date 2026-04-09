export class VHSPostFX extends Phaser.Renderer.WebGL.Pipelines.PostFXPipeline {
    static readonly KEY = 'vhs';

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
                    
                    float noise = random(uv + uTime) * 0.1;
                    
                    float distortion = sin(uv.y * 10.0 + uTime * 2.0) * 0.002;
                    uv.x += distortion;
                    
                    vec2 uvR = uv + vec2(0.002, 0.0);
                    vec2 uvB = uv - vec2(0.002, 0.0);
                    
                    float r = texture2D(uMainSampler, uvR).r;
                    float g = texture2D(uMainSampler, uv).g;
                    float b = texture2D(uMainSampler, uvB).b;
                    
                    vec3 color = vec3(r, g, b);
                    color += noise;
                    
                    float scanline = sin(uv.y * uResolution.y * 1.5) * 0.04;
                    color -= scanline;
                    
                    float vignette = 1.0 - length((uv - 0.5) * 1.2);
                    color *= clamp(vignette, 0.0, 1.0);
                    
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