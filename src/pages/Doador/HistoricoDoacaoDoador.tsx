import React, { useEffect, useState } from "react";
import Footer from "@/components/Footer";
import { Button } from "@/components/shadcn/button";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { Table, Tooltip } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { Breakpoint } from "antd/es/_util/responsiveObserver";

export default function HistoricoDoacaoDoador() {
  const navigate = useNavigate();
  const [filtro, setFiltro] = useState("");
  interface Endereco {
    logradouro?: string;
    numero?: string;
    complemento?: string;
    bairro?: string;
    municipio?: string;
    estado?: string;
    cep?: string;
    // tipoLogradouro removido
  }
  interface Doacao {
    id: string;
    doadorId: string;
    alimento: string;
    quantidade: number;
    validade: string;
    beneficiarioId?: string;
    beneficiario?: string;
    beneficiarioCnpj?: string;
    beneficiarioRazaoSocial?: string;
    beneficiarioNomeFantasia?: string;
    beneficiarioEndereco?: Endereco;
    endereco?: string;
    dataCriacao?: string;
  }

  const [doacoes, setDoacoes] = useState<Doacao[]>([]);
  const [loading, setLoading] = useState(true);

  function formatarEndereco(enderecoObj: Endereco | null | undefined) {
    if (!enderecoObj) return "-";
    const {
      logradouro,
      numero,
      complemento,
      bairro,
      municipio,
      estado,
      cep,
    } = enderecoObj;
    return (
      `${logradouro || ""}, ${numero || ""}` +
      `${complemento ? ", " + complemento : ""}, ${bairro || ""} - ${municipio || ""} / ${estado || ""}` +
      `${cep ? " - " + cep : ""}`
    );
  }

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

        // Buscar dados dos beneficiários
        const beneficiarioIds: string[] = [
          ...new Set(
            data
              .filter((d: Doacao) => d.beneficiarioId)
              .map((d: Doacao) => d.beneficiarioId)
          ),
        ] as string[];

        type BeneficiarioInfo = {
          razaoSocial: string;
          nomeFantasia: string;
          cnpj: string;
          endereco: Endereco;
        };
        const beneficiarios: Record<string, BeneficiarioInfo> = {};
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
                beneficiarios[id] = {
                  razaoSocial: usuario.razaoSocial || "-",
                  nomeFantasia: usuario.nomeFantasia || "-",
                  cnpj: usuario.cnpj || "-",
                  endereco: usuario.endereco || {},
                };
              } else {
                beneficiarios[id] = {
                  razaoSocial: "-",
                  nomeFantasia: "-",
                  cnpj: "-",
                  endereco: {},
                };
              }
            } catch {
              beneficiarios[id] = {
                razaoSocial: "-",
                nomeFantasia: "-",
                cnpj: "-",
                endereco: {},
              };
            }
          })
        );

        // Adiciona os dados do beneficiário em cada doação
        const doacoesComBeneficiario = data.map((d: Doacao) => {
          const ben = d.beneficiarioId ? beneficiarios[d.beneficiarioId] : null;
          return {
            ...d,
            beneficiario: ben ? ben.razaoSocial : "-",
            beneficiarioRazaoSocial: ben ? ben.razaoSocial : "-",
            beneficiarioNomeFantasia: ben ? ben.nomeFantasia : "-",
            beneficiarioCnpj: ben ? ben.cnpj : "-",
            beneficiarioEndereco: ben ? ben.endereco : null,
          };
        });

        // Ordena pelas datas mais recentes de criação
        doacoesComBeneficiario.sort((a: { dataCriacao: string | number | Date; }, b: { dataCriacao: string | number | Date; }) => {
          const dataA = a.dataCriacao ? new Date(a.dataCriacao).getTime() : 0;
          const dataB = b.dataCriacao ? new Date(b.dataCriacao).getTime() : 0;
          return dataB - dataA;
        });

        setDoacoes(doacoesComBeneficiario);
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

  // Colunas da tabela padronizadas
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
      render: (_: string, record: Doacao) =>
        record.beneficiario && record.beneficiario !== "-" ? (
          <Tooltip
            title={
              <div>
                <div>
                  <b>CNPJ:</b> {record.beneficiarioCnpj || "-"}
                </div>
                <div>
                  <b>Razão Social:</b> {record.beneficiarioRazaoSocial || "-"}
                </div>
                <div>
                  <b>Nome Fantasia:</b> {record.beneficiarioNomeFantasia || "-"}
                </div>
                <div>
                  <b>Endereço:</b> {formatarEndereco(record.beneficiarioEndereco)}
                </div>
              </div>
            }
          >
            <span className="underline cursor-pointer">
              {record.beneficiarioRazaoSocial}
            </span>
          </Tooltip>
        ) : (
          "-"
        ),
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
          pagination={{ pageSize: 10 }}
          scroll={{ x: true }}
          locale={{
            emptyText:
              "Você ainda não realizou nenhuma doação ou nenhum resultado foi encontrado.",
          }}
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