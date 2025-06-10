import React, { useEffect, useState } from "react"
import { Button } from "@/components/shadcn/button"
import { Input } from "@/components/shadcn/input"
import { Separator } from "@/components/shadcn/separator"
import Footer from "@/components/Footer"
import { Link } from "react-router-dom"
import { getAuth } from "firebase/auth"
import { Pencil } from "lucide-react"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

// Máscaras
const formatarCNPJ = (valor: string) => {
  return valor
    .replace(/\D/g, "")
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2")
    .slice(0, 18)
}

const formatarCep = (value: string) => {
  const onlyNums = value.replace(/\D/g, "")
  if (onlyNums.length > 5) {
    return onlyNums.slice(0, 5) + "-" + onlyNums.slice(5, 8)
  }
  return onlyNums
}

export default function EditarPerfilBeneficiario() {
  const [formData, setFormData] = useState({
    razaoSocial: "",
    nomeFantasia: "", // <-- Adicionado
    cnpj: "",
    cep: "",
    logradouro: "",
    bairro: "",
    municipio: "",
    estado: "",
    numero: "",
    complemento: "",
    email: "",
    tipo: "",
  })

  const [editavel, setEditavel] = useState<{ [key: string]: boolean }>({})
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  useEffect(() => {
    const fetchPerfil = async () => {
      try {
        const token = localStorage.getItem("token")
        const auth = getAuth()
        const currentUser = auth.currentUser
        if (!token || !currentUser) return
        const uid = currentUser.uid
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/usuarios/${uid}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        if (!response.ok) throw new Error("Erro ao buscar perfil")
        const data = await response.json()
        setFormData((prev) => ({
          ...prev,
          ...data,
          email: currentUser.email || prev.email || "",
        }))
      } catch (err) {
        toast.error("Erro ao buscar perfil.")
        console.error(err)
      }
    }
    fetchPerfil()
  }, [])

  // Busca endereço pelo CEP
  const buscarEnderecoPorCep = async (cep: string) => {
    try {
      const cepLimpo = cep.replace(/\D/g, "")
      if (cepLimpo.length !== 8) return
      const response = await fetch(
        `https://brasilapi.com.br/api/cep/v1/${cepLimpo}`
      )
      if (!response.ok) {
        setFormData((prev) => ({
          ...prev,
          logradouro: "",
          bairro: "",
          municipio: "",
          estado: "",
        }))
        toast.error("CEP não encontrado.")
        return
      }
      const data = await response.json()
      setFormData((prev) => ({
        ...prev,
        logradouro: data.street || "",
        bairro: data.neighborhood || "",
        municipio: data.city || "",
        estado: data.state || "",
      }))
      // Limpa os erros dos campos de endereço ao preencher corretamente
      setErrors((prev) => ({
        ...prev,
        logradouro: "",
        bairro: "",
        municipio: "",
        estado: "",
      }))
    } catch {
      setFormData((prev) => ({
        ...prev,
        logradouro: "",
        bairro: "",
        municipio: "",
        estado: "",
      }))
      toast.error("CEP não encontrado.")
    }
  }

  // Atualiza o formData e busca endereço se for o campo CEP
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    // Máscaras
    let valor = value
    if (name === "cnpj") valor = formatarCNPJ(value)
    if (name === "cep") valor = formatarCep(value)
    if (name === "estado") valor = value.toUpperCase().slice(0, 2)

    setFormData((prev) => ({ ...prev, [name]: valor }))

    if (name === "cep") {
      const cepLimpo = valor.replace(/\D/g, "")
      if (cepLimpo.length === 8) {
        buscarEnderecoPorCep(cepLimpo)
      }
    }
    setErrors((prev) => ({ ...prev, [name]: "" }))
  }

  const handleEdit = (campo: string) => {
    setEditavel((prev) => ({ ...prev, [campo]: !prev[campo] }))
  }

  // Validação dos campos obrigatórios
  const validarCampos = () => {
    const novosErros: { [key: string]: string } = {}
    if (!formData.cnpj || formData.cnpj.replace(/\D/g, "").length !== 14)
      novosErros.cnpj = "CNPJ inválido. Deve conter 14 dígitos."
    if (!formData.razaoSocial)
      novosErros.razaoSocial = "Razão Social é obrigatória."
    if (!formData.nomeFantasia)
      novosErros.nomeFantasia = "Nome Fantasia é obrigatória." // <-- Adicionado
    if (!formData.cep) novosErros.cep = "CEP é obrigatório."
    if (!formData.logradouro) novosErros.logradouro = "Logradouro é obrigatório."
    if (!formData.bairro) novosErros.bairro = "Bairro é obrigatório."
    if (!formData.municipio) novosErros.municipio = "Município é obrigatório."
    if (!formData.estado) novosErros.estado = "Estado é obrigatório."
    if (!formData.numero) novosErros.numero = "Número é obrigatório."
    return novosErros
  }

  const handleSalvar = async (e: React.FormEvent) => {
    e.preventDefault()
    const novosErros = validarCampos()
    if (Object.keys(novosErros).length > 0) {
      setErrors(novosErros)
      toast.error("Preencha todos os campos obrigatórios corretamente.")
      return
    }
    try {
      const token = localStorage.getItem("token")
      const auth = getAuth()
      const currentUser = auth.currentUser
      if (!token || !currentUser) return
      const uid = currentUser.uid
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { email, tipo, ...dadosEditaveis } = formData
      await fetch(`${import.meta.env.VITE_API_URL}/usuarios/${uid}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(dadosEditaveis),
      })
      setEditavel({})
      toast.success("Perfil atualizado com sucesso!")
    } catch (err) {
      toast.error("Erro ao salvar alterações.")
      console.error(err)
    }
  }

  const isSalvarDesabilitado = () => {
    // Verifica se há erros
    if (Object.keys(errors).some((key) => errors[key])) return true
    // Verifica se algum campo obrigatório está vazio
    if (
      !formData.cnpj ||
      formData.cnpj.replace(/\D/g, "").length !== 14 ||
      !formData.razaoSocial ||
      !formData.nomeFantasia || // <-- Adicionado
      !formData.cep ||
      !formData.logradouro ||
      !formData.bairro ||
      !formData.municipio ||
      !formData.estado ||
      !formData.numero
    ) {
      return true
    }
    return false
  }

  // Campos que nunca podem ser editados
  const camposSomenteLeitura = [
    "email",
    "tipo",
    "cnpj",
    "razaoSocial",
    "logradouro",
    "bairro",
    "municipio",
    "estado",
  ]

  // Lista de campos do formulário (ordem e labels iguais ao CriarConta)
  const campos = [
    { name: "tipo", label: "Tipo de usuário" },
    { name: "cnpj", label: "CNPJ" },
    { name: "razaoSocial", label: "Razão Social" },
    { name: "nomeFantasia", label: "Nome Fantasia" }, // <-- Adicionado
    { name: "cep", label: "CEP" },
    { name: "logradouro", label: "Logradouro" },
    { name: "numero", label: "Número" },
    { name: "complemento", label: "Complemento" },
    { name: "bairro", label: "Bairro" },
    { name: "municipio", label: "Município" },
    { name: "estado", label: "Estado (UF)" },
    { name: "email", label: "Email" },
  ]

  return (
    <>
      <ToastContainer />
      <main className="min-h-screen bg-[#F5F5F5] flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-3xl bg-white shadow-xl rounded-2xl p-8 space-y-6">
          <h1 className="text-3xl font-bold text-[#4CAF50] text-center font-poppins">
            Editar Perfil do Beneficiário
          </h1>

          <form className="space-y-6" onSubmit={handleSalvar}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {campos.map((campo) => (
                <div key={campo.name} className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {campo.label}
                  </label>
                  <Input
                    name={campo.name}
                    value={formData[campo.name as keyof typeof formData] || ""}
                    onChange={handleChange}
                    readOnly={
                      camposSomenteLeitura.includes(campo.name) ||
                      !editavel[campo.name]
                    }
                    disabled={camposSomenteLeitura.includes(campo.name)}
                    className={
                      camposSomenteLeitura.includes(campo.name)
                        ? "bg-gray-100 cursor-not-allowed"
                        : editavel[campo.name]
                        ? ""
                        : "bg-gray-100"
                    }
                  />
                  {/* Ícone de lápis para liberar edição */}
                  {!camposSomenteLeitura.includes(campo.name) && (
                    <button
                      type="button"
                      className={`absolute right-2 top-8 ${
                        editavel[campo.name]
                          ? "text-yellow-500"
                          : "text-gray-500 hover:text-green-600"
                      }`}
                      onClick={() => handleEdit(campo.name)}
                      tabIndex={-1}
                      aria-label={`Editar ${campo.label}`}
                    >
                      <Pencil size={18} />
                    </button>
                  )}
                  {errors[campo.name] && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors[campo.name]}
                    </p>
                  )}
                </div>
              ))}
            </div>

            <Button
              type="submit"
              variant="green"
              className="w-full text-base mt-4"
              disabled={isSalvarDesabilitado()}
            >
              Salvar Alterações
            </Button>
          </form>

          <Separator className="my-4" />

          <Button
            asChild
            variant="linkGreen"
            className="text-sm flex items-center gap-1 mb-4"
          >
            <Link to="/beneficiario">← Voltar para o perfil</Link>
          </Button>
        </div>
      </main>
      <Footer />
    </>
  )
}
