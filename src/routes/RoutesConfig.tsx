
/**
 * /src/routes/RoutesConfig.tsx
 *
 * Configures the application's route structure using React Router.
 * Defines public, authentication, donor, and beneficiary routes,
 * mapping each path to its respective page component.
 *
 * @returns {JSX.Element} The set of application routes.
 */

import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute"; // 


// Páginas públicas
import Home from "../pages/Home";

// Autenticação
import Login from "@/pages/Autenticacao/Login";
import CriarConta from "@/pages/Autenticacao/CriarConta";
import EsqueceuSenha from "@/pages/Autenticacao/EsqueceuSenha";

// Páginas do Doador
import HomeDoador from "@/pages/Doador/HomeDoador";
import NovaDoacao from "@/pages/Doador/NovaDoacao";
import HistoricoDoacaoDoador from "@/pages/Doador/HistoricoDoacaoDoador";
import EditarPerfilDoador from "@/pages/Doador/EditarPerfilDoador";

// Páginas do Beneficiário
import HomeBeneficiario from "@/pages/Beneficiario/HomeBeneficiario";
import BuscarDoacao from "@/pages/Beneficiario/BuscarDoacao";
import HistoricoDoacaoBeneficiario from "@/pages/Beneficiario/HistoricoDoacaoBeneficiario";
import EditarPerfilBeneficiario from "@/pages/Beneficiario/EditarPerfilBeneficiario";
import RedefinirSenha from "@/pages/Autenticacao/RedefinirSenha";

const RoutesConfig = () => {
  return (
    <Routes>
      {/* Página inicial pública */}
      <Route path="/" element={<Home />} />

      {/* Autenticação */}
      <Route path="/autenticacao/login" element={<Login />} />
      <Route path="/autenticacao/criar-conta" element={<CriarConta />} />
      <Route path="/autenticacao/esqueci-senha" element={<EsqueceuSenha />} />
      <Route path="/autenticacao/redefinir-senha/:token" element={<RedefinirSenha/>} />

      {/* Rotas do Doador */}
      <Route
        path="/doador"
        element={
          <ProtectedRoute allowedTipo="doador">
            <HomeDoador />
          </ProtectedRoute>
        }
      />
      <Route
        path="/doador/nova-doacao"
        element={
          <ProtectedRoute allowedTipo="doador">
            <NovaDoacao />
          </ProtectedRoute>
        }
      />
      <Route
        path="/doador/historico-doacao"
        element={
          <ProtectedRoute allowedTipo="doador">
            <HistoricoDoacaoDoador />
          </ProtectedRoute>
        }
      />
      <Route
        path="/doador/editar-perfil"
        element={
          <ProtectedRoute allowedTipo="doador">
            <EditarPerfilDoador />
          </ProtectedRoute>
        }
      />

      {/* Rotas do Beneficiário */}
      <Route
        path="/beneficiario"
        element={
          <ProtectedRoute allowedTipo="beneficiario">
            <HomeBeneficiario />
          </ProtectedRoute>
        }
      />
      <Route
        path="/beneficiario/buscar-doacao"
        element={
          <ProtectedRoute allowedTipo="beneficiario">
            <BuscarDoacao />
          </ProtectedRoute>
        }
      />
      <Route
        path="/beneficiario/historico-doacao"
        element={
          <ProtectedRoute allowedTipo="beneficiario">
            <HistoricoDoacaoBeneficiario />
          </ProtectedRoute>
        }
      />
      <Route
        path="/beneficiario/editar-perfil"
        element={
          <ProtectedRoute allowedTipo="beneficiario">
            <EditarPerfilBeneficiario />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default RoutesConfig;
