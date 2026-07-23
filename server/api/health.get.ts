import { defineHandler } from 'nitro'

export default defineHandler(event => {
  return Response.json({
    status: 'ok',
    requestId: event.context.requestId,
  })
})
