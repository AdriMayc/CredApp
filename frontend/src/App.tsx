import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Navbar from './components/global/Navbar';
import BottomNavbar from './components/global/BottomNavbar';

import Home from './pages/Home';
import SimuladorInstituicao from './components/SimuladorInstituicao';
import Clientes from './pages/Clientes'


export default function App() {

  return (
    <Router>
      <div className="relative min-h-screen">
        <Navbar/>
        <main className="pb-16">
          <Routes>
            <Route path="/" element={<Navigate to="/instituicao" replace />} />
            <Route path="/instituicao" element={<Home />} />
            <Route path="/instituicao/simulador" element={<SimuladorInstituicao />} />
            <Route path='/instituicao/clientes' element={<Clientes/>}/>
          </Routes>
        </main>
        
        <BottomNavbar/>
      </div>
    </Router>
  );
}
