import React from 'react';
import './Slider.css';

interface SliderProps {
  min: number;
  max: number;
  step?: number;
  value: number;
  onChange: (value: number) => void;
  label?: string;
}

export const Slider: React.FC<SliderProps> = ({
  min,
  max,
  step = 0.1,
  value,
  onChange,
  label
}) => {
  return (
    <div className="slider-container">
      {label && (
        <div className="slider-header">
          <span className="slider-label">{label}</span>
          <span className="slider-value">{value.toFixed(1)}</span>
        </div>
      )}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="slider-input"
      />
    </div>
  );
};