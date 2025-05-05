import { Route, Routes } from "react-router-dom";
import Home from "../pages/Home"; 
import Login from "@/pages/Autenticacao/Login";
import EsqueceuSenha from "@/pages/Autenticacao/EsqueceuSenha";
import CriarConta from "@/pages/Autenticacao/CriarConta";


const RoutesConfig = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/autenticacao/login" element={<Login />} />
      <Route path="/autenticacao/esqueci-senha" element={<EsqueceuSenha />} />
      <Route path="/autenticacao/criar-conta" element={<CriarConta />} />
    </Routes>
  );
};

export default RoutesConfig;
