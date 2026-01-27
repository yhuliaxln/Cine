// src/components/global/Spinner.jsx
import { Spinner as HeroSpinner } from "@heroui/react";

export default function Spinner({ color = "primary", ...props }) {
  return <HeroSpinner color={color} {...props} />;
}