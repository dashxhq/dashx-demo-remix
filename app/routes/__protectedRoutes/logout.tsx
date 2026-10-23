import type { LoaderFunction } from '@remix-run/server-runtime'
import { logout } from '~/utils/session.server'

export const loader: LoaderFunction = async ({request}) => {
  return logout(request)
}
