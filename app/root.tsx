import type { MetaFunction } from "@remix-run/node"
import { json } from "@remix-run/node"
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData
} from "@remix-run/react"

import styles from "./styles/app.css"
import dashXlogo from "../public/dashx_logo.svg"
import CurrentUserProvider from './contexts/CurrentUserContext'

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
  viewport: "width=device-width,initial-scale=1",
  description: "DashX Demo App using Remix.js"
})

export async function loader() {
  const env = {
    DASHX_BASE_URI: process.env.DASHX_BASE_URI,
    DASHX_PUBLIC_KEY: process.env.DASHX_PUBLIC_KEY,
    DASHX_TARGET_ENVIRONMENT: process.env.DASHX_TARGET_ENVIRONMENT
  }

  return json(env)
}

export default function App() {
  const env = useLoaderData()

  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <CurrentUserProvider>
        <Outlet />
        </CurrentUserProvider>
        <script
          dangerouslySetInnerHTML={{
            __html: `window.env = ${JSON.stringify(env)}`
          }}
        />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  )
}
