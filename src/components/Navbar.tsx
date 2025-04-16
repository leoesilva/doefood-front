import Button from "@/components/ui/Button";


export default function Navbar() {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-primary font-poppins">doeFood</h1>
        <nav className="flex gap-4">
          <Button variant="ghost">Entrar</Button>
          <Button variant="outline">Cadastrar</Button>
        </nav>
      </div>
    </header>
  )
}
