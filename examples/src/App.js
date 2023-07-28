
import { useEffect, useState } from 'react';
import { LocationBased, WebcamRenderer } from "./ar/three.js/src/location-based/index"
import {ARCanvas, ARLocationBased, ARPrimitive } from './ar'
import * as THREE from 'three';

import SceneInit from './ar/lib/SceneInit';

function App() {
  const [init, setInit] = useState(false)

  // const arPrimitives = [ 
  //   {
  //     title:"test1",
  //     description:"description1",
  //     distance:0,
  //     position:[39.338469656940084 +0.001,  -120.17282861459799, -10],
  //     // position:[39.34758798530564  + 0.001, -120.11029577905212, -100],
  //     scale:[2,2,2]
  //   },
  //   {
  //     title:"test2",
  //     description:"description2",
  //     position:[ 39.338451 +0.0001, -120.172888, -10],
  //     // position:[39.34758798530564 - 0.001, -120.11029577905212, -100],
  //     scale:[2,2,2]
  //   },
    
  // ]
  

  // const arPrimitives = [ 
  //   {
  //     title:"tahoe1",
  //     description:"description1",
  //     distance:0,
  //     position:[39.347403, -120.110854, -10],
  //     scale:[0.5,0.5,0.5]
  //   },
  //   {
  //     title:"tahoe2",
  //     description:"description2",
  //     position:[ 39.347420, -120.110875, -10],
  //     scale:[0.5,0.5,0.5]
  //   },
  //   {
  //     title:"tahoe3",
  //     description:"description3",
  //     position:[ 39.346499, -120.110677, -10],
  //     scale:[1,1,1]
  //   },
    
  // ]


  const arPrimitives = [ 
    {
      title:"sf1",
      description:"description1",
      distance:0,
      position:[37.755418, -122.442719, -10],
      scale:[0.5,0.5,0.5]
    },
    {
      title:"sf2",
      description:"description2",
      position:[ 37.754175, -122.442917, -10],
      scale:[0.5,0.5,0.5]
    },
    {
      title:"sf3",
      description:"description3",
      position:[ 37.755893, -122.442197, -10],
      scale:[1,1,1]
    },
    
  ]
  const InitExperience =() => {

    const test = new SceneInit('canvas1');
    test.initialize();
    test.animate();

    const geom = new THREE.BoxGeometry(20,20,20);
    const arjs = new LocationBased( test.scene, test.camera)
    const material = new THREE.MeshBasicMaterial({color: 0xff0000});
    const material2 = new THREE.MeshBasicMaterial({color: 0xffff00});
    const material3 = new THREE.MeshBasicMaterial({color: 0x0000ff});
    const material4 = new THREE.MeshBasicMaterial({color: 0x00ff00});

    const obj1 = new THREE.Mesh(geom, material);
    const obj2 = new THREE.Mesh(geom, material2);
    const obj3 = new THREE.Mesh(geom, material3);
    const obj4 = new THREE.Mesh(geom, material4);
    let pos1=[0,0]
    let pos2=[0,0]
    let pos3=[0,0]
    let pos4=[0,0]
   
    let first = true;

    arjs.on("gpsupdate", pos => {
        if(first) {
            setupObjects(pos.coords.longitude, pos.coords.latitude);
            first = false;
        } else {
          updateObjects(pos.coords.longitude, pos.coords.latitude);
        }
    });

    arjs.on("gpserror", code => {
        alert(`GPS error: code ${code}`);
    });

    arjs.startGps();

    function setupObjects(longitude, latitude) {
      // Use position of first GPS update (fake or real)
     
      arjs.add(obj1, longitude, latitude + 0.001); // slightly north
      arjs.add(obj2, longitude, latitude - 0.001); // slightly south
      arjs.add(obj3, longitude + 0.001, latitude- 0.0002); // slightly west
      arjs.add(obj4, longitude + 0.001, latitude); // slightly east

      pos1 = [ longitude, latitude + 0.001]
      pos2 = [ longitude, latitude - 0.001]
      pos3 = [ longitude + 0.001, latitude- 0.0002]
      pos4 = [ longitude + 0.001, latitude]

    }

    function updateObjects(longitude, latitude) {
      //console.log("here update")
      arjs.setWorldPosition(obj1,  pos1[0], pos1[1] ); 
      arjs.setWorldPosition(obj2,  pos2[0], pos2[1] ); 
      arjs.setWorldPosition(obj3,  pos3[0], pos3[1] ); 
      arjs.setWorldPosition(obj4,  pos4[0], pos4[1] ); 

      console.log(obj1)
      console.log(test.camera)
    }
    setInit(true);
  }
 
  return (
    <div className="App">
      {/* { !init &&
        <button onClick={InitExperience}>Init </button>
      }
    <canvas id="canvas1" /> */}

    
      <ARCanvas
        locationBased={true}
        arEnabled={true}
        gl={{ antialias: false, powerPreference: "default"}}
        onCameraStreamReady={() => console.log("Camera stream ready")}
        onCameraStreamError={() => console.error("Camera stream error")}
        onCreated={({ gl }) => {
          gl.setSize(window.innerWidth, window.innerHeight)
        }}>
        <ambientLight />
        <pointLight position={[10, 10, 0]} intensity={10.0} />
        <ARLocationBased arPrimitives={arPrimitives} />
        {/* <ARPrimitive locationBased={true} position={[39.3475451, -120.110365, 1]} /> */}

         {/* <ARPrimitive locationBased={true} position={[39.3475451, -120.110365, 1]} /> */}
          {/* <ARPrimitive locationBased={true} position={[37.754558, -122.4416811,0]} /> */}
          {/* <ARPrimitive  position={[0,0,-20]}  scale= {[.3,.3,.3]} />
          
          <Box/>
       */}
        
      </ARCanvas>


    </div>
  );
}

export default App;