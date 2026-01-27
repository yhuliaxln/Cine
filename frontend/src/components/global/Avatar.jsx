// src/components/global/Avatar.jsx
import { Avatar as HeroAvatar } from "@heroui/react";

export default function Avatar({ src, name, size = "md", radius = "full", ...props }) {
  return <HeroAvatar src={src} name={name} size={size} radius={radius} {...props} />;
}