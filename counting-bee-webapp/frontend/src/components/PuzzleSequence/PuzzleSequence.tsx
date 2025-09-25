import React, { useState, useEffect } from 'react';
import NumberSelector from '../NumberSelector/NumberSelector';
import './PuzzleSequence.css';
import { SequencePuzzle } from '../../types';

interface Props {
  puzzle: SequencePuzzle;
  onSubmit: (answers: number[]) => void;
  onReset?: () => void;
}

const PuzzleSequence: React.FC<Props> = ({ puzzle, onSubmit, onReset }) => {
  // Sort missing indices by their position (left to right)
  const sortedMissingIndices = [...puzzle.missingIndices].sort((a, b) => a - b);
  
  const [answers, setAnswers] = useState<(number | null)[]>(
    puzzle.numbers.map(n => n === null ? null : n)
  );
  const [activeBlank, setActiveBlank] = useState(0);
  const [status, setStatus] = useState<("idle" | "correct" | "incorrect")[]>(
    sortedMissingIndices.map(() => "idle")
  );

  // Reset state when puzzle changes
  useEffect(() => {
    setAnswers(puzzle.numbers.map(n => n === null ? null : n));
    setActiveBlank(0);
    setStatus(sortedMissingIndices.map(() => "idle"));
  }, [puzzle.id]);

  const handleSelect = (num: number) => {
    const idx = sortedMissingIndices[activeBlank];
    // Only allow filling the current active blank
    if (answers[idx] !== null || status[activeBlank] !== "idle") return;
    
    const correct = num === getCorrectNumber(idx);
    const newAnswers = [...answers];
    newAnswers[idx] = num;
    setAnswers(newAnswers);
    const newStatus = [...status];
    newStatus[activeBlank] = correct ? "correct" : "incorrect";
    setStatus(newStatus);
    
    if (correct) {
      setTimeout(() => {
        if (activeBlank + 1 < sortedMissingIndices.length) {
          setActiveBlank(activeBlank + 1);
        } else {
          // All blanks filled correctly - submit the puzzle
          // Send answers in the same order as the original missing indices
          onSubmit(puzzle.missingIndices.map(i => newAnswers[i] as number));
        }
      }, 500);
    } else {
      setTimeout(() => {
        newAnswers[idx] = null;
        newStatus[activeBlank] = "idle";
        setAnswers([...newAnswers]);
        setStatus([...newStatus]);
      }, 2000);
    }
  };

  function getCorrectNumber(idx: number) {
    // The correct number for the blank
    return puzzle.correctNumbers[idx];
  }

  return (
    <div className="puzzle-sequence">
      <div className="sequence-row">
        {puzzle.numbers.map((n, i) => {
          const sortedBlankIdx = sortedMissingIndices.indexOf(i);
          if (n === null) {
            const isActive = sortedBlankIdx === activeBlank;
            const blankStatus = status[sortedBlankIdx];
            return (
              <span
                key={i}
                className={`blank${isActive ? ' active' : ''} ${blankStatus}`}
              >
                {answers[i] !== null ? answers[i] : ''}
              </span>
            );
          }
          return <span key={i} className="number">{n}</span>;
        })}
      </div>
      <NumberSelector
        options={puzzle.options}
        onSelect={handleSelect}
        disabled={status[activeBlank] === "correct"}
      />
    </div>
  );
};

export default PuzzleSequence;
