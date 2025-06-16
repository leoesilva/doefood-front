// src/pages/Beneficiario/BuscarDoacao.tsx
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/shadcn/button";
import { FaSearch, FaMapMarkerAlt } from "react-icons/fa";
import "leaflet/dist/leaflet.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getAuth } from "firebase/auth";
import Modal from "antd/es/modal/Modal";

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

interface DoadorComDoacoes {
  doadorId: string;
  razaoSocial: string;
  endereco: string;
  lat: number;
  lng: number;
  doacoes: Doacao[];
}

function FlyToLocation({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, 13);
  }, [center, map]);
  return null;
}

export default function BuscarDoacao() {
  const [doadores, setDoadores] = useState<DoadorComDoacoes[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([-23.55052, -46.633308]);
  const [mostrarProximas, setMostrarProximas] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reservingId, setReservingId] = useState<string | null>(null);
  const [modalDoador, setModalDoador] = useState<DoadorComDoacoes | null>(null);
  const [maisProximo, setMaisProximo] = useState<DoadorComDoacoes | null>(null);

  // Função para calcular distância
  function calcularDistancia(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ) {
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

  // Ao carregar a página, busca endereço cadastrado do usuário e define userLocation e maisProximo
  useEffect(() => {
    async function fetchDoacoesEUsuario() {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("Você precisa estar autenticado para ver as doações.");
          setLoading(false);
          return;
        }
        // Busca doações
        const respDoacoes = await fetch(
          `${import.meta.env.VITE_API_URL}/doacoes`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (!respDoacoes.ok) throw new Error("Falha ao buscar doações");
        const doacoesAll: Doacao[] = await respDoacoes.json();

        // Agrupa doações por doadorId
        const doacoesPorDoador: Record<string, Doacao[]> = {};
        doacoesAll.forEach((doacao) => {
          if (doacao.disponivel) {
            if (!doacoesPorDoador[doacao.doadorId]) {
              doacoesPorDoador[doacao.doadorId] = [];
            }
            doacoesPorDoador[doacao.doadorId].push(doacao);
          }
        });

        const doadoresArray: DoadorComDoacoes[] = [];
        for (const doadorId of Object.keys(doacoesPorDoador)) {
          const respUsuario = await fetch(
            `${import.meta.env.VITE_API_URL}/usuarios/${doadorId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );
          if (!respUsuario.ok) continue;
          const usuario: Usuario = await respUsuario.json();

          const endereco = `${usuario.logradouro}, ${usuario.numero}, ${usuario.bairro}, ${usuario.municipio}, ${usuario.estado}`;
          const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
            endereco
          )}&format=json&limit=1`;
          const geoResp = await fetch(url);
          const geoJson = await geoResp.json();

          if (geoJson && geoJson[0]) {
            doadoresArray.push({
              doadorId,
              razaoSocial: usuario.razaoSocial || usuario.nomeFantasia || "Doador",
              endereco,
              lat: parseFloat(geoJson[0].lat),
              lng: parseFloat(geoJson[0].lon),
              doacoes: doacoesPorDoador[doadorId],
            });
          }
        }
        setDoadores(doadoresArray);

        // Busca usuário autenticado
        const auth = getAuth();
        const currentUser = auth.currentUser;
        if (!currentUser) {
          setLoading(false);
          return;
        }
        const uid = currentUser.uid;
        const respUsuario = await fetch(
          `${import.meta.env.VITE_API_URL}/usuarios/${uid}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (!respUsuario.ok) {
          setLoading(false);
          return;
        }
        const usuario: Usuario = await respUsuario.json();
        const enderecoUsuario = `${usuario.logradouro}, ${usuario.numero}, ${usuario.bairro}, ${usuario.municipio}, ${usuario.estado}`;
        const urlUsuario = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          enderecoUsuario
        )}&format=json&limit=1`;
        const geoRespUsuario = await fetch(urlUsuario);
        const geoJsonUsuario = await geoRespUsuario.json();

        if (geoJsonUsuario && geoJsonUsuario[0]) {
          const lat = parseFloat(geoJsonUsuario[0].lat);
          const lng = parseFloat(geoJsonUsuario[0].lon);
          setUserLocation([lat, lng]);
          setMapCenter([lat, lng]);

          // Encontrar doador mais próximo do endereço cadastrado
          if (doadoresArray.length > 0) {
            let menorDist = Infinity;
            let maisProximoDoador = doadoresArray[0];
            doadoresArray.forEach((d) => {
              const dist = calcularDistancia(lat, lng, d.lat, d.lng);
              if (dist < menorDist) {
                menorDist = dist;
                maisProximoDoador = d;
              }
            });
            setMaisProximo(maisProximoDoador);
            setMapCenter([maisProximoDoador.lat, maisProximoDoador.lng]);
          }
        }
      } catch {
        toast.error("Erro ao buscar doações ou endereços.");
      }
      setLoading(false);
    }
    fetchDoacoesEUsuario();
  }, []);

  const handleSearch = async () => {
    if (!searchTerm) return;
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
      searchTerm
    )}&format=json&limit=1`;
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

  // Ao clicar em "Ver doações próximas", usa localização atual e busca novo doador mais próximo
  const handleVerProximas = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocalização não é suportada pelo seu navegador.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation([latitude, longitude]);
        setMostrarProximas(true);

        // Encontrar o doador mais próximo da localização atual
        if (doadores.length > 0) {
          let menorDist = Infinity;
          let maisProximoDoador = doadores[0];
          doadores.forEach((d) => {
            const dist = calcularDistancia(latitude, longitude, d.lat, d.lng);
            if (dist < menorDist) {
              menorDist = dist;
              maisProximoDoador = d;
            }
          });
          setMaisProximo(maisProximoDoador);
          setMapCenter([maisProximoDoador.lat, maisProximoDoador.lng]);
        } else {
          setMaisProximo(null);
          setMapCenter([latitude, longitude]);
        }
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
      const auth = getAuth();
      const currentUser = auth.currentUser;
      if (!currentUser) {
        toast.error("Usuário não autenticado.");
        setReservingId(null);
        return;
      }
      const uid = currentUser.uid;
      if (!uid) {
        toast.error("Não foi possível identificar o beneficiário.");
        setReservingId(null);
        return;
      }
      const resp = await fetch(
        `${import.meta.env.VITE_API_URL}/doacoes/${id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ disponivel: false, beneficiarioId: uid }),
        }
      );
      if (!resp.ok) throw new Error("Falha ao reservar doação");

      // Atualiza o estado removendo a doação reservada do modal
      setDoadores((prev) =>
        prev.map((doador) =>
          doador.doacoes.some((d) => d.id === id)
            ? {
                ...doador,
                doacoes: doador.doacoes.map((d) =>
                  d.id === id ? { ...d, disponivel: false } : d
                ),
              }
            : doador
        )
      );
      // Atualiza o modalDoador para refletir a mudança imediatamente
      setModalDoador((prev) =>
        prev
          ? {
              ...prev,
              doacoes: prev.doacoes.map((d) =>
                d.id === id ? { ...d, disponivel: false } : d
              ),
            }
          : null
      );

      toast.success("Doação reservada com sucesso!");

      // Após atualizar, verifica se todas as doações do doador foram reservadas
      setTimeout(() => {
        const doadorAtualizado = doadores.find((d) =>
          d.doacoes.some((doacao) => doacao.id === id)
        );
        const todasReservadas =
          doadorAtualizado &&
          doadorAtualizado.doacoes.every((d) => !d.disponivel);

        // Também verifica no modalDoador atualizado
        const todasReservadasModal =
          modalDoador &&
          modalDoador.doacoes
            .map((d) =>
              d.id === id ? { ...d, disponivel: false } : d
            )
            .every((d) => !d.disponivel);

        if (todasReservadas || todasReservadasModal) {
          setModalDoador(null);
          setTimeout(() => {
            window.location.reload();
          }, 700); // delay breve para UX
        }
      }, 300);
    } catch {
      toast.error("Erro ao reservar doação.");
    }
    setReservingId(null);
  };

  // Não filtre os doadores, mantenha todos os marcadores no mapa
  const doadoresFiltrados = doadores;

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
              {doadoresFiltrados.map((doador) => (
                <Marker
                  key={doador.doadorId}
                  position={[doador.lat, doador.lng]}
                  icon={markerIcon}
                >
                  <Popup>
                    <div
                      style={{
                        minWidth: 220,
                        fontFamily: "Arial, sans-serif",
                        padding: 8,
                      }}
                    >
                      <div
                        style={{
                          fontWeight: "bold",
                          fontSize: 18,
                          color: "#388e3c",
                        }}
                      >
                        {doador.razaoSocial}
                        {maisProximo && doador.doadorId === maisProximo.doadorId && (
                          <span style={{ color: "#388e3c", marginLeft: 8 }}>
                            (Mais próximo)
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: 14, color: "#555", margin: "4px 0" }}>
                        {doador.endereco}
                      </div>
                      <Button
                        variant="green"
                        size="sm"
                        style={{
                          marginTop: 8,
                          width: "100%",
                          background: "#388e3c",
                          color: "#fff",
                          borderRadius: 8,
                          fontWeight: "bold",
                        }}
                        onClick={() => setModalDoador(doador)}
                      >
                        Ver Doações Disponíveis
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
        {/* Modal de doações do doador */}
        <Modal
          open={!!modalDoador}
          onCancel={() => setModalDoador(null)}
          footer={null}
          title={
            modalDoador
              ? `Doações de ${modalDoador.razaoSocial}`
              : "Doações disponíveis"
          }
        >
          {modalDoador && (
            <div className="space-y-4">
              {modalDoador.doacoes.filter((d) => d.disponivel).length === 0 ? (
                <div className="text-center text-gray-500">
                  Nenhuma doação disponível deste doador.
                </div>
              ) : (
                modalDoador.doacoes
                  .filter((d) => d.disponivel)
                  .map((doacao) => (
                    <div
                      key={doacao.id}
                      className="border rounded-lg p-4 flex flex-col gap-2 bg-gray-50"
                    >
                      <div>
                        <span className="font-semibold">Alimento:</span>{" "}
                        {doacao.alimento}
                      </div>
                      <div>
                        <span className="font-semibold">Quantidade:</span>{" "}
                        {doacao.quantidade}
                      </div>
                      <div>
                        <span className="font-semibold">Validade:</span>{" "}
                        {doacao.validade}
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
                          fontWeight: "bold",
                        }}
                      >
                        {reservingId === doacao.id
                          ? "Reservando..."
                          : "Reservar"}
                      </Button>
                    </div>
                  ))
              )}
            </div>
          )}
        </Modal>
      </main>
      <Footer />
    </>
  );
}
