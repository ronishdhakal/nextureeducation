import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Nexture Education",
    short_name: "Nexture",
    description: "Study abroad consultancy in Bagbazar, Kathmandu, Nepal.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#8b55ea",
    icons: [{ src: "/assets/nexture-icon.png", sizes: "512x512", type: "image/png", purpose: "any" }],
  };
}
