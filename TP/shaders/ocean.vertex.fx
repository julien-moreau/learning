// Attributes
attribute vec3 position;

// Uniforms
uniform mat4 worldViewProjection;

void main ()
{
    gl_Position = worldViewProjection * vec4(position, 1.0);
}