import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/global/Navbar';
import BottomNavbar from './components/global/BottomNavbar';
import Home from './pages/Home';
import SimuladorInstituicao from './components/simulador/SimuladorDeCredito';
import Clientes from './pages/Clientes';
import { SolicitacoesProvider } from './context/SolicitacoesContext';
import { NotificacoesProvider } from './context/NotificacoesContext';
import React, { useEffect } from 'react';
import OnlyMobile from './components/global/OnlyMobile';

export default function App() {
  useEffect(() => {
    sessionStorage.removeItem('historicoCredito');
    return () => sessionStorage.removeItem('historicoCredito');
  }, []);

  return (
    <OnlyMobile>
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
    </OnlyMobile>
  );
}
