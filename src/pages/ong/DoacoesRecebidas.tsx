import { useState } from "react"
import { Separator } from "@/components/shadcn/separator"
import { FaBox, FaCheckCircle, FaClock, FaFilter } from "react-icons/fa"
import Footer from "@/components/Footer"
import { Link } from "react-router-dom"
import { Button } from "@/components/shadcn/button"

type Doacao = {
  id: number
  doador: string
  data: string
  itens: string[]
  status: "entregue" | "pendente"
}

export const DoacoesRecebidas = () => {
  const [filtro, setFiltro] = useState<"todos" | "entregue" | "pendente">("todos")

  const todasDoacoes: Doacao[] = [
    {
      id: 1,
      doador: "João da Silva",
      data: "10/05/2025",
      itens: ["Arroz", "Feijão", "Óleo"],
      status: "entregue",
    },
    {
      id: 2,
      doador: "Maria Oliveira",
      data: "09/05/2025",
      itens: ["Leite", "Macarrão"],
      status: "pendente",
    },
    {
      id: 3,
      doador: "Empresa Solidária",
      data: "08/05/2025",
      itens: ["Farinha", "Café", "Açúcar"],
      status: "entregue",
    },
  ]

  const doacoesFiltradas = filtro === "todos"
    ? todasDoacoes
    : todasDoacoes.filter((d) => d.status === filtro)

  return (
    <>
      <main className="min-h-screen bg-[#F5F5F5] px-4 py-10 flex items-center justify-center">
        <div className="w-full max-w-5xl bg-white shadow-xl rounded-2xl p-8 space-y-8">
          <h1 className="text-3xl font-bold text-[#4CAF50] text-center font-poppins">
            <FaBox className="inline mr-2" />
            Minhas Doações Recebidas
          </h1>

          {/* Filtros */}
          <div className="flex flex-wrap gap-4 justify-center">
            <Button
              variant={filtro === "todos" ? "default" : "outline"}
              onClick={() => setFiltro("todos")}
              className="text-sm"
            >
              <FaFilter className="mr-2" /> Todas
            </Button>
            <Button
              variant={filtro === "entregue" ? "default" : "outline"}
              onClick={() => setFiltro("entregue")}
              className="text-sm"
            >
              <FaCheckCircle className="mr-2" /> Entregues
            </Button>
            <Button
              variant={filtro === "pendente" ? "default" : "outline"}
              onClick={() => setFiltro("pendente")}
              className="text-sm"
            >
              <FaClock className="mr-2" /> Pendentes
            </Button>
          </div>

          {/* Lista de doações */}
          {doacoesFiltradas.length === 0 ? (
            <p className="text-center text-gray-500">
              Nenhuma doação encontrada com esse filtro.
            </p>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {doacoesFiltradas.map((doacao) => (
                <div
                  key={doacao.id}
                  className="border border-gray-200 rounded-xl p-5 bg-gray-50 shadow-md hover:shadow-lg transition-all duration-200"
                >
                  <h2 className="text-lg font-semibold text-[#4CAF50] mb-2">
                    <FaBox className="inline mr-2" />
                    {doacao.doador}
                  </h2>
                  <p className="text-sm text-gray-700">Data: {doacao.data}</p>
                  <p className="text-sm text-gray-700">
                    Itens: <span className="text-gray-900">{doacao.itens.join(", ")}</span>
                  </p>
                  <div className="mt-3">
                    {doacao.status === "entregue" ? (
                      <span className="inline-flex items-center text-green-600 font-medium">
                        <FaCheckCircle className="mr-1" />
                        Entregue
                      </span>
                    ) : (
                      <span className="inline-flex items-center text-yellow-600 font-medium">
                        <FaClock className="mr-1" />
                        Pendente
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          <Separator className="my-6" />

          <Link
            to="/ong"
            className="block text-center text-sm text-blue-600 hover:underline"
          >
            ← Voltar para o perfil
          </Link>
        </div>
      </main>

      <Footer />
    </>
  )
}
