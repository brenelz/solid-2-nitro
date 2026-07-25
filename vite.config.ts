import { defineConfig } from 'vite'
import solid, { serverFunctions } from 'vite-plugin-solid'
import { nitro } from 'nitro/vite'

export default defineConfig({
  plugins: [
    serverFunctions(),
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
