import Button from "@/components/ui/Button";
import logo from "@/assets/doefood-logo.png";

export default function Navbar() {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50 h-16 w-full">
      <div className="w-full h-full flex items-center justify-between px-6">
        <div className="h-12 flex items-center">
          <img
            src={logo}
            alt="Logo doeFood"
            className="h-full object-contain"
          />
        </div>

        <nav className="flex gap-4 items-center">
          <Button variant="ghost">Entrar</Button>
          <Button variant="outline">Cadastrar</Button>
        </nav>
      </div>
    </header>
  );
}
