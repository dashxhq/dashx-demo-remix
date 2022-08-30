import { Outlet, useLocation } from '@remix-run/react'
import { useState } from 'react'

import  { useCurrentUserContext } from '~/contexts/CurrentUserContext'
import Navbar from '~/components/Navbar'
import Sidebar from '~/components/Sidebar'
import { Navigate } from 'react-router-dom'

const ProtectedRoutes = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const location = useLocation()
  const { user }: any = useCurrentUserContext()
  if(!user){
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }

  return (
    <>
      <Sidebar setSidebarOpen={setSidebarOpen} sidebarOpen={sidebarOpen} />
      <Navbar setSidebarOpen={setSidebarOpen} />
      <Outlet />
    </>
  )
}

export default ProtectedRoutes
