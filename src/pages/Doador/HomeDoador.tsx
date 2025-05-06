
import { Button } from "@/components/shadcn/button"
import { Separator } from "@/components/shadcn/separator"
import { FaHandHoldingHeart, FaSignOutAlt, FaUserEdit } from "react-icons/fa"
import { Link } from "react-router-dom"
import Footer from "@/components/Footer"

export const HomeDoador = () => {
  return (
    <>
      <main className="min-h-screen bg-[#F5F5F5] flex items-center justify-center py-10 px-4">
        <div className="w-full max-w-2xl bg-white shadow-lg rounded-2xl p-8 space-y-8">
          <h1 className="text-3xl font-bold text-[#4CAF50] text-center font-poppins">
            Bem-vindo ao seu perfil!
          </h1>

          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 shadow-sm">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-700">Seus dados</h2>
                <p className="text-sm text-gray-600">Nome da empresa, CNPJ, E-mail</p>
              </div>
              <Link to="/doador/editar-perfil">
                <Button className="bg-[#FF9800] hover:bg-[#FB8C00] text-white flex gap-2 items-center transition-transform transform hover:scale-105">
                  <FaUserEdit />
                  Editar Perfil
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <Button className="bg-[#4CAF50] hover:bg-[#43A047] text-white w-full flex items-center justify-center gap-3 py-5 text-lg rounded-xl transition-transform transform hover:scale-105">
              <FaHandHoldingHeart className="text-2xl" />
              Realizar Doação
            </Button>

            <Button className="bg-red-500 hover:bg-red-600 text-white w-full flex items-center justify-center gap-3 py-5 text-lg rounded-xl transition-transform transform hover:scale-105">
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
  )
}
