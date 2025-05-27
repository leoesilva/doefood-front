import React, { useState } from "react";
import Footer from "@/components/Footer";
import { useNavigate } from "react-router-dom";

const doacoesMock = [
  {
    id: 1,
    alimento: "Arroz",
    quantidade: "5 kg",
    validade: "2025-07-15",
    endereco: "Rua das Flores, 123 - Bairro Verde",
    data: "2025-05-01",
    doador: "Supermercado Chama",
  },
  {
    id: 2,
    alimento: "Leite",
    quantidade: "10 unidades",
    validade: "2025-06-10",
    endereco: "Av. Central, 456 - Centro",
    data: "2025-04-28",
    doador: "Fazenda Boa Esperança",
  },
  {
    id: 3,
    alimento: "Feijão",
    quantidade: "8 kg",
    validade: "2025-07-20",
    endereco: "Rua Nova, 789 - Bairro Azul",
    data: "2025-05-05",
    doador: "Mercado União",
  },
  {
    id: 4,
    alimento: "Macarrão",
    quantidade: "12 unidades",
    validade: "2025-08-01",
    endereco: "Av. Principal, 321 - Centro",
    data: "2025-05-03",
    doador: "Supermercado Bom Preço",
  },
  {
    id: 5,
    alimento: "Óleo de soja",
    quantidade: "6 unidades",
    validade: "2025-09-15",
    endereco: "Rua das Palmeiras, 456 - Bairro Rosa",
    data: "2025-05-02",
    doador: "Distribuidora Alimentos Ltda",
  },
];

export default function HistoricoDoacaoBeneficiario() {
  const navigate = useNavigate();
  const [filtro, setFiltro] = useState("");

  const doacoesFiltradas = doacoesMock.filter(
    (doacao) =>
      doacao.alimento.toLowerCase().includes(filtro.toLowerCase()) ||
      doacao.doador.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gray-50 font-[Roboto]">
      <main className="max-w-6xl mx-auto px-6 py-12 flex-grow">
        <h1 className="text-3xl font-bold text-green-700 mb-6 text-center">
          Histórico de Doações
        </h1>

        {/* 🔍 Campo de Filtro */}
        <div className="mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <input
            type="text"
            placeholder="Filtrar por alimento ou doador..."
            className="w-full sm:w-1/3 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-600"
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
          />
        </div>

        {doacoesFiltradas.length > 0 ? (
          <div className="overflow-x-auto rounded-xl shadow-lg bg-white border border-gray-200">
            <table className="min-w-full text-sm text-gray-700">
              <thead className="bg-green-600 text-white text-left uppercase text-xs tracking-wider">
                <tr>
                  <th className="px-6 py-4">Alimento</th>
                  <th className="px-6 py-4">Quantidade</th>
                  <th className="px-6 py-4">Validade</th>
                  <th className="px-6 py-4">Doador</th>
                  <th className="px-6 py-4">Endereço</th>
                  <th className="px-6 py-4">Recebido em</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {doacoesFiltradas.map((doacao) => (
                  <tr
                    key={doacao.id}
                    className="hover:bg-green-50 transition duration-150"
                  >
                    <td className="px-6 py-4">{doacao.alimento}</td>
                    <td className="px-6 py-4">{doacao.quantidade}</td>
                    <td className="px-6 py-4">{doacao.validade}</td>
                    <td className="px-6 py-4">{doacao.doador}</td>
                    <td className="px-6 py-4">{doacao.endereco}</td>
                    <td className="px-6 py-4 text-gray-500">{doacao.data}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-gray-500 text-center mt-8">
            Nenhuma doação encontrada.
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
          <button
            onClick={() => navigate(-1)}
            className="text-green-600 hover:text-green-800 underline transition text-sm"
          >
            ← Voltar para página anterior
          </button>

          <button
            onClick={() => navigate("/beneficiario/buscar-doacao")}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg shadow transition"
          >
            Buscar Doação
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
