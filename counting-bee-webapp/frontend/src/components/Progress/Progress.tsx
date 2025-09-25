import React from 'react';
import './Progress.css';

interface Props {
  stars: number;
}

const Progress: React.FC<Props> = ({ stars }) => (
  <div className="progress-bar">
    {[...Array(10)].map((_, i) => (
      <span key={i} className={`star${i < stars ? ' filled' : ''}`}>★</span>
    ))}
  </div>
);

export default Progress;
