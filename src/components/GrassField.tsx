import React, { useEffect, useRef } from 'react';
import * as THREE from 'three/webgpu';
import {
  Fn, uniform, float, vec3, instancedArray, instanceIndex, uv,
  positionGeometry, positionWorld, sin, cos, pow, smoothstep, mix,
  sqrt, select, hash, time, deltaTime, PI, mx_noise_float,
  pass, mrt, output, transformedNormalView,
} from 'three/tsl';
import { dof } from 'three/addons/tsl/display/DepthOfFieldNode.js';

const BLADE_COUNT = 100000;
const FIELD_SIZE = 60; // Increased for better coverage
const BACKGROUND_HEX = '#000000';
const GROUND_HEX = '#000000';
// Deep Red Theme
const BLADE_BASE_HEX = '#1a0000';
const BLADE_TIP_HEX = '#b30000';

// Brand Red Params (consistent across all stages)
const RED_PARAMS = { 
  bladeBaseR: 0.1, bladeBaseG: 0.0, bladeBaseB: 0.0, 
  bladeTipR: 0.7, bladeTipG: 0.0, bladeTipB: 0.0,
  colorVar: 0.0 // No variation
};

// Per-stage camera path with full DoF settings
// [scroll, posX, posY, posZ, lookX, lookY, lookZ, focusDist, autoFocus, dofOn, focalLen, bokehScale, afSpeed, afMin, afMax]
const cameraPath = [
  [0.00, -2.8,  7.2, 19.6,  0.5, 1.5,  0.4, 22.0, 1, 1, 10.0, 12.5, 5.0, 1.0, 40.0],
  [0.14,  0,    2.2, 14.0,  0,  -2.0,   0,   15.0, 1, 1,  8.0, 10.0, 5.0, 1.0, 30.0],
  [0.28,  7.5, 10.9, 15.8,  0,   0.0,   0.7, 10.0, 1, 1,  6.0,  8.0, 5.0, 0.5, 20.0],
  [0.43, -8.0,  6.8, 21.6,  0,   0.2,   0,    7.0, 1, 1,  5.0, 10.0, 5.0, 0.5, 15.0],
  [0.57, -1.0,  5.3, 25.0, -1.2, 3.0,   0,    5.0, 1, 1,  4.0, 14.0, 6.0, 1.1, 21.5],
  [0.78, -1.6,  2.4,  0.0, -1.2, -2.0,   0.0, 16.4, 1, 0, 20.0, 18.0, 19.0, 2.8, 12.5],
  [1.00,  0,   15.0,  0.0, -5,   3.0,  -5,    9.8, 1, 1, 13.8,  0.0, 17.5, 1.2,  9.0],
];

const stageParams = cameraPath.map((_, i) => ({
  ...RED_PARAMS,
  fogStart: i === 5 ? 7 : (i === 6 ? 2 : 6.5),
  fogEnd: i === 3 ? 12.5 : (i === 6 ? 10 : 12.0),
  bladeHeight: i === 3 || i === 6 ? 2.0 : (i === 5 ? 0.9 : 1.6),
  bladeHeightVar: i === 3 ? 1.0 : (i === 5 || i === 6 ? 0.0 : 0.5),
  bladeLean: i === 3 || i === 5 || i === 6 ? 0.0 : 1.1,
  windSpeed: 1.3,
  windAmplitude: 0.21,
  bladeTipWidth: i === 5 ? 0.27 : 0.19,
}));

export const GrassField: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGPURenderer | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    let animationFrameId: number;
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // --- Scene Setup ---
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(BACKGROUND_HEX);
    scene.fog = new THREE.FogExp2(BACKGROUND_HEX, 0.035);

    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(-2.8, 7.2, 19.6);
    const lookTarget = new THREE.Vector3(0.5, 1.5, 0.4);
    camera.lookAt(lookTarget);

    const renderer = new THREE.WebGPURenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // --- GPU Buffers ---
    const bladeData = instancedArray(BLADE_COUNT, 'vec4');
    const bendState = instancedArray(BLADE_COUNT, 'vec4');
    const bladeBound = instancedArray(BLADE_COUNT, 'float');

    // --- Uniforms ---
    const mouseWorld = uniform(new THREE.Vector3(99999, 0, 99999));
    const mouseVelocity = uniform(new THREE.Vector3(0, 0, 0));
    const mouseRadius = uniform(4.0); // More localized
    const mouseStrength = uniform(12.0); // Stronger push
    const outerRadius = uniform(8.0); // More localized
    const outerStrength = uniform(4.0);
    const camSphereWorld = uniform(new THREE.Vector3(99999, 0, 99999));
    const camSphereRadius = uniform(15.0);
    const camSphereStrength = uniform(5.9);

    const grassDensity = uniform(1.0);
    const windSpeed = uniform(1.3);
    const windAmplitude = uniform(0.21);
    const bladeWidth = uniform(4.0);
    const bladeTipWidth = uniform(0.19);
    const bladeHeight = uniform(1.6);
    const bladeHeightVariation = uniform(0.5);
    const bladeLean = uniform(1.1);
    const noiseAmplitude = uniform(1.85);
    const noiseFrequency = uniform(0.3);
    const noise2Amplitude = uniform(0.2);
    const noise2Frequency = uniform(15);
    const bladeColorVariation = uniform(0.0);
    const groundRadius = uniform(13.8);
    const groundFalloff = uniform(2.4);
    
    const bladeBaseColor = uniform(new THREE.Color(BLADE_BASE_HEX));
    const bladeTipColor = uniform(new THREE.Color(BLADE_TIP_HEX));
    const backgroundColor = uniform(new THREE.Color(BACKGROUND_HEX));
    const groundColor = uniform(new THREE.Color(GROUND_HEX));
    
    const fogStart = uniform(6.5);
    const fogEnd = uniform(12.0);
    const fogIntensity = uniform(1.0);
    const fogColor = uniform(new THREE.Color(BACKGROUND_HEX));
    
    const goldenTipColor = uniform(new THREE.Color('#b30000'));
    const greenTipColor = uniform(new THREE.Color('#b30000'));
    const midColor = uniform(new THREE.Color('#400000'));

    // --- DoF Uniforms ---
    const focusDistanceU = uniform(22.0);
    const focalLengthU = uniform(10.0);
    const bokehScaleU = uniform(12.5);

    const noise2D = Fn(([x, z]) => mx_noise_float(vec3(x, float(0), z)).mul(0.5).add(0.5));

    // --- Interpolation Logic ---
    const lerpCam = (scrollT: number) => {
      const snapThreshold = 0.005;
      for (let j = 0; j < cameraPath.length; j++) {
        if (Math.abs(cameraPath[j][0] - scrollT) < snapThreshold) {
          const kf = cameraPath[j];
          return {
            px: kf[1], py: kf[2], pz: kf[3],
            lx: kf[4], ly: kf[5], lz: kf[6],
            fd: kf[7], af: kf[8], dofOn: kf[9],
            fl: kf[10], bk: kf[11],
            afSpd: kf[12], afMin: kf[13], afMax: kf[14],
            params: { ...stageParams[j] },
          };
        }
      }

      let i = 0;
      for (let j = 1; j < cameraPath.length; j++) {
        if (cameraPath[j][0] >= scrollT) { i = j - 1; break; }
        if (j === cameraPath.length - 1) i = j - 1;
      }
      const a = cameraPath[i], b = cameraPath[Math.min(i + 1, cameraPath.length - 1)];
      const range = b[0] - a[0];
      const t = range > 0 ? Math.max(0, Math.min(1, (scrollT - a[0]) / range)) : 0;
      const ease = t * t * (3 - 2 * t);

      const iB = Math.min(i + 1, cameraPath.length - 1);
      const pA = stageParams[i], pB = stageParams[iB];
      const lerpedParams: any = {};
      Object.keys(pA).forEach(k => {
        // @ts-ignore
        lerpedParams[k] = pA[k] + (pB[k] - pA[k]) * ease;
      });

      return {
        px: a[1] + (b[1] - a[1]) * ease,
        py: a[2] + (b[2] - a[2]) * ease,
        pz: a[3] + (b[3] - a[3]) * ease,
        lx: a[4] + (b[4] - a[4]) * ease,
        ly: a[5] + (b[5] - a[5]) * ease,
        lz: a[6] + (b[6] - a[6]) * ease,
        fd: a[7] + (b[7] - a[7]) * ease,
        af: a[8] + (b[8] - a[8]) * ease,
        dofOn: a[9] + (b[9] - a[9]) * ease,
        fl: a[10] + (b[10] - a[10]) * ease,
        bk: a[11] + (b[11] - a[11]) * ease,
        afSpd: a[12] + (b[12] - a[12]) * ease,
        afMin: a[13] + (b[13] - a[13]) * ease,
        afMax: a[14] + (b[14] - a[14]) * ease,
        params: lerpedParams,
      };
    };

    let currentScrollT = 0;
    let targetScrollT = 0;

    const getScrollProgress = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight;
      const winHeight = window.innerHeight;
      const scrollable = docHeight - winHeight;
      return scrollable > 0 ? Math.min(1, Math.max(0, scrollTop / scrollable)) : 0;
    };

    const syncCameraPathToDOM = () => {
      const docHeight = document.documentElement.scrollHeight;
      const winHeight = window.innerHeight;
      const scrollable = docHeight - winHeight;
      if (scrollable <= 0) return;
      
      // We'll use the original scroll values from the Verdana code as they are normalized
      // but we could also sync them to specific sections if they existed.
      // For now, we'll stick to the normalized 0-1 range.
    };

    let _scrollDirty = false;
    const onScroll = () => { _scrollDirty = true; };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('touchmove', onScroll, { passive: true });

    // --- Compute Init ---
    const computeInit = Fn(() => {
      const blade = bladeData.element(instanceIndex);
      const gridSize = float(316); // sqrt(100000)
      const col = instanceIndex.mod(gridSize);
      const row = instanceIndex.div(gridSize);
      const jx = hash(instanceIndex).sub(0.5);
      const jz = hash(instanceIndex.add(7919)).sub(0.5);
      const wx = col.toFloat().add(jx).div(gridSize).sub(0.5).mul(FIELD_SIZE);
      const wz = row.toFloat().add(jz).div(gridSize).sub(0.5).mul(FIELD_SIZE);
      blade.x.assign(wx);
      blade.y.assign(wz);
      blade.z.assign(hash(instanceIndex.add(1337)).mul(PI.mul(2)));
      const n1 = noise2D(wx.mul(noiseFrequency), wz.mul(noiseFrequency));
      const n2 = noise2D(wx.mul(noiseFrequency.mul(noise2Frequency)).add(50), wz.mul(noiseFrequency.mul(noise2Frequency)).add(50));
      const clump = n1.mul(noiseAmplitude).sub(noise2Amplitude).add(n2.mul(noise2Amplitude).mul(2)).max(0);
      blade.w.assign(clump);
      const dist = sqrt(wx.mul(wx).add(wz.mul(wz)));
      const edgeNoise = noise2D(wx.mul(0.25).add(100), wz.mul(0.25).add(100));
      const maxR = float(25.0).add(edgeNoise.sub(0.5).mul(10.0)); // Increased radius for larger field
      const boundary = float(1).sub(smoothstep(maxR.sub(5.0), maxR, dist));
      bladeBound.element(instanceIndex).assign(select(boundary.lessThan(0.05), float(0), boundary));
    })().compute(BLADE_COUNT);

    // --- Compute Update ---
    const computeUpdate = Fn(() => {
      const blade = bladeData.element(instanceIndex);
      const bend = bendState.element(instanceIndex);
      const bx = blade.x;
      const bz = blade.y;

      const w1 = sin(bx.mul(0.35).add(bz.mul(0.12)).add(time.mul(windSpeed)));
      const w2 = sin(bx.mul(0.18).add(bz.mul(0.28)).add(time.mul(windSpeed.mul(0.67))).add(1.7));
      const windX = w1.add(w2).mul(windAmplitude);
      const windZ = w1.sub(w2).mul(windAmplitude.mul(0.55));

      const lw = deltaTime.mul(2.0).saturate(); // Slower response for stability
      bend.x.assign(mix(bend.x, windX, lw));
      bend.y.assign(mix(bend.y, windZ, lw));

      // Mouse push & drag
      const dx = bx.sub(mouseWorld.x);
      const dz = bz.sub(mouseWorld.z);
      const dist = sqrt(dx.mul(dx).add(dz.mul(dz))).add(0.0001);
      const falloff = float(1).sub(dist.div(mouseRadius).saturate());
      const influence = falloff.mul(falloff).mul(mouseStrength);
      
      // Push away
      const pushX = dx.div(dist).mul(influence);
      const pushZ = dz.div(dist).mul(influence);
      
      // Drag in direction of mouse motion
      const dragX = mouseVelocity.x.mul(influence).mul(1.5);
      const dragZ = mouseVelocity.z.mul(influence).mul(1.5);

      // Outer mouse sphere
      const odx = bx.sub(mouseWorld.x);
      const odz = bz.sub(mouseWorld.z);
      const odist = sqrt(odx.mul(odx).add(odz.mul(odz))).add(0.0001);
      const ofalloff = float(1).sub(odist.div(outerRadius).saturate());
      const oinfluence = ofalloff.mul(ofalloff).mul(outerStrength);
      const opushX = odx.div(odist).mul(oinfluence);
      const opushZ = odz.div(odist).mul(oinfluence);
      
      const combinedMouseX = pushX.add(dragX).add(opushX);
      const combinedMouseZ = pushZ.add(dragZ).add(opushZ);

      // Camera sphere push
      const cdx = bx.sub(camSphereWorld.x);
      const cdz = bz.sub(camSphereWorld.z);
      const cdist = sqrt(cdx.mul(cdx).add(cdz.mul(cdz))).add(0.0001);
      const cfalloff = float(1).sub(cdist.div(camSphereRadius).saturate());
      const cinfluence = cfalloff.mul(cfalloff).mul(camSphereStrength);
      const cpushX = cdx.div(cdist).mul(cinfluence);
      const cpushZ = cdz.div(cdist).mul(cinfluence);

      const totalPushX = combinedMouseX.add(cpushX);
      const totalPushZ = combinedMouseZ.add(cpushZ);

      const targetMag = sqrt(totalPushX.mul(totalPushX).add(totalPushZ.mul(totalPushZ)));
      const currentMag = sqrt(bend.z.mul(bend.z).add(bend.w.mul(bend.w)));
      const lm = select(targetMag.greaterThan(currentMag), deltaTime.mul(12.0), deltaTime.mul(0.8)).saturate(); // Faster response for interactivity
      bend.z.assign(mix(bend.z, totalPushX, lm));
      bend.w.assign(mix(bend.w, totalPushZ, lm));
    })().compute(BLADE_COUNT);

    // --- Blade Geometry ---
    function createBladeGeometry() {
      const segs = 5, W = 0.055, H = 1.0;
      const verts = [], norms = [], uvArr = [], idx = [];
      for (let i = 0; i <= segs; i++) {
        const t = i / segs, y = t * H, hw = W * 0.5 * (1.0 - t * 0.82);
        verts.push(-hw, y, 0, hw, y, 0);
        norms.push(0, 0, 1, 0, 0, 1);
        uvArr.push(0, t, 1, t);
      }
      for (let i = 0; i < segs; i++) { const b = i * 2; idx.push(b, b + 1, b + 2, b + 1, b + 3, b + 2); }
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3));
      geo.setAttribute('normal', new THREE.Float32BufferAttribute(norms, 3));
      geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvArr, 2));
      geo.setIndex(idx);
      return geo;
    }

    // --- Grass Material ---
    const grassMat = new THREE.MeshBasicNodeMaterial({ side: THREE.DoubleSide, fog: true });

    grassMat.positionNode = Fn(() => {
      const blade = bladeData.element(instanceIndex);
      const bend = bendState.element(instanceIndex);
      const worldX = blade.x, worldZ = blade.y, rotY = blade.z;
      const boundary = bladeBound.element(instanceIndex);
      const visible = select(hash(instanceIndex.add(9999)).lessThan(grassDensity.mul(0.5)), float(1), float(0));
      const hVar = hash(instanceIndex.add(5555)).mul(bladeHeightVariation);
      const heightScale = float(0.35).add(blade.w).add(hVar).mul(boundary).mul(visible);
      const taper = float(1).sub(uv().y.mul(float(1).sub(bladeTipWidth)));
      const lx = positionGeometry.x.mul(bladeWidth).mul(taper).mul(heightScale.sign());
      const ly = positionGeometry.y.mul(heightScale).mul(bladeHeight);
      const cY = cos(rotY), sY = sin(rotY);
      const rx = lx.mul(cY), rz = lx.mul(sY);
      const t = uv().y;
      const bendFactor = pow(t, 1.8);
      const staticBendX = hash(instanceIndex.add(7777)).sub(0.5).mul(bladeLean);
      const staticBendZ = hash(instanceIndex.add(8888)).sub(0.5).mul(bladeLean);
      const bendX = staticBendX.add(bend.x).add(bend.z);
      const bendZ = staticBendZ.add(bend.y).add(bend.w);
      const relX = rx.add(bendX.mul(bendFactor).mul(bladeHeight));
      const relY = ly;
      const relZ = rz.add(bendZ.mul(bendFactor).mul(bladeHeight));
      const origLen = sqrt(rx.mul(rx).add(ly.mul(ly)).add(rz.mul(rz)));
      const newLen = sqrt(relX.mul(relX).add(relY.mul(relY)).add(relZ.mul(relZ)));
      const scale = origLen.div(newLen.max(0.0001));
      return vec3(worldX.add(relX.mul(scale)), relY.mul(scale), worldZ.add(relZ.mul(scale)));
    })();

    grassMat.colorNode = Fn(() => {
      const t = uv().y;
      const lowerGrad = smoothstep(float(0.0), float(0.45), t);
      const upperGrad = smoothstep(float(0.4), float(0.85), t);
      const lowerColor = mix(bladeBaseColor, midColor, lowerGrad);
      const grassColor = mix(lowerColor, bladeTipColor, upperGrad);
      const blade = bladeData.element(instanceIndex);
      const dist = sqrt(blade.x.mul(blade.x).add(blade.y.mul(blade.y)));
      const fogFactor = smoothstep(fogStart, fogEnd, dist).mul(fogIntensity);
      return mix(grassColor, fogColor, fogFactor);
    })();

    grassMat.opacityNode = Fn(() => {
      const blade = bladeData.element(instanceIndex);
      const dist = sqrt(blade.x.mul(blade.x).add(blade.y.mul(blade.y)));
      const fadeEnd = select(fogIntensity.greaterThan(0.01), fogEnd.add(2.0), float(15.0));
      const fadeFactor = float(1).sub(smoothstep(fadeEnd.sub(5.0), fadeEnd, dist));
      return smoothstep(float(0.0), float(0.1), uv().y).mul(fadeFactor);
    })();
    grassMat.transparent = true;

    // --- Instances ---
    const bladeGeo = createBladeGeometry();
    const grass = new THREE.InstancedMesh(bladeGeo, grassMat, BLADE_COUNT);
    grass.frustumCulled = false;
    scene.add(grass);
    const dummy = new THREE.Object3D();
    for (let i = 0; i < BLADE_COUNT; i++) grass.setMatrixAt(i, dummy.matrix);
    grass.instanceMatrix.needsUpdate = true;

    // --- Ground ---
    const groundMat = new THREE.MeshBasicNodeMaterial();
    groundMat.colorNode = Fn(() => {
      const wx = positionWorld.x, wz = positionWorld.z;
      const dist = sqrt(wx.mul(wx).add(wz.mul(wz)));
      const edgeNoise = noise2D(wx.mul(0.25).add(100), wz.mul(0.25).add(100));
      const maxR = groundRadius.add(edgeNoise.sub(0.5).mul(4.0));
      const t = smoothstep(maxR.sub(groundFalloff), maxR, dist);
      return mix(groundColor, backgroundColor, t);
    })();
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(FIELD_SIZE * 5, FIELD_SIZE * 5), groundMat);
    ground.rotation.x = -Math.PI / 2;
    scene.add(ground);

    // --- Lighting ---
    scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    const dirLight = new THREE.DirectionalLight(0xfff4e0, 1.5);
    dirLight.position.set(5, 10, 7);
    scene.add(dirLight);

    // --- Post Processing (DoF) ---
    const postProcessing = new THREE.PostProcessing(renderer);
    const scenePass = pass(scene, camera);
    scenePass.setMRT(mrt({
      output: output,
      normal: transformedNormalView,
    }));
    const sceneColor = scenePass.getTextureNode('output');
    const sceneViewZ = scenePass.getViewZNode();
    const dofOutput = dof(sceneColor, sceneViewZ, focusDistanceU, focalLengthU, bokehScaleU);

    postProcessing.outputNode = dofOutput;
    postProcessing.needsUpdate = true;

    // --- Mouse Interaction ---
    const raycaster = new THREE.Raycaster();
    const mouseNDC = new THREE.Vector2();
    const grassPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    const hitPoint = new THREE.Vector3();
    const lastHitPoint = new THREE.Vector3();
    let firstMove = true;

    const onMouseMove = (e: MouseEvent | TouchEvent) => {
      const rect = container.getBoundingClientRect();
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      
      mouseNDC.set(
        ((clientX - rect.left) / width) * 2 - 1,
        -((clientY - rect.top) / height) * 2 + 1
      );
      raycaster.setFromCamera(mouseNDC, camera);
      if (raycaster.ray.intersectPlane(grassPlane, hitPoint)) {
        if (firstMove) {
          lastHitPoint.copy(hitPoint);
          firstMove = false;
        }
        
        // Calculate velocity
        const velX = hitPoint.x - lastHitPoint.x;
        const velZ = hitPoint.z - lastHitPoint.z;
        
        // Apply velocity with some smoothing
        mouseVelocity.value.x = mouseVelocity.value.x * 0.8 + velX * 0.2;
        mouseVelocity.value.z = mouseVelocity.value.z * 0.8 + velZ * 0.2;
        
        mouseWorld.value.copy(hitPoint);
        lastHitPoint.copy(hitPoint);
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('touchmove', onMouseMove, { passive: true });

    // --- Boot ---
    const initRenderer = async () => {
      await renderer.init();
      await renderer.computeAsync(computeInit);
      
      const clock = new THREE.Clock();

      const animate = () => {
        const dt = Math.min(clock.getDelta(), 0.05);
        
        if (_scrollDirty) {
          targetScrollT = getScrollProgress();
          _scrollDirty = false;
        }

        // Smooth scroll interpolation - SLOWER (dt * 2 instead of dt * 6)
        currentScrollT += (targetScrollT - currentScrollT) * Math.min(1, dt * 2);

        const cam = lerpCam(currentScrollT);
        
        // Camera sphere - push grass away from camera base
        camSphereWorld.value.set(camera.position.x, 0, camera.position.z);

        // Apply camera position and look target from interpolation
        const targetPos = new THREE.Vector3(cam.px, cam.py, cam.pz);
        const currentLookTarget = new THREE.Vector3(cam.lx, cam.ly, cam.lz);
        
        // Add subtle mouse tilt on top of scroll position - MORE STABLE (0.02 lerp)
        const mouseTiltX = mouseNDC.x * 0.5;
        const mouseTiltY = mouseNDC.y * 0.3;
        targetPos.x += mouseTiltX;
        targetPos.y += mouseTiltY;
        
        camera.position.lerp(targetPos, 0.05);
        camera.lookAt(currentLookTarget);

        // Apply interpolated parameters to uniforms
        if (cam.params) {
          const p = cam.params;
          if (p.fogStart !== undefined) fogStart.value = p.fogStart;
          if (p.fogEnd !== undefined) fogEnd.value = p.fogEnd;
          if (p.bladeHeight !== undefined) bladeHeight.value = p.bladeHeight;
          if (p.bladeHeightVar !== undefined) bladeHeightVariation.value = p.bladeHeightVar;
          if (p.bladeLean !== undefined) bladeLean.value = p.bladeLean;
          if (p.windSpeed !== undefined) windSpeed.value = p.windSpeed;
          if (p.windAmplitude !== undefined) windAmplitude.value = p.windAmplitude;
          
          // Apply colors (interpolated channels)
          if (p.bladeBaseR !== undefined) bladeBaseColor.value.r = p.bladeBaseR;
          if (p.bladeBaseG !== undefined) bladeBaseColor.value.g = p.bladeBaseG;
          if (p.bladeBaseB !== undefined) bladeBaseColor.value.b = p.bladeBaseB;
          
          if (p.bladeTipR !== undefined) bladeTipColor.value.r = p.bladeTipR;
          if (p.bladeTipG !== undefined) bladeTipColor.value.g = p.bladeTipG;
          if (p.bladeTipB !== undefined) bladeTipColor.value.b = p.bladeTipB;
        }

        renderer.compute(computeUpdate);
        
        // Decay mouse velocity
        mouseVelocity.value.x *= 0.95;
        mouseVelocity.value.z *= 0.95;

        postProcessing.render();
        animationFrameId = requestAnimationFrame(animate);
      };

      animate();
    };

    initRenderer();

    const handleResize = () => {
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('touchmove', onMouseMove);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('touchmove', onScroll);
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={containerRef} className="h-full w-full" />;
};
