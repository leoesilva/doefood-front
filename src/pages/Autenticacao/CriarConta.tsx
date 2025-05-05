import { Button } from "@/components/shadcn/button";
import { Input } from "@/components/shadcn/input";
import { Separator } from "@/components/shadcn/separator";
import { FcGoogle } from "react-icons/fc";
import { Link } from "react-router-dom";

export default function CriarConta() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="w-full max-w-sm p-6 rounded-xl shadow-md border bg-white">
        <h1 className="text-2xl font-semibold text-center mb-4">Criar Conta</h1>

        <form className="space-y-4">
          <div>
            <label htmlFor="nome" className="block text-sm font-medium">
              Nome da Empresa
            </label>
            <Input
              id="nome"
              type="text"
              placeholder="DoeFood Solidária"
              required
            />
          </div>

          <div>
            <label htmlFor="cnpj" className="block text-sm font-medium">
              CNPJ
            </label>
            <Input
              id="cnpj"
              type="text"
              placeholder="00.000.000/0001-00"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium">
              E-mail
            </label>
            <Input
              id="email"
              type="email"
              placeholder="empresa@email.com"
              required
            />
          </div>

          <div>
            <label htmlFor="senha" className="block text-sm font-medium">
              Senha
            </label>
            <Input
              id="senha"
              type="password"
              placeholder="••••••••"
              required
            />
          </div>

          <Button type="submit" className="bg-[#FF9800] hover:bg-[#FB8C00] text-white font-poppins transition-transform transform hover:scale-105 w-full mt-2">
            Cadastrar
          </Button>
        </form>

        <p className="text-sm text-center mt-4">
          Já tem uma conta?{" "}
          <Link
            to="/autenticacao/login"
            className="text-blue-600 hover:underline"
          >
            Faça login
          </Link>
        </p>

        <Link
          to="/"
          className="block mt-2 text-sm text-blue-600 hover:underline text-center"
        >
          ← Voltar para a página inicial
        </Link>
      </div>
    </div>
  );
}
