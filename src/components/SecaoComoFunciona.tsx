import { FaUserPlus, FaHandsHelping, FaMapMarkedAlt } from "react-icons/fa";

const steps = [
  {
    number: "1",
    title: "Cadastre-se",
    desc: "Crie uma conta como doador ou receptor.",
    icon: <FaUserPlus className="text-green-600 text-3xl mb-2" />,
  },
  {
    number: "2",
    title: "Doe ou Solicite",
    desc: "Informe os alimentos disponíveis ou peça ajuda.",
    icon: <FaHandsHelping className="text-green-600 text-3xl mb-2" />,
  },
  {
    number: "3",
    title: "Conecte e Ajude",
    desc: "Encontre alguém próximo e faça a diferença.",
    icon: <FaMapMarkedAlt className="text-green-600 text-3xl mb-2" />,
  },
];

export default function SecaoComoFunciona() {
  return (
    <section className="py-16 bg-green-50">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <h3 className="text-3xl font-semibold text-primary font-poppins mb-10">
          Como funciona?
        </h3>

        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {steps.map((step, idx) => (
            <div
              key={step.number}
              className="bg-white p-6 rounded-xl shadow-md transition-transform transform hover:scale-105 hover:shadow-xl relative"
            >
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-2xl font-bold bg-green-600 text-white w-10 h-10 rounded-full flex items-center justify-center shadow">
                {step.number}
              </div>
              <div className="mt-6 flex justify-center">{step.icon}</div>

              <h4 className="text-lg font-bold font-poppins mb-1">{step.title}</h4>
              <p className="text-sm text-gray-700 font-roboto font-semibold">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
