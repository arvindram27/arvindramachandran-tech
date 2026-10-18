// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: "https://arvindramachandran.tech",
  // One trailing-slash policy across the site: no trailing slash, except for the root
  // URL itself (which is what the canonical tag and the sitemap emit for "/").
  trailingSlash: "never",
  integrations: [sitemap()],
  build: {
    inlineStylesheets: "always",
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
