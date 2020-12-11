import { OrbitControls } from 'drei';
import React, { Suspense } from 'react';
import { Canvas } from 'react-three-fiber';
import PlainBox from './PlainBox';
import TextureBox from './TextureBox';
import DiceBox from './DiceBox';

import './Cube.scss';

const Cube = () => {
  console.log(-Math.PI / 2);
  return (
    <div id="cube-canvas">
      <Canvas shadowMap>
        {/* general light */}
        <ambientLight intensity={0.3} />
        {/* main source of light */}
        <directionalLight
          position={[0, 10, 0]}
          intensity={1.5}
          castShadow
        />
        {/* aditional light */}
        <pointLight position={[-10, 0, -20]} intensity={0.5} />

        {/* The purpose of group is to make working with groups of objects syntactically clearer  */}
        <group>
          {/* FLOOR */}
          {/* PlaneBufferGeometry(
            width : Float, 
            height : Float, 
            widthSegments : Integer, 
            heightSegments : Integer) */}
          {/* rotation: x, y, z */}
          <mesh
            position={[0, -2, 0]}
            rotation={[-1, 0, 0]}
            receiveShadow
          >
            <planeBufferGeometry attach="geometry" args={[40, 40]} />
            <meshStandardMaterial attach="material" color="yellow" />
            {/* <shadowMaterial attach="material" /> */}
          </mesh>
          <mesh position={[0, -2, 0]} rotation={[-1, 0, 0]}>
            <gridHelper
              args={[10, 10, `red`, `gray`]}
              rotation={[-1, 0, 0]}
            />
          </mesh>
          <PlainBox
            position={[0, 0, 0]}
            args={[1, 1, 3]}
            color="pink"
          />
          {/* !!! Use suspense inside parent component */}
          <Suspense fallback={null}>
            <DiceBox position={[6, 0, 0]} />
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
