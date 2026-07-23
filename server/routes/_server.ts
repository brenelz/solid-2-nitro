import { defineHandler } from 'nitro'
import 'virtual:solid-server-function-manifest'
import { handleServerFunctionRequest } from 'virtual:solid-server-function-handler'

export default defineHandler(event => handleServerFunctionRequest(event.req, {
  createEvent(request: Request) {
    return {
      request,
      locals: event.context,
      response: event.res,
    }
  },
}))
