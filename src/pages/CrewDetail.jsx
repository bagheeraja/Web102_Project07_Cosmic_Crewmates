import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '../client';

export default function CrewDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [crewmate, setCrewmate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    fetchCrewmateDetail();
  }, [id]);

  async function fetchCrewmateDetail() {
    setLoading(true);
    const { data, error } = await supabase
      .from('crewmates')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching crewmate detail:', error.message);
      setErrorMsg('Crewmate telemetry not found in stellar registry.');
    } else {
      setCrewmate(data);
    }
    setLoading(false);
  }

  if (loading) return <div className="detail-container"><p className="loading-text">Fetching crewmate telemetry...</p></div>;
  if (errorMsg) return <div className="detail-container"><p className="error-banner">{errorMsg}</p><Link to="/" className="cta-link">← Return to Fleet Dashboard</Link></div>;
  if (!crewmate) return null;

  return (
    <div className="detail-container">
      <div className="detail-card">
        <div className="detail-header">
          <h2>{crewmate.custom_name}</h2>
          <span className={`color-badge badge-${crewmate.api_data?.color?.toLowerCase()}`}>
            {crewmate.api_data?.color || 'Standard'}
          </span>
        </div>

        <div className="detail-section">
          <h3>Stellar Telemetry</h3>
          <p><strong>Registry ID:</strong> <span className="mono-text">{crewmate.id}</span></p>
          <p><strong>Recruitment Date:</strong> {new Date(crewmate.created_at).toLocaleDateString()}</p>
          <p><strong>Classification:</strong> {crewmate.api_data?.starType || 'Main Sequence'}</p>
          <p><strong>Warp Engine Speed:</strong> {crewmate.game_stats?.speed || 1} / 10</p>
          <p><strong>Current Level:</strong> {crewmate.game_stats?.currentLevel || 1}</p>
          <p><strong>Fuel Reserve:</strong> {crewmate.game_stats?.fuelPct || 100}%</p>
        </div>

        <div className="detail-actions">
          <Link to={`/edit/${crewmate.id}`} className="card-btn edit-btn">
            Edit Crewmate
          </Link>
          <button onClick={() => navigate('/')} className="card-btn details-btn">
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}