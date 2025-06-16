import React, { useState, useEffect } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebaseConfig";
import { Button } from "@/components/shadcn/button";
import { Input } from "@/components/shadcn/input";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [lembrarMe, setLembrarMe] = useState(false);
  const [erro, setErro] = useState("");
  const navigate = useNavigate();

  // Ao carregar, verifica se há dados salvos
  useEffect(() => {
    const emailSalvo = localStorage.getItem("lembrarEmail");
    if (emailSalvo) {
      setEmail(emailSalvo);
      setLembrarMe(true);
    }
  }, []);

  // Ao marcar/desmarcar o checkbox
  const handleLembrarMe = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLembrarMe(e.target.checked);
    if (!e.target.checked) {
      localStorage.removeItem("lembrarEmail");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email.trim(),
        senha.trim()
      );
      const token = await userCredential.user.getIdToken();
      localStorage.setItem("token", token);

      // Busca o tipo do usuário no backend e redireciona conforme o tipo
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/usuarios/${userCredential.user.uid}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Erro ao buscar dados do usuário");

      const usuario = await response.json();

      // Verifica se o backend retorna o tipo diretamente ou dentro de um objeto 'usuario'
      const tipo = usuario.tipo || (usuario.usuario && usuario.usuario.tipo);

      if (tipo) {
        // Salva o tipo no localStorage para usar depois no painel
        localStorage.setItem("tipoUsuario", tipo);

        if (tipo === "doador") {
          navigate("/doador", { replace: true });
        } else if (tipo === "beneficiario") {
          navigate("/beneficiario", { replace: true });
        } else {
          setErro("Tipo de usuário não reconhecido.");
        }
      } else {
        setErro("Tipo de usuário não encontrado.");
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setErro("E-mail ou senha inválidos.");
      }
    }

    // Salva ou remove o e-mail conforme a opção "Lembrar-me"
    if (lembrarMe) {
      localStorage.setItem("lembrarEmail", email);
    } else {
      localStorage.removeItem("lembrarEmail");
    }

    // Limpa os campos após o login
    setEmail("");
    setSenha("");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="w-full max-w-sm p-6 rounded-xl shadow-md border bg-white">
        <h1 className="text-2xl font-semibold text-center">Conecte-se</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium">
              E-mail
            </label>
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
            <label htmlFor="senha" className="block text-sm font-medium">
              Senha
            </label>
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
                <input
                  type="checkbox"
                  className="accent-blue-600 h-4 w-4"
                  checked={lembrarMe}
                  onChange={handleLembrarMe}
                />
                Lembrar-me
              </label>
              <Link
                to="/autenticacao/esqueci-senha"
                className="text-sm text-blue-600 hover:underline"
              >
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
          <Link
            to="/autenticacao/criar-conta"
            className="text-blue-600 hover:underline"
          >
            Cadastre-se
          </Link>
        </p>

        <Link
          to="/"
          className="block mt-4 text-sm text-blue-600 hover:underline text-center"
        >
          ← Voltar para a página inicial
        </Link>
      </div>
    </div>
  );
}
