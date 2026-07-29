import { HydrationScript, type JSX } from '@solidjs/web'

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
