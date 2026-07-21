import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { supabase } from './client';

import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import CreateCrewmate from './pages/CreateCrewmate';
import CrewDetail from './pages/CrewDetail';
import EditCrewmate from './pages/EditCrewmate';

import './App.css';

export default function App() {
  const [dbStatus, setDbStatus] = useState('Checking database connection...');

  useEffect(() => {
    async function testDatabase() {
      // 1. Test reading from the crewmates table
      const { data, error } = await supabase.from('crewmates').select('*').limit(1);

      if (error) {
        console.error('Database connection error:', error.message);
        setDbStatus(`❌ Database Error: ${error.message}`);
      } else {
        setDbStatus('✅ Connected to Supabase & Table Accessible!');
      }
    }

    testDatabase();
  }, []);

  return (
    <BrowserRouter>
      <div className="app-container">
        <Navbar />
        <main className="content">
          <p style={{ textAlign: 'center', color: '#4facfe', margin: '1rem 0', fontWeight: 'bold' }}>
            🚀 {dbStatus}
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