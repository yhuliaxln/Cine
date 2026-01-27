// src/components/global/Alert.jsx
import { Alert as HeroAlert } from "@heroui/react";

export default function Alert({ title, description, color = "success", ...props }) {
  return <HeroAlert title={title} description={description} color={color} {...props} />;
}