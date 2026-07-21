import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../client';

export default function CreateCrewmate() {
  const navigate = useNavigate();

  // Form State
  const [name, setName] = useState('');
  const [speed, setSpeed] = useState('5'); // Default speed rating (1-10)
  const [color, setColor] = useState('Blue');
  const [starType, setStarType] = useState('Main Sequence');
  
  // UI Feedback State
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      setErrorMsg('Please enter a name for your crewmate.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    // Package API data and game stats into JSON objects matching database schema
    const newCrewmate = {
      custom_name: name.trim(),
      is_assigned_to_squad: false,
      api_data: {
        color: color,
        starType: starType,
      },
      game_stats: {
        speed: Number(speed),
        currentLevel: 1,
        fuelPct: 100,
      }
    };

    const { error } = await supabase
      .from('crewmates')
      .insert([newCrewmate]);

    setLoading(false);

    if (error) {
      console.error('Error inserting crewmate:', error.message);
      setErrorMsg(`Failed to create crewmate: ${error.message}`);
    } else {
      // Navigate user back to Fleet Dashboard after successful creation
      navigate('/');
    }
  };

  return (
    <div className="create-container">
      <h2>Recruit New Cosmic Crewmate</h2>
      <p className="subtitle">Configure your star crewmate's attributes before launching into the fleet.</p>

      {errorMsg && <p className="error-banner">{errorMsg}</p>}

      <form onSubmit={handleSubmit} className="create-form">
        {/* Name Input */}
        <div className="form-group">
          <label htmlFor="name">Crewmate Callsign / Name:</label>
          <input
            type="text"
            id="name"
            placeholder="e.g. Orion-9, Sirius Prime"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        {/* Speed Rating Slider/Number */}
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

        {/* Color Selection (Radio Buttons) */}
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

        {/* Star Type Selection */}
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

        {/* Submit Button */}
        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? 'Transmitting to Fleet...' : 'Create Crewmate'}
        </button>
      </form>
    </div>
  );
}