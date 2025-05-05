import imgSecaoPrincipal from "../assets/img-seccion.png";

export default function SecaoPrincipal() {
  return (
    <section className="relative w-full min-h-screen overflow-hidden">
      <img
        src={imgSecaoPrincipal}
        alt="Ação de doação de alimentos"
        className="absolute top-0 left-0 w-full h-full object-cover"
      />

      <div className="relative z-10 flex items-center h-full">
        <div className="pl-6 md:pl-16 max-w-[500px] pt-32">
          <h1 className="text-black text-3xl md:text-5xl lg:text-6xl font-bold leading-tight">
            Doe alimentos, compartilhe esperança.
          </h1>
          <p className="mt-4 text-black text-lg md:text-xl lg:text-2xl font-bold">
            Conectamos doadores a quem mais precisa, com responsabilidade e empatia.
          </p>
        </div>
      </div>
    </section>
  );
}
