import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { BLOG_URL } from "./src/data/site.js";

// Keep the Blogspot address in src/data/site.js. This creates Netlify's
// address rules from that one setting whenever the site is built.
function netlifyRedirects() {
  return {
    name: "netlify-redirects",
    apply: "build",
    generateBundle() {
      this.emitFile({
        type: "asset",
        fileName: "_redirects",
        source: `/blog ${BLOG_URL} 301!\n/blog/* ${BLOG_URL} 301!\n/* /index.html 200\n`,
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), netlifyRedirects()],
});
