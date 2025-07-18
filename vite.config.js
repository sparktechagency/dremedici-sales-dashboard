import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
 
export default defineConfig({
  plugins: [react()],
  server: {
    host: "31.97.128.5",
    // port: 4173,
  },
  build: {
    sourcemap: false,        
    minify: "esbuild",       
    chunkSizeWarningLimit: 600, 
  },
});