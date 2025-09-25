import React from 'react';
import './FeedbackPopup.css';

interface Props {
  success: boolean;
  message: string;
  onClose: () => void;
}

const FeedbackPopup: React.FC<Props> = ({ success, message, onClose }) => (
  <div className="feedback-popup">
    <div className={`popup-content${success ? ' success' : ' error'}`}>
      <h2>{success ? 'Correct!' : 'Incorrect'}</h2>
      <p>{message}</p>
      <button onClick={onClose}>{success ? 'Next Puzzle' : 'Try Again'}</button>
    </div>
  </div>
);

export default FeedbackPopup;
