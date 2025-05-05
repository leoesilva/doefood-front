export default function SecaoObjetivo() {
  const objetivos = [
    {
      icon: "♻️",
      title: "Reduz Desperdício",
      desc: "Aproveite alimentos bons que seriam descartados.",
    },
    {
      icon: "🤝",
      title: "Conecta Pessoas",
      desc: "Aproxima empresas, ONGs e pessoas em rede solidária.",
    },
    {
      icon: "🌍",
      title: "Impacto Social",
      desc: "Transforme a realidade de quem mais precisa.",
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <h3 className="text-3xl font-bold text-primary font-poppins mb-4">
          Por que o doeFood existe?
        </h3>
        <p className="text-gray-700 font-roboto mb-10 ">
          Nosso objetivo é combater o desperdício de alimentos e ajudar comunidades em situação de insegurança alimentar.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {objetivos.map((item, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow-md transition-transform transform hover:scale-105 hover:shadow-xl flex flex-col items-center"
            >
              <div className="text-5xl mb-4">{item.icon}</div>
              <h4 className="text-lg font-bold font-poppins mb-2">{item.title}</h4>
              <p className="text-gray-700 font-roboto">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
