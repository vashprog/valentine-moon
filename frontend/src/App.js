import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Button } from './components/ui/button';
import { Card, CardContent } from './components/ui/card';
import { Volume2, VolumeX, Play, RotateCcw } from 'lucide-react';
import './App.css';

function MoonScene({ message, cinematicMode, onCinematicComplete }) {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const animationIdRef = useRef(null);
  
  useEffect(() => {
    if (!mountRef.current) return;
    

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x0a0a1a, 30, 150); 
    sceneRef.current = scene;
    
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x0a0a1a); 
    renderer.shadowMap.enabled = true;
    mountRef.current.appendChild(renderer.domElement);
    
    
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    const sunLight = new THREE.DirectionalLight(0xffffff, 2.5);
    sunLight.position.set(10, 10, 5);
    sunLight.castShadow = true;
    scene.add(sunLight);
    
    const blueLight = new THREE.PointLight(0x4a9eff, 1.5, 100);
    blueLight.position.set(-10, 5, -5);
    scene.add(blueLight);
    
    const goldLight = new THREE.PointLight(0xffd700, 1.0, 100);
    goldLight.position.set(10, 3, 10);
    scene.add(goldLight);
    
    
    const fillLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1.0);
    scene.add(fillLight);
    
   
    const starGeometry = new THREE.BufferGeometry();
    const starCount = 5000;
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);
    
    for (let i = 0; i < starCount; i++) {
      const radius = 50 + Math.random() * 50;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      starPositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      starPositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      starPositions[i * 3 + 2] = radius * Math.cos(phi);
      
      const colorChoice = Math.random();
      if (colorChoice < 0.7) {
        starColors[i * 3] = 1;
        starColors[i * 3 + 1] = 1;
        starColors[i * 3 + 2] = 1;
      } else if (colorChoice < 0.85) {
        starColors[i * 3] = 0.8;
        starColors[i * 3 + 1] = 0.9;
        starColors[i * 3 + 2] = 1;
      } else {
        starColors[i * 3] = 1;
        starColors[i * 3 + 1] = 1;
        starColors[i * 3 + 2] = 0.8;
      }
    }
    
    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starGeometry.setAttribute('color', new THREE.BufferAttribute(starColors, 3));
    
    const starMaterial = new THREE.PointsMaterial({
      size: 0.1,
      vertexColors: true,
      transparent: true,
      opacity: 0.8
    });
    
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);
    
    // Earth
    const earthGeometry = new THREE.SphereGeometry(3, 64, 64);
    const earthMaterial = new THREE.MeshStandardMaterial({
      color: 0x4a9eff,
      emissive: 0x2a5f9f,
      emissiveIntensity: 0.3,
      roughness: 0.6,
      metalness: 0.2
    });
    const earth = new THREE.Mesh(earthGeometry, earthMaterial);
    earth.position.set(-15, 8, -30);
    scene.add(earth);
    
    
    const moonGeometry = new THREE.SphereGeometry(20, 256, 256);
    
  
    const moonCanvas = document.createElement('canvas');
    moonCanvas.width = 2048;
    moonCanvas.height = 2048;
    const moonCtx = moonCanvas.getContext('2d');
   
    const baseColor = moonCtx.createLinearGradient(0, 0, 2048, 2048);
    baseColor.addColorStop(0, '#7a7a7a');
    baseColor.addColorStop(0.5, '#9a9a9a');
    baseColor.addColorStop(1, '#7a7a7a');
    moonCtx.fillStyle = baseColor;
    moonCtx.fillRect(0, 0, 2048, 2048);
    
    
    for (let i = 0; i < 500; i++) {
      const x = Math.random() * 2048;
      const y = Math.random() * 2048;
      const radius = Math.random() * 100 + 20;
      const darkness = Math.random() * 0.4 + 0.2;
      
      const gradient = moonCtx.createRadialGradient(x, y, radius * 0.3, x, y, radius);
      gradient.addColorStop(0, `rgba(40, 40, 40, ${darkness})`);
      gradient.addColorStop(0.6, `rgba(60, 60, 60, ${darkness * 0.5})`);
      gradient.addColorStop(1, 'rgba(60, 60, 60, 0)');
      
      moonCtx.fillStyle = gradient;
      moonCtx.beginPath();
      moonCtx.arc(x, y, radius, 0, Math.PI * 2);
      moonCtx.fill();
      
     
      moonCtx.strokeStyle = `rgba(120, 120, 120, ${darkness * 0.3})`;
      moonCtx.lineWidth = 2;
      moonCtx.beginPath();
      moonCtx.arc(x, y, radius * 0.95, 0, Math.PI * 2);
      moonCtx.stroke();
    }
    
  
    const imageData = moonCtx.getImageData(0, 0, 2048, 2048);
    for (let i = 0; i < imageData.data.length; i += 4) {
      const noise = (Math.random() - 0.5) * 40;
      imageData.data[i] += noise;
      imageData.data[i + 1] += noise;
      imageData.data[i + 2] += noise;
    }
    moonCtx.putImageData(imageData, 0, 0);
    
    const moonTexture = new THREE.CanvasTexture(moonCanvas);
    

    const displacementCanvas = document.createElement('canvas');
    displacementCanvas.width = 1024;
    displacementCanvas.height = 1024;
    const dispCtx = displacementCanvas.getContext('2d');
    dispCtx.fillStyle = '#808080';
    dispCtx.fillRect(0, 0, 1024, 1024);
    
    for (let i = 0; i < 300; i++) {
      const x = Math.random() * 1024;
      const y = Math.random() * 1024;
      const radius = Math.random() * 50 + 10;
      const depth = Math.random() * 100 + 50;
      
      const gradient = dispCtx.createRadialGradient(x, y, 0, x, y, radius);
      gradient.addColorStop(0, `rgba(${128 - depth}, ${128 - depth}, ${128 - depth}, 1)`);
      gradient.addColorStop(1, 'rgba(128, 128, 128, 1)');
      
      dispCtx.fillStyle = gradient;
      dispCtx.beginPath();
      dispCtx.arc(x, y, radius, 0, Math.PI * 2);
      dispCtx.fill();
    }
    
    const displacementTexture = new THREE.CanvasTexture(displacementCanvas);
    
    const moonMaterial = new THREE.MeshStandardMaterial({
      map: moonTexture,
      displacementMap: displacementTexture,
      displacementScale: 2,
      roughness: 0.95,
      metalness: 0.05
    });
    const moon = new THREE.Mesh(moonGeometry, moonMaterial);
    moon.position.set(0, 0, 0);
    moon.receiveShadow = true;
    scene.add(moon);
    
    
    const groundGeometry = new THREE.CircleGeometry(15, 64);
    const groundMaterial = new THREE.MeshStandardMaterial({
      color: 0x7a7a7a,
      roughness: 0.95,
      metalness: 0.05
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.set(0, 40, 0); 
    ground.receiveShadow = true;
    scene.add(ground);
    
   
    const messageGroup = new THREE.Group();
    messageGroup.visible = false;
    messageGroup.position.set(0, 24, 0);
    
    // Create canvas with cursive text and STRONG glow
    const textCanvas = document.createElement('canvas');
    textCanvas.width = 2048;
    textCanvas.height = 1024;
    const ctx = textCanvas.getContext('2d');
    
    
    ctx.fillStyle = 'rgba(0, 0, 0, 0)';
    ctx.fillRect(0, 0, 2048, 1024);
    
    
    ctx.font = 'italic bold 200px "Brush Script MT", "Lucida Handwriting", cursive';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    
    for (let i = 0; i < 5; i++) {
      ctx.shadowColor = '#ff0080';
      ctx.shadowBlur = 80 - i * 10;
      ctx.fillStyle = '#ff3399';
      ctx.fillText('Will You Be My', 1024, 300);
      ctx.fillText('Valentine?', 1024, 550);
    }
    
    
    ctx.shadowBlur = 20;
    ctx.shadowColor = '#ffffff';
    ctx.fillStyle = '#ffeeee';
    ctx.fillText('Will You Be My', 1024, 300);
    ctx.fillText('Valentine?', 1024, 550);
    
   
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#ffffff';
    ctx.fillText('Will You Be My', 1024, 300);
    ctx.fillText('Valentine?', 1024, 550);
    
    const textTexture = new THREE.CanvasTexture(textCanvas);
    textTexture.needsUpdate = true;
    
    
    const textMaterial = new THREE.MeshBasicMaterial({
      map: textTexture,
      transparent: true,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      opacity: 1.5 
    });
    
    const textMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(22, 11),
      textMaterial
    );
    textMesh.position.set(0, 0, 0);
    messageGroup.add(textMesh);
    
    
    const messageLight = new THREE.PointLight(0xffffff, 3, 15);
    messageLight.position.set(0, 0, 5);
    messageGroup.add(messageLight);
    
    
    const glowGeometry = new THREE.PlaneGeometry(24, 13);
    const glowMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        color: { value: new THREE.Color(0xff0080) }
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform vec3 color;
        varying vec2 vUv;
        
        void main() {
          vec2 center = vUv - vec2(0.5);
          float dist = length(center);
          
          float pulse = 0.7 + sin(time * 2.0) * 0.3;
          float glow = exp(-dist * 2.0) * pulse;
          
          gl_FragColor = vec4(color, glow * 0.6);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide
    });
    
    const glowMesh = new THREE.Mesh(glowGeometry, glowMaterial);
    glowMesh.position.z = -0.1;
    messageGroup.add(glowMesh);
    
    scene.add(messageGroup);
    
    
    const fireworksGroup = new THREE.Group();
    fireworksGroup.visible = false;
    fireworksGroup.position.set(0, 21, 0);
    
    
    const fireworkColors = [
      { main: 0xff1744, trail: 0xff6090 }, // Red-Pink
      { main: 0xffd700, trail: 0xffed4e }, // Gold-Yellow
      { main: 0xff6d00, trail: 0xff9e40 }, // Orange
      { main: 0x00bcd4, trail: 0x80deea }, // Cyan-Blue
      { main: 0xaa00ff, trail: 0xd05ce3 }, // Purple
    ];
    const fireworkParticles = [];
    
    for (let f = 0; f < 5; f++) {
      const particleCount = 200; 
      const mainParticles = new THREE.BufferGeometry();
      const trailParticles = new THREE.BufferGeometry();
      
      const mainPositions = new Float32Array(particleCount * 3);
      const trailPositions = new Float32Array(particleCount * 6 * 3); 
      const velocities = [];
      
    
      const startX = (Math.random() - 0.5) * 6;
      const startY = 5 + f * 2;
      const startZ = (Math.random() - 0.5) * 4;
      
      for (let i = 0; i < particleCount; i++) {
        mainPositions[i * 3] = startX;
        mainPositions[i * 3 + 1] = startY;
        mainPositions[i * 3 + 2] = startZ;
        
       
        for (let t = 0; t < 6; t++) {
          const idx = (i * 6 + t) * 3;
          trailPositions[idx] = startX;
          trailPositions[idx + 1] = startY;
          trailPositions[idx + 2] = startZ;
        }
        
        
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;
        const speed = Math.random() * 0.8 + 0.4;
        
        velocities.push({
          x: Math.sin(phi) * Math.cos(theta) * speed,
          y: Math.cos(phi) * speed * 0.8,
          z: Math.sin(phi) * Math.sin(theta) * speed,
          life: 1.0,
          trail: []
        });
        
        
        for (let t = 0; t < 6; t++) {
          velocities[i].trail.push({ x: startX, y: startY, z: startZ });
        }
      }
      
      mainParticles.setAttribute('position', new THREE.BufferAttribute(mainPositions, 3));
      trailParticles.setAttribute('position', new THREE.BufferAttribute(trailPositions, 3));
      
      const mainMaterial = new THREE.PointsMaterial({
        size: 0.3,
        color: fireworkColors[f].main,
        transparent: true,
        opacity: 1,
        blending: THREE.AdditiveBlending
      });
      
      const trailMaterial = new THREE.PointsMaterial({
        size: 0.15,
        color: fireworkColors[f].trail,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
      });
      
      const mainSystem = new THREE.Points(mainParticles, mainMaterial);
      const trailSystem = new THREE.Points(trailParticles, trailMaterial);
      
      fireworksGroup.add(mainSystem);
      fireworksGroup.add(trailSystem);
      
      fireworkParticles.push({
        main: mainSystem,
        trail: trailSystem,
        velocities: velocities,
        delay: f * 0.4
      });
    }
    
    scene.add(fireworksGroup);
    
    
    camera.position.set(0, 0, 150);
    camera.lookAt(0, 0, 0);
    
    
    let mouseX = 0;
    let mouseY = 0;
    let isDragging = false;
    let previousMouseX = 0;
    let previousMouseY = 0;
    let cameraRotationX = 0;
    let cameraRotationY = 0;
    let targetRotationX = 0;
    let targetRotationY = 0;
    let zoom = 1;
    
    
    const startTime = Date.now();
    let messageRevealed = false;
    let fireworksStarted = false;
    let fireworksTime = 0;
    let canControl = false;
    let glowTime = 0;
    
    
    function onMouseDown(event) {
      if (canControl) {
        isDragging = true;
        previousMouseX = event.clientX;
        previousMouseY = event.clientY;
      }
    }
    
    function onMouseMove(event) {
      if (isDragging && canControl) {
        const deltaX = event.clientX - previousMouseX;
        const deltaY = event.clientY - previousMouseY;
        
        targetRotationY -= deltaX * 0.003;
        targetRotationX -= deltaY * 0.003;
        
        
        targetRotationX = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, targetRotationX));
        
        previousMouseX = event.clientX;
        previousMouseY = event.clientY;
      }
    }
    
    function onMouseUp() {
      isDragging = false;
    }
    
    function onWheel(event) {
      if (canControl) {
        event.preventDefault();
        zoom += event.deltaY * -0.001;
        zoom = Math.max(0.5, Math.min(2, zoom));
      }
    }
    
    mountRef.current.addEventListener('mousedown', onMouseDown);
    mountRef.current.addEventListener('mousemove', onMouseMove);
    mountRef.current.addEventListener('mouseup', onMouseUp);
    mountRef.current.addEventListener('wheel', onWheel, { passive: false });
    
    
    function animate() {
      animationIdRef.current = requestAnimationFrame(animate);
      
      const elapsed = (Date.now() - startTime) / 1000;
      
      
      moon.rotation.y += 0.0002;
      earth.rotation.y += 0.001;
      stars.rotation.y += 0.0001;
      
      if (cinematicMode) {
        // Phase 1: Approach moon from far away (0-10s)
        if (elapsed < 10) {
          const t = elapsed / 10;
          const distance = 150 - (t * t * 130); 
          
          
          camera.position.set(
            Math.sin(t * Math.PI * 0.2) * distance * 0.15,
            Math.cos(t * Math.PI * 0.15) * distance * 0.1,
            distance
          );
          camera.lookAt(0, 0, 0);
        }
        // Phase 2: Final descent and landing (10-13s)
        else if (elapsed < 13) {
          const t = (elapsed - 10) / 3;
          const height = 20 + (1 - t * t) * 15;
          
          camera.position.set(0, height, 5 - t * 2);
          camera.lookAt(0, 21, 0);
        }
        // Phase 3: Fireworks celebration RIGHT AFTER LANDING (13-18s)
        else if (elapsed < 18) {
          if (!fireworksStarted) {
            fireworksStarted = true;
            fireworksGroup.visible = true;
          }
          
          fireworksTime = elapsed - 13;
          
          
          fireworkParticles.forEach((fw, index) => {
            if (fireworksTime > fw.delay) {
              const mainPositions = fw.main.geometry.attributes.position.array;
              const trailPositions = fw.trail.geometry.attributes.position.array;
              
              for (let i = 0; i < fw.velocities.length; i++) {
                const vel = fw.velocities[i];
                
              
                vel.trail.unshift({
                  x: mainPositions[i * 3],
                  y: mainPositions[i * 3 + 1],
                  z: mainPositions[i * 3 + 2]
                });
                if (vel.trail.length > 6) vel.trail.pop();
                
                
                mainPositions[i * 3] += vel.x * 0.08;
                mainPositions[i * 3 + 1] += vel.y * 0.08 - 0.03; 
                mainPositions[i * 3 + 2] += vel.z * 0.08;
                
               
                for (let t = 0; t < 6; t++) {
                  const idx = (i * 6 + t) * 3;
                  trailPositions[idx] = vel.trail[t].x;
                  trailPositions[idx + 1] = vel.trail[t].y;
                  trailPositions[idx + 2] = vel.trail[t].z;
                }
                
                
                vel.x *= 0.98;
                vel.y *= 0.98;
                vel.z *= 0.98;
                vel.life -= 0.008;
              }
              
              fw.main.geometry.attributes.position.needsUpdate = true;
              fw.trail.geometry.attributes.position.needsUpdate = true;
              fw.main.material.opacity = Math.max(0, fw.velocities[0].life);
              fw.trail.material.opacity = Math.max(0, fw.velocities[0].life * 0.6);
            }
          });
          
         
          camera.position.set(0, 23, 8);
          camera.lookAt(0, 23, 0);
        }
        
        else if (elapsed < 23) {
          if (!messageRevealed) {
            messageRevealed = true;
            messageGroup.visible = true;
            fireworksGroup.visible = false; 
          }
          
          glowTime = elapsed - 18;
          
          
          if (messageGroup.children && messageGroup.children.length > 1) {
            const glowMesh = messageGroup.children[1];
            if (glowMesh && glowMesh.material && glowMesh.material.uniforms) {
              glowMesh.material.uniforms.time.value = glowTime;
            }
          }
          
          
          const t = (elapsed - 18) / 5;
          camera.position.set(0, 24, 12 - t * 2);
          camera.lookAt(0, 24, 0);
        }
        
        else {
          if (!canControl) {
            canControl = true;
            if (onCinematicComplete) {
              onCinematicComplete();
            }
          }
          
          
          glowTime = elapsed - 18;
          if (messageGroup.children && messageGroup.children.length > 1) {
            const glowMesh = messageGroup.children[1];
            if (glowMesh && glowMesh.material && glowMesh.material.uniforms) {
              glowMesh.material.uniforms.time.value = glowTime;
            }
          }
          
          
          cameraRotationX += (targetRotationX - cameraRotationX) * 0.1;
          cameraRotationY += (targetRotationY - cameraRotationY) * 0.1;
          
         
          const direction = new THREE.Vector3(0, 0, -1);
          direction.applyQuaternion(camera.quaternion);
          
          camera.position.set(0, 21, 10);
          
          
          const rotationMatrix = new THREE.Matrix4();
          rotationMatrix.makeRotationY(cameraRotationY);
          direction.applyMatrix4(rotationMatrix);
          
          const rotationMatrixX = new THREE.Matrix4();
          rotationMatrixX.makeRotationX(cameraRotationX);
          direction.applyMatrix4(rotationMatrixX);
          
          const lookAtPoint = new THREE.Vector3(
            camera.position.x + direction.x,
            camera.position.y + direction.y,
            camera.position.z + direction.z
          );
          camera.lookAt(lookAtPoint);
          
          
          camera.fov = 60 / zoom;
          camera.updateProjectionMatrix();
        }
      } else {
        
        glowTime += 0.016;
        if (messageGroup.children && messageGroup.children.length > 1) {
          const glowMesh = messageGroup.children[1];
          if (glowMesh && glowMesh.material && glowMesh.material.uniforms) {
            glowMesh.material.uniforms.time.value = glowTime;
          }
        }
      }
      
      renderer.render(scene, camera);
    }
    
    animate();
    
    
    function handleResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }
    window.addEventListener('resize', handleResize);
    
    
    return () => {
      window.removeEventListener('resize', handleResize);
      if (mountRef.current) {
        mountRef.current.removeEventListener('mousedown', onMouseDown);
        mountRef.current.removeEventListener('mousemove', onMouseMove);
        mountRef.current.removeEventListener('mouseup', onMouseUp);
        mountRef.current.removeEventListener('wheel', onWheel);
      }
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [message, cinematicMode, onCinematicComplete]);
  
  return <div ref={mountRef} className="canvas-container" />;
}

function App() {
  const [started, setStarted] = useState(false);
  const [cinematicMode, setCinematicMode] = useState(true);
  const message = 'Will you be my Valentine?'; // Permanent message
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showMessage, setShowMessage] = useState(false);

  const handleStart = () => {
    setStarted(true);
    setCinematicMode(true);
  };

  const handleCinematicComplete = () => {
    setCinematicMode(false);
    setShowMessage(true);
  };

  const handleRestart = () => {
    setStarted(false);
    setCinematicMode(true);
    setShowMessage(false);
    setTimeout(() => {
      setStarted(true);
      setCinematicMode(true);
    }, 100);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-background">
      {/* 3D Scene */}
      {started && (
        <MoonScene
          message={message}
          cinematicMode={cinematicMode}
          onCinematicComplete={handleCinematicComplete}
        />
      )}

      {/* UI Overlay */}
      <div className="ui-overlay">
        {!started && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />
            
            {/* Animated stars background */}
            <div className="absolute inset-0 overflow-hidden">
              {[...Array(50)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 bg-accent rounded-full animate-twinkle"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 3}s`,
                  }}
                />
              ))}
            </div>

            <Card className="relative w-full max-w-2xl mx-4 bg-card/80 backdrop-blur-xl border-accent/20 shadow-glow">
              <CardContent className="p-12 text-center space-y-8">
                <div>
                  <h1 className="text-6xl sm:text-7xl font-serif font-bold text-gradient-gold mb-4">
                    Sweetie
                  </h1>
                  <p className="text-xl text-muted-foreground font-light tracking-wide">
                    Take my hand. Let's go to the moon.
                  </p>
                </div>

                <Button
                  onClick={handleStart}
                  size="lg"
                  className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-accent to-accent-glow hover:shadow-glow transition-all duration-500 animate-glow-pulse"
                >
                  <Play className="mr-2 h-5 w-5" />
                  Let's go 
                </Button>

                <div className="pt-6 border-t border-border/50">
                  <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary-glow animate-pulse" />
                      <span>Cinematic Experience</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                      <span>3D Graphics</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Control Panel */}
        {started && (
          <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-20">
            <Card className="bg-card/60 backdrop-blur-xl border-accent/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setSoundEnabled(!soundEnabled)}
                    className="border-accent/30 hover:bg-accent/10"
                  >
                    {soundEnabled ? (
                      <Volume2 className="h-4 w-4" />
                    ) : (
                      <VolumeX className="h-4 w-4" />
                    )}
                  </Button>

                  <Button
                    variant="outline"
                    onClick={handleRestart}
                    className="border-accent/30 hover:bg-accent/10"
                  >
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Replay Journey
                  </Button>

                  {showMessage && (
                    <div className="ml-2 px-4 py-2 text-sm text-foreground border-l border-accent/30">
                      <div className="text-xs text-muted-foreground">🎆 Scroll to zoom</div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

      </div>
    </div>
  );
}

export default App;
