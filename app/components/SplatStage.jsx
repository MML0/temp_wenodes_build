"use client";

import { useEffect, useRef, useState } from "react";

export const DEFAULT_FX = {
  // sliders
  scatter: 0,
  splatSize: 1,
  ghost: 1,
  kaleido: 0,
  warp: 0,
  // toggles
  pointCloud: false,
  glitch: false,
  crt: false,
  holo: false,
  thermal: false,
};

/* ------------------------------------------------------------------ *
 *  shaders
 * ------------------------------------------------------------------ */

// PlaneGeometry(2,2) already spans clip space, so skip the matrices.
const QUAD_VERT = /* glsl */ `
  out vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

// Drifting nebula behind the splat, so the low-alpha edges of the cloud
// have something coloured to bleed into.
const BG_FRAG = /* glsl */ `
  precision highp float;

  in vec2 vUv;
  layout(location = 0) out vec4 outColor;

  uniform float uTime;
  uniform vec2  uRes;

  void main() {
    vec2 p = (vUv - 0.5) * vec2(uRes.x / uRes.y, 1.0);
    float t = uTime * 0.12;

    float a = exp(-3.2 * length(p - vec2(sin(t * 1.3) * 0.42, cos(t * 1.1) * 0.34)));
    float b = exp(-3.6 * length(p - vec2(cos(t * 0.9) * -0.46, sin(t * 1.7) * 0.30)));
    float c = exp(-4.2 * length(p - vec2(sin(t * 2.1) * 0.30, cos(t * 0.7) * -0.40)));

    vec3 col = vec3(0.012, 0.014, 0.028);
    col += vec3(0.34, 0.10, 0.64) * a * 0.46;
    col += vec3(0.05, 0.45, 0.74) * b * 0.42;
    col += vec3(0.85, 0.20, 0.38) * c * 0.26;

    col *= smoothstep(1.20, 0.22, length(p));
    outColor = vec4(col, 1.0);
  }
`;

// Composite pass. The house look (lens pull, chromatic aberration,
// mip bloom, prism scan, grade, vignette, grain) is always on; the
// selectable effects layer on top of it.
const POST_FRAG = /* glsl */ `
  precision highp float;

  in vec2 vUv;
  layout(location = 0) out vec4 outColor;

  uniform sampler2D tScene;
  uniform vec2  uRes;
  uniform float uTime;
  uniform float uEnergy;
  uniform float uReveal;

  uniform float uKaleido;
  uniform float uWarp;
  uniform float uGlitch;
  uniform float uCrt;
  uniform float uHolo;
  uniform float uThermal;

  const float TAU = 6.28318530718;

  float hash21(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  vec3 heat(float t) {
    t = clamp(t, 0.0, 1.0);
    vec3 c = mix(vec3(0.02, 0.01, 0.16), vec3(0.42, 0.04, 0.68), smoothstep(0.00, 0.32, t));
    c = mix(c, vec3(0.95, 0.20, 0.22), smoothstep(0.30, 0.58, t));
    c = mix(c, vec3(1.00, 0.72, 0.10), smoothstep(0.55, 0.82, t));
    c = mix(c, vec3(1.00, 1.00, 0.92), smoothstep(0.80, 1.00, t));
    return c;
  }

  void main() {
    vec2 uv0 = vUv;                 // untouched, for vignette / scanlines
    vec2 uv  = vUv;
    float r0 = length(uv0 - 0.5);

    // --- kaleidoscope (wedge-mirror the sampling coords)
    if (uKaleido >= 1.5) {
      vec2 k = uv - 0.5;
      float ang = atan(k.y, k.x);
      float rad = length(k);
      float seg = TAU / uKaleido;
      ang = abs(mod(ang + seg * 0.5, seg) - seg * 0.5) + uTime * 0.05;
      uv = vec2(cos(ang), sin(ang)) * rad + 0.5;
    }

    // --- liquid warp
    if (uWarp > 0.001) {
      uv += vec2(
        sin(uv.y * 14.0 + uTime * 1.7) * 0.6 + sin(uv.y * 31.0 - uTime * 2.3) * 0.25,
        cos(uv.x * 11.0 - uTime * 1.3) * 0.6 + cos(uv.x * 27.0 + uTime * 1.9) * 0.25
      ) * 0.07 * uWarp;
    }

    vec2  d = uv - 0.5;
    float r = length(d);

    // --- barrel pull, opens up as the camera moves
    vec2 luv = uv - d * r * r * (0.010 + 0.070 * uEnergy);

    // --- blocky RGB tear
    float tear = 0.0;
    if (uGlitch > 0.5) {
      float slot = floor(uTime * 11.0);
      float band = floor(uv.y * 26.0);
      float n = hash21(vec2(band, slot));
      tear = (n - 0.5) * step(0.70, n) * 0.22;
      luv.x += tear * 0.45;
    }

    // --- radial chromatic aberration
    float ca = (0.0020 + 0.0150 * uEnergy) * (0.25 + r);
    vec3 col;
    col.r = textureLod(tScene, luv - d * ca + vec2(tear, 0.0), 0.0).r;
    col.g = textureLod(tScene, luv,                            0.0).g;
    col.b = textureLod(tScene, luv + d * ca - vec2(tear, 0.0), 0.0).b;

    // --- bloom straight off the mip chain
    vec3 b1 = textureLod(tScene, luv, 3.0).rgb;
    vec3 b2 = textureLod(tScene, luv, 5.0).rgb;
    vec3 bloom = max(mix(b1, b2, 0.55) - 0.62, vec3(0.0)) * 0.85;
    col += bloom * (0.38 + 0.55 * uEnergy);

    // --- travelling prism scan
    float sweep = fract(uTime * 0.17);
    float band  = exp(-pow((uv0.y - sweep) * 11.0, 2.0));
    vec3  tint  = vec3(0.38, 0.86, 1.00);
    col += band * tint * 0.12;
    col.r += band * 0.06 * sin(uv0.x * 30.0 + uTime * 2.0);

    // --- thermal palette
    if (uThermal > 0.5) {
      float lum = dot(col, vec3(0.299, 0.587, 0.114));
      col = heat(pow(lum, 0.72) * 1.15);
    }

    // --- hologram
    if (uHolo > 0.5) {
      float lum = dot(col, vec3(0.299, 0.587, 0.114));
      vec3 h = vec3(0.24, 0.86, 1.00) * lum * 1.6;
      h += vec3(0.62, 0.22, 1.00) * pow(lum, 3.0) * 0.8;
      h *= 0.72 + 0.28 * sin(uv0.y * 150.0 - uTime * 6.0);
      h += tint * 0.12 * step(0.985, fract(uv0.y * 3.0 - uTime * 0.35));
      col = mix(col, h, 0.88);
    }

    // --- grade: punch saturation, lift the shadows somewhere cold
    float lum = dot(col, vec3(0.299, 0.587, 0.114));
    col  = mix(vec3(lum), col, 1.28);
    col += vec3(0.008, 0.012, 0.030) * (1.0 - smoothstep(0.0, 0.35, lum));

    // --- CRT: scanlines + phosphor stripe
    if (uCrt > 0.5) {
      col *= 0.74 + 0.36 * (0.5 + 0.5 * sin(uv0.y * uRes.y * 1.55));
      float m = mod(gl_FragCoord.x, 3.0);
      col *= vec3(
        mix(0.82, 1.18, step(m, 1.0)),
        mix(0.82, 1.18, step(1.0, m) * step(m, 2.0)),
        mix(0.82, 1.18, step(2.0, m))
      );
      col *= 1.12;
    }

    // --- reveal wipe on first load
    float y = 1.0 - uv0.y;
    float w = uReveal * 1.3;
    col *= smoothstep(w, w - 0.30, y);
    col += tint * exp(-pow((y - (w - 0.15)) * 24.0, 2.0)) * 0.55
                * sin(uReveal * 3.14159265);

    // --- vignette + grain
    col *= smoothstep(0.92, 0.20, r0) * 0.68 + 0.32;
    col += (hash21(uv0 * uRes + fract(uTime) * 917.0) - 0.5) * 0.050;

    outColor = vec4(col, 1.0);
  }
`;

/* ------------------------------------------------------------------ *
 *  splat-shader injection
 * ------------------------------------------------------------------ */

// Scatter and ghost can't be done in post — they have to move and fade
// the gaussians themselves, so we splice into the library's vertex
// shader once, after the scene is built, and drive it with uniforms.
const SPLAT_UNIFORMS = /* glsl */ `
  uniform float uScatter;
  uniform float uGhost;
  uniform float uFxTime;
  uniform vec3  uCloudCentre;
  uniform float uCloudRadius;

  float fxHash(float n) { return fract(sin(n) * 43758.5453123); }
`;

const SPLAT_CENTER_SRC =
  "vec3 splatCenter = uintBitsToFloat(uvec3(sampledCenterColor.gba));";

const SPLAT_SCATTER = /* glsl */ `
  ${SPLAT_CENTER_SRC}
  if (uScatter > 0.0001) {
    float fi = float(splatIndex);
    float h1 = fxHash(fi * 0.731);
    float h2 = fxHash(fi * 1.317 + 11.7);
    float h3 = fxHash(fi * 2.113 + 41.3);

    vec3 jitter  = normalize(vec3(h1, h2, h3) * 2.0 - 1.0 + 0.0001);
    vec3 outward = normalize(splatCenter - uCloudCentre + 0.00001);
    vec3 dir     = normalize(mix(outward, jitter, 0.45) + 0.00001);

    // churn around the outward axis so it swirls instead of just exploding
    vec3 tangent = cross(outward, jitter);
    float tl = length(tangent);
    tangent = tl > 0.0001 ? tangent / tl : vec3(1.0, 0.0, 0.0);

    float burst = 0.15 + h1 * 2.2;
    float ang   = uScatter * (2.5 + h2 * 3.0) + uFxTime * (0.2 + h3 * 0.5);

    splatCenter += (dir * burst + tangent * sin(ang) * 0.7)
                 * uScatter * uCloudRadius;
  }
`;

const SPLAT_COLOR_SRC = "vColor = uintToRGBAVec(sampledCenterColor.r);";
const SPLAT_GHOST = `${SPLAT_COLOR_SRC}\n  vColor.a *= uGhost;`;

function patchSplatMaterial(mesh, centre, radius) {
  const mat = mesh?.material;
  if (!mat || mat.userData.fxPatched) return false;
  if (
    !mat.vertexShader.includes(SPLAT_CENTER_SRC) ||
    !mat.vertexShader.includes(SPLAT_COLOR_SRC)
  ) {
    return false;
  }

  mat.vertexShader = mat.vertexShader
    .replace("#include <common>", `#include <common>\n${SPLAT_UNIFORMS}`)
    .replace(SPLAT_CENTER_SRC, SPLAT_SCATTER)
    .replace(SPLAT_COLOR_SRC, SPLAT_GHOST);

  mat.uniforms.uScatter = { value: 0 };
  mat.uniforms.uGhost = { value: 1 };
  mat.uniforms.uFxTime = { value: 0 };
  mat.uniforms.uCloudCentre = { value: centre.clone() };
  mat.uniforms.uCloudRadius = { value: radius };

  mat.userData.fxPatched = true;
  mat.needsUpdate = true;
  return true;
}

/* ------------------------------------------------------------------ */

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

export default function SplatStage({
  src,
  fx = DEFAULT_FX,
  // Most .splat files converted from the original 3DGS datasets are
  // Y-down, hence the default. Flip to [0, 1, 0] if a scene shows up
  // upside down.
  sceneUp = [0, -1, 0],
  autoSpin = 0.2,
  resumeDelay = 2200,
  framing = 2.45,
  alphaThreshold = 5,
}) {
  const hostRef = useRef(null);
  const fxRef = useRef(fx);
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(null);
  const [touched, setTouched] = useState(false);

  // Keep the loop reading live settings without tearing the viewer down
  // every time a slider moves.
  useEffect(() => {
    fxRef.current = fx;
  }, [fx]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let cancelled = false;
    let raf = 0;
    let viewer = null;
    let renderer = null;
    let rt = null;
    let ro = null;
    let bgMat = null;
    let postMat = null;
    let quad = null;
    let bgScene = null;
    let postScene = null;
    let canvas = null;
    let detach = () => {};

    (async () => {
      const [THREE, GS] = await Promise.all([
        import("three"),
        import("@mkkellogg/gaussian-splats-3d"),
      ]);
      if (cancelled) return;

      /* ---------- renderer ---------- */

      const dpr = window.devicePixelRatio || 1;
      const size = () => ({
        w: Math.max(1, host.clientWidth),
        h: Math.max(1, host.clientHeight),
      });
      let { w, h } = size();

      renderer = new THREE.WebGLRenderer({
        antialias: false,
        precision: "highp",
        alpha: false,
      });
      // The splat material writes display-ready values, so keep three
      // out of the colour-space conversion business entirely.
      renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
      renderer.setPixelRatio(dpr);
      renderer.setSize(w, h, false);
      renderer.setClearColor(0x000000, 1);

      canvas = renderer.domElement;
      Object.assign(canvas.style, {
        width: "100%",
        height: "100%",
        display: "block",
        touchAction: "none",
      });
      host.appendChild(canvas);

      rt = new THREE.WebGLRenderTarget(
        Math.round(w * dpr),
        Math.round(h * dpr),
        {
          minFilter: THREE.LinearMipmapLinearFilter,
          magFilter: THREE.LinearFilter,
          format: THREE.RGBAFormat,
          type: THREE.UnsignedByteType,
          depthBuffer: true,
          stencilBuffer: false,
        }
      );
      rt.texture.generateMipmaps = true;

      /* ---------- background + post scenes ---------- */

      const quadGeo = new THREE.PlaneGeometry(2, 2);
      const flatCam = new THREE.Camera();

      bgMat = new THREE.ShaderMaterial({
        glslVersion: THREE.GLSL3,
        vertexShader: QUAD_VERT,
        fragmentShader: BG_FRAG,
        uniforms: {
          uTime: { value: 0 },
          uRes: { value: new THREE.Vector2(w, h) },
        },
        depthTest: false,
        depthWrite: false,
      });
      const bgQuad = new THREE.Mesh(quadGeo, bgMat);
      bgQuad.frustumCulled = false;
      bgScene = new THREE.Scene();
      bgScene.add(bgQuad);

      postMat = new THREE.ShaderMaterial({
        glslVersion: THREE.GLSL3,
        vertexShader: QUAD_VERT,
        fragmentShader: POST_FRAG,
        uniforms: {
          tScene: { value: rt.texture },
          uRes: { value: new THREE.Vector2(w * dpr, h * dpr) },
          uTime: { value: 0 },
          uEnergy: { value: 0 },
          uReveal: { value: 0 },
          uKaleido: { value: 0 },
          uWarp: { value: 0 },
          uGlitch: { value: 0 },
          uCrt: { value: 0 },
          uHolo: { value: 0 },
          uThermal: { value: 0 },
        },
        depthTest: false,
        depthWrite: false,
      });
      quad = new THREE.Mesh(quadGeo, postMat);
      quad.frustumCulled = false;
      postScene = new THREE.Scene();
      postScene.add(quad);

      /* ---------- camera ---------- */

      const camera = new THREE.PerspectiveCamera(50, w / h, 0.05, 500);
      const up = new THREE.Vector3().fromArray(sceneUp).normalize();
      const seed = new THREE.Vector3(1, 0, 0);
      if (Math.abs(seed.dot(up)) > 0.9) seed.set(0, 0, 1);
      const axisR = new THREE.Vector3().crossVectors(up, seed).normalize();
      const axisF = new THREE.Vector3().crossVectors(axisR, up).normalize();

      const PHI_LO = 0.55;
      const PHI_HI = 2.45;

      const cam = {
        theta: 0,
        phi: 1.16,
        radius: 4,
        tTheta: 0,
        tPhi: 1.16,
        tRadius: 4,
        phiBase: 1.16,
        radiusBase: 4,
        minRadius: 0.4,
        maxRadius: 40,
        target: new THREE.Vector3(),
        mode: "auto",
        autoBlend: 1,
        idleUntil: 0,
        energy: 0,
      };

      const place = () => {
        const sp = Math.sin(cam.phi);
        const cp = Math.cos(cam.phi);
        const dir = axisR
          .clone()
          .multiplyScalar(sp * Math.cos(cam.theta))
          .addScaledVector(axisF, sp * Math.sin(cam.theta))
          .addScaledVector(up, cp);
        camera.up.copy(up);
        camera.position.copy(cam.target).addScaledVector(dir, cam.radius);
        camera.lookAt(cam.target);
      };
      place();

      /* ---------- pointer / touch ---------- */

      const pts = new Map();
      let pinchPrev = 0;
      let firstTouch = true;

      const grab = () => {
        cam.mode = "manual";
        cam.autoBlend = 0;
        if (firstTouch) {
          firstTouch = false;
          setTouched(true);
        }
      };

      const onDown = (e) => {
        canvas.setPointerCapture?.(e.pointerId);
        pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
        if (pts.size === 2) {
          const [a, b] = [...pts.values()];
          pinchPrev = Math.hypot(a.x - b.x, a.y - b.y);
        }
        grab();
      };

      const onMove = (e) => {
        const prev = pts.get(e.pointerId);
        if (!prev) return;
        const dx = e.clientX - prev.x;
        const dy = e.clientY - prev.y;
        pts.set(e.pointerId, { x: e.clientX, y: e.clientY });

        if (pts.size >= 2) {
          const [a, b] = [...pts.values()];
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (pinchPrev > 0 && dist > 0) {
            cam.radiusBase = clamp(
              cam.radiusBase * (pinchPrev / dist),
              cam.minRadius,
              cam.maxRadius
            );
          }
          pinchPrev = dist;
        } else {
          cam.tTheta -= dx * 0.0062;
          cam.phiBase = clamp(cam.phiBase - dy * 0.0062, PHI_LO, PHI_HI);
        }
        cam.tPhi = cam.phiBase;
        cam.tRadius = cam.radiusBase;
      };

      const onUp = (e) => {
        pts.delete(e.pointerId);
        canvas.releasePointerCapture?.(e.pointerId);
        pinchPrev = 0;
        if (pts.size === 0) cam.idleUntil = performance.now() + resumeDelay;
      };

      const onWheel = (e) => {
        e.preventDefault();
        grab();
        cam.radiusBase = clamp(
          cam.radiusBase * Math.exp(e.deltaY * 0.0012),
          cam.minRadius,
          cam.maxRadius
        );
        cam.tRadius = cam.radiusBase;
        cam.idleUntil = performance.now() + resumeDelay;
      };

      canvas.addEventListener("pointerdown", onDown);
      canvas.addEventListener("pointermove", onMove);
      canvas.addEventListener("pointerup", onUp);
      canvas.addEventListener("pointercancel", onUp);
      canvas.addEventListener("wheel", onWheel, { passive: false });
      detach = () => {
        canvas.removeEventListener("pointerdown", onDown);
        canvas.removeEventListener("pointermove", onMove);
        canvas.removeEventListener("pointerup", onUp);
        canvas.removeEventListener("pointercancel", onUp);
        canvas.removeEventListener("wheel", onWheel);
      };

      /* ---------- resize ---------- */

      ro = new ResizeObserver(() => {
        const n = size();
        if (n.w === w && n.h === h) return;
        ({ w, h } = n);
        renderer.setSize(w, h, false);
        rt.setSize(Math.round(w * dpr), Math.round(h * dpr));
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        bgMat.uniforms.uRes.value.set(w, h);
        postMat.uniforms.uRes.value.set(w * dpr, h * dpr);
      });
      ro.observe(host);

      /* ---------- viewer ---------- */

      viewer = new GS.Viewer({
        renderer,
        camera,
        rootElement: host,
        selfDrivenMode: false,
        useBuiltInControls: false,
        sharedMemoryForWorkers: false,
        dynamicScene: false,
        antialiased: true,
        renderMode: GS.RenderMode.Always,
        logLevel: GS.LogLevel.None,
      });

      try {
        await viewer.addSplatScene(src, {
          splatAlphaRemovalThreshold: alphaThreshold,
          showLoadingUI: false,
          progressiveLoad: false,
          onProgress: (pct) => {
            if (!cancelled) setProgress(Math.round(pct));
          },
        });
      } catch (err) {
        if (!cancelled) setFailed(String(err?.message || err));
        return;
      }
      if (cancelled) return;

      /* ---------- frame the cloud we actually got ---------- */

      let splatMesh = null;
      let cloudCentre = new THREE.Vector3();
      let cloudRadius = 1;

      try {
        splatMesh = viewer.getSplatMesh();
        const count = splatMesh.getSplatCount();
        if (count > 0) {
          const step = Math.max(1, Math.floor(count / 20000));
          const xs = [];
          const ys = [];
          const zs = [];
          const c = new THREE.Vector3();
          for (let i = 0; i < count; i += step) {
            splatMesh.getSplatCenter(i, c);
            xs.push(c.x);
            ys.push(c.y);
            zs.push(c.z);
          }
          const med = (arr) => {
            arr.sort((p, q) => p - q);
            return arr[arr.length >> 1];
          };
          // Median centre and a p90 radius: real captures are full of
          // distant floaters and a bounding box would frame those.
          cloudCentre = new THREE.Vector3(med(xs), med(ys), med(zs));
          const dists = [];
          for (let i = 0; i < count; i += step) {
            splatMesh.getSplatCenter(i, c);
            dists.push(c.distanceTo(cloudCentre));
          }
          dists.sort((p, q) => p - q);
          cloudRadius =
            dists[Math.floor(dists.length * 0.9)] ||
            dists[dists.length - 1] ||
            1;

          cam.target.copy(cloudCentre);
          cam.radiusBase = cloudRadius * framing;
          cam.radius = cam.radiusBase;
          cam.tRadius = cam.radiusBase;
          cam.minRadius = cloudRadius * 0.35;
          cam.maxRadius = cloudRadius * 9;
          camera.near = Math.max(0.01, cloudRadius * 0.02);
          // scatter throws splats well outside the original bounds
          camera.far = cloudRadius * 120;
          camera.updateProjectionMatrix();
          place();
        }
      } catch {
        // framing is a nicety; a bad read shouldn't kill the viewer
      }

      patchSplatMaterial(splatMesh, cloudCentre, cloudRadius);

      setReady(true);

      /* ---------- loop ---------- */

      const t0 = performance.now();
      let last = t0;

      const loop = () => {
        raf = requestAnimationFrame(loop);
        const now = performance.now();
        const dt = Math.min(0.05, (now - last) / 1000);
        last = now;
        const t = (now - t0) / 1000;
        const f = fxRef.current || DEFAULT_FX;

        // hand control back once the finger has been off long enough
        if (cam.mode === "manual" && pts.size === 0 && now > cam.idleUntil) {
          cam.mode = "auto";
        }

        if (cam.mode === "auto") {
          cam.autoBlend = Math.min(1, cam.autoBlend + dt / 1.6);
          cam.tTheta += autoSpin * dt;
          cam.tPhi = cam.phiBase + Math.sin(t * 0.45) * 0.16 * cam.autoBlend;
          cam.tRadius =
            cam.radiusBase * (1 + Math.sin(t * 0.31) * 0.09 * cam.autoBlend);
        }

        const k = 1 - Math.exp(-dt * 6);
        const pTheta = cam.theta;
        const pPhi = cam.phi;
        cam.theta += (cam.tTheta - cam.theta) * k;
        cam.phi += (cam.tPhi - cam.phi) * k;
        cam.radius += (cam.tRadius - cam.radius) * k;
        place();

        const speed =
          (Math.abs(cam.theta - pTheta) + Math.abs(cam.phi - pPhi)) /
          Math.max(dt, 1e-4);
        cam.energy +=
          (clamp(speed / 2.2, 0, 1) - cam.energy) * (1 - Math.exp(-dt * 5));

        const reveal = Math.min(1, (now - t0) / 1500);

        /* --- splat-level effects --- */
        if (splatMesh) {
          const su = splatMesh.material?.uniforms;
          if (su?.uScatter) {
            su.uScatter.value = f.scatter;
            su.uGhost.value = f.ghost;
            su.uFxTime.value = t;
          }
          if (splatMesh.getSplatScale() !== f.splatSize) {
            splatMesh.setSplatScale(f.splatSize);
          }
          if (splatMesh.getPointCloudModeEnabled() !== f.pointCloud) {
            splatMesh.setPointCloudModeEnabled(f.pointCloud);
          }
        }

        /* --- post effects --- */
        bgMat.uniforms.uTime.value = t;
        const pu = postMat.uniforms;
        pu.uTime.value = t;
        pu.uEnergy.value = cam.energy;
        pu.uReveal.value = reveal;
        pu.uKaleido.value = f.kaleido;
        pu.uWarp.value = f.warp;
        pu.uGlitch.value = f.glitch ? 1 : 0;
        pu.uCrt.value = f.crt ? 1 : 0;
        pu.uHolo.value = f.holo ? 1 : 0;
        pu.uThermal.value = f.thermal ? 1 : 0;

        viewer.update();

        renderer.setRenderTarget(rt);
        renderer.autoClear = true;
        renderer.render(bgScene, flatCam);
        renderer.autoClear = false;
        viewer.render();
        renderer.autoClear = true;
        renderer.setRenderTarget(null);

        renderer.render(postScene, flatCam);
      };
      raf = requestAnimationFrame(loop);
    })().catch((err) => {
      if (!cancelled) setFailed(String(err?.message || err));
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      detach();
      ro?.disconnect();
      const done = viewer ? viewer.dispose() : Promise.resolve();
      Promise.resolve(done)
        .catch(() => {})
        .finally(() => {
          rt?.dispose();
          bgMat?.dispose();
          postMat?.dispose();
          quad?.geometry?.dispose();
          renderer?.dispose();
          if (canvas?.parentNode) canvas.parentNode.removeChild(canvas);
        });
    };
  }, [src, autoSpin, resumeDelay, framing, alphaThreshold, sceneUp.join(",")]);

  return (
    <div
      ref={hostRef}
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        background: "#04040a",
        cursor: "grab",
        touchAction: "none",
      }}
    >
      {!ready && !failed && (
        <div style={overlay}>
          <div style={barTrack}>
            <div style={{ ...barFill, width: `${progress}%` }} />
          </div>
          <span style={label}>{progress}%</span>
        </div>
      )}

      {failed && (
        <div style={{ ...overlay, padding: "0 24px", textAlign: "center" }}>
          <span style={{ ...label, color: "#ff6b8a" }}>{failed}</span>
        </div>
      )}

      {ready && !touched && <span style={hint}>drag &middot; pinch</span>}

      <style>{`@keyframes splatHintPulse{0%,100%{opacity:.25}50%{opacity:.75}}`}</style>
    </div>
  );
}

/* ------------------------------------------------------------------ */

const overlay = {
  position: "absolute",
  inset: 0,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: "10px",
  pointerEvents: "none",
  zIndex: 2,
};

const barTrack = {
  width: "96px",
  height: "2px",
  background: "rgba(255,255,255,0.14)",
  overflow: "hidden",
};

const barFill = {
  height: "100%",
  background: "linear-gradient(90deg,#6ad8ff,#c56bff)",
  transition: "width .2s linear",
};

const label = {
  font: "500 10px/1 ui-monospace,SFMono-Regular,Menlo,monospace",
  letterSpacing: "0.14em",
  color: "rgba(255,255,255,0.55)",
};

const hint = {
  position: "absolute",
  left: "50%",
  bottom: "14px",
  transform: "translateX(-50%)",
  font: "500 9px/1 ui-monospace,SFMono-Regular,Menlo,monospace",
  letterSpacing: "0.22em",
  textTransform: "uppercase",
  color: "rgba(255,255,255,0.4)",
  pointerEvents: "none",
  zIndex: 2,
  animation: "splatHintPulse 2.6s ease-in-out infinite",
};
