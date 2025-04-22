import { Button } from "@/components/shadcn/button";
import { Link } from "react-router-dom";
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

        <nav className="flex gap-4  items-center">
          <Link to="/autenticacao/login">
            <Button className="bg-[#FF9800] hover:bg-[#FB8C00] text-white font-poppins transition-transform transform hover:scale-105">Entrar</Button>
          </Link>
        </nav>
      </div>
    </header>
  );
}
