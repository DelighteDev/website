import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
// Netlify serves the app for direct visits to any page address.
function netlifyRedirects() {
  return {
    name: "netlify-redirects",
    apply: "build",
    generateBundle() {
      this.emitFile({
        type: "asset",
        fileName: "_redirects",
        source: "/* /index.html 200\n",
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), netlifyRedirects()],
});
