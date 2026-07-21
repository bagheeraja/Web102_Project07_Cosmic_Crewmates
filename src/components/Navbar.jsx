import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav style={{ padding: '1rem', borderBottom: '1px solid #333', display: 'flex', gap: '1rem' }}>
      <Link to="/">Dashboard</Link>
      <Link to="/create">Recruit Star</Link>
    </nav>
  );
}