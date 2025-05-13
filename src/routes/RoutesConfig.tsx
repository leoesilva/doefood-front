import { Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import Login from "@/pages/Autenticacao/Login";
import EsqueceuSenha from "@/pages/Autenticacao/EsqueceuSenha";
import CriarConta from "@/pages/Autenticacao/CriarConta";
import { HomeDoador } from "@/pages/Doador/HomeDoador";
import { EditarPerfilDoador } from "@/pages/Doador/EditarPerfilDoador";
import { HomeBeneficiario } from "@/pages/Beneficiario/HomeBeneficiario";
import { EditarPerfilBeneficiario } from "@/pages/Beneficiario/EditarPerfilBeneficiario";
import { DoacoesRecebidas } from "@/pages/Beneficiario/DoacoesRecebidas";

const RoutesConfig = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/autenticacao/login" element={<Login />} />
      <Route path="/autenticacao/esqueci-senha" element={<EsqueceuSenha />} />
      <Route path="/autenticacao/criar-conta" element={<CriarConta />} />

      <Route path="/doador" element={<HomeDoador />} />
      <Route path="/doador/editar-perfil" element={<EditarPerfilDoador />} />
      <Route path="/beneficiario" element={<HomeBeneficiario />} />
      <Route path="/beneficiario/editar-perfil" element={<EditarPerfilBeneficiario />} />
      <Route path="/beneficiario/doacoes" element={<DoacoesRecebidas />} />
    </Routes>
  );
};

export default RoutesConfig;
