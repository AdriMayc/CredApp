import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/global/Navbar';
import BottomNavbar from './components/global/BottomNavbar';
import Home from './pages/Home';
import SimuladorInstituicao from './components/SimuladorInstituicao';
import Clientes from './pages/Clientes';
import { SolicitacoesProvider } from './context/SolicitacoesContext';
import { NotificacoesProvider } from './context/NotificacoesContext';
import React, { useEffect } from 'react';

export default function App() {
  useEffect(() => {
    // Limpa imediatamente quando o componente monta (executa a cada F5)
    sessionStorage.removeItem('historicoCredito');
    
    // Opcional: também limpa quando o componente desmonta (fechar aba/navegador)
    return () => {
      sessionStorage.removeItem('historicoCredito');
    };
  }, []);

  return (
    <NotificacoesProvider>
      <SolicitacoesProvider>
        <Router>
          <div className="relative min-h-screen">
            <Navbar />
            <main className="pb-16">
              <Routes>
                <Route path="/" element={<Navigate to="/instituicao" replace />} />
                <Route path="/instituicao" element={<Home />} />
                <Route path="/instituicao/simulador" element={<SimuladorInstituicao />} />
                <Route path="/instituicao/clientes" element={<Clientes />} />
              </Routes>
            </main>
            <BottomNavbar />
          </div>
        </Router>
      </SolicitacoesProvider>
    </NotificacoesProvider>
  );
}