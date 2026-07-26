import { createRouter, type RouteDefinition } from '@solidjs/router'
import { lazy, type Component } from 'solid-js'
import { pageRoutes } from 'virtual:file-routes'

/**
 * This app's emission adapter for `@solidjs/file-routes`.
 *
 * The Vite plugin scans `src/routes` with this app's naming convention (see
 * `toPath` in vite.config.ts) and serves the result from
 * `virtual:file-routes`. `pageRoutes` arrives already nested, so all that is
 * left is turning each entry into a `RouteDefinition`: a lazy component, plus
 * whatever the module's own `route` export declares (`/`'s preload now lives
 * in routes/Index.tsx).
 *
 * The mapping is typed rather than a plain `.map` on purpose. `paths` is
 * derived from the route table's *literal* type, and `RoutePaths` degrades to
 * `any` the moment the table is a `RouteDefinition[]` instead of a tuple —
 * so the tuple the generated declaration provides has to survive this step.
 */
type RouteFrom<E> = E extends { path: infer P extends string }
  ? {
      path: P
      component?: Component
      preload?: RouteDefinition['preload']
      info?: Record<string, unknown>
      children: E extends { children: infer C extends readonly unknown[] }
        ? { [K in keyof C]: RouteFrom<C[K]> }
        : undefined
    }
  : never

type Entry = {
  path: string
  $component?: { import(): Promise<Record<string, unknown>> }
  $$route?: { require(): Record<string, unknown> }
  children?: readonly Entry[]
}

function toRoutes<const T extends readonly Entry[]>(entries: T): { [K in keyof T]: RouteFrom<T[K]> } {
  return entries.map(entry => {
    // The manifest types module refs generically — it cannot know a page's
    // default export is a component, or what shape a `route` export has — so
    // an emission adapter is where those get named.
    const config = entry.$$route?.require().route as Partial<RouteDefinition> | undefined
    const load = entry.$component?.import as (() => Promise<{ default: Component }>) | undefined

    return {
      ...config,
      path: entry.path,
      component: load && lazy(load),
      children: entry.children && toRoutes(entry.children),
    }
  }) as { [K in keyof T]: RouteFrom<T[K]> }
}

export const Router = createRouter({ routes: toRoutes(pageRoutes) })

export const { paths } = Router
