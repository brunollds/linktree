import { useEffect, useRef } from 'react';
import {
  copyVertexShader,
  simulationFragmentShader,
  displayFragmentShader,
} from './shaders';

interface FBO {
  texture: WebGLTexture;
  fbo: WebGLFramebuffer;
  width: number;
  height: number;
  attach(id: number): void;
}

interface DoubleFBO {
  first: FBO;
  second: FBO;
  read: () => FBO;
  write: () => FBO;
  swap: () => void;
}

function createFBO(
  gl: WebGLRenderingContext,
  w: number,
  h: number,
  type: number,
  format: { internalFormat: number; format: number },
  filter: number
): FBO {
  const texture = gl.createTexture()!;
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    format.internalFormat,
    w,
    h,
    0,
    format.format,
    type,
    null
  );

  const fbo = gl.createFramebuffer()!;
  gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
  gl.framebufferTexture2D(
    gl.FRAMEBUFFER,
    gl.COLOR_ATTACHMENT0,
    gl.TEXTURE_2D,
    texture,
    0
  );
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);

  return {
    texture,
    fbo,
    width: w,
    height: h,
    attach(id: number) {
      gl.activeTexture(gl.TEXTURE0 + id);
      gl.bindTexture(gl.TEXTURE_2D, this.texture);
    },
  };
}

function createDoubleFBO(
  gl: WebGLRenderingContext,
  w: number,
  h: number,
  type: number,
  format: { internalFormat: number; format: number },
  filter: number
): DoubleFBO {
  const fbo1 = createFBO(gl, w, h, type, format, filter);
  const fbo2 = createFBO(gl, w, h, type, format, filter);

  return {
    first: fbo1,
    second: fbo2,
    read() {
      return this.first;
    },
    write() {
      return this.second;
    },
    swap() {
      const temp = this.first;
      this.first = this.second;
      this.second = temp;
    },
  };
}

function compileShader(
  gl: WebGLRenderingContext,
  type: number,
  source: string
): WebGLShader {
  const shader = gl.createShader(type)!;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error('Shader compile error:', gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    throw new Error('Shader compilation failed');
  }
  return shader;
}

function createProgram(
  gl: WebGLRenderingContext,
  vertSrc: string,
  fragSrc: string
): WebGLProgram {
  const vs = compileShader(gl, gl.VERTEX_SHADER, vertSrc);
  const fs = compileShader(gl, gl.FRAGMENT_SHADER, fragSrc);
  const program = gl.createProgram()!;
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('Program link error:', gl.getProgramInfoLog(program));
    throw new Error('Program linking failed');
  }
  return program;
}

export default function FluidBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({
    x: 0,
    y: 0,
    prevX: 0,
    prevY: 0,
    active: false,
    timeout: null as ReturnType<typeof setTimeout> | null,
  });
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const mouseState = mouseRef.current;

    const gl = canvas.getContext('webgl', {
      alpha: false,
      premultipliedAlpha: false,
      antialias: false,
    });
    if (!gl) {
      console.warn('WebGL not supported');
      return;
    }

    // Extensions
    const halfFloat = gl.getExtension('OES_texture_half_float');
    const linear = gl.getExtension('OES_texture_half_float_linear');
    gl.getExtension('OES_standard_derivatives');
    const texType = halfFloat ? halfFloat.HALF_FLOAT_OES : gl.UNSIGNED_BYTE;
    const filter = linear ? gl.LINEAR : gl.NEAREST;

    const formatRGBA = {
      internalFormat: gl.RGBA,
      format: gl.RGBA,
    };

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const SIM_W = 512;
    const SIM_H = 512;

    let width = canvas.offsetWidth;
    let height = canvas.offsetHeight;

    function resize() {
      width = canvas!.offsetWidth;
      height = canvas!.offsetHeight;
      canvas!.width = width * dpr;
      canvas!.height = height * dpr;
    }
    resize();

    // Full-screen quad
    const quadBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quadBuf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );

    function bindQuad(program: WebGLProgram) {
      const loc = gl!.getAttribLocation(program, 'a_pos');
      gl!.bindBuffer(gl!.ARRAY_BUFFER, quadBuf);
      gl!.enableVertexAttribArray(loc);
      gl!.vertexAttribPointer(loc, 2, gl!.FLOAT, false, 0, 0);
    }

    // Programs
    const simProgram = createProgram(gl, copyVertexShader, simulationFragmentShader);
    const displayProgram = createProgram(gl, copyVertexShader, displayFragmentShader);

    // FBOs
    const fluidFBO = createDoubleFBO(gl, SIM_W, SIM_H, texType, formatRGBA, filter);

    // Uniform locations - sim
    const simUniforms = {
      u_prevState: gl.getUniformLocation(simProgram, 'u_prevState'),
      u_resolution: gl.getUniformLocation(simProgram, 'u_resolution'),
      iMouse: gl.getUniformLocation(simProgram, 'iMouse'),
      uBrushSize: gl.getUniformLocation(simProgram, 'uBrushSize'),
      uBrushStrength: gl.getUniformLocation(simProgram, 'uBrushStrength'),
      uFluidDecay: gl.getUniformLocation(simProgram, 'uFluidDecay'),
      uTrailLength: gl.getUniformLocation(simProgram, 'uTrailLength'),
      uStopDecay: gl.getUniformLocation(simProgram, 'uStopDecay'),
      u_frame: gl.getUniformLocation(simProgram, 'u_frame'),
    };

    // Uniform locations - display
    const displayUniforms = {
      u_fluid: gl.getUniformLocation(displayProgram, 'u_fluid'),
      u_resolution: gl.getUniformLocation(displayProgram, 'u_resolution'),
      u_time: gl.getUniformLocation(displayProgram, 'u_time'),
      u_color1: gl.getUniformLocation(displayProgram, 'u_color1'),
      u_color2: gl.getUniformLocation(displayProgram, 'u_color2'),
      u_color3: gl.getUniformLocation(displayProgram, 'u_color3'),
    };

    // Config
    const config = {
      brushSize: 4.0,
      brushStrength: 0.55,
      fluidDecay: 0.985,
      trailLength: 0.89,
      stopDecay: 0.83,
    };

    // Colors
    const color1 = [0.059, 0.078, 0.098]; // #0f1419 black
    const color2 = [0.102, 0.302, 0.180]; // #1a4d2e green
    const color3 = [1.0, 0.42, 0.208]; // #ff6b35 orange

    let frameCount = 0;

    function updateSimUniforms() {
      gl!.useProgram(simProgram);
      gl!.uniform1f(simUniforms.uBrushSize, config.brushSize);
      gl!.uniform1f(simUniforms.uBrushStrength, config.brushStrength);
      gl!.uniform1f(simUniforms.uFluidDecay, config.fluidDecay);
      gl!.uniform1f(simUniforms.uTrailLength, config.trailLength);
      gl!.uniform1f(simUniforms.uStopDecay, config.stopDecay);
      gl!.uniform2f(simUniforms.u_resolution, SIM_W, SIM_H);
    }

    function renderLoop(time: number) {
      frameCount++;
      const mouse = mouseRef.current;

      // Simulation pass
      gl!.bindFramebuffer(gl!.FRAMEBUFFER, fluidFBO.write().fbo);
      gl!.viewport(0, 0, SIM_W, SIM_H);
      gl!.useProgram(simProgram);
      bindQuad(simProgram);

      fluidFBO.read().attach(0);
      gl!.uniform1i(simUniforms.u_prevState, 0);

      const mx = mouse.x * (SIM_W / width) * dpr;
      const my = (height - mouse.y) * (SIM_H / height) * dpr;
      const mpx = mouse.prevX * (SIM_W / width) * dpr;
      const mpy = (height - mouse.prevY) * (SIM_H / height) * dpr;

      gl!.uniform4f(
        simUniforms.iMouse,
        mouse.active ? mx : 0,
        mouse.active ? my : 0,
        mouse.active ? mpx : 0,
        mouse.active ? mpy : 0
      );
      gl!.uniform1f(simUniforms.u_frame, frameCount);
      updateSimUniforms();

      gl!.drawArrays(gl!.TRIANGLES, 0, 6);
      fluidFBO.swap();

      // Display pass
      gl!.bindFramebuffer(gl!.FRAMEBUFFER, null);
      gl!.viewport(0, 0, canvas!.width, canvas!.height);
      gl!.useProgram(displayProgram);
      bindQuad(displayProgram);

      fluidFBO.read().attach(0);
      gl!.uniform1i(displayUniforms.u_fluid, 0);
      gl!.uniform2f(displayUniforms.u_resolution, canvas!.width, canvas!.height);
      gl!.uniform1f(displayUniforms.u_time, time * 0.001);
      gl!.uniform3f(displayUniforms.u_color1, color1[0], color1[1], color1[2]);
      gl!.uniform3f(displayUniforms.u_color2, color2[0], color2[1], color2[2]);
      gl!.uniform3f(displayUniforms.u_color3, color3[0], color3[1], color3[2]);

      gl!.drawArrays(gl!.TRIANGLES, 0, 6);

      // Update previous mouse
      mouse.prevX = mouse.x;
      mouse.prevY = mouse.y;

      animRef.current = requestAnimationFrame(renderLoop);
    }

    // Mouse handlers
    function handleMouseMove(e: MouseEvent) {
      const m = mouseRef.current;
      m.x = e.clientX;
      m.y = e.clientY;
      m.active = true;
      if (m.timeout) clearTimeout(m.timeout);
      m.timeout = setTimeout(() => {
        m.active = false;
      }, 100);
    }

    function handleTouchMove(e: TouchEvent) {
      const touch = e.touches[0];
      if (touch) {
        const m = mouseRef.current;
        m.x = touch.clientX;
        m.y = touch.clientY;
        m.active = true;
        if (m.timeout) clearTimeout(m.timeout);
        m.timeout = setTimeout(() => {
          m.active = false;
        }, 100);
      }
    }

    function handleResize() {
      resize();
    }

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('resize', handleResize);

    animRef.current = requestAnimationFrame(renderLoop);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('resize', handleResize);
      if (mouseState.timeout) clearTimeout(mouseState.timeout);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
      }}
    />
  );
}
