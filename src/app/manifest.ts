import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Best of Ghana - Curated Tourism Guide",
    short_name: "Best of Ghana",
    description: "Your journey. Our insight. Curated independent guide to Ghana destinations, culture, dining, and transport.",
    start_url: "/",
    display: "standalone",
    background_color: "#FDFBF7",
    theme_color: "#0B6623",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}

