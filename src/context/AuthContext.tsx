import { createContext, useContext, useState, ReactNode } from 'react'

// 1. Definindo a interface dos dados do usuário e do contexto
interface User {
  nome: string
  email: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, senha: string) => boolean
  logout: () => void
}

// 2. Criando o contexto com valor padrão "vazio" (falso) para evitar erro de tipo
const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => false,
  logout: () => { },
})

// 3. Provedor do contexto
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  const login = (email: string, senha: string) => {
    if (email === "doador@doefood.com" && senha === "1234") {
      setUser({ nome: "Doador Teste", email });
      return true;
    } if (email === "beneficiario@doefood.com" && senha === "1234") {
      setUser({ nome: "Beneficiario Teste", email });
      return true;
    }
    return false;
  };

  const logout = () => setUser(null)

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// 4. Hook para acessar o contexto
export function useAuth() {
  return useContext(AuthContext)
}
