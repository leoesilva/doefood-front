import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { auth, db } from "@/lib/firebaseConfig";
import { Button } from "@/components/shadcn/button";
import { Input } from "@/components/shadcn/input";
import { Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

const formatarCNPJ = (valor: string) => {
  return valor
    .replace(/\D/g, "")
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2")
    .slice(0, 18);
};

function formatarCep(value: string) {
  // Remove tudo que não for número
  const onlyNums = value.replace(/\D/g, "");
  // Limita o tamanho a 8 dígitos e adiciona o hífen depois dos 5 primeiros
  if (onlyNums.length > 5) {
    return onlyNums.slice(0, 5) + "-" + onlyNums.slice(5, 8);
  }
  return onlyNums;
}

function verificarForcaSenha(senha: string) {
  const regras = {
    tamanho: senha.length >= 8,
    maiuscula: /[A-Z]/.test(senha),
    minuscula: /[a-z]/.test(senha),
    numero: /\d/.test(senha),
    especial: /[!@#$%^&*(),.?":{}|<>]/.test(senha),
  };

  const totalRegras = Object.values(regras).filter(Boolean).length;

  let forca: "fraca" | "media" | "forte" = "fraca";
  if (totalRegras >= 4) forca = "forte";
  else if (totalRegras === 3) forca = "media";

  return { forca, regras };
}

export default function CriarConta() {
  const [razaoSocial, setRazaoSocial] = useState("");
  const [nomeFantasia, setNomeFantasia] = useState("");
  const [cnpj, setCnpj] = useState("");

  // Endereço separado
  const [cep, setCep] = useState("");
  const [logradouro, setLogradouro] = useState("");
  const [bairro, setBairro] = useState("");
  const [municipio, setMunicipio] = useState("");
  const [estado, setEstado] = useState("");
  const [numero, setNumero] = useState("");
  const [complemento, setComplemento] = useState("");
  const [TipoLogradouro, setTipoLogradouro] = useState("");

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarSenhaConfirmar, setMostrarSenhaConfirmar] = useState(false);
  const [mostrarRegras, setMostrarRegras] = useState(false);
  const [tipo, setTipo] = useState("doador");

  const [errors, setErrors] = useState({
    razaoSocial: "",
    nomeFantasia: "",
    cnpj: "",
    cep: "",
    logradouro: "",
    bairro: "",
    municipio: "",
    estado: "",
    numero: "",
    TipoLogradouro: "",
    email: "",
    senha: "",
    confirmarSenha: "",
    geral: "",
  });

  const navigate = useNavigate();

  const { forca, regras } = verificarForcaSenha(senha);

  // Função para buscar dados do CNPJ via Brasil API
  async function buscarDadosCNPJ(cnpjLimpo: string) {
    try {
      // A URL da Brasil API para CNPJ
      const url = `https://brasilapi.com.br/api/cnpj/v1/${cnpjLimpo}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("CNPJ não encontrado");
      }
      const data = await response.json();

      // Atualiza os campos de endereço
      setRazaoSocial(data.razao_social || "");
      setNomeFantasia(data.nome_fantasia || "");

      setCep(formatarCep(data.cep) || "");
      setTipoLogradouro(data.descricao_tipo_de_logradouro || "");
      setLogradouro(data.logradouro || "");
      setNumero(data.numero || "");
      setComplemento(data.complemento || "");
      setBairro(data.bairro || "");
      setMunicipio(data.municipio || "");
      setEstado(data.uf || "");
    } catch {
      setErrors((prev) => ({ ...prev, cnpj: "CNPJ inválido ou não encontrado." }));
      setCep("");
      setLogradouro("");
      setBairro("");
      setMunicipio("");
      setEstado("");
      setRazaoSocial("");
      setNomeFantasia("");
    }
  }

  const handleBlurCNPJ = () => {
    const cnpjLimpo = cnpj.replace(/\D/g, "");
    if (cnpjLimpo.length === 14) {
      buscarDadosCNPJ(cnpjLimpo);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({
      razaoSocial: "",
      nomeFantasia: "",
      cnpj: "",
      cep: "",
      logradouro: "",
      bairro: "",
      municipio: "",
      estado: "",
      numero: "",
      TipoLogradouro: "",
      email: "",
      senha: "",
      confirmarSenha: "",
      geral: "",
    });


    const cnpjNumerico = cnpj.replace(/\D/g, "");
    if (cnpjNumerico.length !== 14) {
      setErrors((prev) => ({ ...prev, cnpj: "CNPJ inválido. Deve conter 14 dígitos." }));
      return;
    }
    if (!razaoSocial) {
      setErrors((prev) => ({ ...prev, razaoSocial: "Razão Social é obrigatória." }));
      return;
    }
    if (!nomeFantasia) {
      setErrors((prev) => ({ ...prev, nomeFantasia: "Nome Fantasia é obrigatório." }));
      return;
    }
    if (!cep) {
      setErrors((prev) => ({ ...prev, cep: "CEP é obrigatório." }));
      return;
    }
    if (!logradouro) {
      setErrors((prev) => ({ ...prev, logradouro: "Logradouro é obrigatório." }));
      return;
    }
    if (!bairro) {
      setErrors((prev) => ({ ...prev, bairro: "Bairro é obrigatório." }));
      return;
    }
    if (!municipio) {
      setErrors((prev) => ({ ...prev, municipio: "Município é obrigatório." }));
      return;
    }
    if (!estado) {
      setErrors((prev) => ({ ...prev, estado: "Estado é obrigatório." }));
      return;
    }
    if (!numero) {
      setErrors((prev) => ({ ...prev, numero: "Número é obrigatório." }));
      return;
    }

    // setTentouSubmeter(true);

    if (!regras.tamanho || !regras.maiuscula || !regras.especial) {
      setErrors((prev) => ({
        ...prev,
        senha: "Senha não corresponde às orientações acima.",
      }));
      return;
    }

    if (senha !== confirmarSenha) {
      setErrors((prev) => ({ ...prev, confirmarSenha: "As senhas não coincidem." }));
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), senha.trim());
      const user = userCredential.user;

      await setDoc(doc(db, "usuarios", user.uid), {
        razaoSocial,
        nomeFantasia,
        cnpj,
        cep,
        logradouro,
        bairro,
        municipio,
        estado,
        numero,
        complemento,
        tipo,
      });

      navigate("/autenticacao/login");
    } catch (error: unknown) {
      if (error instanceof Error) {
        const message = error.message;

        if (message.includes("email-already-in-use")) {
          setErrors((prev) => ({ ...prev, email: "E-mail já está em uso." }));
        } else if (message.includes("invalid-email")) {
          setErrors((prev) => ({ ...prev, email: "E-mail inválido." }));
        } else {
          setErrors((prev) => ({ ...prev, geral: "Erro inesperado. Tente novamente." }));
        }
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="w-full max-w-3xl p-8 rounded-xl shadow-md border bg-white">
        <h1 className="text-2xl font-semibold text-center mb-6">Criar Conta</h1>

        {errors.geral && (
          <p className="text-red-500 text-sm text-center mb-2">{errors.geral}</p>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Linha 1: CNPJ (1/2) e Tipo de usuário (1/2) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div>
              <label htmlFor="tipo" className="block text-sm font-medium mb-1">
                Tipo de usuário
              </label>
              <select
                id="tipo"
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
                className="w-full rounded border border-gray-300 p-2"
              >
                <option value="doador">Doador</option>
                <option value="beneficiario">Beneficiário</option>
              </select>
            </div>

            <div>
              <label htmlFor="cnpj" className="block text-sm font-medium">
                CNPJ
              </label>
              <Input
                id="cnpj"
                value={cnpj}
                onChange={(e) => {
                  setCnpj(formatarCNPJ(e.target.value));
                  setErrors((prev) => ({ ...prev, cnpj: "" }));
                }}
                onBlur={handleBlurCNPJ}
                placeholder="00.000.000/0000-00"
                required
                className={errors.cnpj ? "border-red-500" : ""}
                maxLength={18}
              />
              {errors.cnpj && (
                <p className="text-sm text-red-500 mt-1">{errors.cnpj}</p>
              )}
            </div>
          </div>


          {/* Linha 2: Razão Social (grande) e Nome Fantasia (grande) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="razaoSocial" className="block text-sm font-medium">
                Razão Social
              </label>
              <Input
                id="razaoSocial"
                value={razaoSocial}
                onChange={(e) => {
                  setRazaoSocial(e.target.value);
                  setErrors((prev) => ({ ...prev, razaoSocial: "" }));
                }}
                required
                className={errors.razaoSocial ? "border-red-500" : ""}
              />
              {errors.razaoSocial && (
                <p className="text-sm text-red-500 mt-1">{errors.razaoSocial}</p>
              )}
            </div>
            <div>
              <label htmlFor="nomeFantasia" className="block text-sm font-medium">
                Nome Fantasia
              </label>
              <Input
                id="nomeFantasia"
                value={nomeFantasia}
                onChange={(e) => {
                  setNomeFantasia(e.target.value);
                  setErrors((prev) => ({ ...prev, nomeFantasia: "" }));
                }}
                required
                className={errors.nomeFantasia ? "border-red-500" : ""}
              />
              {errors.nomeFantasia && (
                <p className="text-sm text-red-500 mt-1">{errors.nomeFantasia}</p>
              )}
            </div>
          </div>

          {/* Linha 3: Tipo Logradouro, Logradouro, Número (todos na mesma linha) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="TipoLogradouro" className="block text-sm font-medium">
                Rua, Avenida, etc.
              </label>
              <Input
                id="TipoLogradouro"
                value={TipoLogradouro}
                onChange={(e) => setTipoLogradouro(e.target.value)}
                required
                className={errors.TipoLogradouro ? "border-red-500" : ""}
              />
              {errors.TipoLogradouro && (
                <p className="text-sm text-red-500 mt-1">{errors.TipoLogradouro}</p>
              )}
            </div>
            <div>
              <label htmlFor="logradouro" className="block text-sm font-medium">
                Logradouro
              </label>
              <Input
                id="logradouro"
                value={logradouro}
                onChange={(e) => {
                  setLogradouro(e.target.value);
                  setErrors((prev) => ({ ...prev, logradouro: "" }));
                }}
                required
                className={errors.logradouro ? "border-red-500" : ""}
              />
              {errors.logradouro && (
                <p className="text-sm text-red-500 mt-1">{errors.logradouro}</p>
              )}
            </div>
            <div>
              <label htmlFor="numero" className="block text-sm font-medium">
                Número
              </label>
              <Input
                id="numero"
                value={numero}
                onChange={(e) => {
                  setNumero(e.target.value);
                  setErrors((prev) => ({ ...prev, numero: "" }));
                }}
                required
                className={errors.numero ? "border-red-500" : ""}
              />
              {errors.numero && (
                <p className="text-sm text-red-500 mt-1">{errors.numero}</p>
              )}
            </div>
          </div>

          {/* Linha 4: Complemento, Bairro */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="complemento" className="block text-sm font-medium">
                Complemento
              </label>
              <Input
                id="complemento"
                value={complemento}
                onChange={(e) => setComplemento(e.target.value)}
                placeholder="Opcional"
              />
            </div>
            <div>
              <label htmlFor="bairro" className="block text-sm font-medium">
                Bairro
              </label>
              <Input
                id="bairro"
                value={bairro}
                onChange={(e) => {
                  setBairro(e.target.value);
                  setErrors((prev) => ({ ...prev, bairro: "" }));
                }}
                required
                className={errors.bairro ? "border-red-500" : ""}
              />
              {errors.bairro && (
                <p className="text-sm text-red-500 mt-1">{errors.bairro}</p>
              )}
            </div>
          </div>

          {/* Linha 5: Município, Estado, CEP */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="municipio" className="block text-sm font-medium">
                Município
              </label>
              <Input
                id="municipio"
                value={municipio}
                onChange={(e) => {
                  setMunicipio(e.target.value);
                  setErrors((prev) => ({ ...prev, municipio: "" }));
                }}
                required
                className={errors.municipio ? "border-red-500" : ""}
              />
              {errors.municipio && (
                <p className="text-sm text-red-500 mt-1">{errors.municipio}</p>
              )}
            </div>
            <div>
              <label htmlFor="estado" className="block text-sm font-medium">
                Estado (UF)
              </label>
              <Input
                id="estado"
                value={estado}
                onChange={(e) => {
                  setEstado(e.target.value.toUpperCase());
                  setErrors((prev) => ({ ...prev, estado: "" }));
                }}
                required
                maxLength={2}
                className={errors.estado ? "border-red-500" : ""}
              />
              {errors.estado && (
                <p className="text-sm text-red-500 mt-1">{errors.estado}</p>
              )}
            </div>
            <div>
              <label htmlFor="cep" className="block text-sm font-medium">
                CEP
              </label>
              <Input
                id="cep"
                value={cep}
                onChange={(e) => {
                  const cepFormatado = formatarCep(e.target.value);
                  setCep(cepFormatado);
                  setErrors((prev) => ({ ...prev, cep: "" }));
                }}
                required
                className={errors.cep ? "border-red-500" : ""}
                placeholder="00000-000"
                maxLength={9}
              />
              {errors.cep && (
                <p className="text-sm text-red-500 mt-1">{errors.cep}</p>
              )}
            </div>
          </div>

          {/* Linha 6: Email (grande) */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium">
              Email
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrors((prev) => ({ ...prev, email: "" }));
              }}
              required
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && (
              <p className="text-sm text-red-500 mt-1">{errors.email}</p>
            )}
          </div>

          {/* Linha 7: Senha, Confirmar Senha */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Campo Senha com Tooltip de Regras */}
            <div className="relative">
              <label htmlFor="senha" className="block text-sm font-medium">Senha</label>

              <div className="relative">
                <Input
                  id="senha"
                  type={mostrarSenha ? "text" : "password"}
                  value={senha}
                  onChange={(e) => {
                    setSenha(e.target.value);
                    setErrors((prev) => ({ ...prev, senha: "" }));
                  }}
                  onFocus={() => setMostrarRegras(true)}
                  onBlur={() => setTimeout(() => setMostrarRegras(false), 200)}
                  required
                  className={errors.senha ? "border-red-500 pr-10" : "pr-10"}
                />
                <button
                  type="button"
                  onClick={() => setMostrarSenha(!mostrarSenha)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  aria-label={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
                >
                  {mostrarSenha ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {/* Barra de força da senha */}
              {senha && (
                <div className="mt-2">
                  <div
                    className={`h-2 rounded transition-all ${
                      forca === "fraca"
                        ? "bg-red-400 w-1/3"
                        : forca === "media"
                        ? "bg-yellow-400 w-2/3"
                        : "bg-green-500 w-full"
                    }`}
                  />
                  <span
                    className={`text-xs font-semibold ml-1 ${
                      forca === "fraca"
                        ? "text-red-500"
                        : forca === "media"
                        ? "text-yellow-600"
                        : "text-green-600"
                    }`}
                  >
                    {forca === "fraca"
                      ? "Senha fraca"
                      : forca === "media"
                      ? "Senha média"
                      : "Senha forte"}
                  </span>
                </div>
              )}

              {/* Tooltip com regras */}
              {mostrarRegras && (
                <div className="absolute z-10 top-0 right-full mr-4 w-[280px] bg-gray-800 text-white text-sm rounded-md shadow-lg p-4">
                  <div className="absolute top-4 -right-2 w-3 h-3 bg-gray-800 rotate-45 shadow-md" />
                  <p className="font-semibold mb-2">SUA SENHA DEVE CONTER:</p>
                  <ul className="space-y-1">
                    <li className={regras.maiuscula ? "text-green-400" : "text-gray-300"}>
                      <span className="font-bold">ABC</span> 1 letra maiúscula
                    </li>
                    <li className={regras.minuscula ? "text-green-400" : "text-gray-300"}>
                      <span className="font-bold">abc</span> 1 letra minúscula
                    </li>
                    <li className={regras.numero ? "text-green-400" : "text-gray-300"}>
                      <span className="font-bold">123</span> 1 número
                    </li>
                    <li className={regras.especial ? "text-green-400" : "text-gray-300"}>
                      <span className="font-bold">!</span> 1 caractere especial
                    </li>
                    <li className={regras.tamanho ? "text-green-400" : "text-gray-300"}>
                      <span className="font-bold">***</span> No mínimo 8 caracteres
                    </li>
                  </ul>
                </div>
              )}

              {errors.senha && <p className="text-sm text-red-500 mt-1">{errors.senha}</p>}
            </div>

            <div>
              <label htmlFor="confirmarSenha" className="block text-sm font-medium">
                Confirmar Senha
              </label>
              <div className="relative">
                <Input
                  id="confirmarSenha"
                  type={mostrarSenhaConfirmar ? "text" : "password"}
                  value={confirmarSenha}
                  onChange={(e) => {
                    setConfirmarSenha(e.target.value);
                    setErrors((prev) => ({ ...prev, confirmarSenha: "" }));
                  }}
                  required
                  className={errors.confirmarSenha ? "border-red-500" : ""}
                />
                <button
                  type="button"
                  onClick={() => setMostrarSenhaConfirmar(!mostrarSenhaConfirmar)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  aria-label={mostrarSenhaConfirmar ? "Ocultar senha" : "Mostrar senha"}
                >
                  {mostrarSenhaConfirmar ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.confirmarSenha && (
                <p className="text-sm text-red-500 mt-1">{errors.confirmarSenha}</p>
              )}
            </div>
          </div>

          {/* Botão de submit */}
          <div>
            <Button
              type="submit"
              className="bg-[#FF9800] hover:bg-[#FB8C00] text-white font-poppins transition-transform transform hover:scale-105 w-full mt-2"
            >
              Criar Conta
            </Button>
            <p className="mt-4 text-center text-sm text-gray-600">
              Já possui uma conta?{" "}
              <Link to="/autenticacao/login" className="text-blue-600 hover:underline">
                Fazer login
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
