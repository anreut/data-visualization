import { OrbitControls } from 'drei';
import React, { Suspense } from 'react';
import { Canvas } from 'react-three-fiber';
import PlainBox from './PlainBox';
import TextureBox from './TextureBox';
import DiceBox from './DiceBox';

import './Cube.scss';

const Cube = () => {
  return (
    <div id="cube-canvas">
      {/* colorManagement - Auto sRGBEncoding encoding for all colors and textures + ACESFilmic */}
      {/* fov - camera field of view (zoom) */}
      <Canvas
        colorManagement
        camera={{ position: [-5, 2, 10], fov: 20 }}
      >
        {/* general light */}
        <ambientLight intensity={0.3} />
        {/* main source of light */}
        <directionalLight position={[0, 10, 0]} intensity={1.5} />
        {/* aditional light */}
        <pointLight position={[-10, 0, -20]} intensity={0.5} />

        {/* The purpose of group is to make working with groups of objects syntactically clearer  */}
        <group>
          {/* FLOOR */}
          {/* <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3, 0]}>
            <planeBufferGeometry
              attach="geometry"
              args={(100, 100)}
            />
            <meshStandardMaterial attach="material" color="yellow" />
          </mesh> */}
          <PlainBox
            position={[0, 0, 0]}
            args={[1, 1, 3]}
            color="pink"
          />
          {/* !!! Use suspense inside parent component */}
          <Suspense fallback={null}>
            <DiceBox position={[5, 0, 0]} />
          </Suspense>
          <Suspense fallback={null}>
            <TextureBox position={[-5, 0, 0]} />
          </Suspense>
        </group>
        {/* Objects moving and zooming */}
        <OrbitControls />
      </Canvas>
    </div>
  );
};

export default Cube;
