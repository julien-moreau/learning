uniform float time;

uniform sampler2D diffuseSampler1;
uniform sampler2D diffuseSampler2;

// Varyings
varying vec2 vUV;

void main ()
{
    vec4 color1 = texture2D(diffuseSampler1, vUV * 10.0);
    vec4 color2 = texture2D(diffuseSampler2, vUV * 10.0 + time * 0.1);

    gl_FragColor = color1 * color2;
}