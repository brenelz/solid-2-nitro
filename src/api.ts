import { query } from '@solidjs/router'
import { getRequestEvent } from '@solidjs/web'

export const hello = query(async function () {
  'use server'
  const event = getRequestEvent()
  console.log(event?.locals.requestId)
  console.log('on server')
  await new Promise(resolve => setTimeout(resolve, 1000))
  return 'Hello World'
}, 'hello')
