/* eslint-disable import/named */

import { ArToolkitContext, ArToolkitSource } from "./three.js/src/index-threex"
import { LocationBased, DeviceOrientationControls } from "./three.js/src/location-based/index"

import { useFrame, useThree } from "@react-three/fiber"
import React, { createContext, useCallback, useEffect, useMemo } from "react"
import * as THREE from "three";

const ARContext = createContext({})
const videoDomElemSelector = "#arjs-video"

//export type XRManagerEventType = 'sessionstart' | 'sessionend'
// export interface XRManagerEvent {
//   type: XRManagerEventType
//   target: XRSession
// }

const AR = React.memo(function AR({
  trackingQR = false,
  locationBased = true,
  children,
  sourceType,
  patternRatio,
  matrixCodeType,
  detectionMode,
  cameraParametersUrl,
  onCameraStreamReady,
  onCameraStreamError,
}) {
  const { scene, gl, camera } = useThree()

  const arContext = useMemo(() => {
    
    const arToolkitContext = new ArToolkitContext({
      cameraParametersUrl,
      detectionMode,
      patternRatio,
      matrixCodeType,
    })
    const arToolkitSource = new ArToolkitSource({ sourceType })
    //{ gpsMinAccuracy: 30 }
  
    const arLocationControl = (locationBased) ? new LocationBased(scene, camera) : null;
    const arOrientationControl = (locationBased) ? new DeviceOrientationControls(camera) : null;

    return { arToolkitContext, arToolkitSource, arLocationControl, arOrientationControl}
  }, [patternRatio, matrixCodeType, cameraParametersUrl, detectionMode, sourceType, locationBased, camera, scene])

  const onResize = useCallback(() => {
    const { arToolkitContext, arToolkitSource } = arContext

    arToolkitSource.onResizeElement();
    if(locationBased) {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      return;
    }
    
    //arToolkitSource.copyElementSizeTo(gl.domElement)

    if (arToolkitContext && arToolkitContext.arController !== null) {
      arToolkitSource.copyElementSizeTo(arToolkitContext.arController.canvas)
      camera.projectionMatrix.copy(arToolkitContext.getProjectionMatrix())
    }
   
  
  }, [gl, arContext, camera])

  const onUnmount = useCallback(() => {
    window.removeEventListener("resize", onResize)

    if(arContext.arToolkitContext) {
      arContext.arToolkitContext.arController.dispose()
      if (arContext.arToolkitContext.arController.cameraParam) {
        arContext.arToolkitContext.arController.cameraParam.dispose()
      }
    }

    delete arContext.arToolkitContext
    delete arContext.arToolkitSource
    delete arContext.arLocationControl

    const video = document.querySelector(videoDomElemSelector)
    if (video) {
      video.srcObject.getTracks().map(track => track.stop())
      video.remove()
    }
  }, [onResize, arContext])

  useEffect(() => {
    console.log(arContext)
   
    arContext.arToolkitSource.init(() => {
      const video = document.querySelector(videoDomElemSelector)
      video.style.position = "fixed"

      video.onloadedmetadata = () => {
        console.log("actual source dimensions", video.videoWidth, video.videoHeight)

        if (video.videoWidth > video.videoHeight) {
          arContext.arToolkitContext.arController.orientation = "landscape"
          arContext.arToolkitContext.arController.options.orientation = "landscape"
        } else {
          arContext.arToolkitContext.arController.orientation = "portrait"
          arContext.arToolkitContext.arController.options.orientation = "portrait"
        }

        if (onCameraStreamReady) {
          onCameraStreamReady()
        }
        onResize()
      }
    }, onCameraStreamError)

    arContext.arToolkitContext.init(() =>
      camera.projectionMatrix.copy(arContext.arToolkitContext.getProjectionMatrix()),
    )
    
    window.addEventListener("resize", onResize)

    return onUnmount
  }, [arContext, camera, onCameraStreamReady, onCameraStreamError, onResize, onUnmount])

  useFrame(() => {
    if(locationBased){
      if(arContext.arOrientationControl) {
        arContext.arOrientationControl.update();
      }
    }
    if (!trackingQR) {
      return
    }
    if (arContext.arToolkitSource && arContext.arToolkitSource.ready !== false) {
      arContext.arToolkitContext.update(arContext.arToolkitSource.domElement)
    }
  })

  const value = useMemo(() => ({ arToolkitContext: arContext.arToolkitContext, arToolkitSource: arContext.arToolkitSource, arLocationControl: arContext.arLocationControl }), [arContext])

  return <ARContext.Provider value={value}>{children}</ARContext.Provider>
})

const useAR = () => {
  const arValue = React.useContext(ARContext)
  //console.log('arValue,',arValue)
  return React.useMemo(() => ({ ...arValue }), [arValue])
}

export { AR, useAR }