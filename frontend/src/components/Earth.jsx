import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const Earth = () => {
  const earthRef = useRef();
  
  useFrame((state) => {
    if (earthRef.current) {
      earthRef.current.rotation.y += 0.001;
    }
  });

  return (
    <mesh ref={earthRef} position={[-15, 8, -30]}>
      <sphereGeometry args={[3, 64, 64]} />
      <meshStandardMaterial
        color="#4a9eff"
        emissive="#2a5f9f"
        emissiveIntensity={0.3}
        roughness={0.6}
        metalness={0.2}
      />
      
      {/* Atmosphere glow */}
      <mesh scale={1.05}>
        <sphereGeometry args={[3, 64, 64]} />
        <meshBasicMaterial
          color="#88ccff"
          transparent
          opacity={0.1}
          side={THREE.BackSide}
        />
      </mesh>
    </mesh>
  );
};
