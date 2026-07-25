import { HydrationScript, type JSX } from '@solidjs/web'

// Document shell rendered by both entries. In turnkey's authored-entry
// mode the handler injects the dev head (Vite client + style patch) and
// doctype itself, but not the client entry script — that uses the classic
// convention: reference the dev path here and the handler rewrites it to
// the hashed build entry in prod.
export default function Document(props: {
  children: JSX.Element
}) {
  return (
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <link rel="icon" type="image/svg+xml" href="/vite.svg" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Solid SSR Lab</title>
        <HydrationScript />
      </head>
      <body>
        <div id="root">{props.children}</div>
      </body>
    </html>
  )
}
