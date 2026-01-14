import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const MoonDust = ({ count = 200 }) => {
  const particlesRef = useRef();
  
  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const velocities = [];
    
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 1] = Math.random() * 2 - 2;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
      
      velocities.push({
        x: (Math.random() - 0.5) * 0.01,
        y: Math.random() * 0.02,
        z: (Math.random() - 0.5) * 0.01,
      });
    }
    
    return { positions, velocities };
  }, [count]);
  
  useFrame(() => {
    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position.array;
      
      for (let i = 0; i < count; i++) {
        positions[i * 3] += particles.velocities[i].x;
        positions[i * 3 + 1] += particles.velocities[i].y;
        positions[i * 3 + 2] += particles.velocities[i].z;
        
        // Reset particles that go too high
        if (positions[i * 3 + 1] > 2) {
          positions[i * 3 + 1] = -2;
        }
      }
      
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particles.positions.length / 3}
          array={particles.positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#ffffff"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
};

export const Sparkles = ({ count = 100 }) => {
  const sparklesRef = useRef();
  
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = Math.random() * 10 - 3;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    
    return pos;
  }, [count]);
  
  useFrame((state) => {
    if (sparklesRef.current) {
      sparklesRef.current.material.opacity = 0.3 + Math.sin(state.clock.getElapsedTime() * 2) * 0.3;
    }
  });

  return (
    <points ref={sparklesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.15}
        color="#ffd700"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
};
