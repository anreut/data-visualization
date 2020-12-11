import React, { useRef } from 'react';
import { TextureLoader } from 'three/src/loaders/TextureLoader.js';
import { useLoader, useFrame } from 'react-three-fiber';

const TextureBox = ({ position }) => {
  const meshRef = useRef(null);

  const texture = useLoader(TextureLoader, '/textures/crate.gif');

  // Rotate mesh
  // ! To use `useFrame` (or any hook) we need to exrtact an element to its own component
  useFrame(
    () =>
      (meshRef.current.rotation.x = meshRef.current.rotation.y += 0.01),
  );

  return (
    <mesh ref={meshRef} position={position}>
      <boxBufferGeometry attach="geometry" args={[1, 1, 1]} />
      <meshStandardMaterial
        attach="material"
        map={texture}
        color="gray"
      />
    </mesh>
  );
};

export default TextureBox;
