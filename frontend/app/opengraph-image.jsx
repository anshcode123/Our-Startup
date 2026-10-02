import { ImageResponse } from "next/og";
import { OgImageContent } from "@/lib/og-image-content";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Anshul.dev â€” Software Development Studio";

export default function OpengraphImage() {
  return new ImageResponse(<OgImageContent />, { ...size });
}
