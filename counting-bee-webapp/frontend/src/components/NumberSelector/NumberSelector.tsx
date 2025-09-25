import React from 'react';
import './NumberSelector.css';

interface Props {
  options: number[];
  onSelect: (num: number) => void;
  disabled?: boolean;
}

const getRandomColor = () => {
  const colors = [
    '#FF5733', '#33FF57', '#3357FF', '#F39C12', '#8E44AD', '#16A085', '#E74C3C',
    '#2ECC71', '#3498DB', '#E67E22', '#1ABC9C', '#9B59B6', '#34495E', '#F1C40F',
    '#7F8C8D', '#C0392B', '#27AE60', '#2980B9', '#D35400', '#2C3E50', '#BDC3C7',
    '#FFB347', '#B2FF66', '#66B2FF', '#FF66B2', '#B266FF'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

const NumberSelector: React.FC<Props> = ({ options, onSelect, disabled }) => {
  return (
    <div className="number-selector">
      {options.map((num, idx) => (
        <button
          key={num + '-' + idx}
          className="number-btn"
          style={{ borderColor: getRandomColor() }}
          onClick={() => !disabled && onSelect(num)}
          disabled={disabled}
        >
          {num}
        </button>
      ))}
    </div>
  );
};

export default NumberSelector;
