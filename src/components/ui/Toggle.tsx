import React from 'react';
import './Toggle.css';

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
}

export const Toggle: React.FC<ToggleProps> = ({ checked, onChange, label }) => {
  return (
    <label className="toggle-container">
      {label && <span className="toggle-label">{label}</span>}
      <div className="toggle">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="toggle-input"
        />
        <span className="toggle-slider"></span>
      </div>
    </label>
  );
};