"use client";

import { useState } from "react";
import Image from "next/image";
import { getPlayerProfileImage } from "@/utils/image";

interface PlayerProfileImageProps {
  player_id: string;
  width?: number;
  height?: number;
  alt?: string;
  className?: string;
}

export default function PlayerProfileImage({
  player_id,
  width = 230,
  height = 300,
  alt = "Player",
  className,
}: PlayerProfileImageProps) {
  const [imgSrc, setImgSrc] = useState(getPlayerProfileImage(player_id));

  return (
    <Image
      src={imgSrc}
      width={width}
      height={height}
      alt={alt}
      className={className}
      loading="lazy"
      onError={() => setImgSrc("/assets/img/playerProfile/default.png")} // Fallback image
    />
  );
}
