import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebaseConfig";
import { Button } from "@/components/shadcn/button";
import { Input } from "@/components/shadcn/input";
import { Separator } from "@/components/shadcn/separator";
import { FcGoogle } from "react-icons/fc";
import { Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email.trim(), senha.trim());
      const token = await userCredential.user.getIdToken();
      localStorage.setItem("token", token);
      alert(`Login realizado com sucesso! Token salvo: ${token}`);
    } catch (error: unknown) {
      if (error instanceof Error) {
        // Resposta segura ao usuário
        setErro("E-mail ou senha inválidos.");
      }
    }
    // Limpa os campos após o login bem-sucedido
    setEmail("");
    setSenha("");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="w-full max-w-sm p-6 rounded-xl shadow-md border bg-white">
        <h1 className="text-2xl font-semibold text-center">Conecte-se</h1>

        <div className="flex gap-2 mt-6">
          <Button variant="outline" className="w-full flex items-center gap-2">
            <FcGoogle className="h-4 w-4" />
            Google
          </Button>
        </div>

        <div className="flex items-center my-6">
          <Separator className="flex-1" />
          <span className="mx-2 text-xs text-gray-500">OU CONTINUE COM</span>
          <Separator className="flex-1" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium">E-mail</label>
            <Input
              id="email"
              type="email"
              placeholder="e-mail@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="senha" className="block text-sm font-medium">Senha</label>
            <Input
              id="senha"
              type="password"
              placeholder="••••••••"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
            <div className="flex items-center justify-between mt-2">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" className="accent-blue-600 h-4 w-4" />
                Lembrar-me
              </label>
              <Link to="/autenticacao/esqueci-senha" className="text-sm text-blue-600 hover:underline">
                Esqueceu a senha?
              </Link>
            </div>
          </div>

          {erro && <p className="text-sm text-red-500">{erro}</p>}

          <Button
            type="submit"
            className="bg-[#FF9800] hover:bg-[#FB8C00] text-white font-poppins transition-transform transform hover:scale-105 w-full mt-2"
          >
            Entrar
          </Button>
        </form>

        <p className="text-sm text-center mt-4">
          Não tem uma conta?{" "}
          <Link to="/autenticacao/criar-conta" className="text-blue-600 hover:underline">
            Cadastre-se
          </Link>
        </p>

        <Link to="/" className="block mt-4 text-sm text-blue-600 hover:underline text-center">
          ← Voltar para a página inicial
        </Link>
      </div>
    </div>
  );
}
