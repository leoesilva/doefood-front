import CriarConta from "@/pages/Autenticacao/CriarConta";
import EsqueceuSenha from "@/pages/Autenticacao/EsqueceuSenha";
import Login from "@/pages/Autenticacao/Login";
import BuscarDoacao from "@/pages/Beneficiario/BuscarDoacao";
import EditarPerfilBeneficiario from "@/pages/Beneficiario/EditarPerfilBeneficiario";
import HistoricoDoacaoBeneficiario from "@/pages/Beneficiario/HistoricoDoacaoBeneficiario";
import HomeBeneficiario from "@/pages/Beneficiario/HomeBeneficiario";
import EditarPerfilDoador from "@/pages/Doador/EditarPerfilDoador";
import HistoricoDoacaoDoador from "@/pages/Doador/HistoricoDoacaoDoador";
import HomeDoador from "@/pages/Doador/HomeDoador";
import NovaDoacao from "@/pages/Doador/NovaDoacao";
import { Route, Routes } from "react-router-dom";
import Home from "../pages/Home";

const RoutesConfig = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/autenticacao/login" element={<Login />} />
      <Route path="/autenticacao/esqueci-senha" element={<EsqueceuSenha />} />
      <Route path="/autenticacao/criar-conta" element={<CriarConta />} />

      <Route path="/doador" element={<HomeDoador />} />
      <Route path="/doador/nova-doacao" element={<NovaDoacao />} />
      <Route
        path="/doador/historico-doacao"
        element={<HistoricoDoacaoDoador />}
      />
      <Route path="/doador/editar-perfil" element={<EditarPerfilDoador />} />

      <Route path="/beneficiario" element={<HomeBeneficiario />} />
      <Route path="/beneficiario/buscar-doacao" element={<BuscarDoacao />} />
      <Route
        path="/beneficiario/historico-doacao"
        element={<HistoricoDoacaoBeneficiario />}
      />
      <Route
        path="/beneficiario/editar-perfil"
        element={<EditarPerfilBeneficiario />}
      />
    </Routes>
  );
};

export default RoutesConfig;
