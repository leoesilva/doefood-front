import { Button } from "@/components/shadcn/button"
import { Input } from "@/components/shadcn/input"
import { Link } from "react-router-dom"


export default function EsqueceuSenha() {
  return (
    <div className="w-full h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-sm mx-auto p-6 rounded-xl shadow-md border bg-white">
        <h1 className="text-2xl font-semibold text-center">Recuperar senha</h1>
        <p className="text-sm text-gray-500 text-center mt-1">
          Digite seu e-mail para receber instruções de redefinição da senha.
        </p>

        <form className="space-y-4 mt-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium">
              E-mail
            </label>
            <Input
              id="email"
              type="email"
              placeholder="e-mail@gmail.com"
              required
            />
          </div>

          <Button type="submit" className="bg-[#FF9800] hover:bg-[#FB8C00] text-white font-poppins transition-transform transform hover:scale-105 w-full mt-2">
            Enviar instruções
          </Button>
        </form>

        <div className="text-center mt-4">
          <Link
            to="/autenticacao/login"
            className="block mt-4 text-sm text-blue-600 hover:underline text-center"
          >
            Voltar para o login
          </Link>
        </div>
      </div>
    </div>
  )
}
