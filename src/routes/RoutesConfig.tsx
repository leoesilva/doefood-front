import { Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import Login from "@/pages/Autenticacao/Login";
import EsqueceuSenha from "@/pages/Autenticacao/EsqueceuSenha";
import CriarConta from "@/pages/Autenticacao/CriarConta";
import { HomeDoador } from "@/pages/Doador/HomeDoador";
import { EditarPerfilDoador } from "@/pages/Doador/EditarPerfilDoador";
import { HomeOng } from "@/pages/ong/HomeOng";
import { EditarPerfilOng } from "@/pages/ong/EditarPerfilOng";

const RoutesConfig = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/autenticacao/login" element={<Login />} />
      <Route path="/autenticacao/esqueci-senha" element={<EsqueceuSenha />} />
      <Route path="/autenticacao/criar-conta" element={<CriarConta />} />

      <Route path="/doador" element={<HomeDoador />} />
      <Route path="/doador/editar-perfil" element={<EditarPerfilDoador />} />
      <Route path="/ong" element={<HomeOng />} />
      <Route path="/ong/editar-perfil" element={<EditarPerfilOng />} />
    </Routes>
  );
};

export default RoutesConfig;
