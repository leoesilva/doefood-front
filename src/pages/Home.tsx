import Navbar from "@/components/Navbar";
import SecaoPrincipal from "@/components/SecaoPrincipal";
import SecaoSobre from "@/components/SecaoSobre";
import SecaoComoFunciona from "@/components/SecaoComoFunciona";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
    <Navbar />
    <main>
      <SecaoPrincipal />
      <SecaoSobre />
      <SecaoComoFunciona />
    </main>
    <Footer />
    </>
  )
}