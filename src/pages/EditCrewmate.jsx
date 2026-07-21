import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../client';

export default function EditCrewmate() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Form State
  const [name, setName] = useState('');
  const [speed, setSpeed] = useState('5');
  const [color, setColor] = useState('Blue');
  const [starType, setStarType] = useState('Main Sequence');

  // UI Feedback State
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    fetchCrewmate();
  }, [id]);

  async function fetchCrewmate() {
    setLoading(true);
    const { data, error } = await supabase
      .from('crewmates')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching crewmate for edit:', error.message);
      setErrorMsg('Could not load crewmate data.');
    } else if (data) {
      setName(data.custom_name || '');
      setColor(data.api_data?.color || 'Blue');
      setStarType(data.api_data?.starType || 'Main Sequence');
      setSpeed(String(data.game_stats?.speed || '5'));
    }
    setLoading(false);
  }

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      setErrorMsg('Crewmate callsign cannot be empty.');
      return;
    }

    setSaving(true);
    setErrorMsg('');

    const updatedCrewmate = {
      custom_name: name.trim(),
      api_data: { color, starType },
      game_stats: { speed: Number(speed), currentLevel: 1, fuelPct: 100 }
    };

    const { error } = await supabase
      .from('crewmates')
      .update(updatedCrewmate)
      .eq('id', id);

    setSaving(false);

    if (error) {
      console.error('Error updating crewmate:', error.message);
      setErrorMsg(`Update failed: ${error.message}`);
    } else {
      navigate(`/crewmate/${id}`);
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(`Are you sure you want to dismiss ${name} from the fleet?`);
    if (!confirmed) return;

    setSaving(true);
    const { error } = await supabase
      .from('crewmates')
      .delete()
      .eq('id', id);

    setSaving(false);

    if (error) {
      console.error('Error deleting crewmate:', error.message);
      setErrorMsg(`Delete failed: ${error.message}`);
    } else {
      navigate('/');
    }
  };

  if (loading) return <div className="create-container"><p className="loading-text">Loading crewmate records...</p></div>;

  return (
    <div className="create-container">
      <h2>Stellar Tuning Lab</h2>
      <p className="subtitle">Update attributes or dismiss crewmate from active service.</p>

      {errorMsg && <p className="error-banner">{errorMsg}</p>}

      <form onSubmit={handleUpdate} className="create-form">
        <div className="form-group">
          <label htmlFor="name">Crewmate Callsign / Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="speed">Engine Warp Speed (1 - 10): {speed}</label>
          <input
            type="range"
            id="speed"
            min="1"
            max="10"
            value={speed}
            onChange={(e) => setSpeed(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Hull Aura / Color:</label>
          <div className="radio-group">
            {['Blue', 'Red', 'Green', 'Yellow', 'Purple'].map((c) => (
              <label key={c} className="radio-label">
                <input
                  type="radio"
                  name="color"
                  value={c}
                  checked={color === c}
                  onChange={(e) => setColor(e.target.value)}
                />
                {c}
              </label>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="starType">Stellar Classification:</label>
          <select
            id="starType"
            value={starType}
            onChange={(e) => setStarType(e.target.value)}
          >
            <option value="Main Sequence">Main Sequence (Balanced)</option>
            <option value="Red Giant">Red Giant (High Mass)</option>
            <option value="White Dwarf">White Dwarf (Dense/Fast)</option>
            <option value="Neutron Star">Neutron Star (High Energy)</option>
            <option value="Supergiant">Supergiant (Titan Class)</option>
          </select>
        </div>

        <div className="edit-button-group">
          <button type="submit" className="submit-btn" disabled={saving}>
            {saving ? 'Updating...' : 'Update Crewmate'}
          </button>
          <button type="button" onClick={handleDelete} className="delete-btn" disabled={saving}>
            Dismiss from Fleet (Delete)
          </button>
        </div>
      </form>
    </div>
  );
}