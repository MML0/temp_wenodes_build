"use client";

import {
  Canvas,
  useFrame,
  useThree,
} from "@react-three/fiber";

import {
  useEffect,
  useMemo,
  useRef,
} from "react";

import * as THREE from "three";

/* =========================================================
   SETTINGS
========================================================= */

const COUNT = 22000;

/*
  The original was too wide on mobile.

  Reduced spacing gives us a much more compact
  4 0 4 while the responsive scale below guarantees
  the complete word fits inside the viewport.
*/

const LETTER_WIDTH = 2.45;
const LETTER_HEIGHT = 4.6;
const LETTER_SPACING = 1.0;


/* =========================================================
   TIMING
========================================================= */

const TIMING = {
  INITIAL_SCATTER: 4.0,

  FORM: 6.0,

  HOLD: 10.0,

  SCATTER: 6.0,

  REFORM: 6.0,

  FINAL_HOLD: 12.0,
};


/* =========================================================
   LETTER MATRICES
========================================================= */

const LETTERS = {
  "4": [
    [0, 0, 0, 0, 1, 1, 0, 0],
    [0, 0, 0, 0, 1, 1, 0, 0],
    [0, 0, 0, 1, 0, 1, 0, 0],
    [0, 0, 1, 0, 0, 1, 0, 0],
    [0, 1, 0, 0, 0, 1, 0, 0],
    [1, 1, 1, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 0, 1, 0, 0],
    [0, 0, 0, 0, 0, 1, 0, 0],
    [0, 0, 0, 0, 0, 1, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
  ],

  "0": [
    [0, 1, 1, 1, 1, 1, 0, 0],
    [1, 1, 0, 0, 0, 1, 1, 0],
    [1, 1, 0, 0, 0, 1, 1, 0],
    [1, 1, 0, 0, 0, 1, 1, 0],
    [1, 1, 0, 0, 0, 1, 1, 0],
    [1, 1, 0, 0, 0, 1, 1, 0],
    [1, 1, 0, 0, 0, 1, 1, 0],
    [1, 1, 0, 0, 0, 1, 1, 0],
    [1, 1, 0, 0, 0, 1, 1, 0],
    [0, 1, 1, 1, 1, 1, 0, 0],
  ],
};


/* =========================================================
   HELPERS
========================================================= */

function random(min, max) {
  return min + Math.random() * (max - min);
}

function clamp01(value) {
  return Math.max(
    0,
    Math.min(1, value)
  );
}

function easeInOut(value) {
  value = clamp01(value);

  return value < 0.5
    ? 4 * value * value * value
    : 1 -
        Math.pow(
          -2 * value + 2,
          3
        ) /
          2;
}

function smoothstep(value) {
  value = clamp01(value);

  return (
    value *
    value *
    (3 - 2 * value)
  );
}


/* =========================================================
   CREATE SINGLE LETTER TARGET
========================================================= */

function createLetterTarget(letter) {
  const matrix = LETTERS[letter];

  const rows = matrix.length;
  const cols = matrix[0].length;

  const cells = [];

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      if (matrix[y][x] === 1) {
        cells.push({
          x,
          y,
        });
      }
    }
  }

  const result =
    new Float32Array(
      COUNT * 3
    );

  const cellWidth =
    LETTER_WIDTH / cols;

  const cellHeight =
    LETTER_HEIGHT / rows;

  for (
    let i = 0;
    i < COUNT;
    i++
  ) {
    const i3 = i * 3;

    const cell =
      cells[
        Math.floor(
          Math.random() *
            cells.length
        )
      ];

    let x =
      -LETTER_WIDTH / 2 +
      cell.x *
        cellWidth +
      cellWidth / 2;

    let y =
      LETTER_HEIGHT / 2 -
      cell.y *
        cellHeight -
      cellHeight / 2;

    /*
      Individual particle width
      variation.
    */

    x *= random(
      0.82,
      1.18
    );

    /*
      Scatter particles inside
      each pixel cell.
    */

    x += random(
      -cellWidth * 0.55,
      cellWidth * 0.55
    );

    y += random(
      -cellHeight * 0.48,
      cellHeight * 0.48
    );

    /*
      Real Z depth.

      This is what gives the
      404 a 3D particle character.
    */

    const z =
      random(
        1.0,
        2.9
      );

    result[i3] = x;
    result[i3 + 1] = y;
    result[i3 + 2] = z;
  }

  return result;
}


/* =========================================================
   CREATE 404 TARGET
========================================================= */

function create404Target(
  letterTargets
) {
  const result =
    new Float32Array(
      COUNT * 3
    );

  const word = [
    "4",
    "0",
    "4",
  ];

  const particlesPerLetter =
    Math.floor(
      COUNT / 3
    );

  const totalWidth =
    LETTER_WIDTH * 3 +
    LETTER_SPACING * 2;

  const startX =
    -totalWidth / 2 +
    LETTER_WIDTH / 2;

  for (
    let i = 0;
    i < COUNT;
    i++
  ) {
    const i3 = i * 3;

    let letterIndex =
      Math.floor(
        i /
          particlesPerLetter
      );

    if (
      letterIndex >= 3
    ) {
      letterIndex = 2;
    }

    const letter =
      word[letterIndex];

    const target =
      letterTargets[letter];

    const localIndex =
      i -
      letterIndex *
        particlesPerLetter;

    const sourceIndex =
      (localIndex %
        COUNT) *
      3;

    result[i3] =
      target[sourceIndex] +
      startX +
      letterIndex *
        (
          LETTER_WIDTH +
          LETTER_SPACING
        );

    result[i3 + 1] =
      target[
        sourceIndex + 1
      ];

    result[i3 + 2] =
      target[
        sourceIndex + 2
      ];
  }

  return result;
}


/* =========================================================
   PARTICLE SYSTEM
========================================================= */

function ParticleSystem() {
  const points =
    useRef(null);

  const { viewport } =
    useThree();

  const mouse =
    useRef({
      x: 0,
      y: 0,
    });

  const smoothMouse =
    useRef({
      x: 0,
      y: 0,
    });

  /*
    Particle data.
  */

  const data = useMemo(() => {
    const positions =
      new Float32Array(
        COUNT * 3
      );

    const target404 =
      new Float32Array(
        COUNT * 3
      );

    const scatter =
      new Float32Array(
        COUNT * 3
      );

    const personality =
      new Float32Array(
        COUNT
      );

    const noise =
      new Float32Array(
        COUNT * 3
      );

    const letterTargets = {
      "4":
        createLetterTarget(
          "4"
        ),

      "0":
        createLetterTarget(
          "0"
        ),
    };

    const target =
      create404Target(
        letterTargets
      );

    /*
      Initial full-page scatter.
    */

    for (
      let i = 0;
      i < COUNT;
      i++
    ) {
      const i3 = i * 3;

      positions[i3] =
        random(
          -8.5,
          8.5
        );

      positions[i3 + 1] =
        random(
          -5.5,
          5.5
        );

      positions[i3 + 2] =
        random(
          -7,
          7
        );

      /*
        Store 404 target.
      */

      target404[i3] =
        target[i3];

      target404[i3 + 1] =
        target[i3 + 1];

      target404[i3 + 2] =
        target[i3 + 2];

      /*
        Individual XYZ scatter.
      */

      scatter[i3] =
        random(-1, 1);

      scatter[i3 + 1] =
        random(-1, 1);

      scatter[i3 + 2] =
        random(-1, 1);

      /*
        Particle personality.
      */

      personality[i] =
        Math.random();

      /*
        Organic noise.
      */

      noise[i3] =
        random(-1, 1);

      noise[i3 + 1] =
        random(-1, 1);

      noise[i3 + 2] =
        random(-1, 1);
    }

    return {
      positions,
      target404,
      scatter,
      personality,
      noise,
    };
  }, []);


  /* =======================================================
     ANIMATION STATE
  ======================================================= */

  const animation =
    useRef({
      phase:
        "INITIAL_SCATTER",

      phaseStart: 0,

      started: false,
    });


  /* =======================================================
     MOUSE
  ======================================================= */

  useEffect(() => {
    const move = (
      event
    ) => {
      mouse.current.x =
        (
          event.clientX /
          window.innerWidth
        ) *
          2 -
        1;

      mouse.current.y =
        -(
          (
            event.clientY /
            window.innerHeight
          ) *
            2 -
          1
        );
    };

    window.addEventListener(
      "mousemove",
      move,
      {
        passive: true,
      }
    );

    return () => {
      window.removeEventListener(
        "mousemove",
        move
      );
    };
  }, []);


  /* =======================================================
     FRAME
  ======================================================= */

  useFrame((state) => {
    if (!points.current) {
      return;
    }

    const time =
      state.clock.elapsedTime;

    const positions =
      points.current
        .geometry
        .attributes
        .position
        .array;

    const {
      target404,
      scatter,
      personality,
      noise,
    } = data;

    const anim =
      animation.current;


    /* =====================================================
       START
    ===================================================== */

    if (!anim.started) {
      anim.started = true;

      anim.phaseStart =
        time;
    }


    const elapsed =
      time -
      anim.phaseStart;


    /* =====================================================
       RESPONSIVE 404 SCALE
    =====================================================

       This is the important mobile fix.

       We calculate how much horizontal
       world-space is available and scale
       ONLY the formed 404.

       The scatter remains full-screen.
    */

    const base404Width =
      LETTER_WIDTH * 3 +
      LETTER_SPACING * 2;

    /*
      More breathing room on
      very narrow screens.
    */

    const horizontalPadding =
      viewport.width < 5
        ? 0.55
        : 0.8;

    const max404Width =
      Math.max(
        1,
        viewport.width -
          horizontalPadding
      );

    /*
      Never enlarge the 404 above
      its original desktop size.

      On mobile it automatically
      becomes smaller.
    */

    const responsive404Scale =
      Math.min(
        1,
        max404Width /
          base404Width
      );


    /* =====================================================
       STATE MACHINE
    ===================================================== */

    if (
      anim.phase ===
      "INITIAL_SCATTER"
    ) {
      if (
        elapsed >
        TIMING.INITIAL_SCATTER
      ) {
        anim.phase =
          "FORM";

        anim.phaseStart =
          time;
      }
    }

    else if (
      anim.phase ===
      "FORM"
    ) {
      if (
        elapsed >
        TIMING.FORM
      ) {
        anim.phase =
          "HOLD";

        anim.phaseStart =
          time;
      }
    }

    else if (
      anim.phase ===
      "HOLD"
    ) {
      if (
        elapsed >
        TIMING.HOLD
      ) {
        anim.phase =
          "SCATTER";

        anim.phaseStart =
          time;
      }
    }

    else if (
      anim.phase ===
      "SCATTER"
    ) {
      if (
        elapsed >
        TIMING.SCATTER
      ) {
        anim.phase =
          "REFORM";

        anim.phaseStart =
          time;
      }
    }

    else if (
      anim.phase ===
      "REFORM"
    ) {
      if (
        elapsed >
        TIMING.REFORM
      ) {
        anim.phase =
          "FINAL_HOLD";

        anim.phaseStart =
          time;
      }
    }

    else if (
      anim.phase ===
      "FINAL_HOLD"
    ) {
      if (
        elapsed >
        TIMING.FINAL_HOLD
      ) {
        anim.phase =
          "SCATTER";

        anim.phaseStart =
          time;
      }
    }


    /* =====================================================
       SMOOTH MOUSE
    ===================================================== */

    smoothMouse.current.x +=
      (
        mouse.current.x -
        smoothMouse.current.x
      ) *
      0.15;

    smoothMouse.current.y +=
      (
        mouse.current.y -
        smoothMouse.current.y
      ) *
      0.15;


    const mouseX =
      smoothMouse.current.x *
      viewport.width *
      0.5;

    const mouseY =
      smoothMouse.current.y *
      viewport.height *
      0.5;


    /* =====================================================
       PARTICLES
    ===================================================== */

    for (
      let i = 0;
      i <
      positions.length;
      i += 3
    ) {
      const particle =
        i / 3;

      const personal =
        personality[particle];

      let targetX;
      let targetY;
      let targetZ;


      /* ===================================================
         INITIAL SCATTER
      =================================================== */

      if (
        anim.phase ===
        "INITIAL_SCATTER"
      ) {
        targetX =
          positions[i] +
          noise[i] *
            0.002;

        targetY =
          positions[i + 1] +
          noise[i + 1] *
            0.002;

        targetZ =
          positions[i + 2] +
          noise[i + 2] *
            0.002;
      }


      /* ===================================================
         FORM 404
      =================================================== */

      else if (
        anim.phase ===
        "FORM"
      ) {
        const progress =
          easeInOut(
            elapsed /
              TIMING.FORM
          );

        /*
          Every particle has a
          slightly different start time.
        */

        const delay =
          personal *
          0.45;

        const local =
          clamp01(
            (
              progress -
              delay
            ) /
            (1 - delay)
          );

        const localEase =
          smoothstep(local);

        const scatterAmount =
          Math.sin(
            localEase *
              Math.PI
          );


        /*
          IMPORTANT:

          Only the final 404 target
          receives responsive scaling.

          The scatter stays large.
        */

        const scaledTargetX =
          target404[i] *
          responsive404Scale;

        const scaledTargetY =
          target404[i + 1] *
          responsive404Scale;

        const scaledTargetZ =
          target404[i + 2] *
          responsive404Scale;


        targetX =
          THREE.MathUtils.lerp(
            scatter[i] * 8,
            scaledTargetX,
            localEase
          );

        targetY =
          THREE.MathUtils.lerp(
            scatter[i + 1] * 6,
            scaledTargetY,
            localEase
          );

        targetZ =
          THREE.MathUtils.lerp(
            scatter[i + 2] * 7,
            scaledTargetZ,
            localEase
          );


        /*
          Strongest disorder in the
          middle of the formation.
        */

        targetX +=
          noise[i] *
          scatterAmount *
          (
            0.4 +
            personal
          );

        targetY +=
          noise[i + 1] *
          scatterAmount *
          (
            0.3 +
            personal
          );

        targetZ +=
          noise[i + 2] *
          scatterAmount *
          (
            0.8 +
            personal
          );
      }


      /* ===================================================
         HOLD 404
      =================================================== */

      else if (
        anim.phase ===
          "HOLD" ||
        anim.phase ===
          "FINAL_HOLD"
      ) {
        targetX =
          target404[i] *
          responsive404Scale;

        targetY =
          target404[i + 1] *
          responsive404Scale;

        targetZ =
          target404[i + 2] *
          responsive404Scale;


        /*
          Almost invisible breathing.
        */

        targetX +=
          Math.sin(
            time * 0.25 +
            particle *
              0.01
          ) *
          0.018;

        targetY +=
          Math.cos(
            time * 0.21 +
            particle *
              0.012
          ) *
          0.018;
      }


      /* ===================================================
         SCATTER
      =================================================== */

      else {
        const progress =
          easeInOut(
            elapsed /
              TIMING.SCATTER
          );

        const amount =
          1 +
          progress *
            6.5;


        /*
          Start from the responsive
          formed 404, then scatter
          outward.
        */

        targetX =
          target404[i] *
            responsive404Scale +
          scatter[i] *
            amount;

        targetY =
          target404[i + 1] *
            responsive404Scale +
          scatter[i + 1] *
            amount;

        targetZ =
          target404[i + 2] *
            responsive404Scale +
          scatter[i + 2] *
            amount;


        /*
          Slow atmospheric movement.
        */

        targetX +=
          Math.sin(
            time * 0.12 +
            particle *
              0.015
          ) *
          0.35;

        targetY +=
          Math.cos(
            time * 0.10 +
            particle *
              0.013
          ) *
          0.35;

        targetZ +=
          Math.sin(
            time * 0.09 +
            particle *
              0.011
          ) *
          0.5;
      }


      /* ===================================================
         MOUSE REPULSION
      =================================================== */

      const px =
        positions[i];

      const py =
        positions[i + 1];

      const dx =
        px -
        mouseX;

      const dy =
        py -
        mouseY;

      const distance =
        Math.sqrt(
          dx * dx +
          dy * dy
        );

      const radius =
        3.2;


      if (
        distance <
          radius &&
        distance >
          0.001
      ) {
        const influence =
          Math.pow(
            1 -
              distance /
                radius,
            2.4
          );

        const force =
          influence *
          1.15;


        targetX +=
          (dx / distance) *
          force;

        targetY +=
          (dy / distance) *
          force;


        /*
          Z displacement.
        */

        targetZ +=
          influence *
          0.7;


        /*
          Small vortex.
        */

        const swirl =
          Math.sin(
            time *
              1.0 +
            particle *
              0.01
          ) *
          influence *
          0.11;


        targetX +=
          (-dy / distance) *
          swirl;

        targetY +=
          (dx / distance) *
          swirl;
      }


      /* ===================================================
         ORGANIC PARTICLE MOTION
      =================================================== */

      const float =
        0.015 +
        personal *
          0.035;


      targetX +=
        Math.sin(
          time * 0.18 +
          particle *
            0.014
        ) *
        float;

      targetY +=
        Math.cos(
          time * 0.16 +
          particle *
            0.011
        ) *
        float;

      targetZ +=
        Math.sin(
          time * 0.13 +
          particle *
            0.009
        ) *
        float;


      /* ===================================================
         SPRING
      =================================================== */

      let spring =
        0.018;

      if (
        anim.phase ===
        "FORM"
      ) {
        spring =
          0.024;
      }

      if (
        anim.phase ===
        "HOLD"
      ) {
        spring =
          0.014;
      }

      if (
        anim.phase ===
        "SCATTER"
      ) {
        spring =
          0.020;
      }


      positions[i] +=
        (
          targetX -
          positions[i]
        ) *
        spring;

      positions[i + 1] +=
        (
          targetY -
          positions[i + 1]
        ) *
        spring;

      positions[i + 2] +=
        (
          targetZ -
          positions[i + 2]
        ) *
        0.014;
    }


    /* =====================================================
       UPDATE GPU
    ===================================================== */

    points.current
      .geometry
      .attributes
      .position
      .needsUpdate = true;


    /* =====================================================
       VERY SLOW GLOBAL MOTION
    ===================================================== */

    points.current.rotation.z =
      Math.sin(
        time * 0.035
      ) *
      0.018;

    points.current.rotation.x =
      Math.sin(
        time * 0.022
      ) *
      0.008;

    points.current.rotation.y =
      Math.cos(
        time * 0.019
      ) *
      0.012;
  });


  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <points
      ref={points}
    >
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={COUNT}
          array={data.positions}
          itemSize={3}
        />
      </bufferGeometry>

      <pointsMaterial
        size={0.021}
        sizeAttenuation
        transparent
        opacity={0.64}
        depthWrite={false}
        blending={
          THREE.AdditiveBlending
        }
        color="#e8e6e3"
      />
    </points>
  );
}


/* =========================================================
   PUBLIC COMPONENT
========================================================= */

export default function Particle404() {
  return (
    <Canvas
      camera={{
        position: [
          0,
          0,
          12,
        ],

        fov: 45,
      }}
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100svh",
        pointerEvents: "auto",
        touchAction: "none",
      }}
      dpr={[
        1,
        1.5,
      ]}

      gl={{
        antialias: true,
        alpha: true,
      }}
    >
      <ParticleSystem />
    </Canvas>
  );
}