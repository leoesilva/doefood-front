// BuscarDoacao.tsx
import { useEffect, useState } from "react";
import { FaSearch, FaMapMarkerAlt } from "react-icons/fa";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
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
  const [searchTerm, setSearchTerm] = useState("");
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [mostrarProximas, setMostrarProximas] = useState(false);
  interface Doacao {
    id: number;
    nome: string;
    lat: number;
    lng: number;
    alimento: string;
    quantidade: number;
    validade: string;
    endereco: string;
  }

  const [doacoesComCoords, setDoacoesComCoords] = useState<Doacao[]>([]);

  useEffect(() => {
    const fetchDoacoesComEndereco = async () => {
      try {
        // 1. Buscar doações disponíveis
        const respDoacoes = await fetch(`${import.meta.env.VITE_API_URL}/doacoes`);
        const doacoesAll = await respDoacoes.json();
        const doacoesDisponiveis = doacoesAll.filter((d: Doacao & { disponivel: boolean; doadorId: number; alimento: string; quantidade: number; validade: string; }) => d.disponivel);

        // 2. Buscar usuários (doador) para cada doação
        const doacoesComEndereco = await Promise.all(
          doacoesDisponiveis.map(async (doacao: Doacao & { disponivel: boolean; doadorId: number; alimento: string; quantidade: number; validade: string; }) => {
            // Busca o usuário doador pelo doadorId
            const respUsuario = await fetch(`${import.meta.env.VITE_API_URL}/usuarios/${doacao.doadorId}`);
            const usuario = await respUsuario.json();

            // Monta o endereço completo
            const endereco = `${usuario.logradouro || ""}, ${usuario.numero || ""}, ${usuario.bairro || ""}, ${usuario.municipio || ""}, ${usuario.estado || ""}`;
            // Busca coordenadas no Nominatim
            const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(endereco)}&format=json&limit=1`;
            try {
              const res = await fetch(url);
              const data = await res.json();
              if (data && data[0]) {
                return {
                  id: doacao.id || Math.random().toString(36).substring(2),
                  nome: usuario.nomeFantasia || usuario.razaoSocial || "Doador",
                  lat: parseFloat(data[0].lat),
                  lng: parseFloat(data[0].lon),
                  endereco: endereco,
                  alimento: doacao.alimento,
                  quantidade: doacao.quantidade,
                  validade: doacao.validade,
                };
              }
            } catch {
              // Erro ao buscar coordenadas, ignorando esta doação
            }
            return null;
          })
        );
        setDoacoesComCoords(doacoesComEndereco.filter(Boolean));
      } catch {
        // Trate o erro conforme necessário
      }
    };

    fetchDoacoesComEndereco();
  }, []);

  // Busca coordenadas do texto digitado na barra de pesquisa
  const handleSearch = async () => {
    if (!searchTerm) return;
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchTerm)}&format=json&limit=1`;
    try {
      const res = await fetch(url);
      const data = await res.json();
      if (data && data[0]) {
        setUserLocation([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
        setMostrarProximas(true);
      }
    } catch {
      // Trate erro de busca
    }
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


  // Adicione para depuração:
  useEffect(() => {
    console.log("Doações com coordenadas:", doacoesComCoords);
  }, [doacoesComCoords]);

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
              variant="green"
              className="py-3 px-6 rounded-xl flex items-center gap-2"
            >
              <FaSearch className="text-xl" />
              Buscar
            </Button>
          </div>

          {/* Mapa */}
          <div className="w-full h-[400px] rounded-xl overflow-hidden mb-6">
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
              {(mostrarProximas && userLocation
                ? doacoesComCoords.filter((d) => {
                  const distancia = calcularDistancia(
                    userLocation[0],
                    userLocation[1],
                    d.lat,
                    d.lng
                  );
                  return distancia <= 5;
                })
                : doacoesComCoords
              ).map((doacao) => (
                <Marker
                  key={doacao.id || Math.random().toString(36)}
                  position={[doacao.lat, doacao.lng]}
                  icon={markerIcon}
                >
                  <Popup>
                    <strong>{doacao.alimento}</strong><br />
                    Quantidade: {doacao.quantidade}<br />
                    Validade: {doacao.validade}<br />
                    Doador: {doacao.nome}<br />
                    {doacao.endereco}
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>

          {/* Botões fora do mapa */}
          <div className="flex flex-col md:flex-row gap-4 mt-6">

            <Button
              asChild
              variant="linkGreen"
              className="text-sm flex items-center gap-1 mb-4"
            >
              <a href="/beneficiario">← Voltar para a Home</a>
            </Button>

            <Button
              onClick={handleVerProximas}
              variant="green"
              className="py-5 text-lg rounded-xl transition-transform transform hover:scale-105 w-full flex items-center justify-center gap-2"
            >
              <FaMapMarkerAlt />
              Ver Doações Próximas
            </Button>



          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default BuscarDoacao;
