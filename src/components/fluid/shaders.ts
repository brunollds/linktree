export const vertexShader = `
attribute vec2 a_pos;
void main() {
  gl_Position = vec4(a_pos, 0.0, 1.0);
}
`;

export const simulationFragmentShader = `
precision highp float;

uniform sampler2D u_prevState;
uniform vec2 u_resolution;
uniform vec4 iMouse;
uniform float uBrushSize;
uniform float uBrushStrength;
uniform float uFluidDecay;
uniform float uTrailLength;
uniform float uStopDecay;
uniform float u_frame;

varying vec2 v_uv;

float lineDistance(vec2 p, vec2 a, vec2 b) {
  vec2 ab = b - a;
  float l2 = dot(ab, ab);
  if (l2 < 0.001) return distance(p, a);
  float t = clamp(dot(p - a, ab) / l2, 0.0, 1.0);
  return distance(p, a + t * ab);
}

void main() {
  vec2 pixel = v_uv * u_resolution;
  vec2 texel = 1.0 / u_resolution;

  vec4 prev = texture2D(u_prevState, v_uv);

  vec4 nL = texture2D(u_prevState, v_uv + vec2(-texel.x, 0.0));
  vec4 nR = texture2D(u_prevState, v_uv + vec2(texel.x, 0.0));
  vec4 nU = texture2D(u_prevState, v_uv + vec2(0.0, texel.y));
  vec4 nD = texture2D(u_prevState, v_uv + vec2(0.0, -texel.y));

  if (u_frame < 5.0) {
    gl_FragColor = vec4(0.5 + 0.5 * sin(pixel.x * 0.05) * cos(pixel.y * 0.05), 0.0, 0.0, 0.0);
    return;
  }

  vec2 mousePos = iMouse.xy;
  vec2 mousePrev = iMouse.zw;
  bool mouseActive = length(mousePos) > 0.0;
  vec2 mouseVel = mousePos - mousePrev;

  float len = length(mouseVel);
  if (len > 6.0) {
    mouseVel = mouseVel / len * 6.0;
  }

  float qLine = lineDistance(pixel, mousePos, mousePrev);
  float qPoint = distance(pixel, mousePos);
  float q = mix(qLine, qPoint, 0.4);

  float brushSizeFactor = 2.2e-4 / uBrushSize;
  float strengthFactor = 0.03 * uBrushStrength;

  vec2 brush = strengthFactor * exp(-q * q * brushSizeFactor) * ((length(mouseVel) > 0.5) ? mouseVel : vec2(0.0));

  if (!mouseActive) {
    brush = vec2(0.0);
  }

  float propagated = 0.25 * (nL.x + nR.x + nU.x + nD.x);
  float state = prev.x * uFluidDecay;
  float ink = prev.z * uTrailLength;

  float newHeight = propagated + state - prev.x;
  newHeight += ink * 0.1;
  newHeight += length(brush) * 0.15;

  float newVel = prev.y * uTrailLength + (propagated - prev.x);
  float newInk = ink + (propagated - prev.x) * 0.5;
  newInk = clamp(newInk, -0.5, 0.5);

  float idle = prev.w;
  if (!mouseActive && length(mouseVel) < 0.5) {
    idle += 0.016;
  } else {
    idle = 0.0;
  }

  if (idle > 1.0) {
    newHeight -= uStopDecay * (idle - 1.0) * 0.01;
  }

  if (!mouseActive) {
    float dist = distance(pixel, mousePos);
    float falloff = exp(-dist * dist * brushSizeFactor * 0.5);
    float swirl = strengthFactor * falloff * 0.01;
    newHeight += swirl;
    newVel += swirl * 0.5;
  }

  gl_FragColor = vec4(clamp(newHeight, -10.0, 10.0), newVel, newInk, idle);
}
`;

export const displayFragmentShader = `
#extension GL_OES_standard_derivatives : enable
precision highp float;

uniform sampler2D u_fluid;
uniform vec2 u_resolution;
uniform float u_time;
uniform vec3 u_color1;
uniform vec3 u_color2;
uniform vec3 u_color3;

varying vec2 v_uv;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;
  vec4 fluidState = texture2D(u_fluid, uv);

  float fluidHeight = clamp(fluidState.x, -1.0, 1.0);

  float gradX = dFdx(fluidHeight);
  float gradY = dFdy(fluidHeight);

  float gradient = smoothstep(0.0, 0.3, sqrt(gradX * gradX + gradY * gradY));

  vec2 noiseSeed = uv * 100.0;
  noiseSeed += fluidHeight * 30.0;

  float noise = hash(noiseSeed) * 0.1;

  float mixFactor = fluidHeight + gradient * 0.5 + noise;
  float t = smoothstep(-0.5, 0.5, mixFactor);

  vec3 finalColor = mix(u_color1, u_color2, t);
  finalColor = mix(finalColor, u_color3, smoothstep(0.5, 1.0, t));

  // Subtle gradient highlight only
  finalColor += gradient * 0.06;

  // Darken overall to keep text readable
  finalColor *= 0.65;

  gl_FragColor = vec4(finalColor, 1.0);
}
`;

export const copyVertexShader = `
attribute vec2 a_pos;
varying vec2 v_uv;
void main() {
  v_uv = a_pos * 0.5 + 0.5;
  gl_Position = vec4(a_pos, 0.0, 1.0);
}
`;
