"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";

export default function ProjectCard({ project, index }) {
  const [isHovered, setIsHovered] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [showGallery, setShowGallery] = useState(false);
  const [isFading, setIsFading] = useState(false);
  const hoverTimerRef = useRef(null);
  const galleryIntervalRef = useRef(null);

  const hasGallery = Array.isArray(project.gallery) && project.gallery.length > 0;
  const totalGalleryImages = hasGallery ? project.gallery.length : 0;

  const startGalleryCycle = useCallback(() => {
    if (!hasGallery || totalGalleryImages <= 1) return;
    setShowGallery(true);
    setGalleryIndex(0);
    galleryIntervalRef.current = setInterval(() => {
      setIsFading(true);
      setTimeout(() => {
        setGalleryIndex((prev) => (prev + 1) % totalGalleryImages);
        setIsFading(false);
      }, 600);
    }, 2200);
  }, [hasGallery, totalGalleryImages]);

  const stopGalleryCycle = useCallback(() => {
    if (galleryIntervalRef.current) {
      clearInterval(galleryIntervalRef.current);
      galleryIntervalRef.current = null;
    }
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
    setShowGallery(false);
    setGalleryIndex(0);
    setIsFading(false);
  }, []);

  const handleMouseEnter = () => {
    setIsHovered(true);
    hoverTimerRef.current = setTimeout(() => {
      startGalleryCycle();
    }, 1200);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    stopGalleryCycle();
  };

  useEffect(() => {
    return () => stopGalleryCycle();
  }, [stopGalleryCycle]);

  const entranceDelay = index * 80;

  return (
    <Link
      href={`/work/${project.id}`}
      className="project-card"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        position: "relative",
        display: "block",
        borderRadius: "6px",
        overflow: "hidden",
        background: "#0a0a0a",
        textDecoration: "none",
        color: "inherit",
        opacity: 0,
        transform: "translateY(30px)",
        animation: `cardEnter 0.7s cubic-bezier(0.22, 1, 0.36, 1) ${entranceDelay}ms forwards`,
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: "16 / 10",
          overflow: "hidden",
          background: "#111",
        }}
      >
        <img
          src={project.coverImage || "/works/placeholder.jpg"}
          alt={project.title}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform: isHovered ? "scale(1.06)" : "scale(1)",
            filter: isHovered ? "brightness(0.35)" : "brightness(1)",
            transition: "transform 1.2s cubic-bezier(0.22, 1, 0.36, 1), filter 0.8s ease",
          }}
        />

        {hasGallery && showGallery && (
          <>
            {project.gallery.map((img, i) => (
              <img
                key={i}
                src={img}
                alt={`${project.title} ${i + 1}`}
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  opacity: i === galleryIndex ? (isFading ? 0 : 1) : 0,
                  transform: "scale(1.06)",
                  filter: "brightness(0.35)",
                  transition: "opacity 1.2s cubic-bezier(0.4, 0, 0.2, 1)",
                  pointerEvents: "none",
                  zIndex: i === galleryIndex ? 2 : 1,
                }}
              />
            ))}
          </>
        )}

        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            padding: "1.5rem",
            zIndex: 3,
            opacity: isHovered ? 1 : 0,
            transform: isHovered ? "translateY(0)" : "translateY(12px)",
            transition: "opacity 0.5s ease, transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.6rem",
              marginBottom: "0.5rem",
              opacity: isHovered ? 1 : 0,
              transform: isHovered ? "translateY(0)" : "translateY(8px)",
              transition: "opacity 0.4s ease 0.1s, transform 0.5s cubic-bezier(0.22, 1, 0.36, 1) 0.1s",
            }}
          >
            <span
              style={{
                fontSize: "0.65rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "rgba(232,230,227,0.7)",
              }}
            >
              {project.category}
            </span>
            <span style={{ color: "rgba(232,230,227,0.3)", fontSize: "0.6rem" }}>•</span>
            <span
              style={{
                fontSize: "0.65rem",
                letterSpacing: "0.08em",
                color: "rgba(232,230,227,0.5)",
              }}
            >
              {project.year}
            </span>
          </div>

          <h3
            style={{
              fontSize: "clamp(1.1rem, 2vw, 1.5rem)",
              fontWeight: 400,
              lineHeight: 1.15,
              margin: 0,
              color: "#e8e6e3",
              opacity: isHovered ? 1 : 0,
              transform: isHovered ? "translateY(0)" : "translateY(10px)",
              transition: "opacity 0.45s ease 0.15s, transform 0.55s cubic-bezier(0.22, 1, 0.36, 1) 0.15s",
            }}
          >
            {project.title}
          </h3>

          {project.location && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
                marginTop: "0.6rem",
                opacity: isHovered ? 1 : 0,
                transform: isHovered ? "translateY(0)" : "translateY(8px)",
                transition: "opacity 0.4s ease 0.25s, transform 0.5s cubic-bezier(0.22, 1, 0.36, 1) 0.25s",
              }}
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="rgba(232,230,227,0.5)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span
                style={{
                  fontSize: "0.75rem",
                  color: "rgba(232,230,227,0.55)",
                  letterSpacing: "0.02em",
                }}
              >
                {project.location}
              </span>
            </div>
          )}

          {Array.isArray(project.services) && project.services.length > 0 && (
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "0.35rem",
                marginTop: "0.7rem",
                opacity: isHovered ? 1 : 0,
                transform: isHovered ? "translateY(0)" : "translateY(6px)",
                transition: "opacity 0.35s ease 0.35s, transform 0.45s cubic-bezier(0.22, 1, 0.36, 1) 0.35s",
              }}
            >
              {project.services.slice(0, 3).map((svc, i) => (
                <span
                  key={i}
                  style={{
                    fontSize: "0.6rem",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    color: "rgba(232,230,227,0.45)",
                    padding: "0.2rem 0.5rem",
                    border: "1px solid rgba(232,230,227,0.12)",
                    borderRadius: "3px",
                  }}
                >
                  {svc}
                </span>
              ))}
              {project.services.length > 3 && (
                <span
                  style={{
                    fontSize: "0.6rem",
                    color: "rgba(232,230,227,0.3)",
                    padding: "0.2rem 0",
                  }}
                >
                  +{project.services.length - 3}
                </span>
              )}
            </div>
          )}

          {hasGallery && showGallery && totalGalleryImages > 1 && (
            <div
              style={{
                display: "flex",
                gap: "0.35rem",
                marginTop: "0.9rem",
                opacity: isHovered ? 1 : 0,
                transition: "opacity 0.3s ease 0.4s",
              }}
            >
              {project.gallery.map((_, i) => (
                <span
                  key={i}
                  style={{
                    width: i === galleryIndex ? "1.2rem" : "0.35rem",
                    height: "0.35rem",
                    borderRadius: "999px",
                    background: i === galleryIndex
                      ? "rgba(232,230,227,0.9)"
                      : "rgba(232,230,227,0.25)",
                    transition: "all 0.4s ease",
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}