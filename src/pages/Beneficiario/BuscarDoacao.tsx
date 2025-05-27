// BuscarDoacao.tsx
import { useEffect, useState } from "react";
import { FaSearch, FaMapMarkerAlt, FaListAlt } from "react-icons/fa";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/shadcn/button";
import L from "leaflet";

const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// Função para calcular distância entre duas coordenadas
function calcularDistancia(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // Raio da Terra em km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distância em km
}

const BuscarDoacao = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [mostrarProximas, setMostrarProximas] = useState(false);

  const doacoes = [
    { id: 1, nome: "Doação de Cestas Básicas", lat: -23.55052, lng: -46.633308 },
    { id: 2, nome: "Doação de Alimentos não-pereciveis", lat: -23.559616, lng: -46.658384 },
    { id: 3, nome: "Doação de Alimentos Perecíveis", lat: -23.566, lng: -46.652 },
    { id: 4, nome: "Doação de Frutas", lat: -23.570, lng: -46.640 },
    { id: 5, nome: "Doação de Água", lat: -23.580, lng: -46.650 },
  ];

  const handleSearch = () => {
    console.log("Buscando doações para:", searchTerm);
  };

  const handleVerProximas = () => {
    if (!navigator.geolocation) {
      alert("Geolocalização não é suportada pelo seu navegador.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation([latitude, longitude]);
        setMostrarProximas(true);
      },
      () => {
        alert("Não foi possível obter sua localização.");
      }
    );
  };

  const handleVerPorCategoria = () => {
    navigate("/categorias");
  };

  // Filtra as doações dentro de 5 km
  const doacoesFiltradas = mostrarProximas && userLocation
    ? doacoes.filter((d) => {
        const distancia = calcularDistancia(
          userLocation[0],
          userLocation[1],
          d.lat,
          d.lng
        );
        return distancia <= 5; // 5 km de raio
      })
    : doacoes;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#F5F5F5] flex items-center justify-center py-10 px-4">
        <div className="w-full max-w-5xl bg-white shadow-2xl rounded-2xl p-8 space-y-10">
          <h1 className="text-4xl font-bold text-[#4CAF50] text-center font-poppins">
            Buscar Doações
          </h1>

          {/* Barra de pesquisa */}
          <div className="flex justify-center items-center space-x-2">
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

          {/* Mapa */}
          <div className="w-full h-[400px] rounded-xl overflow-hidden">
            <MapContainer
              center={userLocation || [-23.55052, -46.633308]}
              zoom={13}
              scrollWheelZoom={true}
              className="w-full h-full z-0"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {userLocation && (
                <Marker position={userLocation} icon={markerIcon}>
                  <Popup>Você está aqui</Popup>
                </Marker>
              )}
              {doacoesFiltradas.map((doacao) => (
                <Marker
                  key={doacao.id}
                  position={[doacao.lat, doacao.lng]}
                  icon={markerIcon}
                >
                  <Popup>{doacao.nome}</Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>

          {/* Botões */}
          <div className="space-y-6 mt-8">
            <div className="grid md:grid-cols-2 gap-4">
              <Button
                onClick={handleVerProximas}
                className="bg-[#4CAF50] hover:bg-[#43A047] text-white py-5 text-lg rounded-xl transition-transform transform hover:scale-105 w-full flex items-center justify-center gap-2"
              >
                <FaMapMarkerAlt />
                Ver Doações Próximas
              </Button>

              <Button
                onClick={handleVerPorCategoria}
                className="bg-blue-500 hover:bg-blue-600 text-white py-5 text-lg rounded-xl transition-transform transform hover:scale-105 w-full flex items-center justify-center gap-2"
              >
                <FaListAlt />
                Ver Doações por Categoria
              </Button>
            </div>

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
