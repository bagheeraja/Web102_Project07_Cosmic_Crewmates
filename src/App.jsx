import { useState } from 'react' 
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Dashboard from './pages/Dashboard'
import CreateCrewmate from './pages/CreateCrewmate'
import CrewDetail from './pages/CrewDetail'
import EditCrewmate from './pages/EditCrewmate'

import './App.css'

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <Navbar />
          <main className="content">
            <p style={{ textAlign: 'center', color: '#4facfe', margin: '1rem 0' }}>
              🚀 Cosmic Crewmates Engine Online & Ready
            </p>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/create" element={<CreateCrewmate />} />
                <Route path="/crewmate/:id" element={<CrewDetail />} />
                <Route path="/edit/:id" element={<EditCrewmate />} />
              </Routes>
          </main>
      </div>
    </BrowserRouter>
  );
}
