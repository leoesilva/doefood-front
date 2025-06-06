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
import { motion } from "framer-motion";

export default function HomeBeneficiario() {
  const { user, logout } = useAuth();

  if (!user) return <Navigate to="/autenticacao/login" />;


  const btnClass =
    "w-full flex items-center justify-center gap-3 py-5 text-lg rounded-xl transition-transform hover:scale-105";

  return (
    <>
      <Navbar />
      <main className="min-h-screen relative flex items-center justify-center py-10 px-4 overflow-hidden">
  
        <div className="w-full max-w-5xl bg-white bg-opacity-90 shadow-2xl rounded-3xl p-10 space-y-10 relative z-10">
          <motion.h1
            className="text-4xl md:text-5xl font-bold text-[#4CAF50] text-center font-poppins"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Bem-vindo(a)! Juntos fazemos a diferença 💚
          </motion.h1>

          <motion.p
            className="text-center text-gray-700 text-lg italic"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Obrigado por estar conosco na missão de levar esperança e alimento
            para quem mais precisa. Sua solidariedade muda vidas!
          </motion.p>

          {/* Ações principais */}
          <motion.div
            className="grid md:grid-cols-2 gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Link to="/beneficiario/buscar-doacao">
              <Button variant="green" className={btnClass}>
                <FaHandHoldingHeart className="text-2xl" />
                Buscar Doação
              </Button>
            </Link>

            <Link to="/beneficiario/historico-doacao">
              <Button variant="blue" className={btnClass}>
                <FaHistory className="text-2xl" />
                Histórico de Doações
              </Button>
            </Link>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <Link to="/beneficiario/editar-perfil">
              <Button variant="orange" className={btnClass}>
                <FaUserEdit className="text-2xl" />
                Editar Perfil
              </Button>
            </Link>

            <Button
              variant="red"
              onClick={logout}
              className={btnClass}
            >
              <FaSignOutAlt className="text-2xl" />
              Sair da Conta
            </Button>
          </motion.div>

          <Separator className="my-8" />

          <motion.div
            className="text-center text-sm text-gray-500 italic"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            Doe amor, doe esperança, doe alimentos. 💚
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
}
