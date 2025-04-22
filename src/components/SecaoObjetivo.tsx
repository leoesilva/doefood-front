export default function SecaoSobre() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-5xl mx-auto px-4 text-center">
        <h3 className="text-3xl font-semibold text-primary font-poppins mb-6">
          Por que o doeFood existe?
        </h3>
        <p className="text-gray-700 font-roboto mb-10 font-medium">
          Nosso objetivo é combater o desperdício de alimentos e ajudar comunidades em situação de insegurança alimentar.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-green-100 p-6 rounded-xl shadow-sm transition-transform transform hover:scale-105">
            <h4 className="text-lg font-semibold font-poppins mb-2">♻️ Reduz Desperdício</h4>
            <p className="text-sm text-gray-600 font-roboto font-semibold">
              Aproveite alimentos bons que seriam descartados.
            </p>
          </div>
          <div className="bg-green-100 p-6 rounded-xl shadow-sm transition-transform transform hover:scale-105">
            <h4 className="text-lg font-semibold font-poppins mb-2">🤝 Conecta Pessoas</h4>
            <p className="text-sm text-gray-600 font-roboto font-semibold">
              Aproxima empresas, ONGs e pessoas em rede solidária.
            </p>
          </div>
          <div className="bg-green-100 p-6 rounded-xl shadow-sm transition-transform transform hover:scale-105">
            <h4 className="text-lg font-semibold font-poppins mb-2">🌍 Impacto Social</h4>
            <p className="text-sm text-gray-600 font-roboto font-semibold">
              Transforme a realidade de quem mais precisa.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
