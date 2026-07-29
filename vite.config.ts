import { defineConfig } from 'vite'
import solid from 'vite-plugin-solid'
import { fileRoutes } from 'filesystem-routing/vite'
import { nitro } from 'nitro/vite'

export default defineConfig({
  plugins: [
    fileRoutes({
      // This app's own convention: PascalCase component files, `Index` at the
      // root, `NotFound` as the catch-all. `toPath` gets the file relative to
      // `dir` without its extension, and returns a route path (or nothing, to
      // skip the file).
      toPath: routeFile => {
        const name = routeFile.slice(1)
        if (name === 'Index') return '/'
        if (name === 'NotFound') return '/*404'
        return '/' + name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()
      },
      // Generate the manifest's declaration, so the route table reaches
      // `createRouter` as a literal tuple and `paths` stays typed.
      types: true,
    }),
    // Let Nitro orchestrate before Solid's post-order build fallback.
    nitro(),
    solid({
      ssr: { external: true },
      serverFunctions: { configure: './src/server-config.ts' },
    }),
  ],
  environments: {
    nitro: {
      resolve: {
        noExternal: ['@solidjs/router'],
      },
    },
    ssr: {
      build: {
        rollupOptions: {
          input: './src/ssr.ts',
        },
      },
    },
  },
})
