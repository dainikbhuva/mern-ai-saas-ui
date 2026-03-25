import { createContext, useContext, useMemo, useState } from 'react'

type AuthContextValue = {
  token: string | null
  isAuthenticated: boolean
  login: (token: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

const STORAGE_KEY = 'auth_token'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() => {
    const existing = localStorage.getItem(STORAGE_KEY)
    return existing && existing.length > 0 ? existing : null
  })

  const value = useMemo<AuthContextValue>(() => {
    return {
      token,
      isAuthenticated: Boolean(token),
      login: (nextToken: string) => {
        localStorage.setItem(STORAGE_KEY, nextToken)
        setToken(nextToken)
      },
      logout: () => {
        localStorage.removeItem(STORAGE_KEY)
        setToken(null)
      },
    }
  }, [token])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
