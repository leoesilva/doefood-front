import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { collection, addDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebaseConfig";
import { Button } from "@/components/shadcn/button";
import { Input } from "@/components/shadcn/input";
import { Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

// Máscara de CNPJ
const formatarCNPJ = (valor: string) => {
  return valor
    .replace(/\D/g, "")
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2")
    .slice(0, 18);
};

// Função para verificar força da senha e regras
function verificarForcaSenha(senha: string) {
  const regras = {
    tamanho: senha.length >= 8,
    maiuscula: /[A-Z]/.test(senha),
    especial: /[!@#$%^&*(),.?":{}|<>]/.test(senha),
  };

  const totalRegras = Object.values(regras).filter(Boolean).length;

  let forca: "fraca" | "media" | "forte" = "fraca";
  if (totalRegras === 3) forca = "forte";
  else if (totalRegras === 2) forca = "media";

  return { forca, regras };
}

export default function CriarConta() {
  const [nome, setNome] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [endereco, setEndereco] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarSenhaConfirmar, setMostrarSenhaConfirmar] = useState(false);
  const [tipo, setTipo] = useState("doador");
  const [tentouSubmeter, setTentouSubmeter] = useState(false);


  const [errors, setErrors] = useState({
    nome: "",
    cnpj: "",
    endereco: "",
    email: "",
    senha: "",
    confirmarSenha: "",
    geral: ""
  });

  const navigate = useNavigate();

  const { forca, regras } = verificarForcaSenha(senha);

  const corForca = {
    fraca: "bg-red-500",
    media: "bg-yellow-400",
    forte: "bg-green-500",
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({
      nome: "",
      cnpj: "",
      endereco: "",
      email: "",
      senha: "",
      confirmarSenha: "",
      geral: ""
    });

    const cnpjNumerico = cnpj.replace(/\D/g, "");
    if (cnpjNumerico.length !== 14) {
      setErrors((prev) => ({ ...prev, cnpj: "CNPJ inválido. Deve conter 14 dígitos." }));
      return;
    }

    // Verifica regras da senha antes de continuar
    setTentouSubmeter(true);

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

      await addDoc(collection(db, "usuarios"), {
        uid: user.uid,
        nome,
        cnpj,
        endereco,
        email,
        tipo
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
      <div className="w-full max-w-sm p-6 rounded-xl shadow-md border bg-white">
        <h1 className="text-2xl font-semibold text-center mb-4">Criar Conta</h1>

        {errors.geral && <p className="text-red-500 text-sm text-center mb-2">{errors.geral}</p>}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="nome" className="block text-sm font-medium">Razão Social</label>
            <Input
              id="nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
              className={errors.nome ? "border-red-500" : ""}
            />
            {errors.nome && <p className="text-sm text-red-500 mt-1">{errors.nome}</p>}
          </div>

          <div>
            <label htmlFor="cnpj" className="block text-sm font-medium">CNPJ</label>
            <Input
              id="cnpj"
              value={cnpj}
              onChange={(e) => setCnpj(formatarCNPJ(e.target.value))}
              placeholder="00.000.000/0000-00"
              required
              className={errors.cnpj ? "border-red-500" : ""}
            />
            {errors.cnpj && <p className="text-sm text-red-500 mt-1">{errors.cnpj}</p>}
          </div>

          <div>
            <label htmlFor="endereco" className="block text-sm font-medium">Endereço</label>
            <Input
              id="endereco"
              value={endereco}
              onChange={(e) => setEndereco(e.target.value)}
              required
              className={errors.endereco ? "border-red-500" : ""}
            />
            {errors.endereco && <p className="text-sm text-red-500 mt-1">{errors.endereco}</p>}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium">E-mail</label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="senha" className="block text-sm font-medium">Senha</label>
            <div className="relative">
              <Input
                id="senha"
                type={mostrarSenha ? "text" : "password"}
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
                className={errors.senha ? "border-red-500 pr-10" : "pr-10"}
              />
              <button
                type="button"
                onClick={() => setMostrarSenha((prev) => !prev)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                aria-label={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
              >
                {mostrarSenha ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Barra de força da senha */}
            <div className="h-2 rounded mt-2 w-full bg-gray-300">
              <div
                className={`${corForca[forca]} h-2 rounded transition-all`}
                style={{
                  width:
                    forca === "fraca"
                      ? "5%"
                      : forca === "media"
                        ? "50%"
                        : forca === "forte"
                          ? "100%"
                          : "0",
                }}
              />
            </div>

            {/* Regras da senha */}
            <div className="mt-2 text-sm space-y-1">
              <p
                className={
                  regras.tamanho
                    ? "text-green-600"
                    : tentouSubmeter
                      ? "text-red-600"
                      : "text-gray-600"
                }
              >
                • Mínimo 8 caracteres (letras ou números)
              </p>
              <p
                className={
                  regras.maiuscula
                    ? "text-green-600"
                    : tentouSubmeter
                      ? "text-red-600"
                      : "text-gray-600"
                }
              >
                • Pelo menos 1 letra maiúscula
              </p>
              <p
                className={
                  regras.especial
                    ? "text-green-600"
                    : tentouSubmeter
                      ? "text-red-600"
                      : "text-gray-600"
                }
              >
                • Pelo menos 1 caractere especial (!@#$%&*...)
              </p>

            </div>

            {errors.senha && <p className="text-sm text-red-500 mt-1">{errors.senha}</p>}
          </div>

          <div>
            <label htmlFor="confirmarSenha" className="block text-sm font-medium">Confirmar Senha</label>
            <div className="relative">
              <Input
                id="confirmarSenha"
                type={mostrarSenhaConfirmar ? "text" : "password"}
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
                required
                className={errors.confirmarSenha ? "border-red-500 pr-10" : "pr-10"}
              />
              <button
                type="button"
                onClick={() => setMostrarSenhaConfirmar((prev) => !prev)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {mostrarSenhaConfirmar ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.confirmarSenha && <p className="text-sm text-red-500 mt-1">{errors.confirmarSenha}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Tipo de usuário</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input type="radio" name="tipo" value="doador" checked={tipo === "doador"} onChange={(e) => setTipo(e.target.value)} className="accent-orange-500" />
                Doador
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" name="tipo" value="beneficiario" checked={tipo === "beneficiario"} onChange={(e) => setTipo(e.target.value)} className="accent-orange-500" />
                Beneficiário
              </label>
            </div>
          </div>

          <Button type="submit" className="bg-[#FF9800] hover:bg-[#FB8C00] text-white w-full mt-2">
            Cadastrar
          </Button>

          <p className="text-xs text-center text-gray-500 mt-4 px-2">
            Ao criar uma conta, você concorda com os <span className="text-blue-600 hover:underline cursor-pointer">Termos de Serviço</span> do doeFood.
            Para saber mais sobre como tratamos seus dados, veja nossa <span className="text-blue-600 hover:underline cursor-pointer">Política de Privacidade</span>.
            Podemos enviar e-mails com informações importantes relacionadas à sua conta.
          </p>
        </form>

        <p className="text-sm text-center mt-4">
          Já tem uma conta?{" "}
          <Link to="/autenticacao/login" className="text-blue-600 hover:underline">Faça login</Link>
        </p>

        <Link to="/" className="block mt-2 text-sm text-blue-600 hover:underline text-center">
          ← Voltar para a página inicial
        </Link>
      </div>
    </div>
  );
}
