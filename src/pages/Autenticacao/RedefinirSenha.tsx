import { useState } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import { Button } from "@/components/shadcn/button";
import { Input } from "@/components/shadcn/input";
import { Eye, EyeOff } from "lucide-react";

function verificarForcaSenha(senha: string) {
  const regras = {
    tamanho: senha.length >= 8,
    maiuscula: /[A-Z]/.test(senha),
    minuscula: /[a-z]/.test(senha),
    numero: /\d/.test(senha),
    especial: /[!@#$%^&*(),.?":{}|<>]/.test(senha),
  };
  const totalRegras = Object.values(regras).filter(Boolean).length;
  let forca: "fraca" | "media" | "forte" = "fraca";
  if (totalRegras >= 4) forca = "forte";
  else if (totalRegras === 3) forca = "media";
  return { forca, regras };
}

export default function RedefinirSenha() {
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarSenhaConfirmar, setMostrarSenhaConfirmar] = useState(false);
  const [mostrarRegras, setMostrarRegras] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const navigate = useNavigate();
  const { token } = useParams<{ token: string }>();

  const url = `${import.meta.env.VITE_API_URL}/autenticacao/redefinir-senha/${token}`;

  const { forca, regras } = verificarForcaSenha(senha);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");
    setSucesso("");

    if (senha !== confirmarSenha) {
      setErro("As senhas não coincidem.");
      return;
    }
    if (!regras.tamanho || !regras.maiuscula || !regras.especial) {
      setErro("A senha não corresponde às orientações.");
      return;
    }

    try {
      const resp = await fetch(url, {
        method: 'POST',
        body: JSON.stringify({ novaSenha: senha }),
        headers: { 'Content-Type': 'application/json' }
      });
      if (resp.ok) {
        setSucesso("Senha redefinida com sucesso! Faça login.");
        console.log("Senha redefinida com sucesso!");
        setTimeout(() => navigate("/autenticacao/login"), 2000);
      } else {
        const data = await resp.json();
        console.error("Erro ao redefinir senha:", data);
        setErro(data.mensagem || "Erro ao redefinir senha.");
      }
    } catch {
      console.error("Erro inesperado ao redefinir senha.");
      setErro("Erro inesperado. Tente novamente.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="w-full max-w-sm p-6 rounded-xl shadow-md border bg-white">
        <h1 className="text-2xl font-semibold text-center">Redefinir senha</h1>

        <form onSubmit={handleSubmit} className="space-y-4 mt-6">
          <div className="relative">
            <label className="block text-sm font-medium">Nova senha</label>
            <div className="relative flex items-center">
              <Input
                type={mostrarSenha ? "text" : "password"}
                value={senha}
                onChange={e => setSenha(e.target.value)}
                onFocus={() => setMostrarRegras(true)}
                onBlur={() => setTimeout(() => setMostrarRegras(false), 150)}
                placeholder="Digite a nova senha"
                autoComplete="new-password"
              />
              <button
                type="button"
                className="absolute right-3 top-2"
                onClick={() => setMostrarSenha(v => !v)}
                tabIndex={-1}
              >
                {mostrarSenha ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
              {/* Tooltip com regras */}
              {mostrarRegras && (
                <div className="absolute z-10 top-0 right-full mr-4 w-[280px] bg-gray-800 text-white text-sm rounded-md shadow-lg p-4">
                  <div className="absolute top-4 -right-2 w-3 h-3 bg-gray-800 rotate-45 shadow-md" />
                  <p className="font-semibold mb-2">SUA SENHA DEVE CONTER:</p>
                  <ul className="space-y-1">
                    <li className={regras.maiuscula ? "text-green-400" : "text-gray-300"}>
                      <span className="font-bold">ABC</span> 1 letra maiúscula
                    </li>
                    <li className={regras.minuscula ? "text-green-400" : "text-gray-300"}>
                      <span className="font-bold">abc</span> 1 letra minúscula
                    </li>
                    <li className={regras.numero ? "text-green-400" : "text-gray-300"}>
                      <span className="font-bold">123</span> 1 número
                    </li>
                    <li className={regras.especial ? "text-green-400" : "text-gray-300"}>
                      <span className="font-bold">!</span> 1 caractere especial
                    </li>
                    <li className={regras.tamanho ? "text-green-400" : "text-gray-300"}>
                      <span className="font-bold">***</span> No mínimo 8 caracteres
                    </li>
                  </ul>
                </div>
              )}
            </div>
            {/* Barra de força da senha */}
            {senha && (
              <div className="mt-2">
                <div
                  className={`h-2 rounded transition-all ${
                    forca === "fraca"
                      ? "bg-red-400 w-1/3"
                      : forca === "media"
                      ? "bg-yellow-400 w-2/3"
                      : "bg-green-500 w-full"
                  }`}
                />
                <span
                  className={`text-xs font-semibold ml-1 ${
                    forca === "fraca"
                      ? "text-red-500"
                      : forca === "media"
                      ? "text-yellow-600"
                      : "text-green-600"
                  }`}
                >
                  {forca === "fraca"
                    ? "Senha fraca"
                    : forca === "media"
                    ? "Senha média"
                    : "Senha forte"}
                </span>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium">Confirme a nova senha</label>
            <div className="relative">
              <Input
                type={mostrarSenhaConfirmar ? "text" : "password"}
                value={confirmarSenha}
                onChange={e => setConfirmarSenha(e.target.value)}
                placeholder="Confirme a nova senha"
                autoComplete="new-password"
              />
              <button
                type="button"
                className="absolute right-3 top-2"
                onClick={() => setMostrarSenhaConfirmar(v => !v)}
                tabIndex={-1}
              >
                {mostrarSenhaConfirmar ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {erro && <p className="text-sm text-red-500">{erro}</p>}
          {sucesso && <p className="text-sm text-green-600">{sucesso}</p>}

          <Button
            type="submit"
            className="bg-[#FF9800] hover:bg-[#FB8C00] text-white font-poppins transition-transform transform hover:scale-105 w-full mt-2"
            disabled={
              senha.length < 8 ||
              senha !== confirmarSenha ||
              !regras.tamanho ||
              !regras.maiuscula ||
              !regras.especial
            }
          >
            Redefinir senha
          </Button>
        </form>

        <p className="text-sm text-center mt-4">
          Lembrou sua senha?{" "}
          <Link
            to="/autenticacao/login"
            className="text-blue-600 hover:underline"
          >
            Entrar
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
