"use client";

import { useEffect, useRef } from "react";

export default function ProjectGallery({ images, title }) {
  const trackRef = useRef(null);
  const resumeTimer = useRef(null);
  const animationRef = useRef(null);
  const isAutoScrolling = useRef(false);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || images.length === 0) return;

    // Start in the middle copy
    requestAnimationFrame(() => {
      track.scrollLeft = track.scrollWidth / 3;
    });

    const pauseAuto = () => {
      cancelAnimationFrame(animationRef.current);

      clearTimeout(resumeTimer.current);

      resumeTimer.current = setTimeout(() => {
        startAutoScroll();
      }, 2000);
    };

    const handleScroll = () => {
      if (!isAutoScrolling.current) {
        pauseAuto();
      }

      const third = track.scrollWidth / 3;

      // Infinite loop
      if (track.scrollLeft <= 20) {
        isAutoScrolling.current = true;
        track.scrollLeft += third;
        requestAnimationFrame(() => {
          isAutoScrolling.current = false;
        });
      }

      if (track.scrollLeft >= third * 2 - 20) {
        isAutoScrolling.current = true;
        track.scrollLeft -= third;
        requestAnimationFrame(() => {
          isAutoScrolling.current = false;
        });
      }
    };

    const startAutoScroll = () => {
      cancelAnimationFrame(animationRef.current);

      let lastTime = performance.now();

      const animate = (time) => {
        const delta = time - lastTime;
        lastTime = time;

        // VERY slow movement
        track.scrollLeft += delta * 0.025;

        isAutoScrolling.current = true;

        const third = track.scrollWidth / 3;

        if (track.scrollLeft >= third * 2 - 20) {
          track.scrollLeft -= third;
        }

        animationRef.current = requestAnimationFrame(animate);
      };

      animationRef.current = requestAnimationFrame(animate);
    };

    track.addEventListener("scroll", handleScroll);

    // Mouse / touch interaction
    const interactionStart = () => {
      pauseAuto();
    };

    track.addEventListener("pointerdown", interactionStart);
    track.addEventListener("wheel", interactionStart, { passive: true });

    startAutoScroll();

    return () => {
      cancelAnimationFrame(animationRef.current);
      clearTimeout(resumeTimer.current);

      track.removeEventListener("scroll", handleScroll);
      track.removeEventListener("pointerdown", interactionStart);
      track.removeEventListener("wheel", interactionStart);
    };
  }, [images]);

  // Triple the images = seamless infinite loop
  const infiniteImages = [...images, ...images, ...images];

  return (
    <div className="super-gallery">
      <div className="super-gallery-header">
        <h3>Gallery</h3>

        <div className="gallery-hint">
          <span>←</span>
          DRAG / SWIPE
          <span>→</span>
        </div>
      </div>

      <div
        ref={trackRef}
        className="super-gallery-track"
      >
        {infiniteImages.map((img, i) => (
          <div
            className="super-gallery-card"
            key={`${img}-${i}`}
          >
            <img
              src={img}
              alt={`${title} gallery ${i + 1}`}
              draggable="false"
              loading="lazy"
              decoding="async"
            />

            <div className="gallery-number">
              {String((i % images.length) + 1).padStart(2, "0")}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}