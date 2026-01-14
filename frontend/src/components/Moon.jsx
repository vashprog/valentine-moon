import React, { useRef } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import * as THREE from 'three';

export const Moon = () => {
  const moonRef = useRef();
  
  // Using procedural generation for moon surface
  const displacementScale = 0.3;
  
  useFrame((state) => {
    if (moonRef.current) {
      // Subtle rotation
      moonRef.current.rotation.y += 0.0005;
    }
  });

  return (
    <mesh ref={moonRef} position={[0, -2, -5]} receiveShadow>
      <sphereGeometry args={[8, 128, 128]} />
      <meshStandardMaterial
        color="#8a8a8a"
        roughness={0.95}
        metalness={0.1}
        displacementScale={displacementScale}
      />
    </mesh>
  );
};
