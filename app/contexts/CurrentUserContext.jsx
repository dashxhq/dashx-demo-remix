import { createContext, useContext } from 'react'

const CurrentUserContext = createContext(null)
const CurrentUserProvider = ({ children, user }) => {
  return (
    <CurrentUserContext.Provider value={{ user }}>
      {children}
    </CurrentUserContext.Provider>
  )
}

const useCurrentUserContext = () => useContext(CurrentUserContext)

export { useCurrentUserContext }
export default CurrentUserProvider
