"use client";

// Unsplash's CDN already resizes and compresses (auto=format), so point the
// browser straight at it instead of proxying through Next's optimiser.
// Everything else (local files, admin-supplied thumbnail URLs) passes through.
export default function imageLoader({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality?: number;
}) {
  if (!src.startsWith("https://images.unsplash.com/")) return src;

  const url = new URL(src);
  url.searchParams.set("w", String(width));
  url.searchParams.set("q", String(quality || 75));
  return url.toString();
}
