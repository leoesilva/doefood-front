import React, { useEffect, useState } from "react";
import Footer from "@/components/Footer";
import { Button } from "@/components/shadcn/button";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { Breakpoint } from "antd/es/_util/responsiveObserver";

export default function HistoricoDoacaoDoador() {
  const navigate = useNavigate();
  const [filtro, setFiltro] = useState("");
  interface Doacao {
    id: string;
    doadorId: string;
    alimento: string;
    quantidade: number;
    validade: string;
    beneficiarioId?: string;
    beneficiario?: string;
    endereco?: string;
    dataCriacao?: string;
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

        // Buscar nomes dos beneficiários
        const beneficiarioIds: string[] = [
          ...new Set(
            data
              .filter((d: Doacao) => d.beneficiarioId)
              .map((d: Doacao) => d.beneficiarioId)
          ),
        ] as string[];

        const nomesBeneficiarios: Record<string, string> = {};
        await Promise.all(
          beneficiarioIds.map(async (id: string) => {
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
                nomesBeneficiarios[id] =
                  usuario.nome ||
                  usuario.nomeFantasia ||
                  usuario.razaoSocial ||
                  "-";
              } else {
                nomesBeneficiarios[id] = "-";
              }
            } catch {
              nomesBeneficiarios[id] = "-";
            }
          })
        );

        // Adiciona o nome do beneficiário em cada doação
        const doacoesComNome = data.map((d: Doacao) => ({
          ...d,
          beneficiario: d.beneficiarioId
            ? nomesBeneficiarios[d.beneficiarioId]
            : "-",
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

  // Filtro global (alimento ou beneficiario)
  const doacoesFiltradas = doacoes.filter(
    (doacao) =>
      doacao.alimento?.toLowerCase().includes(filtro.toLowerCase()) ||
      (doacao.beneficiario || "").toLowerCase().includes(filtro.toLowerCase())
  );

  // Colunas da tabela
  const columns: ColumnsType<Doacao> = [
    {
      title: "Alimento",
      dataIndex: "alimento",
      key: "alimento",
      responsive: ["xs", "sm", "md", "lg"] as Breakpoint[],
    },
    {
      title: "Quantidade",
      dataIndex: "quantidade",
      key: "quantidade",
      responsive: ["sm", "md", "lg"] as Breakpoint[],
    },
    {
      title: "Validade",
      dataIndex: "validade",
      key: "validade",
      render: (text: string) =>
        text ? new Date(text).toLocaleDateString("pt-BR") : "-",
      responsive: ["sm", "md", "lg"] as Breakpoint[],
    },
    {
      title: "Beneficiário",
      dataIndex: "beneficiario",
      key: "beneficiario",
      render: (text: string) => text || "-",
      responsive: ["md", "lg"] as Breakpoint[],
    },
    {
      title: "Doado em",
      dataIndex: "dataCriacao",
      key: "dataCriacao",
      render: (text: string) =>
        text ? new Date(text).toLocaleString("pt-BR") : "-",
      responsive: ["xs", "sm", "md", "lg"] as Breakpoint[],
    },
  ];

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gray-50 font-[Roboto]">
      <main className="max-w-6xl mx-auto px-6 py-12 flex-grow">
        <h1 className="text-3xl font-bold text-green-700 mb-8 text-center">
          Histórico de Doações Realizadas
        </h1>
        <div className="mb-6 flex flex-col sm:flex-row items-center justify-center gap-4">
          <input
            type="text"
            placeholder="Filtrar por alimento ou beneficiário..."
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
          pagination={{ pageSize: 8 }}
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
            onClick={() => navigate("/doador/nova-doacao")}
            variant="green"
            className="w-full flex items-center justify-center gap-3 py-2 text-lg rounded-xl transition-transform transform hover:scale-105"
          >
            Nova Doação
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
