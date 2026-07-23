import { defineHandler } from 'nitro'
import 'virtual:solid-server-function-manifest'
import { handleServerFunctionRequest } from 'virtual:solid-server-function-handler'
import { createFlightDataCollector, createNoJSHandler } from '@solidjs/router/server'
import { Router } from '../../src/router.ts'

// Single-flight: the router's preload runner produces the revalidated route
// data for the post-mutation URL straight off the configured route tree —
// no app render involved.
const collectFlightData = createFlightDataCollector(Router)

// No-JS form posts redirect back (303) with the outcome in the router's
// flash cookie; the router seeds submission state from it on the next SSR.
const handleNoJS = createNoJSHandler()

export default defineHandler(event => handleServerFunctionRequest(event.req, {
  createEvent(request: Request) {
    return {
      request,
      locals: event.context,
      response: event.res,
    }
  },
  collectFlightData,
  handleNoJS,
}))
