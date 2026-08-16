"use client";

import Link from "next/link";
import { useState } from "react";

export default function MemberCard({ member, index = 0 }) {

  const [hovered, setHovered] = useState(false);

  return (
    <Link
      href={`/team/${member.slug}`}
      className={`wn-member-card ${
        hovered ? "is-hovered" : ""
      }`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >

      {/* HEADER */}

      <div className="wn-member-header">

        <span>
          {String(index + 1).padStart(2, "0")}
        </span>

        <span>
          {member.category}
        </span>

      </div>

      {/* IMAGE */}

      <div className="wn-member-image">

      <img
        src={member.hero?.src}
        alt={member.hero?.alt || member.fullName}
        loading="lazy"
      />

        <div className="wn-member-image-overlay" />

        <div className="wn-member-scan" />

        <span className="wn-member-cross top-left" />
        <span className="wn-member-cross top-right" />
        <span className="wn-member-cross bottom-left" />
        <span className="wn-member-cross bottom-right" />

        <div className="wn-member-status">
          <span />
          PROFILE ONLINE
        </div>

      </div>

      {/* IDENTITY */}

      <div className="wn-member-body">

        <div>

          <span className="wn-member-role">
            {member.role}
          </span>

          <h2>
            {member.nickname}
            <span>.</span>
          </h2>

          <p>
            {member.bio}
          </p>

        </div>

        <div className="wn-member-arrow">
          ↗
        </div>

      </div>

      {/* FOOTER */}

      <div className="wn-member-footer">

        <span>
          {member.location}
        </span>

        <span>
          OPEN PROFILE →
        </span>

      </div>

      <style>{`

        .wn-member-card {
          position: relative;

          display: block;

          min-width: 0;

          background: #090909;

          color: #e8e6e3;

          text-decoration: none;

          overflow: hidden;

          transition:
            background .5s ease;
        }

        .wn-member-card:hover {
          background: #101010;
        }

        /* HEADER */

        .wn-member-header {
          display: flex;
          justify-content: space-between;

          padding: .8rem 1rem;

          border-bottom: 1px solid
            rgba(232,230,227,.1);

          font-family:
            var(--font-pixel, monospace);

          font-size: .52rem;

          letter-spacing: .1em;

          color: #555;
        }

        /* IMAGE */

        .wn-member-image {
          position: relative;

          margin: 1rem;

          overflow: hidden;

          aspect-ratio: 4 / 5;

          background: #111;
        }

        .wn-member-image img {
          width: 100%;
          height: 100%;

          display: block;

          object-fit: cover;

          filter:
            grayscale(1)
            contrast(.95)
            brightness(.8);

          transform: scale(1);

          transition:
            transform 1.2s
              cubic-bezier(.22,1,.36,1),
            filter .8s ease;
        }

        .wn-member-card:hover
        .wn-member-image img {

          transform: scale(1.045);

          filter:
            grayscale(.15)
            contrast(1)
            brightness(.9);
        }

        .wn-member-image-overlay {
          position: absolute;
          inset: 0;

          background:
            linear-gradient(
              180deg,
              transparent 55%,
              rgba(0,0,0,.65)
            );

          pointer-events: none;
        }

        /* SCAN */

        .wn-member-scan {
          position: absolute;

          left: 0;
          right: 0;

          top: -2px;

          height: 1px;

          background:
            rgba(232,230,227,.55);

          box-shadow:
            0 0 14px
            rgba(232,230,227,.35);

          opacity: .25;

          animation:
            wnMemberScan
            6s
            linear
            infinite;
        }

        @keyframes wnMemberScan {

          from {
            top: -2px;
          }

          to {
            top: calc(100% + 2px);
          }

        }

        /* CORNERS */

        .wn-member-cross {
          position: absolute;

          width: 12px;
          height: 12px;

          opacity: .7;
        }

        .top-left {
          top: 10px;
          left: 10px;

          border-top: 1px solid #aaa;
          border-left: 1px solid #aaa;
        }

        .top-right {
          top: 10px;
          right: 10px;

          border-top: 1px solid #aaa;
          border-right: 1px solid #aaa;
        }

        .bottom-left {
          bottom: 10px;
          left: 10px;

          border-bottom: 1px solid #aaa;
          border-left: 1px solid #aaa;
        }

        .bottom-right {
          bottom: 10px;
          right: 10px;

          border-bottom: 1px solid #aaa;
          border-right: 1px solid #aaa;
        }

        /* STATUS */

        .wn-member-status {

          position: absolute;

          left: 1rem;
          bottom: 1rem;

          display: flex;
          align-items: center;

          gap: .5rem;

          font-family:
            var(--font-pixel, monospace);

          font-size: .5rem;

          letter-spacing: .08em;

          color: rgba(232,230,227,.65);
        }

        .wn-member-status span {

          width: 5px;
          height: 5px;

          border-radius: 50%;

          background: #e8e6e3;

          box-shadow:
            0 0 10px
            rgba(232,230,227,.8);
        }

        /* BODY */

        .wn-member-body {

          display: flex;

          justify-content: space-between;

          gap: 1rem;

          padding:
            .5rem 1rem 1.5rem;
        }

        .wn-member-role {

          display: block;

          margin-bottom: .7rem;

          font-family:
            var(--font-pixel, monospace);

          font-size: .55rem;

          letter-spacing: .1em;

          color: #555;

          text-transform: uppercase;
        }

        .wn-member-body h2 {

          margin: 0;

          font-family:
            var(--font-whyte, sans-serif);

          font-size:
            clamp(3rem, 6vw, 6rem);

          font-weight: 400;

          line-height: .8;

          letter-spacing: -.06em;

          text-transform: uppercase;

          transition:
            transform .6s
            cubic-bezier(.22,1,.36,1);
        }

        .wn-member-body h2 span {
          color: #555;
        }

        .wn-member-card:hover
        .wn-member-body h2 {

          transform:
            translateX(.15em);
        }

        .wn-member-body p {

          max-width: 420px;

          margin:
            1.5rem 0 0;

          font-family:
            var(--font-whyte, sans-serif);

          font-size: .95rem;

          line-height: 1.5;

          color: #777;
        }

        /* ARROW */

        .wn-member-arrow {

          flex-shrink: 0;

          width: 45px;
          height: 45px;

          display: flex;
          align-items: center;
          justify-content: center;

          border: 1px solid
            rgba(232,230,227,.15);

          font-size: 1.2rem;

          color: #777;

          transition:
            transform .6s
              cubic-bezier(.22,1,.36,1),
            background .4s ease,
            color .4s ease;
        }

        .wn-member-card:hover
        .wn-member-arrow {

          transform:
            translate(4px,-4px);

          background: #e8e6e3;

          color: #090909;
        }

        /* FOOTER */

        .wn-member-footer {

          display: flex;
          justify-content: space-between;

          padding: .8rem 1rem;

          border-top:
            1px solid
            rgba(232,230,227,.1);

          font-family:
            var(--font-pixel, monospace);

          font-size: .5rem;

          letter-spacing: .08em;

          color: #444;

          transition:
            color .3s ease;
        }

        .wn-member-card:hover
        .wn-member-footer {

          color: #777;
        }

        @media (max-width: 600px) {

          .wn-member-image {
            aspect-ratio: 1 / 1;
          }

          .wn-member-body h2 {
            font-size: 3.5rem;
          }

        }

      `}</style>

    </Link>
  );
}