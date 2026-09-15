import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
export default defineConfig({
  base: "./",
  plugins: [react()],
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react-dom/client",
      "react/jsx-runtime",
      "react/jsx-dev-runtime",
      "@react-three/fiber",
      "@react-three/drei/core/OrbitControls.js",
      "@react-three/drei/core/RoundedBox.js",
      "@react-three/drei/web/Html.js",
      "three",
      "lucide-react",
    ],
  },
  build: { chunkSizeWarningLimit: 1100 },
});
