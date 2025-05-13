import { Button } from "@/components/shadcn/button"
import { Input } from "@/components/shadcn/input"
import { Separator } from "@/components/shadcn/separator"
import Footer from "@/components/Footer"
import { Link } from "react-router-dom"

export const EditarPerfilBeneficiario = () => {
  return (
    <>
      <main className="min-h-screen bg-[#F5F5F5] flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-xl bg-white shadow-xl rounded-2xl p-8 space-y-6">
          <h1 className="text-3xl font-bold text-[#4CAF50] text-center font-poppins">
            Editar Perfil da ONG
          </h1>

          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Razão Social
              </label>
              <Input placeholder="Ex: ONG Ajuda e Amor" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                CNPJ
              </label>
              <Input placeholder="00.000.000/0000-00" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                E-mail
              </label>
              <Input type="email" placeholder="email@ong.org" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Senha
              </label>
              <Input type="password" placeholder="********" />
            </div>

            <Button type="submit" className="w-full bg-[#4CAF50] hover:bg-[#43A047] text-white text-base">
              Salvar Alterações
            </Button>
          </form>

          <Separator className="my-4" />

          <Link to="/ong" className="block text-center text-sm text-blue-600 hover:underline">
            ← Voltar para o perfil
          </Link>
        </div>
      </main>

      <Footer />
    </>
  )
}
