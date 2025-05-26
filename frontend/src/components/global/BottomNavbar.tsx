import { Link, useLocation } from 'react-router-dom';
import { Home, List, Calculator } from 'lucide-react';

const BottomNavbar = () => {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-md z-50 h-16">
      <div className="flex justify-between items-center px-10 py-2">
        <Link
          to="/instituicao/simulador"
          className={`flex flex-col items-center text-sm ${
            location.pathname === '/instituicao/simulador'
              ? 'text-blue-600 font-semibold'
              : 'text-gray-500'
          }`}
        >
          <Calculator className="h-5 w-5 mb-1" />
          Simulador
        </Link>

        <Link
          to="/instituicao"
          className={`flex flex-col items-center text-sm ${
            location.pathname === '/instituicao'
              ? 'text-blue-600 font-semibold'
              : 'text-gray-500'
          }`}
        >
          <Home className="h-5 w-5 mb-1" />
          Home
        </Link>

        <Link
          to="/instituicao/clientes"
          className={`flex flex-col items-center text-sm ${
            location.pathname === '/instituicao/clientes'
              ? 'text-blue-600 font-semibold'
              : 'text-gray-500'
          }`}
        >
          <List className="h-5 w-5 mb-1" />
          Clientes
        </Link>
      </div>
    </nav>
  );
};

export default BottomNavbar;
