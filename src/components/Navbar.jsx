import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Navbar() {
  return (
    <header className="navbar-header">
      <div className="navbar-brand">
        <span className="brand-icon">🚀</span>
        <span className="brand-title">Cosmic Crewmates</span>
      </div>
      <nav className="navbar-links">
        <NavLink 
          to="/" 
          className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
          end
        >
          Fleet Dashboard
        </NavLink>
        <NavLink 
          to="/create" 
          className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
        >
          Recruit Crewmate
        </NavLink>
      </nav>
    </header>
  );
}