import { action, query } from '@solidjs/router'
import { respond } from '@solidjs/web'

let global = 'Hello World';

export const hello = query(async function () {
  'use server'
  console.log('on server!')
  await new Promise(resolve => setTimeout(resolve, 1000))
  return global;
}, 'hello')


export const changeText = action(async function () {
  'use server'
  global = 'Hello World 2';

  return respond({ ok: true });
});