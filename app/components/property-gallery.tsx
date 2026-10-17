"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import type { PropertyImage } from "../lib/properties";

export default function PropertyGallery({ images, title }: { images: PropertyImage[]; title: string }) {
  const [selected, setSelected] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const count = images.length;

  const move = useCallback(
    (amount: number) => setSelected((index) => (index + amount + count) % count),
    [count],
  );

  useEffect(() => {
    if (!lightbox) return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setLightbox(false);
      if (event.key === "ArrowRight") move(1);
      if (event.key === "ArrowLeft") move(-1);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [lightbox, move]);

  const imageElement = (image: PropertyImage, index: number, sizes: string) => (
    <Image
      src={image.src}
      alt={image.alt}
      fill
      sizes={sizes}
      priority={index === 0}
      unoptimized
      onError={(event) => { event.currentTarget.src = "/frames/frame_0001.jpg"; }}
    />
  );

  return (
    <>
      <div className="gallery" aria-label={`${title} image gallery`}>
        <button className="gallery-main" type="button" onClick={() => setLightbox(true)} aria-label={`Open image ${selected + 1} of ${count}`}>
          {imageElement(images[selected], selected, "(max-width: 780px) 100vw, 65vw")}
          <span className="gallery-count">{selected + 1} / {count} · View gallery</span>
        </button>
        {images.map((image, index) => index !== selected && (
          <button className="gallery-thumb" type="button" key={`${image.src}-${index}`} onClick={() => { setSelected(index); setLightbox(true); }} aria-label={`View image ${index + 1}`}>
            {imageElement(image, index, "(max-width: 780px) 50vw, 35vw")}
          </button>
        ))}
      </div>
      {lightbox && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label={`${title} image viewer`} onClick={() => setLightbox(false)}>
          <button className="lightbox-close" type="button" onClick={() => setLightbox(false)} aria-label="Close gallery">×</button>
          <button type="button" onClick={(event) => { event.stopPropagation(); move(-1); }} aria-label="Previous image">‹</button>
          <div className="lightbox-image" onClick={(event) => event.stopPropagation()}>
            {imageElement(images[selected], selected, "100vw")}
            <p>{images[selected].alt}</p>
          </div>
          <button type="button" onClick={(event) => { event.stopPropagation(); move(1); }} aria-label="Next image">›</button>
        </div>
      )}
    </>
  );
}
