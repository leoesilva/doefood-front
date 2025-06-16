import React, { useEffect, useState } from "react";
import Footer from "@/components/Footer";
import { Button } from "@/components/shadcn/button";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { Table } from "antd";

export default function HistoricoDoacaoBeneficiario() {
  const navigate = useNavigate();
  const [filtro, setFiltro] = useState("");
  interface Doacao {
    id: string;
    alimento: string;
    quantidade: number;
    validade: string;
    doadorId?: string;
    doador?: string;
  }

  const [doacoes, setDoacoes] = useState<Doacao[]>([]);
  const [loading, setLoading] = useState(true);

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
        // Busca as doações recebidas pelo beneficiário
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/doacoes/beneficiario/${uid}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) throw new Error("Erro ao buscar doações");
        const data = await response.json();

        // Buscar nomes dos doadores
        const doadorIds: string[] = [
          ...new Set(
            data
              .filter((d: Doacao) => d.doadorId)
              .map((d: Doacao) => d.doadorId)
          ),
        ] as string[];

        const nomesDoadores: Record<string, string> = {};
        await Promise.all(
          doadorIds.map(async (id: string) => {
            try {
              const resp = await fetch(
                `${import.meta.env.VITE_API_URL}/usuarios/${id}`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );
              if (resp.ok) {
                const usuario = await resp.json();
                nomesDoadores[id] = usuario.nome || usuario.nomeFantasia || usuario.razaoSocial || "-";
              } else {
                nomesDoadores[id] = "-";
              }
            } catch {
              nomesDoadores[id] = "-";
            }
          })
        );

        // Adiciona o nome do doador em cada doação
        const doacoesComNome = data.map((d: Doacao) => ({
          ...d,
          doador: d.doadorId ? nomesDoadores[d.doadorId] : "-",
        }));

        setDoacoes(doacoesComNome);
      } catch (err) {
        console.error(err);
        setDoacoes([]);
      } finally {
        setLoading(false);
      }
    };
    fetchDoacoes();
  }, []);

  // Filtro global (alimento ou doador)
  const doacoesFiltradas = doacoes.filter(
    (doacao) =>
      doacao.alimento?.toLowerCase().includes(filtro.toLowerCase()) ||
      (doacao.doador || "").toLowerCase().includes(filtro.toLowerCase())
  );

  // Colunas da tabela (sem endereço e recebido em)
  const columns = [
    { title: "Alimento", dataIndex: "alimento", key: "alimento", responsive: ['xs', 'sm', 'md', 'lg'] as ("xs" | "sm" | "md" | "lg" | "xl" | "xxl")[] },
    { title: "Quantidade", dataIndex: "quantidade", key: "quantidade", responsive: ['sm', 'md', 'lg'] as ("xs" | "sm" | "md" | "lg" | "xl" | "xxl")[] },
    {
      title: "Validade",
      dataIndex: "validade",
      key: "validade",
      render: (text: string) =>
        text ? new Date(text).toLocaleDateString("pt-BR") : "-",
      responsive: ['sm', 'md', 'lg'] as ("xs" | "sm" | "md" | "lg" | "xl" | "xxl")[],
    },
    {
      title: "Doador",
      dataIndex: "doador",
      key: "doador",
      render: (text: string) => text || "-",
      responsive: ['md', 'lg'] as ("xs" | "sm" | "md" | "lg" | "xl" | "xxl")[],
    },
  ];

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gray-50 font-[Roboto]">
      <main className="max-w-6xl mx-auto px-6 py-12 flex-grow">
        <h1 className="text-3xl font-bold text-green-700 mb-8 text-center">
          Histórico de Doações Recebidas
        </h1>

        {/* 🔍 Campo de Filtro Global */}
        <div className="mb-6 flex flex-col sm:flex-row items-center justify-center gap-4">
          <input
            type="text"
            placeholder="Filtrar por alimento ou doador..."
            className="w-full sm:w-2/3 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-600"
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
              "Você ainda não recebeu nenhuma doação ou nenhum resultado foi encontrado.",
          }}
          pagination={{ pageSize: 10 }}
          scroll={{ x: true }}
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
            onClick={() => navigate("/beneficiario/buscar-doacao")}
            variant="green"
            className="w-full flex items-center justify-center gap-3 py-2 text-lg rounded-xl transition-transform transform hover:scale-105"
          >
            Buscar Doação
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
