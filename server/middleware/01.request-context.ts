import { defineHandler } from 'nitro'

export default defineHandler(event => {
  const requestId = crypto.randomUUID()

  event.context.requestId = requestId
  event.req.headers.set('x-request-id', requestId)
})
