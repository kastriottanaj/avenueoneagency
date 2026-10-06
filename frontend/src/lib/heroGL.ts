/**
 * Hero WebGL effect — a single fullscreen fragment shader.
 *
 * Deliberately NOT Three.js. This effect is a flow-field displacement with
 * chromatic aberration, pink light bleed and animated grain over one texture.
 * That needs a quad and a shader, not a scene graph — Three.js would add
 * ~155KB gzipped (more than doubling the bundle) to do the same thing, on a
 * site whose whole performance story we just rebuilt.
 *
 * It also reuses the <img> the browser already downloaded as its texture, so
 * the effect costs zero additional image bytes.
 *
 * Bails out to the static image on: reduced-motion, no WebGL, small screens,
 * or a device with few cores. Pauses when off-screen or backgrounded.
 */

const VERT = `
attribute vec2 aPos;
varying vec2 vUv;
void main() {
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}`

const FRAG = `
precision highp float;

uniform sampler2D uTex;
uniform vec2  uRes;
uniform vec2  uTexRes;
uniform float uTime;
uniform vec2  uMouse;
uniform float uMouseAmt;
varying vec2 vUv;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}

float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 4; i++) { v += a * noise(p); p *= 2.02; a *= 0.5; }
  return v;
}

/* object-fit: cover, in UV space */
vec2 coverUv(vec2 uv, vec2 res, vec2 tex) {
  float rs = res.x / res.y;
  float ri = tex.x / tex.y;
  vec2 s = (ri > rs) ? vec2(rs / ri, 1.0) : vec2(1.0, ri / rs);
  return (uv - 0.5) * s + 0.5;
}

void main() {
  vec2 uv = coverUv(vUv, uRes, uTexRes);
  float aspect = uRes.x / uRes.y;
  float t = uTime * 0.055;

  /* slow flow field — the image is never quite still */
  vec2 q = vec2(fbm(vUv * 3.0 + t), fbm(vUv * 3.0 + vec2(5.2, 1.3) - t));
  float flow = fbm(vUv * 2.5 + q * 0.8 + t * 0.5);

  /* cursor pushes the field around */
  float d = distance(vUv * vec2(aspect, 1.0), uMouse * vec2(aspect, 1.0));
  float ripple = smoothstep(0.5, 0.0, d) * uMouseAmt;

  float amp = 0.008 + ripple * 0.026;
  vec2 disp = vec2(flow - 0.5, q.y - 0.5) * amp;

  /* chromatic split, widening under the cursor */
  vec2 dir = normalize(vUv - uMouse + vec2(1e-5));
  float ca = 0.0018 + ripple * 0.009;
  vec3 col = vec3(
    texture2D(uTex, uv + disp + dir * ca).r,
    texture2D(uTex, uv + disp).g,
    texture2D(uTex, uv + disp - dir * ca).b
  );

  col *= 0.40;

  /* Claret, not fuchsia — matches --claret in index.css. */
  vec3 accent = vec3(0.659, 0.118, 0.271);
  vec3 warm   = vec3(0.604, 0.482, 0.310);  /* brass, for the highlights */

  /* light bleed from the upper left, and around the cursor */
  float bleed = smoothstep(1.25, 0.0, distance(vUv, vec2(0.12, 0.88))) * 0.17;
  bleed += ripple * 0.11;
  col += accent * bleed;

  /* pink caught in the highlights */
  /* Brass caught in the highlights, claret in the mid-tones. Two-temperature
     grading is what stops a duotone reading as a filter. */
  float lum = dot(col, vec3(0.2126, 0.7152, 0.0722));
  col += warm   * smoothstep(0.26, 0.70, lum) * 0.13;
  col += accent * smoothstep(0.05, 0.34, lum) * 0.10;

  /* animated grain */
  float g = hash(vUv * uRes + fract(uTime) * vec2(37.0, 17.0));
  col += (g - 0.5) * 0.045;

  /* vignette so the headline always has a ground */
  float vig = smoothstep(1.15, 0.22, length((vUv - 0.5) * vec2(1.15, 1.0)));
  col *= mix(0.58, 1.0, vig);

  gl_FragColor = vec4(col, 1.0);
}`

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const sh = gl.createShader(type)!
  gl.shaderSource(sh, src)
  gl.compileShader(sh)
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    // Silent fallback hides real bugs; the static image still renders.
    console.warn('[heroGL] shader compile failed:', gl.getShaderInfoLog(sh))
    gl.deleteShader(sh)
    return null
  }
  return sh
}

export function shouldRunHeroGL(): boolean {
  if (typeof window === 'undefined') return false
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false
  // Phones get the static image: the effect is a full-viewport fragment shader
  // every frame, which is the wrong trade on a battery.
  if (window.innerWidth < 900) return false
  if ((navigator.hardwareConcurrency ?? 8) < 4) return false
  return true
}

/**
 * @param canvas       target canvas
 * @param img          an already-loaded <img> to use as the texture
 * @param onFirstFrame called once a frame has actually been drawn — only then
 *                    is it safe to reveal the canvas
 * @returns a teardown function, or null if the effect could not start
 */
export function initHeroGL(
  canvas: HTMLCanvasElement,
  img: HTMLImageElement,
  onFirstFrame?: () => void,
): (() => void) | null {
  const gl = (canvas.getContext('webgl', {
    antialias: false,
    alpha: false,
    powerPreference: 'low-power',
  }) || canvas.getContext('experimental-webgl')) as WebGLRenderingContext | null

  if (!gl) return null

  const vs = compile(gl, gl.VERTEX_SHADER, VERT)
  const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG)
  if (!vs || !fs) return null

  const prog = gl.createProgram()!
  gl.attachShader(prog, vs)
  gl.attachShader(prog, fs)
  gl.linkProgram(prog)
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    console.warn('[heroGL] link failed:', gl.getProgramInfoLog(prog))
    return null
  }
  gl.useProgram(prog)

  // Fullscreen triangle
  const buf = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buf)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
  const aPos = gl.getAttribLocation(prog, 'aPos')
  gl.enableVertexAttribArray(aPos)
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0)

  const tex = gl.createTexture()
  gl.bindTexture(gl.TEXTURE_2D, tex)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1)
  try {
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img)
  } catch (err) {
    console.warn('[heroGL] texture upload failed:', err)
    return null
  }

  const u = {
    tex: gl.getUniformLocation(prog, 'uTex'),
    res: gl.getUniformLocation(prog, 'uRes'),
    texRes: gl.getUniformLocation(prog, 'uTexRes'),
    time: gl.getUniformLocation(prog, 'uTime'),
    mouse: gl.getUniformLocation(prog, 'uMouse'),
    mouseAmt: gl.getUniformLocation(prog, 'uMouseAmt'),
  }
  gl.uniform1i(u.tex, 0)
  gl.uniform2f(u.texRes, img.naturalWidth, img.naturalHeight)
  gl.clearColor(0.039, 0.035, 0.047, 1.0)

  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  function resize() {
    const w = Math.max(1, Math.round(canvas.clientWidth * dpr))
    const h = Math.max(1, Math.round(canvas.clientHeight * dpr))
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w
      canvas.height = h
      gl!.viewport(0, 0, w, h)
    }
    gl!.uniform2f(u.res, canvas.width, canvas.height)
  }
  resize()

  // Target and eased values, so the cursor feels weighted rather than snapped.
  let mx = 0.5, my = 0.5, tx = 0.5, ty = 0.5
  let amt = 0, tAmt = 0
  let raf = 0
  let visible = true
  let running = true
  const start = performance.now()

  function onMove(e: PointerEvent) {
    const r = canvas.getBoundingClientRect()
    tx = (e.clientX - r.left) / r.width
    ty = 1 - (e.clientY - r.top) / r.height
    tAmt = 1
  }
  function onLeave() { tAmt = 0 }

  function frame() {
    if (!running) return
    raf = requestAnimationFrame(frame)
    if (!visible || document.hidden) return

    resize()
    mx += (tx - mx) * 0.06
    my += (ty - my) * 0.06
    amt += (tAmt - amt) * 0.05

    draw((performance.now() - start) / 1000)
  }

  const io = new IntersectionObserver(
    ([entry]) => { visible = entry.isIntersecting },
    { threshold: 0 },
  )
  io.observe(canvas)

  function draw(timeSec: number) {
    gl!.uniform1f(u.time, timeSec)
    gl!.uniform2f(u.mouse, mx, my)
    gl!.uniform1f(u.mouseAmt, amt)
    gl!.clear(gl!.COLOR_BUFFER_BIT)
    gl!.drawArrays(gl!.TRIANGLES, 0, 3)
  }

  draw(0)
  gl.finish()
  onFirstFrame?.()

  window.addEventListener('pointermove', onMove, { passive: true })
  window.addEventListener('pointerleave', onLeave, { passive: true })
  window.addEventListener('resize', resize)
  raf = requestAnimationFrame(frame)

  return () => {
    running = false
    cancelAnimationFrame(raf)
    io.disconnect()
    window.removeEventListener('pointermove', onMove)
    window.removeEventListener('pointerleave', onLeave)
    window.removeEventListener('resize', resize)
    gl.deleteTexture(tex)
    gl.deleteBuffer(buf)
    gl.deleteProgram(prog)
    gl.deleteShader(vs)
    gl.deleteShader(fs)
    gl.getExtension('WEBGL_lose_context')?.loseContext()
  }
}
