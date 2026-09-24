import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

/**
 * Preloads the hero photograph from the HTML head.
 *
 * The landing page and the atlas both have their LCP set by the hero `<img>`.
 * `fetchpriority="high"` on the image only helps once the browser knows it
 * exists, and it cannot know until React has rendered — after ~195 KB of
 * JavaScript has been fetched and parsed. The preload moves discovery to the
 * first bytes of the document, so the photograph downloads alongside the
 * bundle rather than queueing behind it.
 *
 * The filename is hashed at build time, so the href is read from the bundle
 * rather than hardcoded — a hardcoded path would rot on the next build and
 * leave a 404 preload in the head.
 */
function preloadHero() {
  return {
    name: "verso-preload-hero",
    enforce: "post" as const,
    apply: "build" as const,
    transformIndexHtml(html: string, ctx: { bundle?: Record<string, unknown> }) {
      const hero = Object.keys(ctx.bundle ?? {}).find((f) =>
        /assets\/registan-[^/]+\.(avif|webp|jpe?g)$/i.test(f),
      );
      // No match means the hero was renamed or removed; injecting nothing is
      // the correct outcome, not a guess.
      if (!hero) return html;
      return {
        html,
        tags: [{
          tag: "link",
          attrs: { rel: "preload", as: "image", href: `/${hero}`, fetchpriority: "high" },
          injectTo: "head" as const,
        }],
      };
    },
  };
}

export default defineConfig({
  plugins: [react(), preloadHero()],
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
  server: {
    port: 3000,
    proxy: {
      "/api": { target: "http://localhost:5000", changeOrigin: true },
    },
  },
  build: {
    // Slightly larger source maps in exchange for readable production
    // stack traces. The app already ships an ErrorBoundary that logs the
    // component stack; without maps those logs point at minified names
    // and are effectively unusable for diagnosing a real user's crash.
    sourcemap: true,
    rollupOptions: {
      output: {
        // Split the long-lived dependencies out of the app chunk.
        //
        // React, framer-motion and Radix change only when their versions do,
        // which is a handful of times a year. Pinned to their own files, a
        // normal deploy re-downloads app code alone instead of invalidating
        // them in every returning visitor's cache.
        //
        // They are deliberately grouped rather than split one-per-package:
        // react/react-dom/scheduler are a single unit that must not
        // initialise out of order, and framer-motion + Radix are both
        // needed by the very first screen anyway, so splitting them further
        // would only add round-trips.
        manualChunks(id) {
          if (!id.includes("node_modules")) return;
          if (/[\/]node_modules[\/](react|react-dom|scheduler|react-router|react-router-dom)[\/]/.test(id)) {
            return "vendor-react";
          }
          if (/[\/]node_modules[\/](framer-motion|motion-dom|motion-utils)[\/]/.test(id)) {
            return "vendor-motion";
          }
          if (/[\/]node_modules[\/](@radix-ui|axios|zustand|clsx|tailwind-merge)[\/]/.test(id)) {
            return "vendor-ui";
          }
        },
      },
    },
    // With the vendor chunks carved out, the remaining app chunk sits well
    // under Rollup's default 500 KB advisory. Kept explicit so the warning
    // stays meaningful instead of being permanently silenced.
    chunkSizeWarningLimit: 500,
  },
});
