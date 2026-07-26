// @solidjs/router/fs

import { type RouteDefinition } from '@solidjs/router'
import { lazy } from 'solid-js'
import { pageRoutes, type FileRouteTreeEntry } from 'virtual:file-routes'

type RoutesFrom<T extends readonly FileRouteTreeEntry[]> = {
    [K in keyof T]: RouteFrom<T[K]>
}

type RouteFrom<T> = T extends { path: infer P extends string }
    ? Omit<RouteDefinition<P>, 'path' | 'children'> & {
        path: P
        children: T extends {
            children: infer C extends readonly FileRouteTreeEntry[]
        }
        ? RoutesFrom<C>
        : undefined
    }
    : never

function toRoutes<const T extends readonly FileRouteTreeEntry[]>(
    entries: T
): RoutesFrom<T> {
    return entries.map(entry => ({
        ...entry.$$route?.require().route,
        path: entry.path,
        component: entry.$component && lazy(entry.$component.import),
        children: entry.children && toRoutes(entry.children),
    })) as RoutesFrom<T>
}

export const routes: RoutesFrom<typeof pageRoutes> = toRoutes(pageRoutes)