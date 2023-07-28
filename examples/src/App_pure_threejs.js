
import { useEffect, useState } from 'react';
import { LocationBased, WebcamRenderer } from "./ar/three.js/src/location-based/index"

import * as THREE from 'three';
// import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
// import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
// import { VOXLoader } from 'three/examples/jsm/loaders/VOXLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import SceneInit from './ar/lib/SceneInit';

function App() {
  const [init, setInit] = useState(false)

  const InitExperience =() => {

    const test = new SceneInit('canvas1');
    test.initialize();
    test.animate();

    const geom = new THREE.BoxGeometry(20,20,20);

    const arjs = new LocationBased( test.scene, test.camera)
    
    let first = true;

    arjs.on("gpsupdate", pos => {
        if(first) {
            setupObjects(pos.coords.longitude, pos.coords.latitude);
            first = false;
        }
    });

    arjs.on("gpserror", code => {
        alert(`GPS error: code ${code}`);
    });

    arjs.startGps();

    function setupObjects(longitude, latitude) {
      // Use position of first GPS update (fake or real)
      const material = new THREE.MeshBasicMaterial({color: 0xff0000});
      const material2 = new THREE.MeshBasicMaterial({color: 0xffff00});
      const material3 = new THREE.MeshBasicMaterial({color: 0x0000ff});
      const material4 = new THREE.MeshBasicMaterial({color: 0x00ff00});
      arjs.add(new THREE.Mesh(geom, material), longitude, latitude + 0.001); // slightly north
      arjs.add(new THREE.Mesh(geom, material2), longitude, latitude - 0.001); // slightly south
      arjs.add(new THREE.Mesh(geom, material3), longitude + 0.001, latitude- 0.0002); // slightly west
      arjs.add(new THREE.Mesh(geom, material4), longitude + 0.001, latitude); // slightly east
    }

    setInit(true);
  }
  // useEffect(() => {

  //   const test = new SceneInit('canvas1');
  //   test.initialize();
  //   test.animate();



  //   const geom = new THREE.BoxGeometry(20,20,20);

  //   const arjs = new LocationBased( test.scene, test.camera);


    
  //   let first = true;

  //   arjs.on("gpsupdate", pos => {
  //       if(first) {
  //           setupObjects(pos.coords.longitude, pos.coords.latitude);
  //           first = false;
  //       }
  //   });

  //   arjs.on("gpserror", code => {
  //       alert(`GPS error: code ${code}`);
  //   });

  //   arjs.startGps();

  //   function setupObjects(longitude, latitude) {
  //     // Use position of first GPS update (fake or real)
  //     const material = new THREE.MeshBasicMaterial({color: 0xff0000});
  //     const material2 = new THREE.MeshBasicMaterial({color: 0xffff00});
  //     const material3 = new THREE.MeshBasicMaterial({color: 0x0000ff});
  //     const material4 = new THREE.MeshBasicMaterial({color: 0x00ff00});
  //     arjs.add(new THREE.Mesh(geom, material), longitude, latitude + 0.001); // slightly north
  //     arjs.add(new THREE.Mesh(geom, material2), longitude, latitude - 0.001); // slightly south
  //     arjs.add(new THREE.Mesh(geom, material3), longitude + 0.001, latitude- 0.0002); // slightly west
  //     arjs.add(new THREE.Mesh(geom, material4), longitude + 0.001, latitude); // slightly east
  // }

  // }, []);

  return (
    <div>
      { !init &&
 
        <button onClick={InitExperience}>Init </button>
      }
    <canvas id="canvas1" />
    </div>
  );
}

export default App;