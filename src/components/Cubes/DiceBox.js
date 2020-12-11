import React, { useRef } from 'react';
import { TextureLoader } from 'three/src/loaders/TextureLoader.js';
import { useLoader, useFrame } from 'react-three-fiber';

const DiceBox = ({ position }) => {
  const meshRef = useRef(null);

  const texture_1 = useLoader(TextureLoader, 'textures/1.jpeg');
  const texture_2 = useLoader(TextureLoader, 'textures/2.jpeg');
  const texture_3 = useLoader(TextureLoader, 'textures/3.jpeg');
  const texture_4 = useLoader(TextureLoader, 'textures/4.jpeg');
  const texture_5 = useLoader(TextureLoader, 'textures/5.jpeg');
  const texture_6 = useLoader(TextureLoader, 'textures/6.jpeg');

  // Rotate mesh
  // ! To use `useFrame` (or any hook) we need to exrtact an element to its own component
  useFrame(
    () =>
      (meshRef.current.rotation.x = meshRef.current.rotation.y += 0.01),
  );

  return (
    <mesh ref={meshRef} position={position} castShadow>
      <boxBufferGeometry attach="geometry" args={[1, 1, 1]} />
      <meshStandardMaterial attachArray="material" map={texture_1} />
      <meshStandardMaterial attachArray="material" map={texture_2} />
      <meshStandardMaterial attachArray="material" map={texture_3} />
      <meshStandardMaterial attachArray="material" map={texture_4} />
      <meshStandardMaterial attachArray="material" map={texture_5} />
      <meshStandardMaterial attachArray="material" map={texture_6} />
    </mesh>
  );
};

export default DiceBox;
