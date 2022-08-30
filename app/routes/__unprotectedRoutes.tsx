import { Navigate, Outlet } from 'react-router-dom'
import { useCurrentUserContext } from '~/contexts/CurrentUserContext'

const UnprotectedRoutes = () => {
  const { user }: any = useCurrentUserContext()
  if (user) {
    return <Navigate to="/home" replace />
  }

  return <Outlet />
}

export default UnprotectedRoutes
