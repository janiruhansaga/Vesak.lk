"use client";

import React, { useState, useRef, useEffect } from 'react';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { 
  Lightbulb, 
  Flag, 
  Settings,
  Trash2,
  Camera,
  Moon,
  Move,
  Volume2, 
  VolumeX,
  Play,
  Info,
  X,
  MapPin
} from 'lucide-react';

const AtapattamIcon = ({ size = 24, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12,2 22,12 12,22 2,12" />
    <line x1="12" y1="2" x2="12" y2="22" />
    <line x1="2" y1="12" x2="22" y2="12" />
  </svg>
);

const PahanIcon = ({ size = 24, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2c0 0-4 3-4 8a4 4 0 0 0 8 0c0-5-4-8-4-8z" />
    <path d="M6 14h12v4a4 4 0 0 1-8 0v-4" />
    <line x1="6" y1="18" x2="18" y2="18" />
  </svg>
);

const TubeLightIcon = ({ size = 24, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="10" width="20" height="4" rx="2" />
    <line x1="4" y1="14" x2="4" y2="16" />
    <line x1="20" y1="14" x2="20" y2="16" />
  </svg>
);

class RealisticNightAudio {
  ctx: AudioContext | null;
  masterGain: GainNode | null;
  isPlaying: boolean;
  nodes: any[];
  intervals: any[];

  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.isPlaying = false;
    this.nodes = [];
    this.intervals = [];
  }

  start() {
    if (this.isPlaying) return;
    this.isPlaying = true;
    
    // Lazy initialize audio context on first click to satisfy browser security policies
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    this.ctx = new AudioContextClass();
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.value = 0.4;
    this.masterGain.connect(this.ctx.destination);
    
    this.ctx.resume();

    // 1. Crickets (High frequency modulated noise)
    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const noiseSource = this.ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    noiseSource.loop = true;

    const bandpass = this.ctx.createBiquadFilter();
    bandpass.type = 'bandpass';
    bandpass.frequency.value = 4500;
    bandpass.Q.value = 10;

    const cricketGain = this.ctx.createGain();
    cricketGain.gain.value = 0.05;

    // Modulate cricket volume for chirping effect
    const lfo = this.ctx.createOscillator();
    lfo.type = 'square';
    lfo.frequency.value = 12; // fast chirps
    
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.value = 0.05;
    
    lfo.connect(lfoGain);
    lfoGain.connect(cricketGain.gain);

    noiseSource.connect(bandpass);
    bandpass.connect(cricketGain);
    cricketGain.connect(this.masterGain);

    noiseSource.start();
    lfo.start();
    this.nodes.push(noiseSource, lfo);

    // 2. Distant ambient hum (City night)
    const hum = this.ctx.createOscillator();
    hum.type = 'sine';
    hum.frequency.value = 55;
    const humGain = this.ctx.createGain();
    humGain.gain.value = 0.08;
    hum.connect(humGain);
    humGain.connect(this.masterGain);
    hum.start();
    this.nodes.push(hum);

    // 3. Occasional distant dog bark simulation (lowpass filtered bursts)
    const playBark = () => {
      if (!this.isPlaying || !this.ctx || !this.masterGain) return;
      const barkOsc = this.ctx.createOscillator();
      barkOsc.type = 'sawtooth';
      barkOsc.frequency.setValueAtTime(300, this.ctx.currentTime);
      barkOsc.frequency.exponentialRampToValueAtTime(100, this.ctx.currentTime + 0.2);
      
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 400;

      const barkGain = this.ctx.createGain();
      barkGain.gain.setValueAtTime(0, this.ctx.currentTime);
      barkGain.gain.linearRampToValueAtTime(0.02, this.ctx.currentTime + 0.05);
      barkGain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.3);

      barkOsc.connect(filter);
      filter.connect(barkGain);
      barkGain.connect(this.masterGain!);

      barkOsc.start();
      barkOsc.stop(this.ctx.currentTime + 0.4);
    };

    this.intervals.push(setInterval(() => {
      if (Math.random() > 0.7) {
        playBark();
        setTimeout(playBark, 400); // double bark
      }
    }, 12000));
  }

  stop() {
    this.isPlaying = false;
    this.nodes.forEach(n => { try { n.stop(); } catch(e){} });
    this.nodes = [];
    this.intervals.forEach(clearInterval);
    this.intervals = [];
    if (this.ctx) {
      this.ctx.close();
      this.ctx = null;
    }
  }
}

const generateTextures = () => {
  const textures: Record<string, THREE.Texture> = {};
  
  // Plaster Wall Texture
  const wallCanvas = document.createElement('canvas');
  wallCanvas.width = 512; wallCanvas.height = 512;
  const wCtx = wallCanvas.getContext('2d');
  if (wCtx) {
    wCtx.fillStyle = '#dcd5c9'; // Warm cement/plaster color
    wCtx.fillRect(0, 0, 512, 512);
    for(let i=0; i<15000; i++) {
      wCtx.fillStyle = `rgba(0,0,0,${Math.random() * 0.05})`;
      wCtx.fillRect(Math.random()*512, Math.random()*512, 2, 2);
    }
  }
  textures.wall = new THREE.CanvasTexture(wallCanvas);
  textures.wall.wrapS = textures.wall.wrapT = THREE.RepeatWrapping;

  // Wet Asphalt Road Texture
  const roadCanvas = document.createElement('canvas');
  roadCanvas.width = 512; roadCanvas.height = 512;
  const rCtx = roadCanvas.getContext('2d');
  if (rCtx) {
    rCtx.fillStyle = '#1a1a1c';
    rCtx.fillRect(0, 0, 512, 512);
    for(let i=0; i<20000; i++) {
      rCtx.fillStyle = Math.random() > 0.5 ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.1)';
      rCtx.fillRect(Math.random()*512, Math.random()*512, 3, 3);
    }
  }
  textures.road = new THREE.CanvasTexture(roadCanvas);
  textures.road.wrapS = textures.road.wrapT = THREE.RepeatWrapping;
  textures.road.repeat.set(10, 10);

  // Roof Tile Texture
  const roofCanvas = document.createElement('canvas');
  roofCanvas.width = 256; roofCanvas.height = 256;
  const rfCtx = roofCanvas.getContext('2d');
  if (rfCtx) {
    rfCtx.fillStyle = '#8b3a2b';
    rfCtx.fillRect(0,0,256,256);
    rfCtx.strokeStyle = '#6a2a1b';
    rfCtx.lineWidth = 4;
    for(let y=0; y<256; y+=32) {
      rfCtx.beginPath(); rfCtx.moveTo(0, y); rfCtx.lineTo(256, y); rfCtx.stroke();
      for(let x=0; x<256; x+=32) {
        rfCtx.beginPath(); rfCtx.moveTo(x + (y%64===0?16:0), y); rfCtx.lineTo(x + (y%64===0?16:0), y+32); rfCtx.stroke();
      }
    }
  }
  textures.roof = new THREE.CanvasTexture(roofCanvas);
  textures.roof.wrapS = textures.roof.wrapT = THREE.RepeatWrapping;
  textures.roof.repeat.set(4, 4);

  return textures;
};

export default function DigitalVesakZone() {
  const [started, setStarted] = useState(false);
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [audioEnabled, setAudioEnabled] = useState(false);
  
  // Selection & Properties State
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [itemProperties, setItemProperties] = useState({ color: '#ffffff', size: 1, on: true });
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const mountRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<any>(null);
  const audioSynthRef = useRef<RealisticNightAudio | null>(null);
  
  // Ref to track look-around dragging start point and completely avoid placement conflicts
  const dragStartPositionRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    audioSynthRef.current = new RealisticNightAudio();
    return () => audioSynthRef.current?.stop();
  }, []);

  const handleStart = () => {
    setStarted(true);
    if (audioSynthRef.current) {
      audioSynthRef.current.start();
      setAudioEnabled(true);
    }
  };

  const toggleAudio = () => {
    if (!audioSynthRef.current) return;
    if (audioEnabled) audioSynthRef.current.stop();
    else audioSynthRef.current.start();
    setAudioEnabled(!audioEnabled);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  useEffect(() => {
    if (!started || !mountRef.current) return;

    // --- ENGINE SETUP ---
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#030611'); // Slightly darker sky for better bloom contrast
    scene.fog = new THREE.FogExp2('#030611', 0.015);

    const camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, 500);
    camera.position.set(0, 1.6, 18); 
    
    // Performance optimization: set pixel ratio limits and high performance preference
    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Caps high-DPI retina rendering bounds
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0; 
    mountRef.current.appendChild(renderer.domElement);

    // --- POST-PROCESSING UNREALBLOOMPASS GLOW ---
    const composer = new EffectComposer(renderer);
    composer.setSize(window.innerWidth, window.innerHeight);
    
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    // Elegant glowing bloom shader
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      0.85,  // glow strength
      0.40,  // radius
      0.55   // high threshold: only lantern lights glow, avoiding wall washout
    );
    composer.addPass(bloomPass);

    const textures = generateTextures();

    // --- LIGHTING ---
    const ambientLight = new THREE.AmbientLight('#26354c', 0.5); 
    scene.add(ambientLight);
    
    const moonLight = new THREE.DirectionalLight('#99bbff', 0.8); 
    moonLight.position.set(-20, 30, -10);
    moonLight.castShadow = true;
    moonLight.shadow.mapSize.width = 1024; // Optimized from 2048 to save memory
    moonLight.shadow.mapSize.height = 1024;
    moonLight.shadow.camera.near = 0.5;
    moonLight.shadow.camera.far = 100;
    moonLight.shadow.camera.left = -25;
    moonLight.shadow.camera.right = 25;
    moonLight.shadow.camera.top = 25;
    moonLight.shadow.camera.bottom = -25;
    moonLight.shadow.bias = -0.0005;
    scene.add(moonLight);

    // Street light
    const streetLight = new THREE.SpotLight('#ffa444', 1.8, 45, Math.PI/4.5, 0.5, 1);
    streetLight.position.set(-10, 8, 15);
    streetLight.target.position.set(-10, 0, 15);
    streetLight.castShadow = true;
    streetLight.shadow.mapSize.width = 512;
    streetLight.shadow.mapSize.height = 512;
    scene.add(streetLight);
    scene.add(streetLight.target);

    // --- ENVIRONMENT ---
    // Wet Road
    const roadMat = new THREE.MeshStandardMaterial({ 
      map: textures.road, 
      roughness: 0.12, 
      metalness: 0.45, 
      color: '#111'
    });
    const road = new THREE.Mesh(new THREE.PlaneGeometry(100, 20), roadMat);
    road.rotation.x = -Math.PI / 2;
    road.position.set(0, 0, 18);
    road.receiveShadow = true;
    scene.add(road);

    // House Yard / Garden
    const yardMat = new THREE.MeshStandardMaterial({ color: '#121a10', roughness: 0.95, metalness: 0.05 });
    const yard = new THREE.Mesh(new THREE.PlaneGeometry(100, 40), yardMat);
    yard.rotation.x = -Math.PI / 2;
    yard.position.set(0, 0.01, -10); 
    yard.receiveShadow = true;
    scene.add(yard);

    const houseGroup = new THREE.Group();
    const wallMat = new THREE.MeshStandardMaterial({ map: textures.wall, roughness: 0.8 });
    const concreteMat = new THREE.MeshStandardMaterial({ color: '#7a7a7a', roughness: 0.9 });
    const woodMat = new THREE.MeshStandardMaterial({ color: '#351d10', roughness: 0.85 });
    const roofMat = new THREE.MeshStandardMaterial({ map: textures.roof, roughness: 0.9 });
    
    // helper to mark children support surfaces so raycasting behaves snapped
    const flagAsSupportSurface = (mesh: THREE.Mesh) => {
      mesh.userData.isSupportSurface = true;
    };

    // Main Ground Floor Structure
    const groundFloor = new THREE.Mesh(new THREE.BoxGeometry(12, 3.5, 10), wallMat);
    groundFloor.position.set(0, 1.75, 0);
    groundFloor.receiveShadow = true; groundFloor.castShadow = true;
    flagAsSupportSurface(groundFloor);
    houseGroup.add(groundFloor);

    // Front Porch (Veranda) Base
    const porchBase = new THREE.Mesh(new THREE.BoxGeometry(12, 0.3, 4), concreteMat);
    porchBase.position.set(0, 0.15, 7);
    porchBase.receiveShadow = true; porchBase.castShadow = true;
    flagAsSupportSurface(porchBase);
    houseGroup.add(porchBase);

    // Porch Pillars
    [-5.5, -2, 2, 5.5].forEach(x => {
      const pillar = new THREE.Mesh(new THREE.BoxGeometry(0.4, 3.5, 0.4), wallMat);
      pillar.position.set(x, 1.75, 8.8);
      pillar.receiveShadow = true; pillar.castShadow = true;
      flagAsSupportSurface(pillar);
      houseGroup.add(pillar);
    });

    // First Floor Structure
    const firstFloor = new THREE.Mesh(new THREE.BoxGeometry(12, 3.2, 10), wallMat);
    firstFloor.position.set(0, 5.1, 0);
    firstFloor.receiveShadow = true; firstFloor.castShadow = true;
    flagAsSupportSurface(firstFloor);
    houseGroup.add(firstFloor);

    // Balcony Floor
    const balconyFloor = new THREE.Mesh(new THREE.BoxGeometry(12, 0.2, 4), concreteMat);
    balconyFloor.position.set(0, 3.6, 7);
    balconyFloor.receiveShadow = true; balconyFloor.castShadow = true;
    flagAsSupportSurface(balconyFloor);
    houseGroup.add(balconyFloor);

    // Balcony Railing
    const railingBase = new THREE.Mesh(new THREE.BoxGeometry(12, 1, 0.2), concreteMat);
    railingBase.position.set(0, 4.1, 8.9);
    railingBase.receiveShadow = true; railingBase.castShadow = true;
    flagAsSupportSurface(railingBase);
    houseGroup.add(railingBase);

    // Main Sloping Roof
    const roof = new THREE.Mesh(new THREE.ConeGeometry(10, 4, 4), roofMat);
    roof.position.set(0, 8.7, 0);
    roof.rotation.y = Math.PI / 4;
    roof.receiveShadow = true; roof.castShadow = true;
    flagAsSupportSurface(roof);
    houseGroup.add(roof);

    // Front Door
    const door = new THREE.Mesh(new THREE.BoxGeometry(1.8, 2.4, 0.1), woodMat);
    door.position.set(0, 1.5, 5.05);
    flagAsSupportSurface(door);
    houseGroup.add(door);

    // Windows with iron grills
    const createFrame = (x: number, y: number, z: number) => {
      const g = new THREE.Group();
      g.position.set(x, y, z);
      const glass = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1.5, 0.05), new THREE.MeshStandardMaterial({color: '#111', roughness: 0.1, metalness: 0.8}));
      flagAsSupportSurface(glass);
      g.add(glass);
      const grillMat = new THREE.MeshStandardMaterial({color: '#222', metalness: 0.8});
      for(let i=-0.5; i<=0.5; i+=0.25) {
        const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 1.5), grillMat);
        bar.position.set(i, 0, 0.05);
        g.add(bar);
      }
      return g;
    };
    houseGroup.add(createFrame(-3, 1.8, 5.05));
    houseGroup.add(createFrame(3, 1.8, 5.05));
    houseGroup.add(createFrame(-3, 5.2, 5.05));
    houseGroup.add(createFrame(3, 5.2, 5.05));

    // Porch Light
    const porchLight = new THREE.PointLight('#ffddaa', 1.5, 10, 1);
    porchLight.position.set(0, 3.2, 7);
    porchLight.castShadow = false; // Performance: disable shadows on decoration light bulbs
    houseGroup.add(porchLight);
    const porchBulb = new THREE.Mesh(new THREE.SphereGeometry(0.1), new THREE.MeshBasicMaterial({color: '#ffddaa', toneMapped: false}));
    porchBulb.position.copy(porchLight.position);
    houseGroup.add(porchBulb);

    houseGroup.position.set(0, 0, -5);
    scene.add(houseGroup);

    // Boundary walls and gate
    const boundaryGroup = new THREE.Group();
    const bWallMat = new THREE.MeshStandardMaterial({ color: '#b8b0a5', roughness: 0.9 });
    
    // Left & Right walls
    const lWall = new THREE.Mesh(new THREE.BoxGeometry(0.4, 1.8, 20), bWallMat);
    lWall.position.set(-15, 0.9, 0); lWall.receiveShadow = true; lWall.castShadow = true;
    flagAsSupportSurface(lWall);
    boundaryGroup.add(lWall);
    
    const rWall = new THREE.Mesh(new THREE.BoxGeometry(0.4, 1.8, 20), bWallMat);
    rWall.position.set(15, 0.9, 0); rWall.receiveShadow = true; rWall.castShadow = true;
    flagAsSupportSurface(rWall);
    boundaryGroup.add(rWall);

    // Front Wall
    const fWall1 = new THREE.Mesh(new THREE.BoxGeometry(11, 1.8, 0.4), bWallMat);
    fWall1.position.set(-9.5, 0.9, 10); fWall1.receiveShadow = true; fWall1.castShadow = true;
    flagAsSupportSurface(fWall1);
    boundaryGroup.add(fWall1);
    
    const fWall2 = new THREE.Mesh(new THREE.BoxGeometry(11, 1.8, 0.4), bWallMat);
    fWall2.position.set(9.5, 0.9, 10); fWall2.receiveShadow = true; fWall2.castShadow = true;
    flagAsSupportSurface(fWall2);
    boundaryGroup.add(fWall2);

    // Iron Gate
    const gateGroup = new THREE.Group();
    const ironMat = new THREE.MeshStandardMaterial({color: '#333', metalness: 0.7, roughness: 0.4});
    const gateFrameBottom = new THREE.Mesh(new THREE.BoxGeometry(8, 0.1, 0.1), ironMat);
    gateFrameBottom.position.set(0, 0.1, 10);
    gateGroup.add(gateFrameBottom);
    const gateFrameTop = new THREE.Mesh(new THREE.BoxGeometry(8, 0.1, 0.1), ironMat);
    gateFrameTop.position.set(0, 1.7, 10);
    gateGroup.add(gateFrameTop);
    for(let i=-3.8; i<=3.8; i+=0.3) {
      const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1.6), ironMat);
      bar.position.set(i, 0.9, 10);
      gateGroup.add(bar);
    }
    boundaryGroup.add(gateGroup);
    scene.add(boundaryGroup);

    // Coconut Trees silhouettes (flagged support trunk surfaces)
    const createCoconutTree = (x: number, z: number) => {
      const g = new THREE.Group();
      const points = [];
      for(let i=0; i<=10; i++) points.push(new THREE.Vector2(Math.sin(i*0.2)*0.35 + 0.25, i));
      const trunkGeo = new THREE.LatheGeometry(points, 8);
      const trunk = new THREE.Mesh(trunkGeo, new THREE.MeshStandardMaterial({color: '#4e3f34', roughness: 1}));
      trunk.castShadow = true;
      flagAsSupportSurface(trunk);
      g.add(trunk);
      
      const frondMat = new THREE.MeshStandardMaterial({color: '#152d14', side: THREE.DoubleSide, roughness: 0.85});
      for(let i=0; i<8; i++) {
        const frond = new THREE.Mesh(new THREE.PlaneGeometry(0.7, 3.5), frondMat);
        frond.position.set(0, 9.5, 0);
        frond.rotation.x = -Math.PI/3;
        frond.rotation.y = (i * Math.PI) / 4;
        frond.translateY(1.8);
        frond.castShadow = true;
        g.add(frond);
      }
      g.position.set(x, 0, z);
      g.scale.set(1.4, 1.4, 1.4);
      scene.add(g);
    };
    createCoconutTree(-12, -2);
    createCoconutTree(12, 5);
    createCoconutTree(-8, -12);

    // Dynamic keyboard movement state
    const keys = { w: false, a: false, s: false, d: false };
    const velocity = new THREE.Vector3();
    const direction = new THREE.Vector3();
    
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let euler = new THREE.Euler(0, 0, 0, 'YXZ');

    const onKeyDown = (e: KeyboardEvent) => {
      if(e.code === 'KeyW' || e.code === 'ArrowUp') keys.w = true;
      if(e.code === 'KeyS' || e.code === 'ArrowDown') keys.s = true;
      if(e.code === 'KeyA' || e.code === 'ArrowLeft') keys.a = true;
      if(e.code === 'KeyD' || e.code === 'ArrowRight') keys.d = true;
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if(e.code === 'KeyW' || e.code === 'ArrowUp') keys.w = false;
      if(e.code === 'KeyS' || e.code === 'ArrowDown') keys.s = false;
      if(e.code === 'KeyA' || e.code === 'ArrowLeft') keys.a = false;
      if(e.code === 'KeyD' || e.code === 'ArrowRight') keys.d = false;
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);

    const canvas = renderer.domElement;
    
    const onPointerDown = (e: PointerEvent) => {
      if (e.target !== canvas) return;
      isDragging = true;
      // Record start clientX/Y to strictly lock look-around drag conflicts
      dragStartPositionRef.current = { x: e.clientX, y: e.clientY };
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onPointerUp = () => { isDragging = false; };
    const onPointerLeave = () => { isDragging = false; };

    // --- DECORATION SYSTEM REGISTRY ---
    const decos = new Map();
    let currentGhost: THREE.Group | null = null;
    let activeToolRef: string | null = null;

    // Shared geometries to optimize buffer memory
    const sharedSphGeo = new THREE.SphereGeometry(0.08, 8, 8);
    const sharedCylGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.05, 8);
    const sharedFlameGeo = new THREE.ConeGeometry(0.02, 0.08, 8);
    const sharedPahanBaseGeo = new THREE.CylinderGeometry(0.08, 0.04, 0.08, 8);
    
    // Expose engine methods to React
    engineRef.current = {
      setTool: (tool: string | null) => { 
        activeToolRef = tool; 
        if(!tool && currentGhost) { scene.remove(currentGhost); currentGhost = null; }
      },
      updateSelected: (id: string, props: any) => {
        const obj = decos.get(id);
        if (obj) {
          if (props.color) {
            obj.userData.color = props.color;
            obj.traverse((c: any) => {
              if (c.isLight) c.color.set(props.color);
              if (c.userData?.isGlow) c.material.color.set(props.color);
            });
          }
          if (props.size) obj.scale.setScalar(props.size);
          if (props.on !== undefined) {
            obj.traverse((c: any) => { 
              if (c.isLight) c.intensity = props.on ? c.userData.baseIntensity : 0; 
            });
          }
        }
      },
      deleteSelected: (id: string) => {
        const obj = decos.get(id);
        if (obj) { scene.remove(obj); decos.delete(id); setSelectedItem(null); }
      }
    };

    const createDecoMesh = (type: string, color: string) => {
      const group = new THREE.Group();
      group.userData = { type, color, id: THREE.MathUtils.generateUUID() };
      
      const glowMat = new THREE.MeshBasicMaterial({ color: color, transparent: true, opacity: 0.85, toneMapped: false });
      
      if (type === 'atapattam') {
        const core = new THREE.Mesh(new THREE.OctahedronGeometry(0.24), glowMat); // Scaled smaller for realism
        core.userData.isGlow = true;
        const frame = new THREE.Mesh(new THREE.OctahedronGeometry(0.25), new THREE.MeshBasicMaterial({color: '#222', wireframe: true}));
        const string = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.4, 8), new THREE.MeshBasicMaterial({color: '#111'}));
        string.position.y = 0.35;
        group.add(core, frame, string);
        
        // Performance: soft range, soft intensity, shadows disabled on placed lights
        const light = new THREE.PointLight(color, 1.2, 5, 1.8);
        light.userData.baseIntensity = 1.2;
        light.castShadow = false;
        group.add(light);
        
      } else if (type === 'pahan') { // Clay oil lamp
        const base = new THREE.Mesh(sharedPahanBaseGeo, new THREE.MeshStandardMaterial({color: '#8b4513', roughness: 1}));
        const flame = new THREE.Mesh(sharedFlameGeo, new THREE.MeshBasicMaterial({color: '#ffaa00', toneMapped: false}));
        flame.position.y = 0.08;
        group.add(base, flame);
        
        const light = new THREE.PointLight('#ffaa00', 0.9, 3.5, 2.0);
        light.position.y = 0.1;
        light.userData.baseIntensity = 0.9;
        light.castShadow = false;
        group.add(light);
        group.userData.isFlicker = true;

      } else if (type === 'string_bulb') {
        const bulb = new THREE.Mesh(sharedSphGeo, glowMat);
        bulb.userData.isGlow = true;
        const base = new THREE.Mesh(sharedCylGeo, new THREE.MeshStandardMaterial({color: '#111'}));
        base.position.y = 0.08;
        group.add(bulb, base);
        
        const light = new THREE.PointLight(color, 0.8, 3.8, 2.0);
        light.userData.baseIntensity = 0.8;
        light.castShadow = false;
        group.add(light);
      
      } else if (type === 'tube_light') {
        const tube = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 1.0, 8), glowMat);
        tube.userData.isGlow = true;
        tube.rotation.z = Math.PI/2;
        group.add(tube);
        
        const light = new THREE.PointLight(color, 1.0, 4.5, 1.8);
        light.userData.baseIntensity = 1.0;
        light.castShadow = false;
        group.add(light);
      
      } else if (type === 'flag') {
        const cloth = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 0.65), new THREE.MeshStandardMaterial({color: '#ffffff', roughness: 0.9, side: THREE.DoubleSide}));
        cloth.position.x = 0.25;
        const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.9, 8), new THREE.MeshStandardMaterial({color: '#444'}));
        group.add(cloth, pole);
        group.userData.isFlag = true; 
      }

      // Mark all meshes so raycaster knows they are decorations
      group.traverse((child: any) => { 
        if(child.isMesh) child.userData.isDecoration = true; 
        child.userData.parentId = group.userData.id; 
      });
      return group;
    };

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onPointerMove = (e: PointerEvent) => {
      if (e.target !== canvas) return;
      
      // Handle Camera Look-around
      if (isDragging) {
        const deltaX = e.clientX - previousMousePosition.x;
        const deltaY = e.clientY - previousMousePosition.y;
        
        euler.setFromQuaternion(camera.quaternion);
        euler.y -= deltaX * 0.0045;
        euler.x -= deltaY * 0.0045;
        euler.x = Math.max(-Math.PI/2 + 0.15, Math.min(Math.PI/2 - 0.15, euler.x)); // Clamp look
        camera.quaternion.setFromEuler(euler);
        
        previousMousePosition = { x: e.clientX, y: e.clientY };
      }

      // Snappy and Stable Ghost Placement Preview
      if (activeToolRef) {
        const rect = canvas.getBoundingClientRect();
        mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
        
        raycaster.setFromCamera(mouse, camera);
        
        // Raycaster Cleanup: only intersect with flagged support surfaces (structures/trees)
        // This makes aiming incredibly snappy and accurate, avoiding sky or ground misalignments
        const intersects = raycaster.intersectObjects(scene.children, true)
          .filter(hit => hit.object.userData.isSupportSurface && !hit.object.userData.isGhost);

        if (intersects.length > 0) {
          const hit = intersects[0];
          
          if (!currentGhost || currentGhost.userData.type !== activeToolRef) {
            if (currentGhost) scene.remove(currentGhost);
            currentGhost = createDecoMesh(activeToolRef, '#ffffff');
            currentGhost.userData.isGhost = true;
            currentGhost.traverse((c: any) => { 
              if(c.isMesh) {
                c.material = new THREE.MeshBasicMaterial({color: '#00ff77', wireframe: true, transparent: true, opacity: 0.5});
                c.userData.isGhost = true;
              }
              if(c.isLight) c.intensity = 0; 
            });
            scene.add(currentGhost);
          }

          currentGhost.position.copy(hit.point);
          
          // Realistic Snap & Orientation logic based on Face Normals
          if (hit.face) {
            const normal = hit.face.normal.clone().transformDirection(hit.object.matrixWorld);
            
            if (activeToolRef === 'atapattam') {
              // snugs under ceiling or mounts beautifully flush projecting outward
              if (normal.y < -0.5) currentGhost.position.add(new THREE.Vector3(0, -0.15, 0));
              else currentGhost.position.add(normal.multiplyScalar(0.18));
              currentGhost.rotation.set(0, 0, 0);
            } 
            else if (activeToolRef === 'tube_light' || activeToolRef === 'string_bulb') {
              // Flush against surface aligned flatly
              currentGhost.position.add(normal.multiplyScalar(0.04));
              const target = hit.point.clone().add(normal);
              currentGhost.lookAt(target);
            }
            else if (activeToolRef === 'pahan') {
              // Snaps flatly to floor or railing surfaces
              if (normal.y > 0.7) {
                currentGhost.position.y = hit.point.y + 0.01;
              } else {
                currentGhost.position.add(normal.multiplyScalar(0.05));
              }
              currentGhost.rotation.set(0, 0, 0);
            }
            else {
              currentGhost.position.add(normal.multiplyScalar(0.08));
            }
          }
        } else {
          if (currentGhost) { scene.remove(currentGhost); currentGhost = null; }
        }
      }
    };

    const onClick = (e: MouseEvent) => {
      // Bulletproof drag-click separation: Calculate absolute diagonal pixel travel
      const dragDist = Math.hypot(
        e.clientX - dragStartPositionRef.current.x,
        e.clientY - dragStartPositionRef.current.y
      );
      if (dragDist > 8) return; // Strict Look-around lock: ignore placement clicks if drag exceeds 8px!

      if (activeToolRef && currentGhost) {
        // Place static item
        const newItem = createDecoMesh(activeToolRef, '#ffaa00'); 
        newItem.position.copy(currentGhost.position);
        newItem.rotation.copy(currentGhost.rotation);
        
        // Performance optimization: disable updates for stationary meshes
        newItem.matrixAutoUpdate = false;
        newItem.updateMatrix();
        
        scene.add(newItem);
        decos.set(newItem.userData.id, newItem);
        
        setSelectedItem(newItem.userData.id);
        setItemProperties({ color: '#ffaa00', size: 1, on: true });
        
        if (currentGhost) { scene.remove(currentGhost); currentGhost = null; }
        setActiveTool(null); 
        activeToolRef = null;

      } else if (!activeToolRef) {
        // Snappy selection logic
        const rect = canvas.getBoundingClientRect();
        mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);
        
        const intersects = raycaster.intersectObjects(scene.children, true)
          .filter(hit => hit.object.userData.isDecoration);
        
        if (intersects.length > 0) {
          const parentId = intersects[0].object.userData.parentId;
          setSelectedItem(parentId);
          const obj = decos.get(parentId);
          if (obj) {
            setItemProperties({ 
              color: obj.userData.color, 
              size: obj.scale.x, 
              on: obj.children.find((c: any) => c.isLight)?.intensity > 0 
            });
          }
        } else {
          setSelectedItem(null);
        }
      }
    };

    canvas.addEventListener('pointerdown', onPointerDown);
    canvas.addEventListener('pointermove', onPointerMove);
    canvas.addEventListener('pointerup', onPointerUp);
    canvas.addEventListener('pointerleave', onPointerLeave);
    canvas.addEventListener('click', onClick);

    const onWindowResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      composer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onWindowResize);

    const clock = new THREE.Clock();
    let animationId: number;

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // FPS walking limits
      velocity.x -= velocity.x * 10.0 * delta;
      velocity.z -= velocity.z * 10.0 * delta;
      
      direction.z = Number(keys.w) - Number(keys.s);
      direction.x = Number(keys.d) - Number(keys.a);
      direction.normalize();

      const speed = 25.0; 
      if (keys.w || keys.s) velocity.z -= direction.z * speed * delta;
      if (keys.a || keys.d) velocity.x -= direction.x * speed * delta;

      camera.translateX(velocity.x * delta);
      camera.translateZ(velocity.z * delta);

      // Lock eye level and constrain boundaries safely
      camera.position.y = 1.6; 
      camera.position.x = Math.max(-25, Math.min(25, camera.position.x));
      camera.position.z = Math.max(-15, Math.min(30, camera.position.z));

      // Dynamic animations
      decos.forEach(deco => {
        // Wind flags
        if (deco.userData.isFlag) {
          deco.children[0].rotation.y = Math.sin(time * 3 + deco.position.x) * 0.2;
        }
        // Flicker pahan lamps
        if (deco.userData.isFlicker) {
          const light = deco.children.find((c: any) => c.isLight);
          if(light && light.intensity > 0) {
            light.intensity = light.userData.baseIntensity + (Math.random() * 0.15 - 0.075);
          }
        }
      });

      // Render scene through composer to enable UnrealBloomPass glowing effects!
      composer.render();
    };
    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      canvas.removeEventListener('pointerdown', onPointerDown);
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerup', onPointerUp);
      canvas.removeEventListener('pointerleave', onPointerLeave);
      canvas.removeEventListener('click', onClick);
      window.removeEventListener('resize', onWindowResize);
      mountRef.current?.removeChild(renderer.domElement);
      renderer.dispose();
      composer.dispose();
    };
  }, [started]);

  const handlePropChange = (key: string, value: any) => {
    const newProps = { ...itemProperties, [key]: value };
    setItemProperties(newProps);
    if (selectedItem && engineRef.current) {
      engineRef.current.updateSelected(selectedItem, newProps);
    }
  };

  const handleDelete = () => {
    if (selectedItem && engineRef.current) {
      engineRef.current.deleteSelected(selectedItem);
    }
  };

  const setTool = (t: string | null) => {
    setActiveTool(t);
    setSelectedItem(null); 
    if(engineRef.current) engineRef.current.setTool(t);
  };

  const tools = [
    { id: 'atapattam', name: 'Atapattam', icon: <AtapattamIcon size={22} /> },
    { id: 'string_bulb', name: 'Bulb', icon: <Lightbulb size={22} /> },
    { id: 'pahan', name: 'Pahan Lamp', icon: <PahanIcon size={22} /> },
    { id: 'tube_light', name: 'Tube Light', icon: <TubeLightIcon size={22} /> },
    { id: 'flag', name: 'Flag', icon: <Flag size={22} /> },
  ];

  const colors = ['#ffffff', '#ffaa00', '#ff3333', '#33aaff', '#ff66b2', '#55ff55'];

  return (
    <div className="w-full h-screen bg-black overflow-hidden relative font-sans select-none">
      
      {/* Intro Screen */}
      {!started && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#05070a] text-white">
          <div className="max-w-2xl text-center space-y-6 p-8">
            <h1 className="text-4xl md:text-5xl font-light tracking-wide text-[#ffcc77] mb-2 font-outfit">
              A Sri Lankan Vesak Night
            </h1>
            <p className="text-gray-400 font-light leading-relaxed text-lg">
              Step into a peaceful neighborhood in Sri Lanka during the Vesak festival. 
              Explore freely and decorate a traditional home with realistic lights, lanterns, and lamps.
            </p>
            
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-sm text-gray-300 grid grid-cols-1 md:grid-cols-2 gap-4 text-left my-8">
              <div className="flex items-start space-x-3">
                <Move className="text-[#ffcc77] shrink-0" />
                <div><strong className="text-white block mb-1">Movement</strong> Drag the screen to look around. Use W, A, S, D (or Arrows) to walk.</div>
              </div>
              <div className="flex items-start space-x-3">
                <Lightbulb className="text-[#ffcc77] shrink-0" />
                <div><strong className="text-white block mb-1">Decorating</strong> Select an item from the menu, then click anywhere on the house or trees to place it.</div>
              </div>
            </div>

            <button 
              onClick={handleStart}
              className="px-8 py-4 bg-[#ffcc77] text-black font-semibold rounded-lg hover:bg-white transition-all flex items-center justify-center mx-auto space-x-2"
            >
              <Play fill="currentColor" size={20} />
              <span>Enter Neighborhood</span>
            </button>
            <div className="text-xs text-gray-500 pt-4 flex items-center justify-center space-x-2">
              <Volume2 size={14} />
              <span>Sound is generated procedurally. Headphones recommended.</span>
            </div>
          </div>
        </div>
      )}

      {/* 3D Canvas Container */}
      <div ref={mountRef} className="absolute inset-0 z-0 touch-none" />

      {/* Main UI Overlay */}
      {started && (
        <>
          {/* Header */}
          <div className="absolute top-0 w-full p-4 flex justify-between items-start z-10 pointer-events-none">
            <div>
              <div className="text-white font-medium text-xl tracking-wider drop-shadow-md flex items-center space-x-2 font-outfit">
                <Moon size={20} className="text-[#ffcc77]" />
                <span>Vesak Zone</span>
              </div>
              <div className="text-xs text-white/70 mt-1 flex items-center space-x-1">
                <MapPin size={12} />
                <span>Pannipitiya, Sri Lanka</span>
              </div>
            </div>
            
            <div className="flex space-x-3 pointer-events-auto">
              <button onClick={toggleAudio} className="p-2.5 bg-black/40 backdrop-blur-md border border-white/10 rounded-lg text-white hover:bg-white/20 transition-all">
                {audioEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
              </button>
              <button onClick={() => showToast("Screenshot captured! (Simulation)")} className="p-2.5 bg-black/40 backdrop-blur-md border border-white/10 rounded-lg text-white hover:bg-white/20 transition-all">
                <Camera size={20} />
              </button>
            </div>
          </div>

          {/* Toast Notification */}
          {toastMessage && (
            <div className="absolute top-20 left-1/2 -translate-x-1/2 bg-[#ffcc77] text-black px-4 py-2 rounded shadow-lg font-medium text-sm z-50 animate-fade-in">
              {toastMessage}
            </div>
          )}

          {/* Left Toolbar - Decoration Selection */}
          <div className="absolute left-4 top-1/2 -translate-y-1/2 flex flex-col space-y-2 z-10 pointer-events-auto">
            <div className="bg-black/60 backdrop-blur-md border border-white/10 rounded-xl p-1.5 flex flex-col space-y-1">
              {tools.map((tool) => (
                <button
                  key={tool.id}
                  onClick={() => setTool(activeTool === tool.id ? null : tool.id)}
                  className={`p-3 rounded-lg transition-all flex flex-col items-center space-y-1 group relative ${
                    activeTool === tool.id ? 'bg-[#ffcc77] text-black' : 'text-white hover:bg-white/10'
                  }`}
                >
                  {tool.icon}
                  {/* Tooltip */}
                  <span className="absolute left-full ml-3 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap">
                    {tool.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Instructions Overlay */}
          {activeTool && !selectedItem && (
            <div className="absolute bottom-24 left-1/2 -translate-x-1/2 bg-black/70 backdrop-blur-md border border-white/20 text-white px-6 py-3 rounded-full flex items-center space-x-3 pointer-events-none">
              <Info size={18} className="text-[#ffcc77]" />
              <span className="text-sm">Click anywhere on walls, roof, or trees to place the {tools.find(t=>t.id===activeTool)?.name}.</span>
            </div>
          )}

          {/* Properties Panel (Shows when an item is selected) */}
          {selectedItem && (
            <div className="absolute right-6 top-1/2 -translate-y-1/2 w-64 bg-black/80 backdrop-blur-xl border border-white/10 rounded-xl p-5 z-10 pointer-events-auto text-white shadow-2xl">
              <div className="flex justify-between items-center mb-4 pb-3 border-b border-white/10">
                <div className="flex items-center space-x-2">
                  <Settings size={18} className="text-gray-400" />
                  <h3 className="font-medium">Modify Item</h3>
                </div>
                <button onClick={() => setSelectedItem(null)} className="text-gray-400 hover:text-white">
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-5">
                {/* Color */}
                <div>
                  <label className="text-xs text-gray-400 uppercase tracking-wider block mb-2">Light Color</label>
                  <div className="flex flex-wrap gap-2">
                    {colors.map((c) => (
                      <button
                        key={c}
                        onClick={() => handlePropChange('color', c)}
                        className={`w-8 h-8 rounded border-2 transition-transform ${
                          itemProperties.color === c ? 'border-white scale-110' : 'border-transparent hover:border-gray-500'
                        }`}
                        style={{ backgroundColor: c, boxShadow: itemProperties.color === c ? `0 0 10px ${c}88` : 'none' }}
                      />
                    ))}
                  </div>
                </div>

                {/* Size */}
                <div>
                  <label className="text-xs text-gray-400 uppercase tracking-wider flex justify-between mb-2">
                    <span>Size</span>
                    <span>{Math.round(itemProperties.size * 100)}%</span>
                  </label>
                  <input 
                    type="range" 
                    min="0.5" max="2" step="0.1" 
                    value={itemProperties.size}
                    onChange={(e) => handlePropChange('size', parseFloat(e.target.value))}
                    className="w-full accent-[#ffcc77] cursor-pointer"
                  />
                </div>

                {/* Power Toggle */}
                <div className="flex items-center justify-between bg-white/5 p-3 rounded-lg border border-white/5">
                  <span className="text-sm">Power</span>
                  <button 
                    onClick={() => handlePropChange('on', !itemProperties.on)}
                    className={`w-12 h-6 rounded-full p-1 transition-colors relative cursor-pointer ${itemProperties.on ? 'bg-[#ffcc77]' : 'bg-gray-600'}`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white transition-transform ${itemProperties.on ? 'translate-x-6' : 'translate-x-0'}`} />
                  </button>
                </div>

                {/* Delete */}
                <button 
                  onClick={handleDelete}
                  className="w-full py-3 mt-2 bg-red-500/20 text-red-400 hover:bg-red-500/40 hover:text-red-300 rounded-lg flex items-center justify-center space-x-2 transition-colors border border-red-500/20 cursor-pointer"
                >
                  <Trash2 size={16} />
                  <span className="font-medium text-sm">Remove Item</span>
                </button>
              </div>
            </div>
          )}
          
          {/* Controls Hint */}
          <div className="absolute bottom-6 left-6 text-xs text-gray-400 pointer-events-none flex flex-col space-y-1">
            <span>W A S D - Walk</span>
            <span>Drag - Look Around</span>
          </div>
        </>
      )}
    </div>
  );
}
