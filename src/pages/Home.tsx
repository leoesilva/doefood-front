import Navbar from "@/components/Navbar";
import SecaoPrincipal from "@/components/SecaoPrincipal";
import SecaoObjetivo from "@/components/SecaoObjetivo";
import SecaoComoFunciona from "@/components/SecaoComoFunciona";
import Footer from "@/components/Footer";
import SecaoSobreNos from "@/components/SecaoSobreNos";
import SecaoOds from "@/components/SecaoOds";

export default function Home() {
  return (
    <>
    <Navbar />
    <main>
      <SecaoPrincipal />
      <SecaoObjetivo />
      <SecaoOds />
      <SecaoComoFunciona />
      <SecaoSobreNos />
    </main>
    <Footer />
    </>
  )
}