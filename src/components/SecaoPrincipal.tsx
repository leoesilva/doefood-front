import imgSecaoPrincipal from "../assets/img-seccion.png";

export default function SecaoPrincipal() {
  return (
    <section
      className="w-full h-screen bg-cover bg-center"
      style={{
        backgroundImage: `url(${imgSecaoPrincipal})`,
      }}
    />
  );
}
