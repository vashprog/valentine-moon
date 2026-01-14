import React, { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const Astronaut = ({ isWalking, onReachFlag }) => {
  const groupRef = useRef();
  const [position, setPosition] = useState([-5, -1.5, 0]);
  const [rotation, setRotation] = useState([0, Math.PI / 4, 0]);
  const walkSpeed = 0.02;
  const targetPosition = [0, -1.5, 0];
  
  useFrame(() => {
    if (isWalking && groupRef.current) {
      // Move astronaut toward flag position
      const currentPos = groupRef.current.position;
      const distance = Math.sqrt(
        Math.pow(targetPosition[0] - currentPos.x, 2) +
        Math.pow(targetPosition[2] - currentPos.z, 2)
      );
      
      if (distance > 0.1) {
        const direction = new THREE.Vector3(
          targetPosition[0] - currentPos.x,
          0,
          targetPosition[2] - currentPos.z
        ).normalize();
        
        groupRef.current.position.x += direction.x * walkSpeed;
        groupRef.current.position.z += direction.z * walkSpeed;
        
        // Bobbing animation while walking
        groupRef.current.position.y = -1.5 + Math.sin(Date.now() * 0.005) * 0.05;
      } else {
        if (onReachFlag) onReachFlag();
      }
    }
  });

  return (
    <group ref={groupRef} position={position} rotation={rotation}>
      {/* Simplified astronaut body */}
      {/* Head/Helmet */}
      <mesh position={[0, 0.7, 0]} castShadow>
        <sphereGeometry args={[0.25, 32, 32]} />
        <meshStandardMaterial color="#ffffff" metalness={0.8} roughness={0.2} />
      </mesh>
      
      {/* Visor */}
      <mesh position={[0, 0.7, 0.2]} castShadow>
        <sphereGeometry args={[0.15, 32, 32]} />
        <meshStandardMaterial color="#1a1a2e" metalness={0.9} roughness={0.1} transparent opacity={0.8} />
      </mesh>
      
      {/* Body */}
      <mesh position={[0, 0.2, 0]} castShadow>
        <boxGeometry args={[0.4, 0.7, 0.3]} />
        <meshStandardMaterial color="#e8e8e8" />
      </mesh>
      
      {/* Backpack */}
      <mesh position={[0, 0.3, -0.25]} castShadow>
        <boxGeometry args={[0.35, 0.5, 0.15]} />
        <meshStandardMaterial color="#cccccc" />
      </mesh>
      
      {/* Arms */}
      <mesh position={[-0.3, 0.15, 0]} rotation={[0, 0, -0.3]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 0.5, 16]} />
        <meshStandardMaterial color="#e8e8e8" />
      </mesh>
      <mesh position={[0.3, 0.15, 0]} rotation={[0, 0, 0.3]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 0.5, 16]} />
        <meshStandardMaterial color="#e8e8e8" />
      </mesh>
      
      {/* Legs */}
      <mesh position={[-0.12, -0.35, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.1, 0.6, 16]} />
        <meshStandardMaterial color="#d0d0d0" />
      </mesh>
      <mesh position={[0.12, -0.35, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.1, 0.6, 16]} />
        <meshStandardMaterial color="#d0d0d0" />
      </mesh>
      
      {/* Boots */}
      <mesh position={[-0.12, -0.75, 0.05]} castShadow>
        <boxGeometry args={[0.15, 0.1, 0.25]} />
        <meshStandardMaterial color="#808080" />
      </mesh>
      <mesh position={[0.12, -0.75, 0.05]} castShadow>
        <boxGeometry args={[0.15, 0.1, 0.25]} />
        <meshStandardMaterial color="#808080" />
      </mesh>
    </group>
  );
};
