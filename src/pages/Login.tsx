import { Button } from "@/components/shadcn/button"
import { Input } from "@/components/shadcn/input"
import { Separator } from "@/components/shadcn/separator"
import { GitHubLogoIcon } from "@radix-ui/react-icons"
import { FcGoogle } from "react-icons/fc"

export default function Login() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="w-full max-w-sm p-6 rounded-xl shadow-md border bg-white">
        <h1 className="text-2xl font-semibold text-center">Cadastre-se</h1>
        <p className="text-sm text-gray-500 text-center mt-1">
          Entre com o seu e-mail abaixo para criar a sua conta
        </p>

        <div className="flex gap-2 mt-6">
          <Button variant="outline" className="w-full flex items-center gap-2">
            <GitHubLogoIcon className="h-4 w-4" />
            GitHub
          </Button>
          <Button variant="outline" className="w-full flex items-center gap-2">
            <FcGoogle className="h-4 w-4" />
            Google
          </Button>
        </div>

        <div className="flex items-center my-6">
          <Separator className="flex-1" />
          <span className="mx-2 text-xs text-gray-500">OU CONTINUE COM</span>
          <Separator className="flex-1" />
        </div>

        <form className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium">
              E-mail
            </label>
            <Input
              id="e-mail"
              type="email"
              placeholder="e-mail@gmail.com"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium">
              Senha
            </label>
            <Input
              id="senha"
              type="password"
              placeholder="••••••••"
              required
            />
          </div>

          <Button type="submit" className="w-full mt-2">
            Criar conta
          </Button>
        </form>
      </div>
    </div>
  )
}
