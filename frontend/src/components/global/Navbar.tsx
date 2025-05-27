import { Link } from 'react-router-dom'
import { Bell } from 'lucide-react'
import Notificacoes from './Notificacoes';

function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full border-b border-gray-200 bg-white z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo / Nome do App */}
        <Link to="/" className="text-xl font-bold text-black">
          App
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
