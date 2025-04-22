import equipe from "../assets/equipe.png";

export default function SecaoSobreNos() {
  return (
    <section className="bg-white py-16" id="sobre-nos">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center gap-10">
        <div className="md:w-1/2 flex justify-center">
          <img
            src={equipe}
            alt="Nossa equipe"
            className="w-full max-w-[400px] h-[400px] object-cover rounded-full shadow-lg"
          />
        </div>
        <div className="md:w-1/2">
          <h2 className="text-3xl font-bold text-primary font-poppins mb-4">
            Quem somos
          </h2>
          <p className="text-gray-700 font-roboto mb-6">
            Somos um grupo apaixonado por impacto social, com a missão de conectar doadores de alimentos a quem mais precisa.
            Nossa equipe é formada por estudantes de desenvolvedores e pessoas engajadas em combater o desperdício de comida
            e ajudar comunidades locais.
          </p>
          <p className="text-gray-700 font-roboto">
            Acreditamos no poder da tecnologia como ponte para a solidariedade. O <span className="text-primary font-bold font-poppins">doeFood</span> nasceu dessa ideia: <span className="text-primary font-bold font-poppins">transformar excedente em esperança.</span>
          </p>
        </div>
      </div>
    </section>
  )
}
