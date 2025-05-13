// BuscarDoacao.tsx
import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/shadcn/button";
import imgMapa from "@/assets/sao-paulo.jpg"; // Substitua pelo caminho da sua imagem
const BuscarDoacao = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = () => {
    // Aqui você pode adicionar lógica para filtrar doações por localização
    console.log("Buscando doações para:", searchTerm);
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#F5F5F5] flex items-center justify-center py-10 px-4">
        <div className="w-full max-w-4xl bg-white shadow-xl rounded-2xl p-8 space-y-10">
          <h1 className="text-4xl font-bold text-[#4CAF50] text-center font-poppins">
            Buscar Doações
          </h1>

          {/* Barra de pesquisa */}
          <div className="flex justify-center items-center space-x-2 mb-6">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Digite sua localização"
              className="w-1/2 p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
            />
            <Button
              onClick={handleSearch}
              className="bg-[#4CAF50] hover:bg-[#43A047] text-white py-3 px-6 rounded-xl flex items-center gap-2"
            >
              <FaSearch className="text-xl" />
              Buscar
            </Button>
          </div>

          {/* Imagem de Mapa */}
          <div className="relative w-full h-80 bg-gray-300 rounded-xl overflow-hidden">
            {/* Você pode substituir pela imagem real de um mapa ou integrar uma API de mapa */}
            <img
              src={imgMapa} // Substitua pelo caminho da sua imagem
              alt="Mapa"
              className="object-cover w-full h-full"
            />
          </div>

          {/* Botões de ações adicionais */}
          <div className="space-y-6 mt-8">
            {/* Grid com dois botões grandes */}
            <div className="grid md:grid-cols-2 gap-4">
              <Button className="bg-[#4CAF50] hover:bg-[#43A047] text-white py-5 text-lg rounded-xl transition-transform transform hover:scale-105 w-full">
                Ver Doações Próximas
              </Button>
              <Button className="bg-blue-500 hover:bg-blue-600 text-white py-5 text-lg rounded-xl transition-transform transform hover:scale-105 w-full">
                Ver Doações por Categoria
              </Button>
            </div>

            {/* Botão de voltar */}
            <div className="text-center md:text-left">
              <button
                onClick={() => navigate(-1)}
                className="text-green-600 hover:text-green-800 underline transition text-sm"
              >
                ← Voltar para página anterior
              </button>
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
};

export default BuscarDoacao;
