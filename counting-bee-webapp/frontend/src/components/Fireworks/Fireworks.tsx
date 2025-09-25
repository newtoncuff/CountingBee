import React from 'react';
import './Fireworks.css';

const Fireworks: React.FC = () => (
  <div className="fireworks-overlay">
    <div className="fireworks">
      {/* Main fireworks */}
      <span className="firework f1" />
      <span className="firework f2" />
      <span className="firework f3" />
      <span className="firework f4" />
      <span className="firework f5" />
      <span className="firework f6" />
      <span className="firework f7" />
      <span className="firework f8" />
      <span className="firework f9" />
      <span className="firework f10" />
      
      {/* Large burst fireworks */}
      <span className="firework-large l1" />
      <span className="firework-large l2" />
      <span className="firework-large l3" />
      
      {/* Confetti particles */}
      {Array.from({ length: 30 }, (_, i) => (
        <span key={i} className={`confetti c${i + 1}`} />
      ))}
      
      {/* Sparkles */}
      {Array.from({ length: 20 }, (_, i) => (
        <span key={i} className={`sparkle s${i + 1}`} />
      ))}
      
      {/* Celebration text with animation */}
      <div className="celebration-text">
        <div className="celebration-main">🎉 AMAZING! 🎉</div>
        <div className="celebration-sub">You got 10 stars in a row!</div>
        <div className="celebration-emoji">⭐ 🌟 ✨ 🎊 �</div>
      </div>
    </div>
  </div>
);

export default Fireworks;
