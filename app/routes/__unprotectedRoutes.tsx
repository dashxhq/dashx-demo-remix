import type { LoaderFunction} from '@remix-run/server-runtime'
import { redirect } from '@remix-run/server-runtime'
import { Outlet } from 'react-router-dom'

import { getUser } from '~/utils/session.server'

export const loader: LoaderFunction = async ({ request }) => {
  const { user }: any = await getUser(request)
  if(user) {
    return redirect('/home')
  }

  return null
}

const UnprotectedRoutes = () =>  <Outlet />

export default UnprotectedRoutes
