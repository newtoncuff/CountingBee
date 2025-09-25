import React, { useState, useEffect } from 'react';
import DifficultySelector from '../DifficultySelector/DifficultySelector';
import PuzzleSequence from '../PuzzleSequence/PuzzleSequence';
import Progress from '../Progress/Progress';
import FeedbackPopup from '../FeedbackPopup/FeedbackPopup';
import Fireworks from '../Fireworks/Fireworks';
import { Difficulty, SequencePuzzle, UserProgress } from '../../types';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || '/api';

const Game: React.FC = () => {
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [puzzle, setPuzzle] = useState<SequencePuzzle | null>(null);
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [showFireworks, setShowFireworks] = useState(false);
  const [feedback, setFeedback] = useState<{ success: boolean; message: string } | null>(null);

  useEffect(() => {
    fetchProgress();
  }, []);

  useEffect(() => {
    fetchPuzzle();
  }, [difficulty]);

  const fetchPuzzle = async () => {
    const res = await axios.get(`${API_URL}/puzzle?difficulty=${difficulty}`);
    setPuzzle(res.data);
  };

  const fetchProgress = async () => {
    const res = await axios.get(`${API_URL}/progress`);
    setProgress(res.data);
  };

  const handleDifficultyChange = (level: Difficulty) => {
    setDifficulty(level);
  };

  const handleSubmit = async (answers: number[]) => {
    const res = await axios.post(`${API_URL}/submit`, {
      puzzleId: puzzle?.id,
      answers,
      missingIndices: puzzle?.missingIndices,
    });
    setFeedback({ success: res.data.correct, message: res.data.message });
    setProgress(res.data.progress);
    if (res.data.progress.stars === 10) {
      setShowFireworks(true);
      setTimeout(() => setShowFireworks(false), 7000); // Extended to 7 seconds for more impact
    }
    // Only fetch new puzzle if answer was correct
    if (res.data.correct) {
      fetchPuzzle();
    }
  };

  const handleFeedbackClose = () => {
    setFeedback(null);
    // If the answer was correct, we already fetched a new puzzle
    // If incorrect, the user can try the same puzzle again
    if (feedback?.success) {
      // New puzzle already loaded
    } else {
      // Keep the same puzzle for retry
    }
  };

  return (
    <div>
      <DifficultySelector value={difficulty} onChange={handleDifficultyChange} />
      {progress && <Progress stars={progress.stars} />}
      {puzzle && (
        <PuzzleSequence puzzle={puzzle} onSubmit={handleSubmit} />
      )}
      {feedback && (
        <FeedbackPopup
          success={feedback.success}
          message={feedback.message}
          onClose={handleFeedbackClose}
        />
      )}
      {showFireworks && <Fireworks />}
    </div>
  );
};

export default Game;
