import React, { useEffect, useState } from "react";
import Footer from "@/components/Footer";
import { Button } from "@/components/shadcn/button";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { Table } from "antd";

export default function HistoricoDoacaoDoador() {
  const navigate = useNavigate();
  const [filtro, setFiltro] = useState("");
  interface Doacao {
    id: string;
    doadorId: string;
    alimento: string;
    quantidade: number;
    validade: string;
    beneficiario?: string;
    endereco?: string;
    data?: string;
  }

  const [doacoes, setDoacoes] = useState<Doacao[]>([]);
  const [loading, setLoading] = useState(true);

  const btnClass =
    "w-full flex items-center justify-center gap-3 py-2 text-lg rounded-xl transition-transform transform hover:scale-105";

  useEffect(() => {
    const fetchDoacoes = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const auth = getAuth();
        const currentUser = auth.currentUser;
        if (!token || !currentUser) {
          setDoacoes([]);
          setLoading(false);
          return;
        }
        const uid = currentUser.uid;
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/doacoes/doador/${uid}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) throw new Error("Erro ao buscar doações");
        const data = await response.json();
        console.log("Doações recebidas:", data); // Adicione este log
        setDoacoes(data);
      } catch (err) {
        console.error(err);
        setDoacoes([]);
      } finally {
        setLoading(false);
      }
    };
    fetchDoacoes();
  }, []);

  const doacoesFiltradas = doacoes.filter(
    (doacao) =>
      doacao.alimento?.toLowerCase().includes(filtro.toLowerCase()) ||
      doacao.beneficiario?.toLowerCase().includes(filtro.toLowerCase())
  );

  // Defina as colunas para o Ant Design Table
  const columns = [
    { title: "Alimento", dataIndex: "alimento", key: "alimento" },
    { title: "Quantidade", dataIndex: "quantidade", key: "quantidade" },
    { title: "Validade", dataIndex: "validade", key: "validade" },
    {
      title: "Beneficiário",
      dataIndex: "beneficiario",
      key: "beneficiario",
      render: (text: string) => text || "-",
    },
    {
      title: "Endereço",
      dataIndex: "endereco",
      key: "endereco",
      render: (text: string) => text || "-",
    },
    {
      title: "Doado em",
      dataIndex: "data",
      key: "data",
      render: (text: string) => text || "-",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gray-50 font-[Roboto]">
      <main className="max-w-6xl mx-auto px-6 py-12 flex-grow">
        <h1 className="text-3xl font-bold text-green-700 mb-8 text-center">
          Histórico de Doações
        </h1>

        {/* 🔍 Campo de Filtro */}
        <div className="mb-6 flex flex-col sm:flex-row items-center justify-center gap-4">
          <input
            type="text"
            placeholder="Filtrar por alimento ou beneficiário..."
            className="w-full sm:w-1/3 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-600"
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
          />
        </div>

        <Table
          columns={columns}
          dataSource={doacoesFiltradas}
          loading={loading}
          rowKey="id"
          locale={{
            emptyText:
              "Você ainda não fez nenhuma doação ou nenhum resultado foi encontrado.",
          }}
          pagination={{ pageSize: 10 }}
        />

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
          <Button
            onClick={() => navigate(-1)}
            variant="linkGreen"
            className="text-sm"
          >
            ← Voltar para página anterior
          </Button>
          <Button
            onClick={() => navigate("/doador/nova-doacao")}
            variant="green"
            className={btnClass}
          >
            Nova Doação
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
