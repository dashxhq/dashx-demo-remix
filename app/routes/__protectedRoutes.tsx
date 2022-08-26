import type { LoaderFunction } from '@remix-run/node'
import { redirect } from '@remix-run/node'
import { json } from '@remix-run/node'
import { Outlet, useLoaderData } from '@remix-run/react'
import { useState } from 'react'

import CurrentUserProvider from '~/contexts/CurrentUserContext'
import Navbar from '~/components/Navbar'
import Sidebar from '~/components/Sidebar'
import { getUser } from '~/utils/session.server'

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUser(request)
  if (!user) {
    return redirect('/login')
  }
  
  return json(user)
}

const Index = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const user = useLoaderData()

  return (
    <CurrentUserProvider user={user}>
      <Sidebar setSidebarOpen={setSidebarOpen} sidebarOpen={sidebarOpen} />
      <Navbar setSidebarOpen={setSidebarOpen} />
      <Outlet />
    </CurrentUserProvider>
  )
}

export default Index
