import { createContext } from 'react'

export interface AuthContextType {
  userId?: string
  loaded: boolean
  loggedIn: boolean
  logout: () => void
  login: () => Promise<void>
  getToken: () => Promise<string | undefined>
}

export const AuthContext = createContext({} as AuthContextType)
