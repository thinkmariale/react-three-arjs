// import './App.css';
// import { ARCanvas } from "@thinkmariale/react-three-arjs"
import {ARCanvas, ARLocationBased, ARPrimitive } from './ar'
import React from "react"

function Box() {
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

const arPrimitives = [ 
  {
    title:"test1",
    description:"description1",
    position:[39.34758798530564  + 0.001, -120.11029577905212, 0],
    scale:[.4,.4,.4]
  },
  {
    title:"test2",
    description:"description2",
    position:[39.34758798530564 - 0.001, -120.11029577905212, 0],
    scale:[1,1,1]
  }
]
function App() {
 

  return (
    <div className="App">
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


// import './App.css';
// import ThreexComp from './ThreexComp';

// function App() {

//   return (

//     <ThreexComp />

//   );
  
//   }
// export default App;