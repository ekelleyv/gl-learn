attribute vec3 aVertexPosition;
varying vec3 color;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;

void main(void) {
    gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
    color = vec3(1.0, 0.0, 0.0);
}
