import { Route, Routes } from "react-router-dom";
import Home from "../pages/Home"; 
import Login from "@/pages/Login";


const RoutesConfig = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
};

export default RoutesConfig;
