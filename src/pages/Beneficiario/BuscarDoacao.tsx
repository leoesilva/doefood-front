// src/pages/Beneficiario/BuscarDoacao.tsx
import React, { useEffect, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import { Button } from "@/components/shadcn/button";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Corrige importação do CSS do leaflet
import "leaflet/dist/leaflet.css";

// Corrige problema do ícone padrão do leaflet não aparecer
delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: () => string })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

// Ícone do marcador
const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  shadowSize: [41, 41],
  shadowAnchor: [12, 41],
});

interface Doacao {
  id: string;
  doadorId: string;
  alimento: string;
  quantidade: number;
  validade: string;
  disponivel: boolean;
}

interface Usuario {
  cep: string | undefined;
  complemento: string | undefined;
  razaoSocial?: string;
  nomeFantasia?: string;
  endereco?: {
    tipoLogradouro?: string;
    logradouro?: string;
    numero?: string;
    complemento?: string;
    bairro?: string;
    municipio?: string;
    estado?: string;
    cep?: string;
  };
  // Para compatibilidade com dados antigos:
  logradouro?: string;
  numero?: string;
  bairro?: string;
  municipio?: string;
  estado?: string;
}

interface DoadorComDoacoes {
  doadorId: string;
  razaoSocial: string;
  endereco: string;
  enderecoObj: Usuario["endereco"];
  lat: number;
  lng: number;
  doacoes: Doacao[];
}

function formatarEndereco(enderecoObj: Usuario["endereco"] | undefined) {
  if (!enderecoObj) return "-";
  const {
    logradouro,
    numero,
    complemento,
    bairro,
    municipio,
    estado,
    cep,
  } = enderecoObj;
  return (
    `${logradouro || ""}, ${numero || ""}` +
    `${complemento ? ", " + complemento : ""}, ${bairro || ""} - ${
      municipio || ""
    } / ${estado || ""}` +
    `${cep ? " - " + cep : ""}`
  );
}

// Função para buscar coordenadas a partir do endereço digitado
async function buscarCoordenadasEndereco(endereco: string) {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
    endereco
  )}&format=json&limit=1`;
  try {
    const resp = await fetch(url, {
      headers: {
        Accept: "application/json",
      },
    });
    if (!resp.ok) return null;
    const data = await resp.json();
    if (data && data[0]) {
      return [parseFloat(data[0].lat), parseFloat(data[0].lon)] as [
        number,
        number
      ];
    }
    return null;
  } catch {
    return null;
  }
}

// Componente auxiliar para ajustar o mapa para exibir ambos os marcadores
function FitBoundsToMarkers({
  userLocation,
  doadorLocation,
}: {
  userLocation: [number, number] | null;
  doadorLocation: [number, number] | null;
}) {
  const map = useMap();
  useEffect(() => {
    if (userLocation && doadorLocation) {
      const bounds = L.latLngBounds([userLocation, doadorLocation]);
      map.fitBounds(bounds, { padding: [80, 80] });
    }
  }, [userLocation, doadorLocation, map]);
  return null;
}

// Componente para abrir automaticamente o Popup do usuário
function OpenUserPopup({
  markerRef,
  open,
}: {
  markerRef: React.RefObject<L.Marker | null>;
  open: boolean;
}) {
  useEffect(() => {
    if (markerRef.current) {
      if (open) {
        markerRef.current.openPopup();
      } else {
        markerRef.current.closePopup();
      }
    }
  }, [markerRef, open]);
  return null;
}

export default function BuscarDoacao() {
  const [doadores, setDoadores] = useState<DoadorComDoacoes[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loading, setLoading] = useState(false);
  const [modalDoador, setModalDoador] = useState<DoadorComDoacoes | null>(null);
  const [reservingId, setReservingId] = useState<string | null>(null);
  const [busca, setBusca] = useState("");
  const [mapCenter, setMapCenter] = useState<[number, number]>([-23.55, -46.63]);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [maisProximo, setMaisProximo] = useState<DoadorComDoacoes | null>(null);
  const [popupUserOpen, setPopupUserOpen] = useState(false);
  const navigate = useNavigate();

  // Adiciona a referência do marcador do usuário
  const userMarkerRef = React.useRef<L.Marker | null>(null);

  // Busca doações e doadores
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

        // Filtra apenas doações disponíveis
        const doacoesDisponiveis = doacoesAll.filter(
          (doacao) => doacao.disponivel
        );

        if (doacoesDisponiveis.length === 0) {
          toast.info("Não há nenhuma doação disponível no momento.");
          setDoadores([]);
          setLoading(false);
          return;
        }

        // Agrupa doações por doadorId
        const doacoesPorDoador: Record<string, Doacao[]> = {};
        doacoesDisponiveis.forEach((doacao) => {
          if (!doacoesPorDoador[doacao.doadorId]) {
            doacoesPorDoador[doacao.doadorId] = [];
          }
          doacoesPorDoador[doacao.doadorId].push(doacao);
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

          // Novo modelo: endereço agrupado em usuario.endereco
          const enderecoObj =
            usuario.endereco ||
            ({
              logradouro: usuario.logradouro,
              numero: usuario.numero,
              bairro: usuario.bairro,
              municipio: usuario.municipio,
              estado: usuario.estado,
              complemento: usuario.complemento,
              cep: usuario.cep,
            } as Usuario["endereco"]);
          const enderecoStr = `${enderecoObj?.logradouro || ""}, ${enderecoObj?.numero || ""}, ${enderecoObj?.bairro || ""}, ${enderecoObj?.municipio || ""}, ${enderecoObj?.estado || ""}`;
          const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
            enderecoStr
          )}&format=json&limit=1`;
          const geoResp = await fetch(url);
          const geoJson = await geoResp.json();

          if (geoJson && geoJson[0]) {
            doadoresArray.push({
              doadorId,
              razaoSocial:
                usuario.razaoSocial || usuario.nomeFantasia || "Doador",
              endereco: enderecoStr,
              enderecoObj, // <-- Salva o objeto de endereço para exibição detalhada
              lat: parseFloat(geoJson[0].lat),
              lng: parseFloat(geoJson[0].lon),
              doacoes: doacoesPorDoador[doadorId],
            });
          }
        }
        setDoadores(doadoresArray);
      } catch {
        toast.error("Erro ao buscar doações ou endereços.");
      }
      setLoading(false);
    }
    fetchDoacoesEUsuario();
  }, []);

  // Função para calcular distância entre dois pontos (Haversine)
  function calcularDistancia(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ) {
    function toRad(x: number) {
      return (x * Math.PI) / 180;
    }
    const R = 6371; // km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  // Handler para centralizar o mapa na localização do usuário e mostrar o doador mais próximo
  const handleVerDoacoesProximas = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const userCoords: [number, number] = [
            pos.coords.latitude,
            pos.coords.longitude,
          ];
          setUserLocation(userCoords);
          setMapCenter(userCoords);
          setPopupUserOpen(true);

          // Encontrar doador mais próximo
          if (doadores.length > 0) {
            let menorDist = Infinity;
            let maisProximoDoador = doadores[0];
            doadores.forEach((d) => {
              const dist = calcularDistancia(
                userCoords[0],
                userCoords[1],
                d.lat,
                d.lng
              );
              if (dist < menorDist) {
                menorDist = dist;
                maisProximoDoador = d;
              }
            });
            setMaisProximo(maisProximoDoador);
          }
        },
        () => {
          toast.error("Não foi possível obter sua localização.");
        }
      );
    } else {
      toast.error("Geolocalização não suportada.");
    }
  };

  // Handler da barra de busca de endereço
  const handleBuscarEndereco = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!busca) return;
    const coords = await buscarCoordenadasEndereco(busca);
    if (coords) {
      setMapCenter(coords);
      setUserLocation(null);
      setMaisProximo(null);
      setPopupUserOpen(false);
    } else {
      toast.error("Endereço não encontrado.");
    }
  };

  // Handler para reservar doação (exemplo)
  const handleReservar = async (doacaoId: string) => {
    setReservingId(doacaoId);
    // Aqui você pode implementar a lógica real de reserva, por exemplo:
    // await fetch(`${import.meta.env.VITE_API_URL}/doacoes/${doacaoId}/reservar`, { ... })
    setTimeout(() => setReservingId(null), 1000);
    toast.success("Reserva realizada com sucesso!");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex-1 py-8 px-2">
        <h1 className="text-3xl font-bold text-green-700 mb-8 text-center">
          Buscar Doações Disponíveis
        </h1>

        {/* Barra de busca de endereço */}
        <form
          onSubmit={handleBuscarEndereco}
          className="mb-6 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <input
            type="text"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar endereço..."
            className="w-full sm:w-2/3 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-600"
          />
          <button
            type="submit"
            className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold transition-transform hover:scale-105"
          >
            Buscar
          </button>
        </form>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
          <Button
            variant="green"
            className="w-full sm:w-auto"
            onClick={handleVerDoacoesProximas}
          >
            Ver doações próximas
          </Button>
        </div>

        <div
          className="w-full max-w-5xl mx-auto mb-8"
          style={{ position: "relative", zIndex: 1 }}
        >
          <MapContainer
            center={mapCenter}
            zoom={13}
            style={{ height: "500px", width: "100%" }}
          >
            <FitBoundsToMarkers
              userLocation={userLocation}
              doadorLocation={
                maisProximo ? [maisProximo.lat, maisProximo.lng] : null
              }
            />
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {/* Marcador do usuário */}
            {userLocation && (
              <Marker
                position={userLocation}
                icon={
                  new L.Icon({
                    iconUrl:
                      "https://cdn-icons-png.flaticon.com/512/64/64113.png",
                    iconSize: [32, 32],
                    iconAnchor: [16, 32],
                  })
                }
                ref={userMarkerRef}
                eventHandlers={{
                  popupclose: () => setPopupUserOpen(false),
                }}
              >
                <Popup autoPan>
                  <div className="font-semibold">Sua localização</div>
                </Popup>
                <OpenUserPopup markerRef={userMarkerRef} open={popupUserOpen} />
              </Marker>
            )}
            {/* Marcador do doador mais próximo */}
            {maisProximo && (
              <Marker
                position={[maisProximo.lat, maisProximo.lng]}
                icon={markerIcon}
              >
                <Popup autoPan>
                  <div className="space-y-2 min-w-[220px]">
                    <div className="font-semibold text-base">
                      {maisProximo.razaoSocial}
                    </div>
                    <div className="text-xs text-gray-700 mb-2">
                      <span className="font-semibold">Endereço:</span>{" "}
                      {formatarEndereco(maisProximo.enderecoObj)}
                    </div>
                    <Button
                      variant="green"
                      size="sm"
                      className="w-full"
                      onClick={(e) => {
                        e.preventDefault();
                        setModalDoador(maisProximo);
                      }}
                    >
                      Ver doações
                    </Button>
                  </div>
                </Popup>
              </Marker>
            )}
            {/* Sempre mostra todos os doadores, inclusive o mais próximo */}
            {doadores.map((doador) => (
              <Marker
                key={doador.doadorId}
                position={[doador.lat, doador.lng]}
                icon={markerIcon}
              >
                <Popup autoPan>
                  <div className="space-y-2 min-w-[220px]">
                    <div className="font-semibold text-base">
                      {doador.razaoSocial}
                    </div>
                    <div className="text-xs text-gray-700 mb-2">
                      <span className="font-semibold">Endereço:</span>{" "}
                      {formatarEndereco(doador.enderecoObj)}
                    </div>
                    <Button
                      variant="green"
                      size="sm"
                      className="w-full"
                      onClick={(e) => {
                        e.preventDefault();
                        setModalDoador(doador);
                      }}
                    >
                      Ver doações
                    </Button>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
          {/* Modal de doações do doador - sempre acima do mapa */}
          {modalDoador && (
            <div
              className="fixed inset-0 z-[1000] flex items-center justify-center bg-black bg-opacity-40"
              style={{ zIndex: 1000 }}
            >
              <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md relative">
                <button
                  className="absolute top-2 right-2 text-gray-500 hover:text-red-600"
                  onClick={() => setModalDoador(null)}
                  aria-label="Fechar"
                >
                  ×
                </button>
                <h2 className="text-xl font-bold mb-2">
                  Doações de {modalDoador.razaoSocial}
                </h2>
                <div className="text-sm text-gray-700 mb-2">
                  <span className="font-semibold">Endereço:</span>{" "}
                  {formatarEndereco(modalDoador.enderecoObj)}
                </div>
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
                        className="border rounded-lg p-4 flex flex-col gap-2 bg-gray-50 mb-2"
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
                          {doacao.validade
                            ? new Date(doacao.validade).toLocaleDateString(
                                "pt-BR"
                              )
                            : "-"}
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
            </div>
          )}
        </div>

        <div className="flex justify-center mb-8">
          <Button
            variant="linkGreen"
            className="w-full sm:w-auto"
            onClick={() => navigate(-1)}
          >
            ← Voltar para página anterior
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
