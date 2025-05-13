// HomeDoador.tsx
import { Button } from "@/components/shadcn/button";
import { Separator } from "@/components/shadcn/separator";
import {
  FaHandHoldingHeart,
  FaHistory,
  FaSignOutAlt,
  FaUserEdit,
} from "react-icons/fa";
import { Link, Navigate } from "react-router-dom";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";

export default function HomeBeneficiario() {
  const { user, logout } = useAuth();

  if (!user) return <Navigate to="/autenticacao/login" />;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#F5F5F5] flex items-center justify-center py-10 px-4">
        <div className="w-full max-w-4xl bg-white shadow-xl rounded-2xl p-8 space-y-10">
          <h1 className="text-4xl font-bold text-[#4CAF50] text-center font-poppins">
            Estamos felizes em te apoiar! 💚
          </h1>

          <div className="text-center text-gray-700 text-lg italic">
            Sua coragem e confiança são fundamentais para tornar este projeto
            possível. Juntos, podemos combater a fome e criar um futuro mais
            justo para todos.
          </div>

          {/* Ações */}
          <div className="grid md:grid-cols-2 gap-4">
            <Link to="/beneficiario/buscar-doacao">
              <Button className="bg-[#4CAF50] hover:bg-[#43A047] text-white w-full flex items-center justify-center gap-3 py-5 text-lg rounded-xl transition-transform transform hover:scale-105">
                <FaHandHoldingHeart className="text-2xl" />
                Buscar Doação
              </Button>
            </Link>

            <Link to="/beneficiario/historico-doacao">
              <Button className="bg-blue-500 hover:bg-blue-600 text-white w-full flex items-center justify-center gap-3 py-5 text-lg rounded-xl transition-transform transform hover:scale-105">
                <FaHistory className="text-2xl" />
                Histórico de Doações
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <Link to="/beneficiario/editar-perfil">
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
            A sua força também é nossa inspiração! 💚
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
