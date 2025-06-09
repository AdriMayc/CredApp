import { Link } from 'react-router-dom'
import Notificacoes from './Notificacoes';

function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full border-b border-gray-200 bg-white z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img
            src="/logo.png"
            alt="Logo do App"
            className="h-10 w-auto"
          />
        </Link>

        {/* Componente Notificações */}
        <div className="flex items-center">
          <Notificacoes />
        </div>
      </div>
    </nav>
  )
}

export default Navbar
