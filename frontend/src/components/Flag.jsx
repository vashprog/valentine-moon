import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const Flag = ({ message, isPlanted }) => {
  const flagRef = useRef();
  const [wavePhase, setWavePhase] = useState(0);
  
  useFrame((state) => {
    if (flagRef.current && isPlanted) {
      // Waving animation
      setWavePhase(state.clock.getElapsedTime());
    }
  });

  return (
    <group position={[0.5, -1.5, 0]} visible={isPlanted}>
      {/* Flag pole */}
      <mesh position={[0, 1.2, 0]} castShadow>
        <cylinderGeometry args={[0.02, 0.02, 2.5, 16]} />
        <meshStandardMaterial color="#c0c0c0" metalness={0.8} />
      </mesh>
      
      {/* Flag cloth */}
      <mesh
        ref={flagRef}
        position={[0.5, 2, 0]}
        rotation={[0, -Math.PI / 6, 0]}
        castShadow
      >
        <planeGeometry args={[1.2, 0.7, 20, 10]} />
        <meshStandardMaterial
          color="#ff6b9d"
          side={THREE.DoubleSide}
          metalness={0.1}
          roughness={0.7}
        />
      </mesh>
    </group>
  );
};
