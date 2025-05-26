import { Link } from 'react-router-dom'
import { Bell } from 'lucide-react'

function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full border-b border-gray-200 bg-white z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo / Nome do App */}
        <Link to="/" className="text-xl font-bold text-black">
          App
        </Link>

        {/* Menu Desktop */}
        <ul className="hidden md:flex space-x-6 text-black items-center">
          <li><Link to="/" className="hover:text-blue-500">Início</Link></li>
          <li><Link to="/ScorePage" className="hover:text-blue-500">Score</Link></li>
          <li><Link to="/sobre" className="hover:text-blue-500">Sobre</Link></li>
        </ul>

        {/* Ícone de Notificação */}
        <div className="flex items-center">
          <button className="relative hover:text-blue-500">
            <Bell className="w-6 h-6 text-black" />
            {/* Badge opcional */}
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5">
              3
            </span>
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
