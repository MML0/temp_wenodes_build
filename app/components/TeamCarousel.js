"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

/* =========================================================
   TEAM CAROUSEL
   Smooth infinite 3D curved scroll for team members.

   - Auto-scrolls to the left
   - Cards follow a bezier curve in perspective
   - Center card is larger, more forward, more in focus
   - Side cards recede, shrink, fade
   - Pauses while dragging, resumes smoothly 1s after release
========================================================= */

export default function TeamCarousel({ members }) {
  const trackRef = useRef(null);
  const itemRefs = useRef([]);
  const cardRefs = useRef([]);
  const offsetRef = useRef(0);
  const targetOffsetRef = useRef(0);
  const rafRef = useRef(null);
  const resumeTimerRef = useRef(null);
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, offset: 0 });
  const isUserInteractingRef = useRef(false);
  const dragDistanceRef = useRef(0);
  const didDragRef = useRef(false);
  const velocityRef = useRef(0); // offset px per ms, measured while dragging
  const momentumRef = useRef(0); // active fling velocity after release
  const lastMoveTimeRef = useRef(0);

  const [isDragging, setIsDragging] = useState(false);

  const RESUME_DELAY = 1000; // ms after release before auto-scroll resumes
  const CLICK_DRAG_THRESHOLD = 6; // px of movement before a drag cancels the click
  // Glide distance works out to roughly v0 * 16.67 / (1 - FRICTION), so at
  // the velocity ceiling a hard flick coasts ~1250px (about 3 cards) over
  // ~2s before auto-scroll takes back over. Raise FRICTION toward 1 for a
  // longer spin, lower it for a shorter one.
  const MOMENTUM_FRICTION = 0.96; // per 60fps frame - lower = stops sooner
  const MOMENTUM_MIN = 0.02; // px/ms below which the fling is considered done
  const MOMENTUM_MAX = 3.0; // px/ms ceiling so a hard flick can't spin forever

  // Auto-scroll stays suspended until this fires, so a fling gets to finish
  // gliding before the carousel takes back over.
  const startResumeTimer = () => {
    clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = setTimeout(() => {
      isUserInteractingRef.current = false;
    }, RESUME_DELAY);
  };

  // Triple the list for seamless infinite looping
  const looped = [...members, ...members, ...members];
  const itemCount = looped.length;

  useEffect(() => {
    const track = trackRef.current;
    if (!track || members.length === 0) return;

    // The visible viewport width (parent carousel, not the track itself)
    const viewport = track.parentElement;
    const getViewportWidth = () => viewport?.offsetWidth || window.innerWidth;

    // Fallback card width matching CSS (.wn-team-card-wrap { flex: 0 0 380px })
    const FALLBACK_CARD_W = 380;
    const GAP = 28;

    let cardW = FALLBACK_CARD_W;
    let viewportW = getViewportWidth();

    // Initialize offset so that the first "real" card (index = members.length)
    // is centered in the viewport.
    const computeOffset = () => {
      // Try to read actual card width
      const firstCard = itemRefs.current.find((el) => el);
      if (firstCard && firstCard.offsetWidth > 0) {
        cardW = firstCard.offsetWidth;
      }
      viewportW = getViewportWidth() || viewportW;
      if (viewportW <= 0) viewportW = window.innerWidth;

      const itemSlot = cardW + GAP;

      // Center the first "real" card (index = members.length) in viewport
      // itemCenter = (i * itemSlot) + (cardW/2) - offset
      // We want itemCenter = viewportW/2
      const startOffset =
        members.length * itemSlot + cardW / 2 - viewportW / 2;

      offsetRef.current = startOffset;
      targetOffsetRef.current = startOffset;
    };

    // Set initial offset immediately with fallback values
    computeOffset();

    // Per-card memo of the last applied curve position - lets the loop skip
    // re-writing style on cards that are fully off to one side and clamped
    // (identical t every frame), which is most of the 36 looped cards at any
    // given moment. Re-styling all of them every frame was the main cause of
    // the frame-rate drop.
    const prevT = new Array(itemCount).fill(null);

    let lastTime = performance.now();

    const animate = (time) => {
      const delta = Math.min(time - lastTime, 64);
      lastTime = time;

      // Fling momentum after a touch/drag release. Touch has no OS-level
      // momentum the way a trackpad does (which keeps emitting decaying
      // wheel events on its own), so on a phone the carousel would stop
      // dead the instant a finger lifts - this carries it on instead.
      if (momentumRef.current !== 0) {
        targetOffsetRef.current += momentumRef.current * delta;
        // Framerate-independent exponential decay
        momentumRef.current *= Math.pow(MOMENTUM_FRICTION, delta / 16.67);
        if (Math.abs(momentumRef.current) < MOMENTUM_MIN) {
          momentumRef.current = 0;
          startResumeTimer();
        }
      }

      if (!isUserInteractingRef.current) {
        targetOffsetRef.current += delta * 0.035;
      }

      // Smooth interpolation
      offsetRef.current +=
        (targetOffsetRef.current - offsetRef.current) * 0.085;

      const itemSlot = cardW + GAP;
      const singleSet = members.length * itemSlot;
      const viewportCenter = viewportW / 2;

      // Seamless wrap
      if (singleSet > 0) {
        if (offsetRef.current >= singleSet * 1.5) {
          offsetRef.current -= singleSet;
          targetOffsetRef.current -= singleSet;
        } else if (offsetRef.current < singleSet * 0.5) {
          offsetRef.current += singleSet;
          targetOffsetRef.current += singleSet;
        }
      }

      // Shift the whole track so card `i`'s on-screen center matches the
      // itemCenter math below - without this the per-card depth/scale/rotate
      // transforms animate in place but the layout never actually scrolls.
      track.style.transform = `translate3d(${-offsetRef.current}px, 0, 0)`;

      // Apply transforms to each item. The wrap (flex item) gets opacity and
      // z-index; the depth/scale/rotate transform goes on the INNER card
      // element instead, which has its own local `perspective` from its
      // immediate parent (see CSS) - each card is its own independent 3D
      // context rather than all 30 sharing one distant vanishing point.
      // That keeps a card's visual position and its real hit-test geometry
      // in sync (a single shared perspective was distorting them apart for
      // off-center cards) and means animating one card's transform never
      // has to touch its siblings.
      itemRefs.current.forEach((wrapEl, i) => {
        const cardEl = cardRefs.current[i];
        if (!wrapEl || !cardEl) return;

        const itemCenter =
          i * itemSlot + cardW / 2 - offsetRef.current;

        const dist = itemCenter - viewportCenter;

        // Use a wider denominator so more cards remain visible
        // (i.e. the curve is gentler and spans a larger portion of the viewport)
        const t = Math.max(
          -1.4,
          Math.min(1.4, dist / (viewportW * 0.6))
        );

        // Skip the write entirely when this card's position hasn't moved
        // meaningfully since last frame (true for every clamped, off-to-the-
        // side card - t pins at exactly +/-1.4 and stays there for many
        // frames while the window scrolls past it).
        const tRounded = Math.round(t * 1000);
        if (prevT[i] === tRounded) return;
        prevT[i] = tRounded;

        const t2 = t * t;

        // Tamed curve: less depth, less shrink, less fade, less rotation
        // so that even cards at the edges stay visible (just smaller & dimmer)
        const depth = 260;
        const shrink = 0.22;
        // Strong enough that a card reaches opacity 0 around |t| = 1.27,
        // i.e. just before the edge of the container - this replaces the
        // mask-image that used to do the edge fade.
        const fade = 0.62;
        const rot = 8;

        const z = -depth * t2;
        const scale = 1 - shrink * t2;
        const opacity = Math.max(0, 1 - fade * t2);
        const rotateY = rot * t;

        cardEl.style.transform = `translateZ(${z}px) scale(${scale}) rotateY(${rotateY}deg)`;
        wrapEl.style.opacity = opacity;
        wrapEl.style.zIndex = Math.round(100 - t2 * 100);
      });

      rafRef.current = requestAnimationFrame(animate);
    };

    // Only animate while the carousel is actually on screen. It sits far
    // down the page, so without this the loop runs during the whole hero -
    // competing every frame with the WebGL particle scene's own render loop
    // and the loading screen's timer.
    const visibility = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && rafRef.current == null) {
          lastTime = performance.now();
          rafRef.current = requestAnimationFrame(animate);
        } else if (!entry.isIntersecting && rafRef.current != null) {
          cancelAnimationFrame(rafRef.current);
          rafRef.current = null;
        }
      },
      { rootMargin: "200px 0px" }
    );
    visibility.observe(track.parentElement || track);

    // Recompute on resize and after layout settles
    const handleResize = () => {
      computeOffset();
    };
    window.addEventListener("resize", handleResize);

    // Also re-measure after a short delay in case layout wasn't ready
    const remeasureTimer = setTimeout(() => {
      computeOffset();
    }, 100);

    // Two-finger trackpad swipe: a horizontal-dominant wheel gesture drives
    // the carousel directly; a vertical one is left alone so the page still
    // scrolls normally. Bound natively (not via onWheel) with passive:false
    // so preventDefault actually stops the browser's own swipe-navigation
    // gesture instead of being silently ignored.
    const handleWheel = (event) => {
      const absX = Math.abs(event.deltaX);
      const absY = Math.abs(event.deltaY);
      if (absX < 2 || absX <= absY) return;
      event.preventDefault();
      isUserInteractingRef.current = true;
      momentumRef.current = 0; // trackpad supplies its own decay
      targetOffsetRef.current += event.deltaX * 1.15;
      offsetRef.current = targetOffsetRef.current;
      startResumeTimer();
    };
    track.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      visibility.disconnect();
      clearTimeout(resumeTimerRef.current);
      clearTimeout(remeasureTimer);
      window.removeEventListener("resize", handleResize);
      track.removeEventListener("wheel", handleWheel);
    };
  }, [members]);

  /* --------------------- INTERACTION --------------------- */

  const pointerIdRef = useRef(null);
  const capturedRef = useRef(false);

  // A plain click/tap must behave completely normally - no pointer capture,
  // no auto-scroll pause - so hover and the card's Link navigation work
  // untouched. Only once movement crosses CLICK_DRAG_THRESHOLD do we treat
  // this as a real drag: capture the pointer and pause auto-scroll.
  const handlePointerDown = (event) => {
    isDraggingRef.current = true;
    dragDistanceRef.current = 0;
    didDragRef.current = false;
    capturedRef.current = false;
    // Grabbing mid-fling catches the carousel, like stopping a spinning wheel
    momentumRef.current = 0;
    velocityRef.current = 0;
    lastMoveTimeRef.current = performance.now();
    pointerIdRef.current = event.pointerId;
    dragStartRef.current = {
      x: event.clientX,
      offset: targetOffsetRef.current,
    };
  };

  const handlePointerMove = (event) => {
    if (!isDraggingRef.current) return;
    const dx = event.clientX - dragStartRef.current.x;
    dragDistanceRef.current = Math.max(dragDistanceRef.current, Math.abs(dx));

    if (!didDragRef.current && dragDistanceRef.current > CLICK_DRAG_THRESHOLD) {
      didDragRef.current = true;
      isUserInteractingRef.current = true;
      setIsDragging(true);
      if (!capturedRef.current) {
        // Throws if the pointer is already gone; capture is an enhancement,
        // not a requirement, so never let it abort the drag itself.
        try {
          event.currentTarget.setPointerCapture?.(pointerIdRef.current);
        } catch {}
        capturedRef.current = true;
      }
    }

    if (!didDragRef.current) return;

    const prevOffset = targetOffsetRef.current;
    targetOffsetRef.current = dragStartRef.current.offset - dx * 1.4;
    offsetRef.current = targetOffsetRef.current;

    // Track how fast the finger/cursor is actually moving so the release
    // can hand that speed to the fling. Smoothed, because raw per-event
    // deltas are noisy and a single jittery last event shouldn't decide
    // the whole throw.
    const now = performance.now();
    const dt = now - lastMoveTimeRef.current;
    if (dt > 0 && dt < 100) {
      const instantV = (targetOffsetRef.current - prevOffset) / dt;
      velocityRef.current = velocityRef.current * 0.6 + instantV * 0.4;
    }
    lastMoveTimeRef.current = now;
  };

  const handlePointerUp = () => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    setIsDragging(false);
    capturedRef.current = false;

    if (!didDragRef.current) return;

    // Throw it. If the release was slow enough to not count as a flick,
    // skip straight to waiting for auto-scroll to resume.
    const stale = performance.now() - lastMoveTimeRef.current > 120;
    if (!stale && Math.abs(velocityRef.current) > MOMENTUM_MIN * 2) {
      momentumRef.current = Math.max(
        -MOMENTUM_MAX,
        Math.min(MOMENTUM_MAX, velocityRef.current)
      );
      clearTimeout(resumeTimerRef.current); // resumes once the fling decays
    } else {
      momentumRef.current = 0;
      startResumeTimer();
    }
    velocityRef.current = 0;
  };

  // A drag that moved past the threshold shouldn't also trigger the card's
  // link navigation - swallow that one click, then let normal clicks through.
  const handleClickCapture = (event) => {
    if (didDragRef.current) {
      event.preventDefault();
      event.stopPropagation();
      didDragRef.current = false;
    }
  };

  return (
    <div className="wn-team-carousel">
      <div
        className="wn-team-track"
        ref={trackRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onClickCapture={handleClickCapture}
        style={{ cursor: isDragging ? "grabbing" : "grab" }}
      >
        {looped.map((member, i) => (
          <div
            key={`${member.id}-${i}`}
            ref={(el) => (itemRefs.current[i] = el)}
            className="wn-team-card-wrap"
          >
            <Link
              href={`/team/${member.slug}`}
              className="wn-team-card"
              draggable={false}
              ref={(el) => (cardRefs.current[i] = el)}
            >
              <div className="wn-team-card-image">
                <img
                  src={member.hero?.src}
                  alt={member.hero?.alt || member.fullName}
                  draggable="false"
                  loading="lazy"
                  decoding="async"
                />
                <div className="wn-team-card-overlay" />
              </div>

              <div className="wn-team-card-meta">
                <span>{String(member.id).padStart(2, "0")}</span>
                <span>{member.role?.toUpperCase()}</span>
              </div>

              <h3 className="wn-team-card-name">
                {member.nickname}
                <span>.</span>
              </h3>

              <div className="wn-team-card-footer">
                <span>OPEN ↗</span>
              </div>
            </Link>
          </div>
        ))}
      </div>

      <div className="wn-team-hint">
        <span>←</span>
        <span>DRAG TO EXPLORE</span>
        <span>→</span>
      </div>

      <style>{`
        .wn-team-carousel {
          position: relative;
          width: 100%;
          max-width: 100%;
          min-height: 600px;
          padding: 4rem 0 2rem;
          /* The track inside is width:max-content (~12,000px for 30 cards).
             Without this it becomes the page's real layout width - which
             blew the mobile viewport out sideways and shrank everything,
             including the loading screen, to fit it. */
          overflow: hidden;
          /* No mask-image here on purpose. A mask forces this whole
             ~1280x744 box through an offscreen pass, so ANY paint inside
             it (a hover colour change, say) is amplified into re-masking
             the entire container - on the same GPU the WebGL particle
             background is using. The per-card opacity falloff in the
             animation loop already does the edge fade. */
        }

        .wn-team-track {
          display: flex;
          align-items: center;
          justify-content: flex-start;
          gap: 28px;
          padding: 2rem 0 4rem;
          /* Deliberately NO will-change here: this element is ~12,000px
             wide, so promoting it to its own compositor layer costs ~32MB
             of GPU texture memory and starves the WebGL particle scene on
             phones. The transform still animates fine without it. */
          width: max-content;
          touch-action: pan-y;
          user-select: none;
          -webkit-user-select: none;
        }

        .wn-team-card-wrap {
          flex: 0 0 380px;
          height: 520px;
          /* Each card gets its OWN local perspective instead of one shared
             on the whole track: every card is its own independent 3D
             context, so its visual position always matches its real
             hit-test box, and animating one card's transform (e.g. on
             hover) never forces its neighbors to recompute. */
          perspective: 1200px;
        }

        .wn-team-card {
          display: block;
          width: 100%;
          height: 100%;
          background: #0a0a0a;
          border: 1px solid rgba(232,230,227,0.12);
          color: #e8e6e3;
          text-decoration: none;
          overflow: hidden;
          position: relative;
        }

        /* Hover is deliberately confined to the small footer strip.
           A full-card overlay had to blend a 380x520 surface over a
           3D-transformed subtree (with a filtered image inside it) for
           every frame of its transition - and because cards slide under a
           stationary cursor while auto-scrolling, those transitions fire
           back to back across cards. That repaint cost lands on the same
           GPU as the WebGL particle background and drags its frame rate
           down. Repainting a ~16px text strip does not.
           hover:hover keeps it off touch devices entirely, where it would
           otherwise stick on after a tap. */
        @media (hover: hover) and (pointer: fine) {
          .wn-team-card:hover .wn-team-card-footer {
            color: rgba(232, 230, 227, 0.9);
            border-top-color: rgba(232, 230, 227, 0.35);
          }
        }

        .wn-team-card-image {
          position: relative;
          width: 100%;
          height: 60%;
          overflow: hidden;
          background: #111;
        }

        .wn-team-card-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: grayscale(0.9) contrast(0.95) brightness(0.78);
        }

        .wn-team-card-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            180deg,
            transparent 50%,
            rgba(0, 0, 0, 0.7) 100%
          );
          pointer-events: none;
        }

        .wn-team-card-meta {
          display: flex;
          justify-content: space-between;
          padding: 0.7rem 1rem 0;
          font-family: var(--font-pixel), monospace;
          font-size: 0.5rem;
          letter-spacing: 0.1em;
          color: rgba(232,230,227,0.4);
        }

        .wn-team-card-name {
          margin: 0.6rem 1rem 0;
          font-family: var(--font-whyte), sans-serif;
          font-size: clamp(2.2rem, 3.5vw, 3.5rem);
          font-weight: 400;
          line-height: 0.85;
          letter-spacing: -0.055em;
          text-transform: uppercase;
        }

        .wn-team-card-name span {
          color: rgba(232,230,227,0.4);
        }

        .wn-team-card-footer {
          position: absolute;
          bottom: 0.8rem;
          left: 1rem;
          right: 1rem;
          display: flex;
          justify-content: space-between;
          font-family: var(--font-pixel), monospace;
          font-size: 0.5rem;
          letter-spacing: 0.1em;
          color: rgba(232,230,227,0.45);
          padding-top: 0.8rem;
          border-top: 1px solid rgba(232,230,227,0.08);
          transition: color 0.25s ease, border-top-color 0.25s ease;
        }

        .wn-team-hint {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 1rem;
          margin-top: 1rem;
          font-family: var(--font-pixel), monospace;
          font-size: 0.55rem;
          letter-spacing: 0.12em;
          color: rgba(232,230,227,0.4);
        }

        .wn-team-hint span:first-child,
        .wn-team-hint span:last-child {
          font-size: 0.9rem;
          color: rgba(232,230,227,0.55);
        }

        @media (max-width: 700px) {
          .wn-team-card-wrap {
            flex: 0 0 280px;
            height: 420px;
          }

          .wn-team-card-name {
            font-size: 2rem;
          }
        }
      `}</style>
    </div>
  );
}
