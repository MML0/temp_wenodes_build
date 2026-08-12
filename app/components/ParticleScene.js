"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";


/* =========================================================
   SETTINGS
========================================================= */

const COUNT = 18000;

const WORD = "WENODES";


/*
  Letter dimensions.

  The old letters were too narrow, so the horizontal
  scale is intentionally larger than the vertical scale.
*/
const LETTER_WIDTH = 1.85;
const LETTER_HEIGHT = 3.05;


/*
  Space between letters in the full WENODES word.
*/
const LETTER_SPACING = 1.95;


/*
  Random horizontal deformation.

  Increase this if you want the letters more organic.
*/
const RANDOM_STRETCH = 0.2;


/*
  Animation timing.

  Everything is intentionally slow.
*/
const TIMING = {
  /*
    Full WENODES stays visible for a long time.
  */
  WORD_HOLD: 14.0,

  /*
    Slow explosion away from WENODES.
  */
  WORD_SCATTER: 29.0,

  /*
    Time to form each individual letter.
  */
  LETTER_FORM: 22.5,

  /*
    Individual letter remains visible.
  */
  LETTER_HOLD: 22.0,

  /*
    Slow transition between letters.
  */
  LETTER_SCATTER: 23.0,

  /*
    Final WENODES remains visible even longer.
  */
  FINAL_WORD_HOLD: 18.0,
};


/* =========================================================
   9 × 8 PIXEL MATRIX DEFINITIONS
========================================================= */

const LETTERS = {
  W: [
    [1, 0, 0, 0, 1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1, 0, 0, 0, 1],
    [0, 1, 0, 1, 0, 1, 0, 1, 0],
    [0, 1, 0, 1, 0, 1, 0, 1, 0],
    [0, 0, 1, 0, 0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0, 0, 1, 0, 0],
  ],

  E: [
    [1, 1, 1, 1, 1, 1, 1, 0, 0],
    [1, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 1, 0, 0, 0],
    [1, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 1, 1, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
  ],

  N: [
    [1, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 1, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 1, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 1, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 1, 1],
  ],

  O: [
    [0, 0, 1, 1, 1, 1, 1, 0, 0],
    [0, 1, 0, 0, 0, 0, 0, 1, 0],
    [1, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 1],
    [0, 1, 0, 0, 0, 0, 0, 1, 0],
    [0, 0, 1, 1, 1, 1, 1, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
  ],

  D: [
    [1, 1, 1, 1, 1, 1, 1, 0, 0],
    [1, 0, 0, 0, 0, 0, 0, 1, 0],
    [1, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 1, 0],
    [1, 1, 1, 1, 1, 1, 1, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
  ],

  S: [
    [0, 1, 1, 1, 1, 1, 1, 1, 0],
    [1, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 1, 1, 1, 1, 1, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 1],
    [0, 1, 1, 1, 1, 1, 1, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
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


function smoothstep(value) {
  value = clamp01(value);

  return (
    value *
    value *
    (3 - 2 * value)
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


/* =========================================================
   CREATE ONE LETTER
========================================================= */

function createLetterTarget(letter) {
  const matrix =
    LETTERS[letter];

  const rows =
    matrix.length;

  const cols =
    matrix[0].length;


  /*
    Find all active pixels.
  */

  const cells = [];

  for (
    let y = 0;
    y < rows;
    y++
  ) {
    for (
      let x = 0;
      x < cols;
      x++
    ) {
      if (
        matrix[y][x] === 1
      ) {
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


  /*
    Pixel size.

    Width is intentionally larger.
  */

  const cellWidth =
    LETTER_WIDTH / cols;

  const cellHeight =
    LETTER_HEIGHT / rows;


  for (
    let i = 0;
    i < COUNT;
    i++
  ) {
    const i3 =
      i * 3;


    const cell =
      cells[
        Math.floor(
          Math.random() *
            cells.length
        )
      ];


    /*
      Base pixel position.
    */

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
      Random horizontal stretch.

      This prevents every particle from sitting
      on an identical rigid grid.

      It only affects X, so the letter remains
      recognizable while becoming more organic.
    */

    const stretch =
      random(
        1 -
          RANDOM_STRETCH,
        1 +
          RANDOM_STRETCH
      );


    x *= stretch;


    /*
      Tiny random position inside the pixel.
    */

    x += random(
      -cellWidth * 0.6,
      cellWidth * 0.6
    );


    y += random(
      -cellHeight * 0.5,
      cellHeight * 0.5
    );
    y*= stretch;

    /*
      Slight depth randomness.
    */

    const z =
      random(
        -0.34,
        0.34
      );


    result[i3] = x;

    result[i3 + 1] = y;

    result[i3 + 2] = z;
  }


  return result;
}


/* =========================================================
   CREATE FULL WENODES
========================================================= */

function createWordTarget(
  letterTargets
) {
  const result =
    new Float32Array(
      COUNT * 3
    );


  const letters =
    WORD.split("");


  /*
    Total width of the word.
  */

  const totalWidth =
    (
      letters.length - 1
    ) *
      LETTER_SPACING +
    LETTER_WIDTH;


  const startX =
    -totalWidth / 2 +
    LETTER_WIDTH / 2;


  /*
    Each particle belongs to one
    of the seven letters.
  */

  const particlesPerLetter =
    Math.floor(
      COUNT /
        letters.length
    );


  for (
    let i = 0;
    i < COUNT;
    i++
  ) {
    const i3 =
      i * 3;


    let letterIndex =
      Math.floor(
        i /
          particlesPerLetter
      );


    /*
      Clamp the last particles to S.
    */

    if (
      letterIndex >=
      letters.length
    ) {
      letterIndex =
        letters.length - 1;
    }


    const letter =
      letters[
        letterIndex
      ];


    const target =
      letterTargets[
        letter
      ];


    /*
      Local particle index.
    */

    const localIndex =
      i -
      letterIndex *
        particlesPerLetter;


    const sourceIndex =
      (
        localIndex %
        COUNT
      ) * 3;


    result[i3] =
      target[
        sourceIndex
      ] +
      startX +
      letterIndex *
        LETTER_SPACING;


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
   PARTICLE FIELD
========================================================= */

function ParticleField() {
  const points =
    useRef(null);


  const {
    viewport,
  } = useThree();


  /*
    Browser mouse.

    Global event means foreground UI cannot block
    the particle interaction.
  */

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


  useEffect(() => {
    const handleMouseMove =
      (event) => {
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
      handleMouseMove,
      {
        passive: true,
      }
    );


    return () => {
      window.removeEventListener(
        "mousemove",
        handleMouseMove
      );
    };
  }, []);


  /* =======================================================
     PARTICLE DATA
  ======================================================= */

  const data =
    useMemo(() => {
      const positions =
        new Float32Array(
          COUNT * 3
        );


      const base =
        new Float32Array(
          COUNT * 3
        );


      const velocity =
        new Float32Array(
          COUNT * 3
        );


      const randomOffset =
        new Float32Array(
          COUNT * 3
        );


      const personality =
        new Float32Array(
          COUNT
        );


      /*
        Create exact individual letters.
      */

      const letterTargets =
        {};

      for (
        const letter of [
          "W",
          "E",
          "N",
          "O",
          "D",
          "S",
        ]
      ) {
        letterTargets[
          letter
        ] =
          createLetterTarget(
            letter
          );
      }


      /*
        Create full WENODES.
      */

      const word =
        createWordTarget(
          letterTargets
        );


      /*
        Initial particle cloud.
      */

      for (
        let i = 0;
        i < COUNT;
        i++
      ) {
        const i3 =
          i * 3;


        const x =
          random(
            -7,
            7
          );


        const y =
          random(
            -4.2,
            4.2
          );


        const z =
          random(
            -2,
            2
          );


        positions[i3] =
          base[i3] =
            x;


        positions[i3 + 1] =
          base[i3 + 1] =
            y;


        positions[i3 + 2] =
          base[i3 + 2] =
            z;


        velocity[i3] =
          random(
            -0.01,
            0.01
          );


        velocity[i3 + 1] =
          random(
            -0.01,
            0.01
          );


        velocity[i3 + 2] =
          random(
            -0.004,
            0.004
          );


        randomOffset[i3] =
          random(
            -1,
            1
          );


        randomOffset[i3 + 1] =
          random(
            -1,
            1
          );


        randomOffset[i3 + 2] =
          random(
            -1,
            1
          );


        personality[i] =
          Math.random();
      }


      return {
        positions,
        base,
        velocity,
        randomOffset,
        personality,
        word,
        letterTargets,
      };
    }, []);


  /* =======================================================
     ANIMATION STATE
  ======================================================= */

  const animation =
    useRef({
      phase:
        "WORD_HOLD",

      phaseStart:
        0,

      letterIndex:
        0,

      initialized:
        false,
    });


  /* =======================================================
     FRAME
  ======================================================= */

  useFrame(
    (state) => {
      if (
        !points.current
      ) {
        return;
      }


      const time =
        state.clock.elapsedTime;


      const geometry =
        points.current
          .geometry;


      const attribute =
        geometry.attributes
          .position;


      const positions =
        attribute.array;


      const {
        randomOffset,
        personality,
        word,
        letterTargets,
      } = data;


      const anim =
        animation.current;


      /* -----------------------------------------------------
         INITIALIZATION
      ----------------------------------------------------- */

      if (
        !anim.initialized
      ) {
        anim.initialized =
          true;

        anim.phase =
          "WORD_HOLD";

        anim.phaseStart =
          time;
      }


      const elapsed =
        time -
        anim.phaseStart;


      /* =====================================================
         ANIMATION STATE MACHINE
      ===================================================== */


      /*
        WENODES stays visible.
      */

      if (
        anim.phase ===
        "WORD_HOLD"
      ) {
        if (
          elapsed >
          TIMING.WORD_HOLD
        ) {
          anim.phase =
            "WORD_SCATTER";

          anim.phaseStart =
            time;
        }
      }


      /*
        Scatter.
      */

      else if (
        anim.phase ===
        "WORD_SCATTER"
      ) {
        if (
          elapsed >
          TIMING.WORD_SCATTER
        ) {
          anim.phase =
            "LETTER_FORM";

          anim.phaseStart =
            time;

          anim.letterIndex =
            0;
        }
      }


      /*
        Letter formation.
      */

      else if (
        anim.phase ===
        "LETTER_FORM"
      ) {
        if (
          elapsed >
          TIMING.LETTER_FORM
        ) {
          anim.phase =
            "LETTER_HOLD";

          anim.phaseStart =
            time;
        }
      }


      /*
        Letter stays visible.
      */

      else if (
        anim.phase ===
        "LETTER_HOLD"
      ) {
        if (
          elapsed >
          TIMING.LETTER_HOLD
        ) {
          anim.phase =
            "LETTER_SCATTER";

          anim.phaseStart =
            time;
        }
      }


      /*
        Scatter before next letter.
      */

      else if (
        anim.phase ===
        "LETTER_SCATTER"
      ) {
        if (
          elapsed >
          TIMING.LETTER_SCATTER
        ) {
          anim.letterIndex++;


          /*
            Finished W E N O D E S.
          */

          if (
            anim.letterIndex >=
            WORD.length
          ) {
            anim.phase =
              "FINAL_WORD";

            anim.phaseStart =
              time;
          } else {
            anim.phase =
              "LETTER_FORM";

            anim.phaseStart =
              time;
          }
        }
      }


      /*
        Final full WENODES.
      */

      else if (
        anim.phase ===
        "FINAL_WORD"
      ) {
        if (
          elapsed >
          TIMING.FINAL_WORD_HOLD
        ) {
          anim.phase =
            "WORD_SCATTER";

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
        0.045;


      smoothMouse.current.y +=
        (
          mouse.current.y -
          smoothMouse.current.y
        ) *
        0.045;


      const mouseX =
        smoothMouse.current.x *
        viewport.width *
        0.5;


      const mouseY =
        smoothMouse.current.y *
        viewport.height *
        0.5;


      /* =====================================================
         GLOBAL ZOOM
      ===================================================== */

      const zoom =
        1 +
        Math.sin(
          time * 0.075
        ) *
          0.035;


      /* =====================================================
         GLOBAL ROTATION
      ===================================================== */

      const rotation =
        Math.sin(
          time * 0.045
        ) *
        0.032;


      const cos =
        Math.cos(
          rotation
        );


      const sin =
        Math.sin(
          rotation
        );


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
          personality[
            particle
          ];


        let targetX = 0;
        let targetY = 0;
        let targetZ = 0;


        /* ===================================================
           FULL WENODES
        =================================================== */

        if (
          anim.phase ===
            "WORD_HOLD" ||
          anim.phase ===
            "FINAL_WORD"
        ) {
          targetX =
            word[i];


          targetY =
            word[i + 1];


          targetZ =
            word[i + 2];


          /*
            Very subtle living motion.
          */

          targetX +=
            Math.sin(
              time * 0.25 +
                particle *
                  0.003
            ) *
            0.018;


          targetY +=
            Math.cos(
              time * 0.22 +
                particle *
                  0.002
            ) *
            0.018;
        }


        /* ===================================================
           WORD SCATTER
        =================================================== */

        else if (
          anim.phase ===
          "WORD_SCATTER"
        ) {
          const progress =
            easeInOut(
              elapsed /
                TIMING.WORD_SCATTER
            );


          const explosion =
            1.2 +
            progress *
              3.5;


          targetX =
            word[i] +
            randomOffset[i] *
              explosion;


          targetY =
            word[i + 1] +
            randomOffset[
              i + 1
            ] *
              explosion;


          targetZ =
            word[i + 2] +
            randomOffset[
              i + 2
            ] *
              explosion;


          /*
            Floating randomness.
          */

          targetX +=
            Math.sin(
              time * 0.21 +
                particle *
                  0.013
            ) *
            0.22;


          targetY +=
            Math.cos(
              time * 0.18 +
                particle *
                  0.011
            ) *
            0.22;
        }


        /* ===================================================
           INDIVIDUAL LETTER
        =================================================== */

        else {
          const letter =
            WORD[
              anim.letterIndex
            ];


          const letterTarget =
            letterTargets[
              letter
            ];


          /* -------------------------------------------------
             FORM
          ------------------------------------------------- */

          if (
            anim.phase ===
            "LETTER_FORM"
          ) {
            const progress =
              easeInOut(
                elapsed /
                  TIMING.LETTER_FORM
              );


            targetX =
              letterTarget[i] *
              progress;


            targetY =
              letterTarget[
                i + 1
              ] *
              progress;


            targetZ =
              letterTarget[
                i + 2
              ] *
              progress;


            /*
              Slight formation turbulence.
            */

            const turbulence =
              Math.sin(
                progress *
                  Math.PI
              );


            targetX +=
              randomOffset[i] *
              turbulence *
              0.18;


            targetY +=
              randomOffset[
                i + 1
              ] *
              turbulence *
              0.12;
          }


          /* -------------------------------------------------
             HOLD
          ------------------------------------------------- */

          else if (
            anim.phase ===
            "LETTER_HOLD"
          ) {
            targetX =
              letterTarget[i];


            targetY =
              letterTarget[
                i + 1
              ];


            targetZ =
              letterTarget[
                i + 2
              ];


            /*
              Tiny breathing motion.
            */

            targetX +=
              Math.sin(
                time * 0.35 +
                  particle *
                    0.018
              ) *
              0.018;


            targetY +=
              Math.cos(
                time * 0.31 +
                  particle *
                    0.015
              ) *
              0.018;
          }


          /* -------------------------------------------------
             SCATTER
          ------------------------------------------------- */

          else {
            const progress =
              easeInOut(
                elapsed /
                  TIMING.LETTER_SCATTER
              );


            const explosion =
              progress *
              3.2;


            targetX =
              letterTarget[i] +
              randomOffset[i] *
                explosion;


            targetY =
              letterTarget[
                i + 1
              ] +
              randomOffset[
                i + 1
              ] *
                explosion;


            targetZ =
              letterTarget[
                i + 2
              ] +
              randomOffset[
                i + 2
              ] *
                explosion;
          }
        }


        /* ===================================================
           MOUSE FORCE
        =================================================== */

        const px =
          positions[i];


        const py =
          positions[
            i + 1
          ];


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


        /*
          Large mouse radius.
        */

        const mouseRadius =
          3.3;


        if (
          distance <
          mouseRadius
        ) {
          const normalized =
            1 -
            distance /
              mouseRadius;


          const influence =
            Math.pow(
              normalized,
              2.4
            );


          /*
            PUSH
          */

          const force =
            influence *
            1.35;


          if (
            distance >
            0.001
          ) {
            targetX +=
              (
                dx /
                distance
              ) *
              force;


            targetY +=
              (
                dy /
                distance
              ) *
              force;
          }


          /*
            LEVITATION.
          */

          targetZ +=
            influence *
            0.8;


          /*
            Soft vortex.
          */

          const swirl =
            Math.sin(
              time * 1.1 +
                particle *
                  0.008
            ) *
            influence *
            0.13;


          targetX +=
            (
              -dy /
              Math.max(
                distance,
                0.001
              )
            ) *
            swirl;


          targetY +=
            (
              dx /
              Math.max(
                distance,
                0.001
              )
            ) *
            swirl;
        }


        /* ===================================================
           GLOBAL MOUSE FIELD
        =================================================== */

        const mouseDistance =
          Math.sqrt(
            mouseX * mouseX +
              mouseY * mouseY
          );


        const globalInfluence =
          Math.exp(
            -mouseDistance *
              0.11
          );


        targetX +=
          -mouseX *
          globalInfluence *
          0.12;


        targetY +=
          -mouseY *
          globalInfluence *
          0.12;


        /* ===================================================
           ORGANIC FLOATING
        =================================================== */

        const float =
          0.018 +
          personal *
            0.035;


        targetX +=
          Math.sin(
            time * 0.21 +
              particle *
                0.016
          ) *
          float;


        targetY +=
          Math.cos(
            time * 0.19 +
              particle *
                0.014
          ) *
          float;


        targetZ +=
          Math.sin(
            time * 0.17 +
              particle *
                0.01
          ) *
          float;


        /* ===================================================
           ZOOM
        =================================================== */

        targetX *= zoom;
        targetY *= zoom;


        /* ===================================================
           ROTATION
        =================================================== */

        const rotatedX =
          targetX * cos -
          targetY * sin;


        const rotatedY =
          targetX * sin +
          targetY * cos;


        targetX =
          rotatedX;


        targetY =
          rotatedY;


        /* ===================================================
           SPRING
        =================================================== */

        let spring =
          0.018;


        if (
          anim.phase ===
          "WORD_HOLD"
        ) {
          spring =
            0.014;
        }


        if (
          anim.phase ===
          "FINAL_WORD"
        ) {
          spring =
            0.012;
        }


        if (
          anim.phase ===
          "WORD_SCATTER"
        ) {
          spring =
            0.022;
        }


        if (
          anim.phase ===
          "LETTER_FORM"
        ) {
          spring =
            0.021;
        }


        if (
          anim.phase ===
          "LETTER_HOLD"
        ) {
          spring =
            0.014;
        }


        if (
          anim.phase ===
          "LETTER_SCATTER"
        ) {
          spring =
            0.024;
        }


        positions[i] +=
          (
            targetX -
            positions[i]
          ) *
          spring;


        positions[
          i + 1
        ] +=
          (
            targetY -
            positions[
              i + 1
            ]
          ) *
          spring;


        positions[
          i + 2
        ] +=
          (
            targetZ -
            positions[
              i + 2
            ]
          ) *
          0.018;
      }


      attribute.needsUpdate =
        true;


      /* =====================================================
         FIELD ROTATION
      ===================================================== */

      points.current.rotation.z =
        Math.sin(
          time * 0.045
        ) *
        0.022;


      points.current.rotation.x =
        Math.sin(
          time * 0.028
        ) *
        0.009;


      points.current.rotation.y =
        Math.cos(
          time * 0.024
        ) *
        0.014;


      /*
        Very slow breathing scale.
      */

      const fieldScale =
        1 +
        Math.sin(
          time * 0.065
        ) *
        0.025;


      points.current.scale.set(
        fieldScale,
        fieldScale,
        fieldScale
      );
    }
  );


  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={COUNT}
          array={data.positions}
          itemSize={3}
        />
      </bufferGeometry>


      <pointsMaterial
        size={0.02}
        sizeAttenuation
        transparent
        opacity={0.62}
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
  const mesh =
    useRef(null);


  const {
    viewport,
  } = useThree();


  const mouse =
    useRef({
      x: 0,
      y: 0,
    });


  const smooth =
    useRef({
      x: 0,
      y: 0,
    });


  useEffect(() => {
    const handleMouseMove =
      (event) => {
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
      handleMouseMove,
      {
        passive: true,
      }
    );


    return () => {
      window.removeEventListener(
        "mousemove",
        handleMouseMove
      );
    };
  }, []);


  useFrame(() => {
    if (
      !mesh.current
    ) {
      return;
    }


    smooth.current.x +=
      (
        mouse.current.x -
        smooth.current.x
      ) *
      0.945;


    smooth.current.y +=
      (
        mouse.current.y -
        smooth.current.y
      ) *
      0.945;


    const x =
      smooth.current.x *
      viewport.width *
      0.5;


    const y =
      smooth.current.y *
      viewport.height *
      0.5;


    mesh.current.position.x +=
      (
        x -
        mesh.current.position.x
      ) *
      0.05;


    mesh.current.position.y +=
      (
        y -
        mesh.current.position.y
      ) *
      0.05;
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
        args={[
          3,
          3,
        ]}
      />


      <meshBasicMaterial
        color="#f4f4f0"
        transparent
        opacity={0.018}
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

      style={{
        width: "100%",
        height: "100%",
        pointerEvents: "none",
      }}
    >
      <ParticleField />

      <CursorGlow />
    </Canvas>
  );
}