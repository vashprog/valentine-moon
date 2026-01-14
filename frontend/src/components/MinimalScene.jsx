import React from 'react';

export const MinimalScene = () => {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      
      {/* Simple sphere representing moon */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[3, 64, 64]} />
        <meshStandardMaterial color="#8a8a8a" />
      </mesh>
      
      {/* Simple cube representing astronaut */}
      <mesh position={[-2, 0, 2]}>
        <boxGeometry args={[0.5, 1, 0.5]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      
      {/* Flag */}
      <mesh position={[1, 0.5, 0]}>
        <planeGeometry args={[1, 0.6]} />
        <meshStandardMaterial color="#ff6b9d" />
      </mesh>
    </>
  );
};
