// "use client";

// import { Canvas, useFrame, useThree } from "@react-three/fiber";
// import { useMemo, useRef } from "react";
// import * as THREE from "three";

// function ParticleField() {
//   const points = useRef();
//   const { pointer, viewport } = useThree();

//   const { positions, base } = useMemo(() => {
//     const count = 18000;
//     const positions = new Float32Array(count * 3);
//     const base = new Float32Array(count * 3);

//     for (let i = 0; i < count; i++) {
//       const i3 = i * 3;
//       const x = (Math.random() - 0.5) * 14;
//       const y = (Math.random() - 0.5) * 8.5;
//       const z = (Math.random() - 0.5) * 4;

//       positions[i3] = base[i3] = x;
//       positions[i3 + 1] = base[i3 + 1] = y;
//       positions[i3 + 2] = base[i3 + 2] = z;
//     }

//     return { positions, base };
//   }, []);

//   useFrame((state) => {
//     const attr = points.current.geometry.attributes.position;
//     const a = attr.array;
//     const t = state.clock.elapsedTime;

//     const mx = pointer.x * viewport.width * 0.5;
//     const my = pointer.y * viewport.height * 0.5;

//     for (let i = 0; i < a.length; i += 3) {
//       const bx = base[i];
//       const by = base[i + 1];
//       const bz = base[i + 2];

//       const dx = bx - mx;
//       const dy = by - my;
//       const d2 = dx * dx + dy * dy;
      
//       // Much wider, more visible mouse radius
//       const influence = Math.exp(-d2 * 0.12);
//       const strongInfluence = Math.exp(-d2 * 0.35);

//       const wave = Math.sin(bx * 1.25 + t * 0.45) * 0.065;
//       const drift = Math.sin(by * 1.8 + t * 0.35) * 0.045;

//       // Stronger repulsion + lift + subtle swirl
//       const repelX = dx * influence * 0.9;
//       const repelY = dy * influence * 0.9;
//       const lift = influence * 0.4;
//       const swirl = strongInfluence * Math.sin(t * 2 + d2) * 0.12;

//       a[i] += ((bx + repelX + drift + swirl) - a[i]) * 0.05;
//       a[i + 1] += ((by + repelY + wave + lift) - a[i + 1]) * 0.05;
//       a[i + 2] += ((bz + influence * 1.4) - a[i + 2]) * 0.04;
//     }

//     attr.needsUpdate = true;
//     points.current.rotation.z = Math.sin(t * 0.08) * 0.018;
//   });

//   return (
//     <points ref={points}>
//       <bufferGeometry>
//         <bufferAttribute
//           attach="attributes-position"
//           count={positions.length / 3}
//           array={positions}
//           itemSize={3}
//         />
//       </bufferGeometry>
//       <pointsMaterial
//         size={0.02}
//         sizeAttenuation
//         transparent
//         opacity={0.78}
//         depthWrite={false}
//         blending={THREE.AdditiveBlending}
//         color="#f4f4f0"
//       />
//     </points>
//   );
// }

// function CursorGlow() {
//   const mesh = useRef();
//   const { pointer, viewport } = useThree();
  
//   useFrame(() => {
//     const mx = pointer.x * viewport.width * 0.5;
//     const my = pointer.y * viewport.height * 0.5;
//     mesh.current.position.x += (mx - mesh.current.position.x) * 0.08;
//     mesh.current.position.y += (my - mesh.current.position.y) * 0.08;
//   });
  
//   return (
//     <mesh ref={mesh} position={[0,0,-1]}>
//       <planeGeometry args={[3, 3]} />
//       <meshBasicMaterial 
//         color="#f4f4f0" 
//         transparent 
//         opacity={0.025} 
//         blending={THREE.AdditiveBlending}
//         depthWrite={false}
//       />
//     </mesh>
//   );
// }

// export default function ParticleScene() {
//   return (
//     <Canvas
//       camera={{ position: [0, 0, 6], fov: 55 }}
//       dpr={[1, 1.7]}
//       gl={{ antialias: true, alpha: true }}
//     >
//       <ParticleField />
//       <CursorGlow />
//     </Canvas>
//   );
// }


"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

/* =========================================================
   SETTINGS
========================================================= */

const COUNT = 18000;

const LETTERS_ORDER = [
  "W",
  "E",
  "N",
  "O",
  "D",
  "E",
  "S",
];

/*
  Mostly W,
  but full WENODES appears often.
*/
const W_CHANCE = 0.45;
const FULL_WORD_CHANCE = 0.38;

/*
  Slow.
*/
const HOLD_MIN = 5;
const HOLD_MAX = 11;

const TRANSITION_MIN = 3;
const TRANSITION_MAX = 5;

/*
  Mouse.
*/
const MOUSE_RADIUS = 2.65;
const MOUSE_FORCE = 2.15;


/* =========================================================
   PIXEL LETTERS
========================================================= */

const LETTERS = {
  W: [
    [1,0,0,0,1,0,0,0,1],
    [1,0,0,0,1,0,0,0,1],
    [1,0,0,0,1,0,0,0,1],
    [1,0,0,0,1,0,0,0,1],
    [0,1,0,1,0,1,0,1,0],
    [0,1,0,1,0,1,0,1,0],
    [0,0,1,0,0,0,1,0,0],
    [0,0,1,0,0,0,1,0,0],
  ],

  E: [
    [1,1,1,1,1,1,1,0,0],
    [1,0,0,0,0,0,0,0,0],
    [1,0,0,0,0,0,0,0,0],
    [1,1,1,1,1,1,0,0,0],
    [1,0,0,0,0,0,0,0,0],
    [1,0,0,0,0,0,0,0,0],
    [1,1,1,1,1,1,1,0,0],
    [0,0,0,0,0,0,0,0,0],
  ],

  N: [
    [1,0,0,0,0,0,0,0,1],
    [1,1,0,0,0,0,0,0,1],
    [1,0,1,0,0,0,0,0,1],
    [1,0,0,1,0,0,0,0,1],
    [1,0,0,0,1,0,0,0,1],
    [1,0,0,0,0,1,0,0,1],
    [1,0,0,0,0,0,1,0,1],
    [1,0,0,0,0,0,0,1,1],
  ],

  O: [
    [0,1,1,1,1,1,1,1,0],
    [1,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,1],
    [0,1,1,1,1,1,1,1,0],
    [0,0,0,0,0,0,0,0,0],
  ],

  D: [
    [1,1,1,1,1,1,1,0,0],
    [1,0,0,0,0,0,0,1,0],
    [1,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,1,0],
    [1,1,1,1,1,1,1,0,0],
    [0,0,0,0,0,0,0,0,0],
  ],

  S: [
    [0,1,1,1,1,1,1,1,0],
    [1,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0],
    [0,1,1,1,1,1,1,0,0],
    [0,0,0,0,0,0,0,1,1],
    [1,0,0,0,0,0,0,0,1],
    [0,1,1,1,1,1,1,1,0],
    [0,0,0,0,0,0,0,0,0],
  ],
};


/* =========================================================
   RANDOM
========================================================= */

function random(min, max) {
  return min + Math.random() * (max - min);
}


/* =========================================================
   CREATE LETTER PARTICLES

   IMPORTANT:

   Every particle gets a slightly different position.

   This prevents the letters from looking like
   perfectly locked pixel fonts.
========================================================= */

function createLetter(letter, count) {
  const matrix = LETTERS[letter];

  const rows = matrix.length;
  const cols = matrix[0].length;

  const cells = [];

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      if (matrix[y][x]) {
        cells.push({ x, y });
      }
    }
  }

  const result = new Float32Array(
    count * 3
  );

  const width = 8.0;
  const height = 4.6;

  const cellW = width / cols;
  const cellH = height / rows;

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;

    const cell =
      cells[
        Math.floor(
          Math.random() * cells.length
        )
      ];

    const centerX =
      -width / 2 +
      cell.x * cellW +
      cellW / 2;

    const centerY =
      height / 2 -
      cell.y * cellH -
      cellH / 2;

    /*
      RANDOM DISTRIBUTION.

      This is important.

      Instead of every particle sitting exactly
      on a pixel, they form a soft particle cloud
      around the imaginary pixel.
    */

    const spreadX =
      cellW * random(0.15, 0.95);

    const spreadY =
      cellH * random(0.15, 0.95);

    result[i3] =
      centerX +
      random(-spreadX, spreadX);

    result[i3 + 1] =
      centerY +
      random(-spreadY, spreadY);

    result[i3 + 2] =
      random(-0.22, 0.22);
  }

  return result;
}


/* =========================================================
   PARTICLE FIELD
========================================================= */

function ParticleField() {
  const points = useRef();

  const { pointer, viewport } =
    useThree();


  const data = useMemo(() => {
    /*
      All letter targets.
    */

    const targets = {};

    for (const letter of LETTERS_ORDER) {
      targets[letter] =
        createLetter(
          letter,
          COUNT
        );
    }


    /*
      Initial position.

      Start from W.
    */

    const positions =
      new Float32Array(
        COUNT * 3
      );

    positions.set(
      targets.W
    );


    /*
      Every particle gets a unique
      random personality.

      This controls how much it moves
      during transitions.
    */

    const personality =
      new Float32Array(COUNT);

    const noise =
      new Float32Array(
        COUNT * 3
      );

    for (let i = 0; i < COUNT; i++) {
      personality[i] =
        Math.random();

      const i3 = i * 3;

      noise[i3] =
        random(-1, 1);

      noise[i3 + 1] =
        random(-1, 1);

      noise[i3 + 2] =
        random(-1, 1);
    }


    return {
      positions,
      targets,
      personality,
      noise,
    };
  }, []);


  const state = useRef({
    sequence: ["W"],

    index: 0,

    phase: "hold",

    started: false,

    phaseStart: 0,

    holdDuration: 7,

    transitionDuration: 4,
  });


  /* =======================================================
     CREATE RANDOM SEQUENCE
  ======================================================= */

  function createSequence() {
    const r = Math.random();

    /*
      MOST COMMON:

      W → WENODES → W
    */

    if (r < FULL_WORD_CHANCE) {
      return [
        "W",
        ...LETTERS_ORDER.slice(1),
        "W",
      ];
    }


    /*
      Sometimes only 2–4 letters.
    */

    if (r < 0.75) {
      const length =
        Math.floor(
          random(2, 5)
        );

      const start =
        Math.floor(
          random(
            0,
            LETTERS_ORDER.length -
              length
          )
        );

      return [
        "W",
        ...LETTERS_ORDER.slice(
          start,
          start + length
        ),
        "W",
      ];
    }


    /*
      Sometimes random individual letters.
    */

    const randomLength =
      Math.floor(
        random(2, 4)
      );

    const result = ["W"];

    for (
      let i = 0;
      i < randomLength;
      i++
    ) {
      result.push(
        LETTERS_ORDER[
          Math.floor(
            Math.random() *
              LETTERS_ORDER.length
          )
        ]
      );
    }

    result.push("W");

    return result;
  }


  /* =======================================================
     FRAME
  ======================================================= */

  useFrame((stateThree) => {
    if (!points.current) return;

    const attr =
      points.current.geometry
        .attributes.position;

    const a = attr.array;

    const time =
      stateThree.clock.elapsedTime;


    /* -----------------------------------------------------
       INITIALIZATION
    ----------------------------------------------------- */

    if (!state.current.started) {
      state.current.started = true;

      state.current.sequence =
        createSequence();

      state.current.phaseStart =
        time;

      state.current.holdDuration =
        random(
          HOLD_MIN,
          HOLD_MAX
        );

      state.current.transitionDuration =
        random(
          TRANSITION_MIN,
          TRANSITION_MAX
        );
    }


    /* -----------------------------------------------------
       TIME
    ----------------------------------------------------- */

    const elapsed =
      time -
      state.current.phaseStart;


    /* -----------------------------------------------------
       HOLD → TRANSITION
    ----------------------------------------------------- */

    if (
      state.current.phase === "hold" &&
      elapsed >
        state.current.holdDuration
    ) {
      state.current.phase =
        "transition";

      state.current.phaseStart =
        time;

      state.current.transitionDuration =
        random(
          TRANSITION_MIN,
          TRANSITION_MAX
        );
    }


    /* -----------------------------------------------------
       TRANSITION → NEXT
    ----------------------------------------------------- */

    if (
      state.current.phase ===
        "transition" &&
      elapsed >
        state.current.transitionDuration
    ) {
      state.current.index++;


      /*
        Finished sequence.

        Start a new random behavior.
      */

      if (
        state.current.index >=
        state.current.sequence.length - 1
      ) {
        state.current.sequence =
          createSequence();

        state.current.index = 0;
      }


      state.current.phase =
        "hold";

      state.current.phaseStart =
        time;

      state.current.holdDuration =
        random(
          HOLD_MIN,
          HOLD_MAX
        );
    }


    /* -----------------------------------------------------
       CURRENT LETTER
    ----------------------------------------------------- */

    const currentLetter =
      state.current.sequence[
        state.current.index
      ];


    const nextLetter =
      state.current.sequence[
        state.current.index + 1
      ] || currentLetter;


    const currentTarget =
      data.targets[currentLetter];

    const nextTarget =
      data.targets[nextLetter];


    /* -----------------------------------------------------
       TRANSITION PROGRESS
    ----------------------------------------------------- */

    let progress = 0;

    if (
      state.current.phase ===
      "transition"
    ) {
      progress =
        Math.min(
          elapsed /
            state.current.transitionDuration,
          1
        );
    }


    /*
      Smooth slow curve.
    */

    const eased =
      progress *
      progress *
      (3 - 2 * progress);


    /* =====================================================
       MOUSE
    ===================================================== */

    const mouseX =
      pointer.x *
      viewport.width *
      0.5;

    const mouseY =
      pointer.y *
      viewport.height *
      0.5;


    /* =====================================================
       PARTICLES
    ===================================================== */

    for (
      let i = 0;
      i < a.length;
      i += 3
    ) {
      const particle =
        i / 3;


      /* ---------------------------------------------------
         TARGET
      --------------------------------------------------- */

      let tx;
      let ty;
      let tz;


      if (
        state.current.phase ===
        "hold"
      ) {
        /*
          Stable letter.

          But still slightly randomized.
        */

        tx =
          currentTarget[i];

        ty =
          currentTarget[i + 1];

        tz =
          currentTarget[i + 2];
      }

      else {
        /*
          RANDOMIZED PARTICLE TRANSITION.

          Not every particle travels.

          Some barely move.
          Some scatter a lot.
        */

        const personality =
          data.personality[
            particle
          ];


        /*
          Only ~60% of particles
          participate strongly.
        */

        const activity =
          personality >
          0.38
            ? 1
            : personality * 0.25;


        /*
          Each particle gets a
          different transition timing.
        */

        const delay =
          personality *
          0.32;


        const local =
          THREE.MathUtils.clamp(
            (
              progress -
              delay
            ) /
              (1 - delay),
            0,
            1
          );


        const localEase =
          local *
          local *
          (3 - 2 * local);


        /*
          Scatter is strongest around
          the middle.
        */

        const scatter =
          Math.sin(
            localEase *
              Math.PI
          ) *
          activity;


        /*
          RANDOM direction.

          Not a perfect radial explosion.
        */

        const nx =
          data.noise[i];

        const ny =
          data.noise[i + 1];

        const nz =
          data.noise[i + 2];


        /*
          Different particles have
          different scatter sizes.
        */

        const amount =
          random(
            0.15,
            0.85
          );


        tx =
          THREE.MathUtils.lerp(
            currentTarget[i],
            nextTarget[i],
            localEase
          ) +
          nx *
          amount *
          scatter;


        ty =
          THREE.MathUtils.lerp(
            currentTarget[i + 1],
            nextTarget[i + 1],
            localEase
          ) +
          ny *
          amount *
          scatter;


        tz =
          THREE.MathUtils.lerp(
            currentTarget[i + 2],
            nextTarget[i + 2],
            localEase
          ) +
          nz *
          amount *
          scatter;
      }


      /* =================================================
         MOUSE REPULSION
      ================================================= */

      const px = a[i];
      const py = a[i + 1];


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


      if (
        distance <
          MOUSE_RADIUS &&
        distance >
          0.001
      ) {
        /*
          1 = cursor center
          0 = edge
        */

        const normalized =
          1 -
          distance /
            MOUSE_RADIUS;


        /*
          Very soft field.
        */

        const influence =
          normalized *
          normalized *
          normalized;


        /*
          Push away.

          Add a little sideways
          turbulence so it doesn't
          look mathematically perfect.
        */

        const angle =
          Math.atan2(
            dy,
            dx
          );


        const swirl =
          Math.sin(
            time * 1.3 +
              particle *
                0.17
          ) *
          influence *
          0.12;


        const force =
          influence *
          MOUSE_FORCE;


        tx +=
          Math.cos(angle) *
          force;


        ty +=
          Math.sin(angle) *
          force;


        /*
          Tiny sideways movement.
        */

        tx +=
          -Math.sin(angle) *
          swirl;


        ty +=
          Math.cos(angle) *
          swirl;


        /*
          Slight depth response.
        */

        tz +=
          influence *
          0.12;
      }


      /* =================================================
         VERY SLOW SPRING
      ================================================= */

      const spring =
        state.current.phase ===
        "hold"
          ? 0.022
          : 0.016;


      a[i] +=
        (tx - a[i]) *
        spring;


      a[i + 1] +=
        (ty - a[i + 1]) *
        spring;


      a[i + 2] +=
        (tz - a[i + 2]) *
        0.012;
    }


    attr.needsUpdate = true;
  });


  /* =======================================================
     PARTICLE RENDER
  ======================================================= */

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={
            data.positions.length /
            3
          }
          array={data.positions}
          itemSize={3}
        />
      </bufferGeometry>


      <pointsMaterial
        size={0.014}
        sizeAttenuation
        transparent
        opacity={0.38}
        depthWrite={false}
        blending={
          THREE.AdditiveBlending
        }
        color="#f4f4f0"
      />
    </points>
  );
}


/* =========================================================
   CURSOR GLOW
========================================================= */

function CursorGlow() {
  const mesh = useRef();

  const {
    pointer,
    viewport,
  } = useThree();


  useFrame(() => {
    if (!mesh.current) return;

    const x =
      pointer.x *
      viewport.width *
      0.5;

    const y =
      pointer.y *
      viewport.height *
      0.5;


    mesh.current.position.x +=
      (x -
        mesh.current.position.x) *
      0.025;


    mesh.current.position.y +=
      (y -
        mesh.current.position.y) *
      0.025;
  });


  return (
    <mesh
      ref={mesh}
      position={[
        0,
        0,
        -1,
      ]}
    >
      <planeGeometry
        args={[3, 3]}
      />


      <meshBasicMaterial
        color="#f4f4f0"
        transparent
        opacity={0.012}
        blending={
          THREE.AdditiveBlending
        }
        depthWrite={false}
      />
    </mesh>
  );
}


/* =========================================================
   SCENE
========================================================= */

export default function ParticleScene() {
  return (
    <Canvas
      camera={{
        position: [
          0,
          0,
          6,
        ],
        fov: 55,
      }}

      dpr={[
        1,
        1.7,
      ]}

      gl={{
        antialias: true,
        alpha: true,
      }}
    >
      <ParticleField />

      <CursorGlow />
    </Canvas>
  );
}