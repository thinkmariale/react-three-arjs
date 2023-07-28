/* eslint-disable import/named */
/* eslint-disable no-underscore-dangle */
import React, { useEffect, useRef, useState } from "react"
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

const ARPrimitive = ({
  loadModel = true,
  position,
  scale,
  ...props
}) => {

  const [loadedModel, setLoadedModel] = useState(null);
  useEffect(() => {
    
    if(loadModel) {
      const glftLoader = new GLTFLoader();
      const dracoLoader = new DRACOLoader();
      dracoLoader.setDecoderPath( 'assets/three/examples/jsm/libs/draco/' );
      glftLoader.setDRACOLoader( dracoLoader );

      glftLoader.load('/assets/obj.glb', (gltfScene) => {
        setLoadedModel(gltfScene);
       
      });
    } 

  }, [loadModel])

  const LoadModel = () => {

    if(loadedModel != null) {
      return(
        <primitive 
          object={loadedModel.scene}
          scale={scale}
          position={position}
        />
      );
    } 
    return (<></>)
   
  }

  const SimpleCube = () =>{

    return (
    <mesh
      position={[3,0,-10]}
      scale={[1,1,1]}
        onClick={e => {
          window.alert("click")
          console.log(e)
        }}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={"hotpink"} />
      </mesh>
    )
  }
  return(
    <>
    { loadModel ? <LoadModel /> : <SimpleCube /> }
   </>
  );
}

export default ARPrimitive
