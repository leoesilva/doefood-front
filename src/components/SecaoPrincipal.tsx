import Button from "@/components/ui/Button";

export default function SecaoPrincipal() {
  return (
    <section className="bg-green-50 py-16">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-10">
        <div className="max-w-xl">
          <h2 className="text-4xl font-bold text-primary font-poppins mb-4">
            Conectando doadores a quem mais precisa
          </h2>
          <p className="text-gray-700 font-roboto mb-6">
            Doe alimentos excedentes ou receba doações de forma rápida, segura e eficiente.
          </p>
          <div className="flex gap-4">
            <Button className="bg-primary hover:bg-green-700 text-white font-poppins">
              Quero Doar
            </Button>
            <Button className="border border-secondary text-secondary font-poppins">
              Preciso de Ajuda
            </Button>
          </div>
        </div>

        <img
          src="https://cdn-icons-png.flaticon.com/512/1040/1040230.png"
          alt="Doação"
          className="w-64 md:w-80"
        />
      </div>
    </section>
  );
}
