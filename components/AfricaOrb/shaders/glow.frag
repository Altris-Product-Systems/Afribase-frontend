uniform vec3 color;
uniform float intensity;
uniform float scrollPosition;
varying vec3 vNormal;

void main() {
  float glow = pow(0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
  float dynamicIntensity = intensity + (scrollPosition * 1.5);
  gl_FragColor = vec4(color, glow * dynamicIntensity);
}
