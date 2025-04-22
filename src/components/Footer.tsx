


export default function Footer() {
  return (
    <footer className="bg-green-600 text-white py-6 mt-12">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
        <p className="font-roboto">
          &copy; {new Date().getFullYear()} doeFood. Todos os direitos reservados.
        </p>
        <div className="flex gap-4 mt-4 md:mt-0">
          <a href="#" className="hover:underline font-roboto">Contato</a>
          <a href="#" className="hover:underline font-roboto">Instagram</a>
          <a href="#" className="hover:underline font-roboto">LinkedIn</a>
        </div>
      </div>
    </footer>
  )
}
