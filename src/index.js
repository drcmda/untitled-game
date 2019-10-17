import * as THREE from 'three'
import ReactDOM from 'react-dom'
import React, { Suspense } from 'react'
import { Canvas } from 'react-three-fiber'
import Stars from './3d/Stars'
import Planets from './3d/Planets'
import Effects from './3d/Effects'
import Particles from './3d/Particles'
import Enemies from './3d/Enemies'
import Rocks from './3d/Rocks'
import Explosions from './3d/Explosions'
import Rings from './3d/Rings'
import Track from './3d/Track'
import Ship from './3d/Ship'
import Rig from './3d/Rig'
import Hud from './Hud'
import useStore from './store'

function App() {
  const { fov } = useStore(state => state.mutation)
  const actions = useStore(state => state.actions)
  return (
    <>
      <Canvas
        onPointerMove={actions.updateMouse}
        onClick={actions.shoot}
        camera={{ position: [0, 0, 2000], near: 0.01, far: 10000, fov }}
        onCreated={({ gl, camera }) => {
          actions.init(camera)
          gl.gammaInput = true
          gl.toneMapping = THREE.Uncharted2ToneMapping
          gl.setClearColor(new THREE.Color('#020207'))
        }}>
        <fog attach="fog" args={['black', 100, 700]} />
        <ambientLight intensity={0.25} />
        <Stars />
        <Explosions />
        <Track />
        <Particles />
        <Rings />
        <Suspense fallback={null}>
          <Rocks />
          <Planets />
          <Enemies />
          <Rig>
            <Ship />
          </Rig>
        </Suspense>
        <Effects />
      </Canvas>
      <Hud />
    </>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
