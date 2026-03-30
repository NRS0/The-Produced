import React, { useEffect, useRef } from 'react';
import * as THREE from 'three/webgpu';
import {
  Fn, uniform, float, vec3, instancedArray, instanceIndex, uv,
  positionGeometry, positionWorld, sin, cos, pow, smoothstep, mix,
  sqrt, select, hash, time, deltaTime, PI, mx_noise_float, pass
} from 'three/tsl';
import { dof } from 'three/addons/tsl/display/DepthOfFieldNode.js';

const BLADE_COUNT = 80000; // Reduced for better performance in React
const FIELD_SIZE = 30;
const BACKGROUND_HEX = '#000000';
const GROUND_HEX = '#000000';
const BLADE_BASE_HEX = '#1a0000'; // Dark red
const BLADE_TIP_HEX = '#FA003F'; // The Produced Red

export const InteractiveHero: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGPURenderer | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    let renderer: THREE.WebGPURenderer;
    let scene: THREE.Scene;
    let camera: THREE.PerspectiveCamera;
    let postProcessing: THREE.PostProcessing;
    let clock = new THREE.Clock();
    let animationId: number;

    const init = async () => {
      // Scene
      scene = new THREE.Scene();
      scene.background = new THREE.Color(BACKGROUND_HEX);
      scene.fog = new THREE.FogExp2('#000000', 0.035);

      // Camera
      camera = new THREE.PerspectiveCamera(38, window.innerWidth / window.innerHeight, 0.1, 100);
      camera.position.set(-2.8, 7.2, 19.6);
      camera.lookAt(0.5, 1.5, 0.4);

      // Renderer
      renderer = new THREE.WebGPURenderer({ antialias: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.0;
      containerRef.current?.appendChild(renderer.domElement);
      rendererRef.current = renderer;

      await renderer.init();

      // GPU Buffers
      const bladeData = instancedArray(BLADE_COUNT, 'vec4');
      const bendState = instancedArray(BLADE_COUNT, 'vec4');
      const bladeBound = instancedArray(BLADE_COUNT, 'float');

      // Uniforms
      const mouseWorld = uniform(new THREE.Vector3(99999, 0, 99999));
      const mouseRadius = uniform(6.1);
      const mouseStrength = uniform(4.0);
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
      const bladeColorVariation = uniform(0.93);
      const bladeBaseColor = uniform(new THREE.Color(BLADE_BASE_HEX));
      const bladeTipColor = uniform(new THREE.Color(BLADE_TIP_HEX));
      const fogStart = uniform(6.5);
      const fogEnd = uniform(12.0);
      const fogIntensity = uniform(1.0);
      const fogColor = uniform(new THREE.Color('#000000'));

      const noise2D = Fn(([x, z]) => mx_noise_float(vec3(x, float(0), z)).mul(0.5).add(0.5));

      // Compute Init
      const computeInit = Fn(() => {
        const blade = bladeData.element(instanceIndex);
        const jx = hash(instanceIndex).sub(0.5);
        const jz = hash(instanceIndex.add(7919)).sub(0.5);
        const wx = instanceIndex.mod(283).toFloat().add(jx).div(float(283)).sub(0.5).mul(FIELD_SIZE);
        const wz = instanceIndex.div(283).toFloat().add(jz).div(float(283)).sub(0.5).mul(FIELD_SIZE);
        blade.x.assign(wx);
        blade.y.assign(wz);
        blade.z.assign(hash(instanceIndex.add(1337)).mul(PI.mul(2)));
        const n1 = noise2D(wx.mul(noiseFrequency), wz.mul(noiseFrequency));
        const n2 = noise2D(wx.mul(noiseFrequency.mul(noise2Frequency)).add(50), wz.mul(noiseFrequency.mul(noise2Frequency)).add(50));
        const clump = n1.mul(noiseAmplitude).sub(noise2Amplitude).add(n2.mul(noise2Amplitude).mul(2)).max(0);
        blade.w.assign(clump);
        const dist = sqrt(wx.mul(wx).add(wz.mul(wz)));
        const edgeNoise = noise2D(wx.mul(0.25).add(100), wz.mul(0.25).add(100));
        const maxR = float(12.0).add(edgeNoise.sub(0.5).mul(6.0));
        const boundary = float(1).sub(smoothstep(maxR.sub(1.5), maxR, dist));
        bladeBound.element(instanceIndex).assign(select(boundary.lessThan(0.05), float(0), boundary));
      })().compute(BLADE_COUNT);

      // Compute Update
      const computeUpdate = Fn(() => {
        const blade = bladeData.element(instanceIndex);
        const bend = bendState.element(instanceIndex);
        const bx = blade.x;
        const bz = blade.y;

        const w1 = sin(bx.mul(0.35).add(bz.mul(0.12)).add(time.mul(windSpeed)));
        const w2 = sin(bx.mul(0.18).add(bz.mul(0.28)).add(time.mul(windSpeed.mul(0.67))).add(1.7));
        const windX = w1.add(w2).mul(windAmplitude);
        const windZ = w1.sub(w2).mul(windAmplitude.mul(0.55));

        const lw = deltaTime.mul(4.0).saturate();
        bend.x.assign(mix(bend.x, windX, lw));
        bend.y.assign(mix(bend.y, windZ, lw));

        const dx = bx.sub(mouseWorld.x);
        const dz = bz.sub(mouseWorld.z);
        const dist = sqrt(dx.mul(dx).add(dz.mul(dz))).add(0.0001);
        const falloff = float(1).sub(dist.div(mouseRadius).saturate());
        const influence = falloff.mul(falloff).mul(mouseStrength);
        
        const cdx = bx.sub(camSphereWorld.x);
        const cdz = bz.sub(camSphereWorld.z);
        const cdist = sqrt(cdx.mul(cdx).add(cdz.mul(cdz))).add(0.0001);
        const cfalloff = float(1).sub(cdist.div(camSphereRadius).saturate());
        const cinfluence = cfalloff.mul(cfalloff).mul(camSphereStrength);

        bend.z.assign(mix(bend.z, dx.div(dist).mul(influence).add(cdx.div(cdist).mul(cinfluence)), lw));
        bend.w.assign(mix(bend.w, dz.div(dist).mul(influence).add(cdz.div(cdist).mul(cinfluence)), lw));
      })().compute(BLADE_COUNT);

      // Blade Geometry
      const createBladeGeometry = () => {
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
      };

      const bladeGeo = createBladeGeometry();
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
        const clump = bladeData.element(instanceIndex).w.saturate();
        const lowerGrad = smoothstep(float(0.0), float(0.45), t);
        const upperGrad = smoothstep(float(0.4), float(0.85), t);
        const tipMix = float(1).sub(bladeColorVariation).add(clump.mul(bladeColorVariation));
        const tipFinal = mix(bladeBaseColor, bladeTipColor, tipMix);
        const lowerColor = mix(bladeBaseColor, bladeTipColor.mul(0.5), lowerGrad);
        const grassColor = mix(lowerColor, tipFinal, upperGrad);
        const blade = bladeData.element(instanceIndex);
        const dist = sqrt(blade.x.mul(blade.x).add(blade.y.mul(blade.y)));
        const fogFactor = smoothstep(fogStart, fogEnd, dist).mul(fogIntensity);
        return mix(grassColor, fogColor, fogFactor);
      })();

      grassMat.opacityNode = Fn(() => {
        const blade = bladeData.element(instanceIndex);
        const dist = sqrt(blade.x.mul(blade.x).add(blade.y.mul(blade.y)));
        const fadeFactor = float(1).sub(smoothstep(float(10.0), float(15.0), dist));
        return smoothstep(float(0.0), float(0.1), uv().y).mul(fadeFactor);
      })();
      grassMat.transparent = true;

      const grass = new THREE.InstancedMesh(bladeGeo, grassMat, BLADE_COUNT);
      grass.frustumCulled = false;
      scene.add(grass);

      // Ground
      const groundMat = new THREE.MeshBasicNodeMaterial();
      groundMat.colorNode = Fn(() => {
        const wx = positionWorld.x, wz = positionWorld.z;
        const dist = sqrt(wx.mul(wx).add(wz.mul(wz)));
        const edgeNoise = noise2D(wx.mul(0.25).add(100), wz.mul(0.25).add(100));
        const maxR = float(13.8).add(edgeNoise.sub(0.5).mul(4.0));
        const t = smoothstep(maxR.sub(2.4), maxR, dist);
        return mix(new THREE.Color(GROUND_HEX), new THREE.Color(BACKGROUND_HEX), t);
      })();
      const ground = new THREE.Mesh(new THREE.PlaneGeometry(FIELD_SIZE * 5, FIELD_SIZE * 5), groundMat);
      ground.rotation.x = -Math.PI / 2;
      scene.add(ground);

      // Post Processing
      postProcessing = new THREE.PostProcessing(renderer);
      const scenePass = pass(scene, camera);
      const focusDistanceU = uniform(31.83);
      const focalLengthU = uniform(10.0);
      const bokehScaleU = uniform(12.5);
      const dofOutput = dof(scenePass.getTextureNode('output'), scenePass.getViewZNode(), focusDistanceU, focalLengthU, bokehScaleU);
      postProcessing.outputNode = dofOutput;

      // Mouse
      const raycaster = new THREE.Raycaster();
      const mouseNDC = new THREE.Vector2();
      const grassPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
      const hitPoint = new THREE.Vector3();

      const onMouseMove = (e: MouseEvent) => {
        mouseNDC.set((e.clientX / window.innerWidth) * 2 - 1, -(e.clientY / window.innerHeight) * 2 + 1);
        raycaster.setFromCamera(mouseNDC, camera);
        if (raycaster.ray.intersectPlane(grassPlane, hitPoint)) {
          mouseWorld.value.copy(hitPoint);
        }
      };
      window.addEventListener('mousemove', onMouseMove);

      const onResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      };
      window.addEventListener('resize', onResize);

      await renderer.computeAsync(computeInit);

      const animate = () => {
        const dt = Math.min(clock.getDelta(), 0.05);
        camSphereWorld.value.set(camera.position.x, 0, camera.position.z);
        
        renderer.compute(computeUpdate);
        postProcessing.render();
        animationId = requestAnimationFrame(animate);
      };

      animate();

      return () => {
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('resize', onResize);
        cancelAnimationFrame(animationId);
        renderer.dispose();
      };
    };

    const cleanupPromise = init();

    return () => {
      cleanupPromise.then(cleanup => cleanup && cleanup());
    };
  }, []);

  return <div ref={containerRef} className="absolute inset-0 z-0 pointer-events-none" />;
};
