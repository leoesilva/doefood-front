// HomeDoador.tsx
import { Button } from "@/components/shadcn/button";
import { Separator } from "@/components/shadcn/separator";
import {
  FaHandHoldingHeart,
  FaHistory,
  FaSignOutAlt,
  FaUserEdit,
  FaAward,
} from "react-icons/fa";
import { Link, Navigate } from "react-router-dom";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";

export default function HomeDoador() {
  const { user, logout } = useAuth();

  if (!user) return <Navigate to="/autenticacao/login" />;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#F5F5F5] flex items-center justify-center py-10 px-4">
        <div className="w-full max-w-4xl bg-white shadow-xl rounded-2xl p-8 space-y-10">
          <h1 className="text-4xl font-bold text-[#4CAF50] text-center font-poppins">
            Obrigado por fazer a diferença 💚
          </h1>

          <div className="text-center text-gray-700 text-lg italic">
            Seu gesto de solidariedade ajuda a combater a fome e o desperdício
            de alimentos. Você é essencial nessa corrente do bem!
          </div>

          {/* Certificado */}
          <div className="bg-green-50 border border-green-200 rounded-xl p-6 shadow-inner flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <FaAward className="text-4xl text-[#FF9800]" />
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  Certificado de Doador
                </h2>
                <p className="text-gray-600 text-sm">
                  Reconhecimento simbólico pelo seu compromisso social
                </p>
              </div>
            </div>
            <Button className="bg-[#FF9800] hover:bg-[#FB8C00] text-white">
              Baixar Certificado
            </Button>
          </div>

          {/* Ações */}
          <div className="grid md:grid-cols-2 gap-4">
            <Link to="/doador/nova-doacao">
              <Button className="bg-[#4CAF50] hover:bg-[#43A047] text-white w-full flex items-center justify-center gap-3 py-5 text-lg rounded-xl transition-transform transform hover:scale-105">
                <FaHandHoldingHeart className="text-2xl" />
                Nova Doação
              </Button>
            </Link>

            <Link to="/doador/historico-doacoes">
              <Button className="bg-blue-500 hover:bg-blue-600 text-white w-full flex items-center justify-center gap-3 py-5 text-lg rounded-xl transition-transform transform hover:scale-105">
                <FaHistory className="text-2xl" />
                Histórico de Doações
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <Link to="/doador/editar-perfil">
              <Button className="bg-[#FF9800] hover:bg-[#FB8C00] text-white w-full flex items-center justify-center gap-3 py-5 text-lg rounded-xl transition-transform transform hover:scale-105">
                <FaUserEdit className="text-2xl" />
                Editar Perfil
              </Button>
            </Link>

            <Button
              onClick={logout}
              className="bg-red-500 hover:bg-red-600 text-white w-full flex items-center justify-center gap-3 py-5 text-lg rounded-xl transition-transform transform hover:scale-105"
            >
              <FaSignOutAlt className="text-2xl" />
              Sair da Conta
            </Button>
          </div>

          <Separator className="my-6" />

          <div className="text-center text-sm text-gray-500 italic">
            Doe com responsabilidade e ajude quem precisa 💚
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
