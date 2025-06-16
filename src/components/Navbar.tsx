import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/shadcn/button";
import { useAuth } from "@/context/AuthContext";
import { FaSignOutAlt } from "react-icons/fa";
import logo from "@/assets/doefood-logo.png";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handlePainelClick = () => {
    const tipo = localStorage.getItem("tipoUsuario");

    if (tipo === "doador") {
      navigate("/doador");
    } else if (tipo === "beneficiario") {
      navigate("/beneficiario");
    } else {
      navigate("/autenticacao/login");
    }
  };

  return (
    <nav className="bg-white shadow-md py-4 px-6 flex items-center justify-between">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2">
        <div className="h-12 flex items-center">
          <img
            src={logo}
            alt="Logo doeFood"
            className="h-full object-contain"
          />
        </div>
      </Link>

      {/* Ações do usuário */}
      {user ? (
        <div className="flex items-center gap-4">
          {user?.email && (
            <span className="text-sm font-medium text-gray-700">
              Bem-vindo, {user.email}
            </span>
          )}

          <Button
            variant="ghost"
            onClick={handlePainelClick}
            className="text-[#FF9800] hover:text-[#FB8C00] text-sm font-medium transition-colors"
          >
            Painel
          </Button>

          <Button
            variant="ghost"
            onClick={logout}
            className="text-red-600 hover:text-red-800 flex items-center gap-2"
          >
            <FaSignOutAlt className="text-lg" />
            Sair
          </Button>
        </div>
      ) : (
        <Link to="/autenticacao/login">
          <Button className="bg-[#FF9800] hover:bg-[#FB8C00] text-white font-poppins transition-transform transform hover:scale-105">
            Entrar
          </Button>
        </Link>
      )}
    </nav>
  );
}
