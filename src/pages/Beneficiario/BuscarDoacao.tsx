// src/pages/Beneficiario/BuscarDoacao.tsx
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/shadcn/button";
import { FaSearch, FaMapMarkerAlt, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import "leaflet/dist/leaflet.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

interface Doacao {
  id: string;
  alimento: string;
  quantidade: number;
  validade: string;
  doadorId: string;
  disponivel: boolean;
}

interface Usuario {
  nomeFantasia?: string;
  razaoSocial?: string;
  logradouro: string;
  numero: string;
  bairro: string;
  municipio: string;
  estado: string;
}

interface DoacaoComCoords {
  id: string;
  alimento: string;
  quantidade: number;
  validade: string;
  nomeDoador: string;
  endereco: string;
  lat: number;
  lng: number;
  disponivel: boolean;
}

function calcularDistancia(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function FlyToLocation({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, 13);
  }, [center]);
  return null;
}

export default function BuscarDoacao() {
  const [doacoes, setDoacoes] = useState<DoacaoComCoords[]>([]);
  const [mapCenter, setMapCenter] = useState<[number, number]>([-23.55052, -46.633308]);
  const [searchTerm, setSearchTerm] = useState("");
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [mostrarProximas, setMostrarProximas] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reservingId, setReservingId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDoacoes() {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("Você precisa estar autenticado para ver as doações.");
          setLoading(false);
          return;
        }
        const respDoacoes = await fetch(`${import.meta.env.VITE_API_URL}/doacoes`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (!respDoacoes.ok) throw new Error("Falha ao buscar doações");
        const doacoesAll: Doacao[] = await respDoacoes.json();

        const doacoesComCoords: DoacaoComCoords[] = [];
        for (const doacao of doacoesAll) {
          const respUsuario = await fetch(`${import.meta.env.VITE_API_URL}/usuarios/${doacao.doadorId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });
          if (!respUsuario.ok) continue;
          const usuario: Usuario = await respUsuario.json();
          const endereco = `${usuario.logradouro}, ${usuario.numero}, ${usuario.bairro}, ${usuario.municipio}, ${usuario.estado}`;
          const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(endereco)}&format=json&limit=1`;
          const geoResp = await fetch(url);
          const geoJson = await geoResp.json();
          if (geoJson && geoJson[0]) {
            doacoesComCoords.push({
              id: doacao.id,
              alimento: doacao.alimento,
              quantidade: doacao.quantidade,
              validade: doacao.validade,
              nomeDoador: usuario.nomeFantasia || usuario.razaoSocial || "Doador",
              endereco,
              lat: parseFloat(geoJson[0].lat),
              lng: parseFloat(geoJson[0].lon),
              disponivel: doacao.disponivel,
            });
          }
        }
        setDoacoes(doacoesComCoords);
        if (doacoesComCoords.length > 0) {
          setMapCenter([doacoesComCoords[0].lat, doacoesComCoords[0].lng]);
        }
      } catch {
        toast.error("Erro ao buscar doações ou endereços.");
      }
      setLoading(false);
    }
    fetchDoacoes();
  }, []);

  const handleSearch = async () => {
    if (!searchTerm) return;
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchTerm)}&format=json&limit=1`;
    try {
      const res = await fetch(url);
      const data = await res.json();
      if (data && data[0]) {
        setUserLocation([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
        setMapCenter([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
        setMostrarProximas(false);
      }
    } catch {
      toast.error("Erro ao buscar endereço.");
    }
  };

  const handleVerProximas = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocalização não é suportada pelo seu navegador.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation([latitude, longitude]);
        setMapCenter([latitude, longitude]);
        setMostrarProximas(true);
      },
      () => {
        toast.error("Não foi possível obter sua localização.");
      }
    );
  };

  const handleReservar = async (id: string) => {
    setReservingId(id);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Você precisa estar autenticado para reservar.");
        setReservingId(null);
        return;
      }
      const resp = await fetch(`${import.meta.env.VITE_API_URL}/doacoes/${id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ disponivel: false }),
      });
      if (!resp.ok) throw new Error("Falha ao reservar doação");
      setDoacoes((prev) =>
        prev.map((d) =>
          d.id === id ? { ...d, disponivel: false } : d
        )
      );
      toast.success("Doação reservada com sucesso!");
    } catch {
      toast.error("Erro ao reservar doação.");
    }
    setReservingId(null);
  };

  // Filtra apenas as doações disponíveis
  const doacoesFiltradas = mostrarProximas && userLocation
    ? doacoes.filter((d) =>
        d.disponivel &&
        calcularDistancia(userLocation[0], userLocation[1], d.lat, d.lng) <= 5
      )
    : doacoes.filter((d) => d.disponivel);

  return (
    <>
      <Navbar />
      <ToastContainer position="top-center" autoClose={3000} />
      <main className="min-h-screen bg-[#F5F5F5] flex items-center justify-center py-10 px-4">
        <div className="w-full max-w-5xl bg-white shadow-2xl rounded-2xl p-8 space-y-10">
          <h1 className="text-4xl font-bold text-[#4CAF50] text-center font-poppins">
            Buscar Doações
          </h1>

          <div className="flex justify-center items-center space-x-2 mb-4">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Digite um endereço, bairro ou cidade"
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
            <Button
              onClick={handleVerProximas}
              variant="green"
              className="py-3 px-6 rounded-xl flex items-center gap-2"
            >
              <FaMapMarkerAlt className="text-xl" />
              Ver Doações Próximas
            </Button>
          </div>

          <div className="w-full h-[400px] rounded-xl overflow-hidden mb-6">
            <MapContainer
              center={mapCenter}
              zoom={13}
              scrollWheelZoom={true}
              className="w-full h-full z-0"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <FlyToLocation center={mapCenter} />
              {userLocation && (
                <Marker position={userLocation} icon={markerIcon}>
                  <Popup>
                    <div style={{ fontWeight: "bold", color: "#388e3c" }}>
                      Você está aqui
                    </div>
                  </Popup>
                </Marker>
              )}
              {doacoesFiltradas.map((doacao) => (
                <Marker
                  key={doacao.id}
                  position={[doacao.lat, doacao.lng]}
                  icon={markerIcon}
                >
                  <Popup>
                    <div style={{
                      minWidth: 220,
                      fontFamily: "Arial, sans-serif",
                      padding: 8
                    }}>
                      <div style={{ fontWeight: "bold", fontSize: 18, color: "#388e3c" }}>
                        {doacao.alimento}
                      </div>
                      <div style={{ margin: "4px 0", fontSize: 15 }}>
                        <strong>Quantidade:</strong> {doacao.quantidade}
                      </div>
                      <div style={{ fontSize: 15 }}>
                        <strong>Validade:</strong> {doacao.validade}
                      </div>
                      <div style={{ fontSize: 15, margin: "4px 0" }}>
                        <strong>Doador:</strong> {doacao.nomeDoador}
                      </div>
                      <div style={{ fontSize: 14, color: "#555" }}>
                        {doacao.endereco}
                      </div>
                      <div style={{ margin: "8px 0" }}>
                        <span style={{
                          display: "inline-flex",
                          alignItems: "center",
                          fontWeight: "bold",
                          color: "#388e3c"
                        }}>
                          <FaCheckCircle style={{ marginRight: 4 }} />
                          Disponível
                        </span>
                      </div>
                      <Button
                        variant="green"
                        size="sm"
                        disabled={reservingId === doacao.id}
                        onClick={() => handleReservar(doacao.id)}
                        style={{
                          marginTop: 6,
                          width: "100%",
                          background: "#388e3c",
                          color: "#fff",
                          borderRadius: 8,
                          fontWeight: "bold"
                        }}
                      >
                        {reservingId === doacao.id ? "Reservando..." : "Reservar"}
                      </Button>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>

          <Button
            asChild
            variant="linkGreen"
            className="text-sm flex items-center gap-1 mb-4"
          >
            <a href="/">← Voltar para a Home</a>
          </Button>
        </div>
      </main>
      <Footer />
    </>
  );
}
