
/**
 * AuthContext.tsx
 * 
 * Caminho do arquivo: /src/context/AuthContext.tsx
 * 
 * Este arquivo define o contexto de autenticação para a aplicação React.
 * 
 * - Define as interfaces `User` e `AuthContextType` para tipagem dos dados do usuário e das funções de autenticação.
 * - Cria o contexto `AuthContext` com valores padrão.
 * - Fornece o componente `AuthProvider` para encapsular a aplicação e disponibilizar o contexto.
 * - Implementa as funções `login` e `logout` para manipulação do estado de autenticação.
 * - Exporta o hook `useAuth` para facilitar o acesso ao contexto em outros componentes.
 */

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
