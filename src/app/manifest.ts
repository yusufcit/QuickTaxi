import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Quick Taxi",
    short_name: "Quick Taxi",
    description: "Reliable local taxi booking requests in Ireland.",
    start_url: "/",
    display: "standalone",
    background_color: "#0f1d3a",
    theme_color: "#0f1d3a",
    icons: [
      {
        src: "/branding/quicktaxi-logo.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
