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
  const offsetRef = useRef(0);
  const targetOffsetRef = useRef(0);
  const rafRef = useRef(null);
  const resumeTimerRef = useRef(null);
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, offset: 0 });
  const isUserInteractingRef = useRef(false);
  const dragDistanceRef = useRef(0);
  const didDragRef = useRef(false);

  const [isDragging, setIsDragging] = useState(false);

  const RESUME_DELAY = 1000; // ms after release before auto-scroll resumes
  const CLICK_DRAG_THRESHOLD = 6; // px of movement before a drag cancels the click

  // Triple the list for seamless infinite looping
  const looped = [...members, ...members, ...members];
  const itemCount = looped.length;

  useEffect(() => {
    const track = trackRef.current;
    if (!track || members.length === 0) return;

    // The visible viewport width (parent carousel, not the track itself)
    const viewport = track.parentElement;
    const getViewportWidth = () => viewport?.offsetWidth || window.innerWidth;

    // Fallback card width matching CSS (.wn-team-card-wrap { flex: 0 0 320px })
    const FALLBACK_CARD_W = 320;
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

    let lastTime = performance.now();

    const animate = (time) => {
      const delta = Math.min(time - lastTime, 64);
      lastTime = time;

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

      // Apply transforms to each item
      itemRefs.current.forEach((el, i) => {
        if (!el) return;

        // Update cardW if real measurement becomes available
        if (el.offsetWidth > 0 && el.offsetWidth !== cardW) {
          // Don't update mid-frame; rely on next frame
        }

        const itemCenter =
          i * itemSlot + cardW / 2 - offsetRef.current;

        const dist = itemCenter - viewportCenter;

        // Use a wider denominator so more cards remain visible
        // (i.e. the curve is gentler and spans a larger portion of the viewport)
        const t = Math.max(
          -1.4,
          Math.min(1.4, dist / (viewportW * 0.6))
        );

        const t2 = t * t;

        // Tamed curve: less depth, less shrink, less fade, less rotation
        // so that even cards at the edges stay visible (just smaller & dimmer)
        const depth = 280;
        const shrink = 0.22;
        const fade = 0.45;
        const rot = 8;

        const z = -depth * t2;
        const scale = 1 - shrink * t2;
        const opacity = Math.max(0, 1 - fade * t2);
        const rotateY = rot * t;

        el.style.transform = `
          translate3d(0, 0, ${z}px)
          scale(${scale})
          rotateY(${rotateY}deg)
        `;
        el.style.opacity = opacity;
        el.style.zIndex = Math.round(100 - t2 * 100);
        el.style.filter = `blur(${Math.min(2.5, t2 * 2.2)}px)`;
        el.style.pointerEvents = t2 < 0.18 ? "auto" : "none";
      });

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    // Recompute on resize and after layout settles
    const handleResize = () => {
      computeOffset();
    };
    window.addEventListener("resize", handleResize);

    // Also re-measure after a short delay in case layout wasn't ready
    const remeasureTimer = setTimeout(() => {
      computeOffset();
    }, 100);

    return () => {
      cancelAnimationFrame(rafRef.current);
      clearTimeout(resumeTimerRef.current);
      clearTimeout(remeasureTimer);
      window.removeEventListener("resize", handleResize);
    };
  }, [members]);

  /* --------------------- INTERACTION --------------------- */

  const handlePointerDown = (event) => {
    isUserInteractingRef.current = true;
    isDraggingRef.current = true;
    dragDistanceRef.current = 0;
    didDragRef.current = false;
    setIsDragging(true);
    dragStartRef.current = {
      x: event.clientX,
      offset: targetOffsetRef.current,
    };

    if (event.currentTarget) {
      event.currentTarget.setPointerCapture?.(event.pointerId);
    }
  };

  const handlePointerMove = (event) => {
    if (!isDraggingRef.current) return;
    const dx = event.clientX - dragStartRef.current.x;
    dragDistanceRef.current = Math.max(dragDistanceRef.current, Math.abs(dx));
    if (dragDistanceRef.current > CLICK_DRAG_THRESHOLD) {
      didDragRef.current = true;
    }
    targetOffsetRef.current = dragStartRef.current.offset - dx * 1.4;
    offsetRef.current = targetOffsetRef.current;
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
    setIsDragging(false);
    clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = setTimeout(() => {
      isUserInteractingRef.current = false;
    }, RESUME_DELAY);
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
            >
              <div className="wn-team-card-image">
                <img
                  src={member.hero?.src}
                  alt={member.hero?.alt || member.fullName}
                  draggable="false"
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
          min-height: 520px;
          padding: 4rem 0 2rem;
          perspective: 1400px;
          perspective-origin: 50% 50%;
          -webkit-mask-image: linear-gradient(
            to right,
            transparent 0%,
            black 10%,
            black 90%,
            transparent 100%
          );
          mask-image: linear-gradient(
            to right,
            transparent 0%,
            black 10%,
            black 90%,
            transparent 100%
          );
        }

        .wn-team-track {
          display: flex;
          align-items: center;
          justify-content: flex-start;
          gap: 28px;
          padding: 2rem 0 4rem;
          transform-style: preserve-3d;
          width: max-content;
          touch-action: pan-y;
          user-select: none;
          -webkit-user-select: none;
        }

        .wn-team-card-wrap {
          flex: 0 0 320px;
          height: 440px;
          transform-style: preserve-3d;
          will-change: transform, opacity, filter;
          transition: filter 0.2s ease;
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
          transform-style: preserve-3d;
          transition: background 0.5s ease, border-color 0.5s ease;
        }

        .wn-team-card:hover {
          background: #111;
          border-color: rgba(232,230,227,0.28);
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
          transform: scale(1);
          transition: transform 1.2s cubic-bezier(0.22, 1, 0.36, 1),
                      filter 0.8s ease;
        }

        .wn-team-card:hover .wn-team-card-image img {
          transform: scale(1.06);
          filter: grayscale(0.15) contrast(1) brightness(0.95);
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
            flex: 0 0 240px;
            height: 360px;
          }

          .wn-team-card-name {
            font-size: 2rem;
          }
        }
      `}</style>
    </div>
  );
}
