import React, { useEffect, useState } from "react";
import Footer from "@/components/Footer";
import { Button } from "@/components/shadcn/button";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { Table, Tooltip } from "antd";

export default function HistoricoDoacaoBeneficiario() {
  const navigate = useNavigate();
  const [filtro, setFiltro] = useState("");
  type Endereco = {
    tipoLogradouro?: string;
    logradouro?: string;
    numero?: string;
    complemento?: string;
    bairro?: string;
    municipio?: string;
    estado?: string;
    cep?: string;
  };
  interface Doacao {
    id: string;
    alimento: string;
    quantidade: number;
    validade: string;
    doadorId?: string;
    doador?: string;
    doadorCnpj?: string;
    doadorRazaoSocial?: string;
    doadorNomeFantasia?: string;
    doadorEndereco?: Endereco;
    dataReserva?: string;
  }

  const [doacoes, setDoacoes] = useState<Doacao[]>([]);
  const [loading, setLoading] = useState(true);

  function formatarEndereco(enderecoObj: Endereco | null | undefined) {
    if (!enderecoObj) return "-";
    const {
      tipoLogradouro,
      logradouro,
      numero,
      complemento,
      bairro,
      municipio,
      estado,
      cep,
    } = enderecoObj;
    return (
      `${tipoLogradouro ? tipoLogradouro + " " : ""}${logradouro || ""}, ${numero || ""}` +
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

        // Buscar dados dos doadores
        const doadorIds: string[] = [
          ...new Set(
            data
              .filter((d: Doacao) => d.doadorId)
              .map((d: Doacao) => d.doadorId)
          ),
        ] as string[];

        type DoadorInfo = {
          razaoSocial: string;
          nomeFantasia: string;
          cnpj: string;
          endereco: Endereco;
        };
        const doadores: Record<string, DoadorInfo> = {};
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
                doadores[id] = {
                  razaoSocial: usuario.razaoSocial || "-",
                  nomeFantasia: usuario.nomeFantasia || "-",
                  cnpj: usuario.cnpj || "-",
                  endereco: usuario.endereco || {},
                };
              } else {
                doadores[id] = {
                  razaoSocial: "-",
                  nomeFantasia: "-",
                  cnpj: "-",
                  endereco: {},
                };
              }
            } catch {
              doadores[id] = {
                razaoSocial: "-",
                nomeFantasia: "-",
                cnpj: "-",
                endereco: {},
              };
            }
          })
        );

        // Adiciona os dados do doador em cada doação
        const doacoesComDoador = data.map((d: Doacao) => {
          const doador = d.doadorId ? doadores[d.doadorId] : null;
          return {
            ...d,
            doador: doador ? doador.razaoSocial : "-",
            doadorRazaoSocial: doador ? doador.razaoSocial : "-",
            doadorNomeFantasia: doador ? doador.nomeFantasia : "-",
            doadorCnpj: doador ? doador.cnpj : "-",
            doadorEndereco: doador ? doador.endereco : null,
          };
        });

        // Ordena pelas datas mais recentes de reserva
        doacoesComDoador.sort((a: { dataReserva: string | number | Date; }, b: { dataReserva: string | number | Date; }) => {
          const dataA = a.dataReserva ? new Date(a.dataReserva).getTime() : 0;
          const dataB = b.dataReserva ? new Date(b.dataReserva).getTime() : 0;
          return dataB - dataA;
        });

        setDoacoes(doacoesComDoador);
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

  // Colunas da tabela padronizadas
  const columns = [
    {
      title: "Alimento",
      dataIndex: "alimento",
      key: "alimento",
      responsive: ["xs", "sm", "md", "lg"] as ("xs" | "sm" | "md" | "lg" | "xl" | "xxl")[],
    },
    {
      title: "Quantidade",
      dataIndex: "quantidade",
      key: "quantidade",
      responsive: ["sm", "md", "lg"] as ("xs" | "sm" | "md" | "lg" | "xl" | "xxl")[],
    },
    {
      title: "Validade",
      dataIndex: "validade",
      key: "validade",
      render: (text: string) =>
        text ? new Date(text).toLocaleDateString("pt-BR") : "-",
      responsive: ["sm", "md", "lg"] as ("xs" | "sm" | "md" | "lg" | "xl" | "xxl")[],
    },
    {
      title: "Doador",
      dataIndex: "doador",
      key: "doador",
      render: (_: string, record: Doacao) =>
        record.doador && record.doador !== "-" ? (
          <Tooltip
            title={
              <div>
                <div>
                  <b>CNPJ:</b> {record.doadorCnpj || "-"}
                </div>
                <div>
                  <b>Razão Social:</b> {record.doadorRazaoSocial || "-"}
                </div>
                <div>
                  <b>Nome Fantasia:</b> {record.doadorNomeFantasia || "-"}
                </div>
                <div>
                  <b>Endereço:</b> {formatarEndereco(record.doadorEndereco)}
                </div>
              </div>
            }
          >
            <span className="underline cursor-pointer">
              {record.doadorRazaoSocial}
            </span>
          </Tooltip>
        ) : (
          "-"
        ),
      responsive: ["md", "lg"] as ("xs" | "sm" | "md" | "lg" | "xl" | "xxl")[],
    },
    {
      title: "Reservado em",
      dataIndex: "dataReserva",
      key: "dataReserva",
      render: (text: string) =>
        text ? new Date(text).toLocaleString("pt-BR") : "-",
      responsive: ["sm", "md", "lg"] as ("xs" | "sm" | "md" | "lg" | "xl" | "xxl")[],
    },
  ];

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gray-50 font-[Roboto]">
      <main className="max-w-6xl mx-auto px-6 py-12 flex-grow">
        <h1 className="text-3xl font-bold text-green-700 mb-8 text-center">
          Histórico de Doações Recebidas
        </h1>
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
