import React, { useRef } from 'react';
import { useFrame } from 'react-three-fiber';

const PlainBox = ({ position, color, args }) => {
  const meshRef = useRef(null);

  // Rotate mesh
  // ! To use `useFrame` (or any hook) we need to exrtact an element to its own component
  useFrame(
    () =>
      (meshRef.current.rotation.x = meshRef.current.rotation.y += 0.01),
  );

  return (
    // to display color the light should be specified
    <mesh ref={meshRef} position={position} castShadow>
      {/* args - constructor arguments (width, height, depth) */}
      <boxBufferGeometry attach="geometry" args={args} />
      <meshStandardMaterial attach="material" color={color} />
    </mesh>
  );
};

export default PlainBox;
