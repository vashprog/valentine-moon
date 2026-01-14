import React, { useState, useEffect, useRef } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { Moon } from './Moon';
import { Astronaut } from './Astronaut';
import { Flag } from './Flag';
import { Stars } from './Stars';
import { Earth } from './Earth';
import { MoonDust, Sparkles } from './Particles';
import * as THREE from 'three';

const CameraController = ({ cinematicMode, onCinematicComplete }) => {
  const { camera } = useThree();
  const [phase, setPhase] = useState(0);
  const startTime = useRef(Date.now());
  
  useFrame(() => {
    if (cinematicMode) {
      const elapsed = (Date.now() - startTime.current) / 1000;
      
      // Phase 1: Pan across moon (0-3s)
      if (elapsed < 3) {
        camera.position.x = -8 + elapsed * 2;
        camera.position.y = 2;
        camera.position.z = 8 - elapsed * 0.5;
        camera.lookAt(0, 0, 0);
      }
      // Phase 2: Follow astronaut (3-8s)
      else if (elapsed < 8) {
        const t = (elapsed - 3) / 5;
        camera.position.x = -8 + t * 6;
        camera.position.y = 2 - t * 0.5;
        camera.position.z = 6.5 - t * 2;
        camera.lookAt(-3 + t * 3, 0, 0);
      }
      // Phase 3: Focus on flag (8-11s)
      else if (elapsed < 11) {
        const t = (elapsed - 8) / 3;
        camera.position.x = -2 + t * 1;
        camera.position.y = 1.5 - t * 0.5;
        camera.position.z = 4.5 - t * 1.5;
        camera.lookAt(0.5, 1, 0);
      }
      // Complete
      else {
        if (onCinematicComplete && phase === 0) {
          setPhase(1);
          onCinematicComplete();
        }
      }
    }
  });
  
  return null;
};

export const Scene3D = ({ message, cinematicMode, onCinematicComplete }) => {
  const [isWalking, setIsWalking] = useState(false);
  const [isFlagPlanted, setIsFlagPlanted] = useState(false);
  const [playFootstep, setPlayFootstep] = useState(false);
  const [playFlagPlant, setPlayFlagPlant] = useState(false);
  
  useEffect(() => {
    if (cinematicMode) {
      // Start walking after 3 seconds
      const walkTimer = setTimeout(() => {
        setIsWalking(true);
        setPlayFootstep(true);
      }, 3000);
      
      // Plant flag after 8 seconds
      const flagTimer = setTimeout(() => {
        setIsFlagPlanted(true);
        setIsWalking(false);
        setPlayFootstep(false);
        setPlayFlagPlant(true);
      }, 8000);
      
      return () => {
        clearTimeout(walkTimer);
        clearTimeout(flagTimer);
      };
    }
  }, [cinematicMode]);
  
  const handleReachFlag = () => {
    setIsFlagPlanted(true);
    setIsWalking(false);
    setPlayFootstep(false);
    setPlayFlagPlant(true);
  };

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.2} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={1.5}
        castShadow
        shadow-mapSize={[2048, 2048]}
      />
      <pointLight position={[-10, 5, -5]} intensity={0.5} color="#4a9eff" />
      <pointLight position={[10, 3, 10]} intensity={0.3} color="#ffd700" />
      
      {/* Fog for atmosphere */}
      <fog attach="fog" args={['#0a0a1a', 10, 100]} />
      
      {/* Camera Controller */}
      <CameraController
        cinematicMode={cinematicMode}
        onCinematicComplete={onCinematicComplete}
      />
      
      {/* Scene Objects */}
      <Stars count={5000} />
      <Earth />
      <Moon />
      <Astronaut isWalking={isWalking} onReachFlag={handleReachFlag} />
      <Flag message={message} isPlanted={isFlagPlanted} />
      <MoonDust count={200} />
      <Sparkles count={100} />
      
      {/* Ground plane for shadows */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.3, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#6a6a6a" roughness={0.9} />
      </mesh>
    </>
  );
};
