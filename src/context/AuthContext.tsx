import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { auth } from '@/lib/firebaseConfig'
import { onAuthStateChanged, signOut } from 'firebase/auth'

interface User {
  nome: string
  email: string
  uid: string
}

interface AuthContextType {
  user: User | null
  logout: () => void
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  logout: () => {},
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          nome: firebaseUser.displayName || '',
          email: firebaseUser.email || '',
          uid: firebaseUser.uid,
        })
      } else {
        setUser(null)
      }
    })
    return () => unsubscribe()
  }, [])

  const logout = () => signOut(auth)

  return (
    <AuthContext.Provider value={{ user, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}