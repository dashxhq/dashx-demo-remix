import type { MetaFunction } from "@remix-run/node"
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration
} from "@remix-run/react"

import styles from "./styles/app.css"
import dashXlogo from "../public/dashx_logo.svg"

export function links() {
  return [
    { rel: "stylesheet", href: styles },
    { rel: "icon", href: dashXlogo },
    { rel: "stylesheet", href: "https://rsms.me/inter/inter.css" }
  ]
}

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "DashX demo Remix",
  viewport: "width=device-width,initial-scale=1"
})

export default function App() {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  )
}
