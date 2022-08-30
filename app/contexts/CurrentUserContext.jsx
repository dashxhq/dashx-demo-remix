import jwtDecode from 'jwt-decode'
import { createContext, useContext, useEffect, useState } from 'react'

import dashx from '~/utils/dashx.client'

const CurrentUserContext = createContext(null)

const CurrentUserProvider = ({ children }) => {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const jwtToken = localStorage.getItem('jwt-token')
    const decodedUser = jwtToken ? jwtDecode(jwtToken).user : null
    setUser(decodedUser)
  }, [])
  
  const login = (jwtToken) => {
    localStorage.setItem('jwt-token', jwtToken)
    const decodedToken = jwtDecode(jwtToken)
    const dashxToken = decodedToken.dashx_token
    const decodedUser = decodedToken.user
    dashx.setIdentity(decodedUser.id, dashxToken)
    setUser(decodedUser)  
  }

  const logout = () => {
    dashx.reset()
    localStorage.removeItem('jwt-token')
    setUser(null)
  }

  return (
    <CurrentUserContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </CurrentUserContext.Provider>
  )
}

const useCurrentUserContext = () => useContext(CurrentUserContext)

export { useCurrentUserContext }
export default CurrentUserProvider
