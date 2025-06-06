import { Route, Routes } from "react-router-dom";

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

const RoutesConfig = () => {
  return (
    <Routes>
      {/* Página inicial pública */}
      <Route path="/" element={<Home />} />

      {/*  Autenticação */}
      <Route path="/autenticacao/login" element={<Login />} />
      <Route path="/autenticacao/criar-conta" element={<CriarConta />} />
      <Route path="/autenticacao/esqueci-senha" element={<EsqueceuSenha />} />

      {/*  Rotas do Doador */}
      <Route path="/doador" element={<HomeDoador />} />
      <Route path="/doador/nova-doacao" element={<NovaDoacao />} />
      <Route path="/doador/historico-doacao" element={<HistoricoDoacaoDoador />} />
      <Route path="/doador/editar-perfil" element={<EditarPerfilDoador />} />

      {/*  Rotas do Beneficiário */}
      <Route path="/beneficiario" element={<HomeBeneficiario />} />
      <Route path="/beneficiario/buscar-doacao" element={<BuscarDoacao />} />
      <Route path="/beneficiario/historico-doacao" element={<HistoricoDoacaoBeneficiario />} />
      <Route path="/beneficiario/editar-perfil" element={<EditarPerfilBeneficiario />} />
    </Routes>
  );
};

export default RoutesConfig;
