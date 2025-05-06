import { Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import Login from "@/pages/Autenticacao/Login";
import EsqueceuSenha from "@/pages/Autenticacao/EsqueceuSenha";
import CriarConta from "@/pages/Autenticacao/CriarConta";
import { HomeDoador } from "@/pages/Doador/HomeDoador";
import { EditarPerfilDoador } from "@/pages/Doador/EditarPerfilDoador";

const RoutesConfig = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/autenticacao/login" element={<Login />} />
      <Route path="/autenticacao/esqueci-senha" element={<EsqueceuSenha />} />
      <Route path="/autenticacao/criar-conta" element={<CriarConta />} />

      <Route path="/doador" element={<HomeDoador />} />
      <Route path="/doador/editar-perfil" element={<EditarPerfilDoador />} />
    </Routes>
  );
};

export default RoutesConfig;
