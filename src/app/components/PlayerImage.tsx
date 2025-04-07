"use client";

import { useState } from "react";
import Image from "next/image";
import { getPlayerImage } from "@/utils/image";

interface PlayerImageProps {
  player_id: string;
  width?: number;
  height?: number;
  alt?: string;
  className?: string;
}

export default function PlayerImage({
  player_id,
  width = 65,
  height = 65,
  alt = "Player",
  className,
}: PlayerImageProps) {
  const [imgSrc, setImgSrc] = useState(getPlayerImage(player_id));

  return (
    <Image
      src={imgSrc}
      width={width}
      height={height}
      alt={alt}
      className={className}
      loading="lazy"
      onError={() => setImgSrc("/assets/img/player/default.webp")} // Fallback image
    />
  );
}
