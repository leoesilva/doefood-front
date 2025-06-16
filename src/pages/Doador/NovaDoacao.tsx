// src/pages/NovaDoacao.tsx
import Footer from "@/components/Footer";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/shadcn/button";
import ilustracao from "@/assets/doacao-ilustracao.webp";
import { getAuth } from "firebase/auth";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function NovaDoacao() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    alimento: "",
    quantidade: "",
    validade: "",
  });
  const [quantidade, setQuantidade] = useState("");
  const [unidade, setUnidade] = useState("UN");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Monta a string quantidade com unidade
    const quantidadeComUnidade = `${quantidade} ${unidade}`;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Você precisa estar autenticado para doar.");
        return;
      }

      const auth = getAuth();
      const currentUser = auth.currentUser;
      if (!currentUser) {
        toast.error("Usuário não autenticado.");
        return;
      }
      const uid = currentUser.uid;

      const doacao = {
        alimento: formData.alimento,
        quantidade: quantidadeComUnidade,
        validade: formData.validade,
        doadorId: uid,
        dataCriacao: new Date().toISOString(),
        disponivel: true,
      };

      const response = await fetch(`${import.meta.env.VITE_API_URL}/doacoes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(doacao),
      });

      if (!response.ok) {
        toast.error("Erro ao registrar doação. Tente novamente.");
        return;
      }

      toast.success("Doação registrada com sucesso!");
      setFormData({ alimento: "", quantidade: "", validade: "" });
      setQuantidade("");
      setUnidade("UN");
      // Removido o redirecionamento após o sucesso
    } catch {
      toast.error("Erro ao registrar doação. Tente novamente.");
    }
  };

  // Calcula a data mínima (1 mês à frente)
  const today = new Date();
  const minDate = new Date(today);
  minDate.setMonth(minDate.getMonth() + 1);
  const yyyy = minDate.getFullYear();
  const mm = String(minDate.getMonth() + 1).padStart(2, '0');
  const dd = String(minDate.getDate()).padStart(2, '0');
  const minDateStr = `${yyyy}-${mm}-${dd}`;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <ToastContainer />
      <main className="flex-1">
        <div className="text-center py-8 px-4">
          <h1 className="text-3xl font-bold text-green-700 mb-2">
            Nova Doação
          </h1>
          <p className="text-gray-700 max-w-xl mx-auto">
            Sua doação pode transformar vidas! Preencha o formulário ao lado
            para compartilhar alimentos com quem mais precisa.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row items-center justify-center gap-8 px-6 mb-12">
          <div className="w-full max-w-md">
            <img
              src={ilustracao}
              alt="Ilustração de doação de alimentos"
              className="rounded shadow-md object-cover w-full h-auto"
            />
          </div>

          <form
            onSubmit={handleSubmit}
            className="w-full max-w-md bg-white p-6 rounded shadow-md space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Alimento
              </label>
              <input
                type="text"
                name="alimento"
                value={formData.alimento}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Ex: Arroz, Feijão, Leite..."
              />
            </div>

            <div className="mb-4 flex items-center gap-2">
              <label htmlFor="quantidade" className="block font-medium">
                Quantidade
              </label>
              <input
                id="quantidade"
                type="number"
                min="0"
                required
                className="border rounded px-2 py-1 w-24"
                value={quantidade}
                onChange={(e) => setQuantidade(e.target.value)}
              />
              <label htmlFor="unidade" className="sr-only">
                Unidade
              </label>
              <select
                id="unidade"
                value={unidade}
                onChange={(e) => setUnidade(e.target.value)}
                className="border rounded px-2 py-1"
                aria-label="Unidade"
              >
                <option value="un">UN</option>
                <option value="kg">KG</option>
                <option value="l">L</option>
                <option value="cx">CX</option>
                <option value="pct">PCT</option>
                {/* Adicione outras unidades se desejar */}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Validade (se aplicável)
              </label>
              <input
                type="date"
                name="validade"
                value={formData.validade}
                onChange={handleChange}
                min={minDateStr}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Selecione a data de validade"
                title="Selecione a data de validade"
              />
            </div>

            <Button
              type="submit"
              variant="green"
              className="w-full flex items-center justify-center gap-3 py-5 text-lg rounded-xl transition-transform transform hover:scale-105"
            >
              Enviar Doação
            </Button>

            <Button
              type="button"
              variant="linkGreen"
              onClick={() => navigate(-1)}
              className="text-sm flex items-center gap-1 mb-4"
            >
              ← Voltar
            </Button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
