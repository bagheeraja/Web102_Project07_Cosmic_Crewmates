import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../client';

export default function Dashboard() {
  const [crewmates, setCrewmates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    fetchCrewmates();
  }, []);

  async function fetchCrewmates() {
    setLoading(true);
    const { data, error } = await supabase
      .from('crewmates')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching crewmates:', error.message);
      setErrorMsg('Failed to load fleet data.');
    } else {
      setCrewmates(data || []);
    }
    setLoading(false);
  }

  // --- SUMMARY STATISTICS CALCULATIONS ---
  const totalCrew = crewmates.length;

  // Average Engine Speed
  const avgSpeed = totalCrew > 0
    ? (crewmates.reduce((acc, c) => acc + (c.game_stats?.speed || 0), 0) / totalCrew).toFixed(1)
    : 0;

  // Percent Blue Hull Aura
  const blueCount = crewmates.filter(c => c.api_data?.color === 'Blue').length;
  const bluePct = totalCrew > 0 ? Math.round((blueCount / totalCrew) * 100) : 0;

  // Percent High Warp (Speed >= 7)
  const highSpeedCount = crewmates.filter(c => (c.game_stats?.speed || 0) >= 7).length;
  const highSpeedPct = totalCrew > 0 ? Math.round((highSpeedCount / totalCrew) * 100) : 0;

  // Percent Main Sequence Class
  const mainSeqCount = crewmates.filter(c => c.api_data?.starType === 'Main Sequence').length;
  const mainSeqPct = totalCrew > 0 ? Math.round((mainSeqCount / totalCrew) * 100) : 0;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>Stellar Fleet Command</h2>
        <Link to="/create" className="recruit-btn">
          + Recruit New Crewmate
        </Link>
      </div>

      {loading && <p className="loading-text">Scanning deep space for crewmates...</p>}
      {errorMsg && <p className="error-banner">{errorMsg}</p>}

      {!loading && totalCrew > 0 && (
        <div className="stats-summary-card">
          <h3>📊 Fleet Command Telemetry Summary</h3>
          <div className="stats-grid">
            <div className="stat-box">
              <span className="stat-value">{totalCrew}</span>
              <span className="stat-label">Total Recruits</span>
            </div>
            <div className="stat-box">
              <span className="stat-value">{avgSpeed} <small>/10</small></span>
              <span className="stat-label">Avg Engine Speed</span>
            </div>
            <div className="stat-box">
              <span className="stat-value">{bluePct}%</span>
              <span className="stat-label">Blue Hull Aura</span>
            </div>
            <div className="stat-box">
              <span className="stat-value">{highSpeedPct}%</span>
              <span className="stat-label">High-Warp (7+ Speed)</span>
            </div>
            <div className="stat-box">
              <span className="stat-value">{mainSeqPct}%</span>
              <span className="stat-label">Main Sequence Class</span>
            </div>
          </div>
        </div>
      )}

      {!loading && totalCrew === 0 && (
        <div className="empty-state">
          <p>No crewmates recruited yet! Your fleet is empty.</p>
          <Link to="/create" className="cta-link">Recruit your first star crewmate →</Link>
        </div>
      )}

      {!loading && totalCrew > 0 && (
        <div className="crew-grid">
          {crewmates.map((crew) => (
            <div key={crew.id} className="crew-card">
              <div className="card-header">
                <h3>{crew.custom_name}</h3>
                <span className={`color-badge badge-${crew.api_data?.color?.toLowerCase()}`}>
                  {crew.api_data?.color || 'Unknown'}
                </span>
              </div>
              <div className="card-body">
                <p><strong>Class:</strong> {crew.api_data?.starType || 'Standard'}</p>
                <p><strong>Warp Speed:</strong> {crew.game_stats?.speed || 1} / 10</p>
              </div>
              <div className="card-footer">
                <Link to={`/crewmate/${crew.id}`} className="card-btn details-btn">Details</Link>
                <Link to={`/edit/${crew.id}`} className="card-btn edit-btn">Edit</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}