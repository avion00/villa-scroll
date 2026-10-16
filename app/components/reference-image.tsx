"use client";

import Image from "next/image";
import { useState } from "react";

export default function ReferenceImage({
  src,
  alt,
  sizes,
  priority = false,
}: {
  src: string;
  alt: string;
  sizes: string;
  priority?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  return (
    <Image
      src={failed ? "/frames/frame_0001.jpg" : src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      unoptimized
      className="cover-image"
      onError={() => setFailed(true)}
    />
  );
}
