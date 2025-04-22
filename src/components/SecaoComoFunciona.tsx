


export default function SecaoComoFunciona() {
  const steps = [
    { number: "1", title: "Cadastre-se", desc: "Crie uma conta como doador ou receptor." },
    { number: "2", title: "Doe ou Solicite", desc: "Informe os alimentos disponíveis ou peça ajuda." },
    { number: "3", title: "Conecte e Ajude", desc: "Encontre alguém próximo e faça a diferença." },
  ]

  return (
    <section className="py-16 bg-green-50">
      <div className="max-w-5xl mx-auto px-4 text-center">
        <h3 className="text-3xl font-semibold text-primary font-poppins mb-10">Como funciona?</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step) => (
            <div key={step.number} className="bg-white p-6 rounded-xl shadow">
              <div className="text-4xl font-bold text-green-600 mb-2">{step.number}</div>
              <h4 className="text-lg font-semibold font-poppins">{step.title}</h4>
              <p className="text-sm text-gray-600 font-roboto mt-2">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
