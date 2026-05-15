"use client";
import { useState } from "react";
import Image from "next/image";

/**
 * Lite YouTube embed — renders a thumbnail with a play overlay.
 * Loads the actual iframe only when clicked, keeping the page light.
 */
export function LiteYouTube({
  id,
  title,
  thumbnail,
  className,
}: {
  id: string;
  title: string;
  thumbnail?: string;
  className?: string;
}) {
  const [active, setActive] = useState(false);
  const src = thumbnail || `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;

  if (active) {
    return (
      <div className={`relative aspect-video w-full overflow-hidden rounded-2xl bg-black ${className ?? ""}`}>
        <iframe
          src={`https://www.youtube.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`}
          title={title}
          className="absolute inset-0 h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setActive(true)}
      className={`group relative aspect-video w-full overflow-hidden rounded-2xl bg-black ${className ?? ""}`}
      aria-label={`Play: ${title}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={title}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10" />
      <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 inline-flex h-16 w-16 items-center justify-center rounded-full bg-white/95 text-yale shadow-lift transition-all group-hover:scale-110 group-hover:bg-white">
        <svg viewBox="0 0 24 24" className="ml-1 h-7 w-7" fill="currentColor">
          <path d="M8 5v14l11-7z" />
        </svg>
      </span>
    </button>
  );
}
