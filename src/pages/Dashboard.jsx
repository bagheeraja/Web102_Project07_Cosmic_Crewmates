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
    // Fetch all crewmates ordered by newest first
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

      {!loading && crewmates.length === 0 && (
        <div className="empty-state">
          <p>No crewmates recruited yet! Your fleet is empty.</p>
          <Link to="/create" className="cta-link">Recruit your first star crewmate →</Link>
        </div>
      )}

      {!loading && crewmates.length > 0 && (
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