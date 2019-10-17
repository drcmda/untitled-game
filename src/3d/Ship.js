import * as THREE from 'three'
import React, { useRef } from 'react'
import { useLoader, useFrame } from 'react-three-fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import useStore from '../store'

const geometry = new THREE.BoxBufferGeometry(1, 1, 40)
const lightgreen = new THREE.Color('lightgreen')
const hotpink = new THREE.Color('hotpink')
const laserMaterial = new THREE.MeshBasicMaterial({ color: lightgreen })
const crossMaterial = new THREE.MeshBasicMaterial({ color: hotpink, fog: false })
const position = new THREE.Vector3()
const direction = new THREE.Vector3()

export default function Ship() {
  const gltf = useLoader(GLTFLoader, '/ship.gltf')
  const mutation = useStore(state => state.mutation)
  const { clock, mouse, ray } = mutation
  const lasers = useStore(state => state.lasers)
  const main = useRef()
  const laserGroup = useRef()
  const laserLight = useRef()
  const exhaust = useRef()
  const cross = useRef()
  const target = useRef()

  useFrame(() => {
    main.current.position.z = Math.sin(clock.getElapsedTime() * 40) * Math.PI * 0.1
    main.current.rotation.z += (mouse.x / 500 - main.current.rotation.z) * 0.1
    main.current.rotation.x += (-mouse.y / 1200 - main.current.rotation.x) * 0.1
    main.current.rotation.y += (-mouse.x / 1200 - main.current.rotation.y) * 0.1
    main.current.position.x += (mouse.x / 10 - main.current.position.x) * 0.1
    main.current.position.y += (25 + -mouse.y / 10 - main.current.position.y) * 0.1
    exhaust.current.scale.x = 1 + Math.sin(clock.getElapsedTime() * 200)
    exhaust.current.scale.y = 1 + Math.sin(clock.getElapsedTime() * 200)
    for (let i = 0; i < lasers.length; i++) {
      const group = laserGroup.current.children[i]
      group.position.z -= 20
    }
    laserLight.current.intensity += ((lasers.length && Date.now() - lasers[lasers.length - 1] < 100 ? 20 : 0) - laserLight.current.intensity) * 0.3

    // Get ships orientation and save it to the stores ray
    main.current.getWorldPosition(position)
    main.current.getWorldDirection(direction)
    ray.origin.copy(position)
    ray.direction.copy(direction.negate())

    // ...
    crossMaterial.color = mutation.hits ? lightgreen : hotpink
    cross.current.visible = !mutation.hits
    target.current.visible = !!mutation.hits
  })

  return (
    <group ref={main}>
      <group scale={[3.5, 3.5, 3.5]}>
        <group ref={cross} position={[0, 0, -300]} name="cross">
          <mesh renderOrder={1000} material={crossMaterial}>
            <boxBufferGeometry attach="geometry" args={[20, 2, 2]} />
          </mesh>
          <mesh renderOrder={1000} material={crossMaterial}>
            <boxBufferGeometry attach="geometry" args={[2, 20, 2]} />
          </mesh>
        </group>
        <group ref={target} position={[0, 0, -300]} name="target">
          <mesh position={[0, 20, 0]} renderOrder={1000} material={crossMaterial}>
            <boxBufferGeometry attach="geometry" args={[40, 2, 2]} />
          </mesh>
          <mesh position={[0, -20, 0]} renderOrder={1000} material={crossMaterial}>
            <boxBufferGeometry attach="geometry" args={[40, 2, 2]} />
          </mesh>
          <mesh position={[20, 0, 0]} renderOrder={1000} material={crossMaterial}>
            <boxBufferGeometry attach="geometry" args={[2, 40, 2]} />
          </mesh>
          <mesh position={[-20, 0, 0]} renderOrder={1000} material={crossMaterial}>
            <boxBufferGeometry attach="geometry" args={[2, 40, 2]} />
          </mesh>
        </group>
        <pointLight ref={laserLight} position={[0, 0, -20]} distance={100} intensity={0} color="lightgreen" />
        <group ref={laserGroup}>
          {lasers.map((t, i) => (
            <group key={i}>
              <mesh position={[-2.8, 0, -0.8]} geometry={geometry} material={laserMaterial} />
              <mesh position={[2.8, 0, -0.8]} geometry={geometry} material={laserMaterial} />
            </group>
          ))}
        </group>
        <group rotation={[Math.PI / 2, Math.PI, 0]}>
          <mesh name="Renault_(S,_T1)_0">
            <bufferGeometry attach="geometry" {...gltf.__$[5].geometry} />
            <meshStandardMaterial attach="material" color="#070707" />
          </mesh>
          <mesh name="Renault_(S,_T1)_1">
            <bufferGeometry attach="geometry" {...gltf.__$[6].geometry} />
            <meshStandardMaterial attach="material" color="black" />
          </mesh>
          <mesh name="Renault_(S,_T1)_2">
            <bufferGeometry attach="geometry" {...gltf.__$[7].geometry} />
            <meshStandardMaterial attach="material" color="#070707" />
          </mesh>
          <mesh name="Renault_(S,_T1)_3">
            <bufferGeometry attach="geometry" {...gltf.__$[8].geometry} />
            <meshBasicMaterial attach="material" color="lightblue" />
          </mesh>
          <mesh name="Renault_(S,_T1)_4">
            <bufferGeometry attach="geometry" {...gltf.__$[9].geometry} />
            <meshBasicMaterial attach="material" color="white" />
          </mesh>
          <mesh name="Renault_(S,_T1)_5">
            <bufferGeometry attach="geometry" {...gltf.__$[10].geometry} />
            <meshBasicMaterial attach="material" color="teal" />
          </mesh>
        </group>
      </group>
      <mesh ref={exhaust} scale={[1, 1, 30]} position={[0, 1, 30]}>
        <dodecahedronBufferGeometry attach="geometry" args={[1.5, 0]} />
        <meshBasicMaterial attach="material" color="lightblue" />
      </mesh>
    </group>
  )
}
