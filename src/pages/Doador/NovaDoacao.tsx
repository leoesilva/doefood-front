// src/pages/NovaDoacao.tsx
import Footer from "@/components/Footer";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ilustracao from "@/assets/doacao-ilustracao.webp"; // Imagem de doação

export default function NovaDoacao() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    alimento: "",
    quantidade: "",
    validade: "",
    beneficiario: "",
    endereco: "",
  });

  const [mensagem, setMensagem] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Doação cadastrada:", formData);
    setMensagem("✅ Doação registrada com sucesso!");
    setTimeout(() => navigate("/home-doador"), 2000);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <main className="flex-1">
        <div className="text-center py-8 px-4">
          <h1 className="text-3xl font-bold text-green-700 mb-2">
            {" "}
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

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Quantidade (kg ou unidades)
              </label>
              <input
                type="number"
                name="quantidade"
                value={formData.quantidade}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Ex: 10"
              />
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
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Beneficiario
              </label>
              <input
                type="text"
                name="beneficiario"
                value={formData.beneficiario}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Nome da ONG"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Endereço para coleta ou entrega
              </label>
              <textarea
                name="endereco"
                value={formData.endereco}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Rua, número, bairro, cidade..."
              />
            </div>

            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg shadow transition block mx-auto"
            >
              Enviar Doação
            </button>

            <button
              type="button"
              onClick={() => navigate(-1)} // volta para a página anterior
              className="text-green-600 hover:underline text-sm flex items-center gap-1 mb-4"
            >
              ← Voltar
            </button>

            {mensagem && (
              <div className="mt-4 text-green-700 font-medium bg-green-50 p-3 rounded border border-green-200">
                {mensagem}
              </div>
            )}
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
