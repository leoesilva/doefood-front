import Ods2 from "../assets/ods2.webp";

export default function SecaoOds() {
  return (
    <section className="bg-white py-16" id="ods2">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center gap-10">
        <div className="md:w-1/2 flex justify-center">
          <img
            src={Ods2}
            alt="ODS 2 - Erradicação da Fome"
            className="w-full max-w-[480px] h-auto object-cover rounded-xl shadow-lg"  // Alterei a max-width para 600px
          />
        </div>

        <div className="md:w-1/2">
          <h2 className="text-3xl font-bold text-primary font-poppins mb-4">
            Conexão com a ODS 2
          </h2>
          <p className="text-gray-700 font-roboto mb-6">
            O <span className="text-primary font-bold font-poppins">doeFood</span> atua diretamente no combate à fome ao conectar doadores com pessoas e instituições que mais precisam. Essa iniciativa fortalece os objetivos da <strong>ODS 2</strong>, promovendo segurança alimentar e reduzindo o desperdício de alimentos.{" "}
            <a
              href="https://www.ipea.gov.br/ods/ods2.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Saiba mais
            </a>
            .
          </p>
          <p className="text-gray-700 font-roboto">
            Acreditamos que, por meio da tecnologia, é possível transformar o excedente em esperança e garantir que mais pessoas tenham acesso à alimentação de qualidade, com responsabilidade e empatia.
          </p>
        </div>
      </div>
    </section>
  );
}
