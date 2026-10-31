import { defineConfig } from "@lovable.dev/vite-tanstack-config";

const basePath = process.env.BASE_PATH || "/";

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
    prerender: {
      enabled: true,
      crawlLinks: true,
      postProcess: (html) => {
        if (basePath === "/" || !basePath) return html;
        // Fix public static root references like /images/, /videos/, /favicon.ico to respect basePath
        return html
          .replaceAll('src="/images/', `src="${basePath}images/`)
          .replaceAll('src="/videos/', `src="${basePath}videos/`)
          .replaceAll('href="/favicon.ico"', `href="${basePath}favicon.ico"`);
      },
    },
  },
  vite: {
    base: basePath,
    define: {
      "import.meta.env.BASE_URL": JSON.stringify(basePath),
    },
  },
});
