"use client";

export function ArticleImage({ src, alt }: { src: string; alt: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
      onError={(e) => {
        const wrapper = (e.currentTarget as HTMLImageElement).closest(".news-thumb") as HTMLElement | null;
        if (wrapper) wrapper.style.display = "none";
      }}
    />
  );
}
