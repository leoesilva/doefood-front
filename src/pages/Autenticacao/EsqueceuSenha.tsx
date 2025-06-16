import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/shadcn/button";
import { Input } from "@/components/shadcn/input";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function EsqueceuSenha() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email) {
      toast.error("Por favor, insira um e-mail válido.");
      return;
    }
    try {
      const respPromise = fetch(`${import.meta.env.VITE_API_URL}/autenticacao/recuperar-senha`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      respPromise.then((resp) => {
        if (resp.ok) {
          toast.success(
            "Instruções de recuperação de senha enviadas com sucesso! Verifique seu e-mail."
          );
          setTimeout(() => {
            navigate("/autenticacao/login");
          }, 2000);
        } else if (resp.status === 404) {
          toast.error("E-mail não encontrado. Por favor, verifique e tente novamente.");
        } else {
          toast.error("Ocorreu um erro ao enviar as instruções. Tente novamente.");
        }
      });
    } catch (error) {
      console.error("Erro ao enviar instruções de recuperação:", error);
      alert("Ocorreu um erro ao enviar as instruções. Tente novamente.");
    }
  };

  return (
    <div className="w-full h-screen flex items-center justify-center bg-gray-100">
      <ToastContainer />
      <div className="w-full max-w-sm mx-auto p-6 rounded-xl shadow-md border bg-white">
        <h1 className="text-2xl font-semibold text-center">Recuperar senha</h1>
        <p className="text-sm text-gray-500 text-center mt-1">
          Digite seu e-mail para receber instruções de redefinição da senha.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 mt-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium">
              E-mail
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e-mail@gmail.com"
              required
            />
          </div>

          <Button
            type="submit"
            className="bg-[#FF9800] hover:bg-[#FB8C00] text-white font-poppins transition-transform transform hover:scale-105 w-full mt-2"
          >
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
  );
}
