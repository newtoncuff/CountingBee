import React from 'react';
import './DifficultySelector.css';
import { Difficulty } from '../../types';

interface Props {
  value: Difficulty;
  onChange: (level: Difficulty) => void;
}

const levels: Difficulty[] = ['easy', 'medium', 'hard'];
const labels = {
  easy: 'Easy (1-10)',
  medium: 'Medium (10-25)',
  hard: 'Hard (25-100)'
};

const DifficultySelector: React.FC<Props> = ({ value, onChange }) => (
  <div className="difficulty-selector">
    {levels.map(level => (
      <button
        key={level}
        className={`difficulty-btn${value === level ? ' selected' : ''}`}
        onClick={() => onChange(level)}
      >
        {labels[level]}
      </button>
    ))}
  </div>
);

export default DifficultySelector;
