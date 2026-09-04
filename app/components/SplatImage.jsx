"use client";

import { useEffect, useRef } from "react";
import * as GaussianSplats3D from "@mkkellogg/gaussian-splats-3d";

export default function SplatImage({
  src
}) {

  const container = useRef(null);

  useEffect(() => {

    if (!container.current) return;


    const viewer =
      new GaussianSplats3D.Viewer({

        cameraUp:
          [0, -1, -0.6],

        initialCameraPosition:
          [0, 0, 3],

        initialCameraLookAt:
          [0,0,0],

        rootElement:
          container.current,

        sharedMemoryForWorkers: false,
      });


    viewer.addSplatScene(src, {

      splatAlphaRemovalThreshold:
        5,

      showLoadingUI:
        false

    })
    .then(()=>{

      viewer.start();

    });


    return ()=>{

      viewer.dispose();

    };


  },[src]);


  return (

    <div
      ref={container}
      style={{
        width:"100%",
        height:"100%",
        position:"absolute",
        inset:0
      }}
    />

  );

}