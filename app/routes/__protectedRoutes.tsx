import { useLoaderData } from '@remix-run/react'
import { useState } from 'react'

import Navbar from '~/components/Navbar'
import Sidebar from '~/components/Sidebar'
import { getUser } from '~/utils/session.server'
import type { LoaderFunction } from '@remix-run/server-runtime'
import Content from '~/components/Content'

export const loader:LoaderFunction = async ({ request }) => {
  const user = await getUser(request)
  return user
}

const ProtectedRoutes = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const { user } = useLoaderData()
  return (
    <>
      <Sidebar setSidebarOpen={setSidebarOpen} sidebarOpen={sidebarOpen} />
      <Navbar user={user} setSidebarOpen={setSidebarOpen} />
      <Content/>
    </>
  )
}

export default ProtectedRoutes
