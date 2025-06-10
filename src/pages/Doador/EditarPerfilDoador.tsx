// src/pages/EditarPerfilDoador.tsx
import React, { useEffect, useState } from "react";
import { Button } from "@/components/shadcn/button";
import { Input } from "@/components/shadcn/input";
import { Separator } from "@/components/shadcn/separator";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { Pencil } from "lucide-react";

export default function EditarPerfilDoador() {
  const [formData, setFormData] = useState({
    razaoSocial: "",
    nomeFantasia: "",
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
  });

  // Controla quais campos estão editáveis
  const [editavel, setEditavel] = useState<{ [key: string]: boolean }>({});
  const [enderecoBloqueado, setEnderecoBloqueado] = useState(false);

  useEffect(() => {
    const fetchPerfil = async () => {
      try {
        const token = localStorage.getItem("token");
        const auth = getAuth();
        const currentUser = auth.currentUser;
        if (!token || !currentUser) return;
        const uid = currentUser.uid;
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/usuarios/${uid}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) throw new Error("Erro ao buscar perfil");
        const data = await response.json();
        // Sempre pega o email do usuário autenticado
        setFormData((prev) => ({
          ...prev,
          ...data,
          email: currentUser.email || prev.email || "",
        }));
      } catch (err) {
        console.error(err);
      }
    };
    fetchPerfil();
  }, []);

  // Função para buscar endereço pelo CEP
  const buscarEnderecoPorCep = async (cep: string) => {
    try {
      const cepLimpo = cep.replace(/\D/g, "");
      if (cepLimpo.length !== 8) return;
      const response = await fetch(
        `https://brasilapi.com.br/api/cep/v1/${cepLimpo}`
      );
      if (!response.ok) return;
      const data = await response.json();
      setFormData((prev) => ({
        ...prev,
        logradouro: data.street || "",
        bairro: data.neighborhood || "",
        municipio: data.city || "",
        estado: data.state || "",
      }));
      setEnderecoBloqueado(true); // Bloqueia os campos após busca
    } catch {
      // Se o CEP não existir, apenas não preenche nada
    }
  };

  // Atualiza o formData e busca endereço se for o campo CEP
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "cep") {
      const cepLimpo = value.replace(/\D/g, "");
      if (cepLimpo.length === 8) {
        buscarEnderecoPorCep(cepLimpo);
      }
    }
  };

  // Torna o campo editável ao clicar no lápis
  const handleEdit = (campo: string) => {
    setEditavel((prev) => ({ ...prev, [campo]: !prev[campo] }));
  };

  // Torna todos os campos não editáveis após salvar
  const handleSalvar = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const auth = getAuth();
      const currentUser = auth.currentUser;
      if (!token || !currentUser) return;
      const uid = currentUser.uid;
      // Não envie email, tipo ou senha para atualização
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { email, tipo, ...dadosEditaveis } = formData;
      await fetch(`${import.meta.env.VITE_API_URL}/usuarios/${uid}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(dadosEditaveis),
      });
      setEditavel({});
      alert("Perfil atualizado com sucesso!");
    } catch (err) {
      alert("Erro ao salvar alterações.");
      console.error(err);
    }
  };

  // Campos que nunca podem ser editados
  const camposSomenteLeitura = ["email", "tipo", "cnpj", "razaoSocial"];

  // Lista de campos do formulário (ordem e labels iguais ao CriarConta)
  const campos = [
    { name: "tipo", label: "Tipo de usuário" },
    { name: "cnpj", label: "CNPJ" },
    { name: "razaoSocial", label: "Razão Social" },
    { name: "nomeFantasia", label: "Nome Fantasia" },
    { name: "cep", label: "CEP" },
    { name: "logradouro", label: "Logradouro" },
    { name: "numero", label: "Número" },
    { name: "complemento", label: "Complemento" },
    { name: "bairro", label: "Bairro" },
    { name: "municipio", label: "Município" },
    { name: "estado", label: "Estado (UF)" },
    { name: "email", label: "Email" },
  ];

  return (
    <>
      <main className="min-h-screen bg-[#F5F5F5] flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-3xl bg-white shadow-xl rounded-2xl p-8 space-y-6">
          <h1 className="text-3xl font-bold text-[#4CAF50] text-center font-poppins">
            Editar Perfil do Doador
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
                </div>
              ))}
            </div>

            <Button
              type="submit"
              variant="green"
              className="w-full text-base mt-4"
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
            <Link to="/doador">← Voltar para o perfil</Link>
          </Button>
        </div>
      </main>
      <Footer />
    </>
  );
}
