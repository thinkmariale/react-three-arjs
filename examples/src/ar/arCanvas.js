/* eslint-disable indent */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-pascal-case */

import React, {useState} from "react"
import { Canvas, events } from "@react-three/fiber"

import { AR } from "./ar"

const eventManagerFactory = state => ({
  ...events(state),

  compute(event, state) {
    state.pointer.set(
      (event.clientX / state.size.width) * 2 - 1,
      -(event.clientY / state.size.height) * 2 + 1,
    )
    state.raycaster.setFromCamera(state.pointer, state.camera)
  },
})

const ARCanvas = ({
  arEnabled = true,
  locationBased = true,
  trackingQR = false,
  children,
  patternRatio = 0.5,
  detectionMode = "mono_and_matrix",
  cameraParametersUrl = "data/camera_para.dat",
  matrixCodeType = "3x3",
  sourceType = "webcam",
  onCameraStreamReady,
  onCameraStreamError,
  ...props
}) => {

  const [initPermissions, setInitPermissions] = useState(false)

  const InitPermissions = () => {
    
    if(locationBased) {
      if (
        window.DeviceOrientationEvent !== undefined &&
        typeof window.DeviceOrientationEvent.requestPermission === "function"
      ) {
        window.DeviceOrientationEvent.requestPermission().then((response) => {
          setInitPermissions(true);
          console.log("here request response", response)
        })
        .catch(function (error) {
          console.error(
            "THREE.DeviceOrientationControls: Unable to use DeviceOrientation API:",
            error
          );
        });
      
      } 
      setInitPermissions(true);
    } else {
      setInitPermissions(true);
    }
  }
  return (
    <>
    {!initPermissions ? 
      <button onClick={InitPermissions}>Init </button> :
    (
      <Canvas
        events={eventManagerFactory} 
        camera={arEnabled ? { position: [0, 0, 0], } : props.camera}
        {...props}>
        {arEnabled ? (
          <AR
            trackingQR={trackingQR}
            locationBased = {locationBased}
            patternRatio={patternRatio}
            matrixCodeType={matrixCodeType}
            detectionMode={detectionMode}
            sourceType={sourceType}
            cameraParametersUrl={cameraParametersUrl}
            onCameraStreamReady={onCameraStreamReady}
            onCameraStreamError={onCameraStreamError}>
            {children}
          </AR>
        ) : (
          children
        )}
      </Canvas>
    )}
    </>
  );
}
export default ARCanvas
