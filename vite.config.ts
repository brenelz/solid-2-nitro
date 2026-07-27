import { defineConfig } from 'vite'
import solid, { serverFunctions } from 'vite-plugin-solid'
import { fileRoutes } from 'filesystem-routing/vite'
import { nitro } from 'nitro/vite'

export default defineConfig({
  plugins: [
    serverFunctions(),
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
    solid({ ssr: {} }),
    nitro(),
  ],
  environments: {
    nitro: {
      resolve: {
        noExternal: ['@solidjs/router'],
      },
    },
    // Declared before `ssr`: nitro builds environments in declaration order,
    // and the ssr build inlines the client manifest (hashed entry + its CSS),
    // which only exists once the client build has run. The plugin fills in
    // this environment's input and `manifest: true`.
    client: {},
    // Configuring the ssr input opts the plugin into external-server mode
    // (patches/vite-plugin-solid@…): it keeps the generated entries, handler
    // and client manifest config, but leaves build wiring and serving to
    // nitro, which uses this entry's `{ fetch }` export as its SSR service.
    ssr: {
      build: {
        rollupOptions: {
          input: './src/ssr.ts',
        },
      },
    },
  },
})
