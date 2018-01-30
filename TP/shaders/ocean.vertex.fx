// Attributes
attribute vec3 position;
attribute vec2 uv;

// Varyings
varying vec2 vUV;

// Uniforms
uniform float time;
uniform mat4 worldViewProjection;

void main ()
{
    vec3 p = position;
    p.y = (sin(((p.x / 0.05) + time)) * 5.0)
        + (cos(((p.z / 0.05) + time)) * 5.0);

    gl_Position = worldViewProjection * vec4(p, 1.0);

    vUV = uv;
}