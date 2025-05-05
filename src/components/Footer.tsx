import { FaGithub } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-green-600 text-white py-6">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
        <p className="font-roboto">
          &copy; {new Date().getFullYear()} doeFood. Todos os direitos reservados.
        </p>
        <div className="flex gap-4 mt-4 md:mt-0 items-center">
          <a href="https://github.com/WebCrafters-ZL" className="flex items-center hover:underline font-roboto">
            <FaGithub className="w-6 h-6 mr-2" /> GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
