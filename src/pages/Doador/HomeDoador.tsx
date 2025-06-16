import { useEffect, useState } from "react";
import { Button } from "@/components/shadcn/button";
import { Separator } from "@/components/shadcn/separator";
import {
  FaHandHoldingHeart,
  FaHistory,
  FaSignOutAlt,
  FaUserEdit,
  FaAward,
  FaDownload,
} from "react-icons/fa";
import { Link, Navigate } from "react-router-dom";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import jsPDF from "jspdf";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import logo from "@/assets/doefood-logo.png"; // Importe o logo corretamente

function formatarDataPorExtenso() {
  const meses = [
    "janeiro", "fevereiro", "março", "abril", "maio", "junho",
    "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"
  ];
  const hoje = new Date();
  return `${hoje.getDate()} de ${meses[hoje.getMonth()]} de ${hoje.getFullYear()}`;
}

export default function HomeDoador() {
  const { user: authUser, logout } = useAuth();
  const [doador, setDoador] = useState<{razaoSocial?: string, cnpj?: string, municipio?: string} | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoador = async () => {
      if (!authUser?.uid) {
        setLoading(false);
        return;
      }
      const db = getFirestore();
      const docRef = doc(db, "usuarios", authUser.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setDoador(docSnap.data());
      }
      setLoading(false);
    };
    fetchDoador();
  }, [authUser]);

  if (!authUser) return <Navigate to="/autenticacao/login" />;

  const btnClass =
    "w-full flex items-center justify-center gap-3 py-5 text-lg rounded-xl transition-transform transform hover:scale-105";

  // Função para gerar PDF do certificado com o logo
  const handleDownloadCertificado = () => {
    if (!doador) {
      alert("Dados do doador não carregados.");
      return;
    }
    const nome = doador.razaoSocial || "Nome do Doador";
    const cnpj = doador.cnpj || "CNPJ não informado";
    const cidade = doador.municipio || "Sua Cidade";
    const dataExtenso = formatarDataPorExtenso();

    // Carregar a imagem do logo antes de gerar o PDF
    const img = new window.Image();
    img.src = logo;
    img.onload = () => {
      const doc = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });

      // Fundo decorativo
      doc.setFillColor(239, 250, 239);
      doc.rect(0, 0, 297, 210, "F");

      // Moldura
      doc.setDrawColor(76, 175, 80);
      doc.setLineWidth(3);
      doc.rect(10, 10, 277, 190);

      // Título
      doc.setFont("helvetica", "bold");
      doc.setTextColor(34, 139, 34);
      doc.setFontSize(30);
      doc.text("CERTIFICADO DE DOADOR", 148.5, 35, { align: "center" });

      // Logo centralizado (ajuste largura/altura conforme o logo)
      // (x, y, largura, altura)
      doc.addImage(img, "PNG", 119, 41, 60, 28);

      // Nome do doador
      doc.setFont("helvetica", "bold");
      doc.setFontSize(22);
      doc.setTextColor(34, 139, 34);
      doc.text(nome, 148.5, 78, { align: "center" });

      // CNPJ
      doc.setFont("helvetica", "normal");
      doc.setFontSize(14);
      doc.setTextColor(33, 33, 33);
      doc.text(`CNPJ: ${cnpj}`, 148.5, 88, { align: "center" });

      // Mensagem principal
      doc.setFontSize(13);
      doc.setTextColor(33, 33, 33);
      doc.text(
        "Certificamos que o(a) doador(a) acima contribuiu de forma solidária com a doação de alimentos,",
        148.5,
        103,
        { align: "center", maxWidth: 250 }
      );
      doc.text(
        "demonstrando empatia, responsabilidade social e comprometimento com a construção de um mundo mais justo e humano.",
        148.5,
        111,
        { align: "center", maxWidth: 260 }
      );
      doc.text(
        "Sua generosidade fez a diferença na vida de quem mais precisa, ajudando a combater a fome e o desperdício de alimentos.",
        148.5,
        123,
        { align: "center", maxWidth: 260 }
      );
      doc.text(
        "Agradecemos profundamente por sua valiosa contribuição.",
        148.5,
        133,
        { align: "center", maxWidth: 200 }
      );

      // Cidade e data
      doc.setFontSize(13);
      doc.setTextColor(100, 100, 100);
      doc.text(`${cidade}, ${dataExtenso}`, 148.5, 153, { align: "center" });

      // Rodapé
      doc.setFontSize(10);
      doc.setTextColor(180, 180, 180);
      doc.text("DoeFood - Plataforma de Solidariedade", 148.5, 200, { align: "center" });

      doc.save(`Certificado-${nome.replace(/\s/g, "_")}.pdf`);
    };
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#F5F5F5] flex items-center justify-center py-10 px-4">
        <motion.div
          className="w-full max-w-4xl bg-white shadow-xl rounded-2xl p-8 space-y-10 animate-fade-in-up"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <motion.h1
            className="text-4xl font-bold text-[#4CAF50] text-center font-poppins"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Obrigado por fazer a diferença 💚
          </motion.h1>

          <motion.div
            className="text-center text-gray-700 text-lg italic"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Seu gesto de solidariedade ajuda a combater a fome e o desperdício
            de alimentos. Você é essencial nessa corrente do bem!
          </motion.div>

          {/* Certificado */}
          <motion.div
            className="bg-green-50 border border-green-200 rounded-xl p-6 shadow-inner flex flex-col md:flex-row items-center justify-between gap-6 animate-fade-in-up delay-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center gap-4">
              <FaAward className="text-4xl text-[#FF9800]" />
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  Certificado de Doador
                </h2>
                <p className="text-gray-600 text-sm">
                  Reconhecimento simbólico pelo seu compromisso social
                </p>
              </div>
            </div>
            <Button
              variant="orange"
              className="px-6 py-4 text-base rounded-xl transition-transform hover:scale-105 flex items-center gap-2"
              onClick={handleDownloadCertificado}
              title="Baixar certificado em PDF"
              disabled={loading || !doador}
            >
              <FaDownload className="text-lg" />
              Baixar Certificado
            </Button>
          </motion.div>

          {/* Ações */}
          <motion.div
            className="grid md:grid-cols-2 gap-4 animate-fade-in-up delay-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Link to="/doador/nova-doacao">
              <Button variant="green" className={btnClass}>
                <FaHandHoldingHeart className="text-2xl" />
                Nova Doação
              </Button>
            </Link>

            <Link to="/doador/historico-doacao">
              <Button variant="blue" className={btnClass}>
                <FaHistory className="text-2xl" />
                Histórico de Doações
              </Button>
            </Link>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 gap-4 animate-fade-in-up delay-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Link to="/doador/editar-perfil">
              <Button variant="orange" className={btnClass}>
                <FaUserEdit className="text-2xl" />
                Editar Perfil
              </Button>
            </Link>

            <Button variant="red" onClick={logout} className={btnClass}>
              <FaSignOutAlt className="text-2xl" />
              Sair da Conta
            </Button>
          </motion.div>

          <Separator className="my-6" />

          <motion.div
            className="text-center text-sm text-gray-500 italic animate-fade-in-up delay-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            Doe com responsabilidade e ajude quem precisa 💚
          </motion.div>
        </motion.div>
      </main>
      <Footer />
    </>
  );
}
