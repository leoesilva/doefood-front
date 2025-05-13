import { Link } from "react-router-dom";
import { Button } from "@/components/shadcn/button";
import logo from "@/assets/doefood-logo.png";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const { user } = useAuth();

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
          {user ? (
            <span className="text-sm font-medium text-gray-700">
               Bem vindo, {user.email} 
            </span>
          ) : (
            <Link to="/autenticacao/login">
              <Button className="bg-[#FF9800] hover:bg-[#FB8C00] text-white font-poppins transition-transform transform hover:scale-105">
                Entrar
              </Button>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
