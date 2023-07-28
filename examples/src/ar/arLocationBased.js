/* eslint-disable import/named */
/* eslint-disable no-underscore-dangle */
import { useFrame } from "@react-three/fiber"
import React, { useEffect, useRef, useState, useCallback } from "react"
import { useAR } from "./ar"
import { useThree } from "@react-three/fiber"
import ARPrimitive from "./arPrimitive"

import * as THREE from 'three'


const ARLocationBased = ({
  arPrimitives,
  type,
  onGpsUpdate,
  onGpsError,
}) => {

  const locationRoot = useRef()
  const { arLocationControl } = useAR()
  const [locationInit, setInitLoc] = useState(false)
  
  const geom = new THREE.BoxGeometry(20,20,20);
  const material = new THREE.MeshBasicMaterial({color: 0xff0000});
  const material2 = new THREE.MeshBasicMaterial({color: 0xffff00});
  
  const handleUpdate = (pos) => { 
    arPrimitives.forEach(element => {
      if(element.position){
        // if(element.title === "test1")
        //   arLocationControl.add(new THREE.Mesh(geom, material), element.position[1], element.position[0],0); 
        // else
        //   arLocationControl.add(new THREE.Mesh(geom, material2), element.position[1], element.position[0],0); 
        
        element.distance = arLocationControl._haversineDist(pos.coords, {longitude:element.position[1], latitude:element.position[0]});
        element.position = arLocationControl.setWorldPositionObj(element.position[1],element.position[0],element.position[2])
      }
    });
  }

  useEffect(() => {
    if (!arLocationControl) { return }
  
    console.log("ARLocationBased useEffect")
    arLocationControl.on("gpsupdate",  pos => {
     // if(!locationInit) {
        handleUpdate(pos);
        setInitLoc(true);
     // } else {
       // console.log("here",pos)
     // }
  });
    arLocationControl.on("gpserror", code => {
        alert(`GPS error: code ${code}`);
       // onGpsError();
    });
    arLocationControl.startGps();
  }, )

  useFrame(() => {
   // console.log("locationInit", locationInit)
  })

  return ( 
    <>
  
      {locationInit && 
        arPrimitives.map((items, index) => {
          console.log(items)
          return (
          <ARPrimitive key={index}
            title={items.title} 
            description={items.description}
            position= {items.position}
            scale={items.scale}
            >
          </ARPrimitive>
          );
        })                            
      }
    </>
  );
}

export default ARLocationBased
