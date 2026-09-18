"use client";

import dynamic from "next/dynamic";

/*
  ParticleScene pulls in three.js and @react-three/fiber (~220 KB over the
  wire). It is a purely decorative, aria-hidden background, but importing it
  directly put those chunks in the critical hydration path of every page —
  so nothing became interactive until three.js had downloaded.

  Loading it lazily keeps the background identical while letting the page
  hydrate on the small chunks it actually needs.
*/

const ParticleScene = dynamic(
  () => import("./ParticleScene"),
  { ssr: false }
);

export default ParticleScene;
