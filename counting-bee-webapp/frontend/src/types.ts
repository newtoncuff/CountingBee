// Types for CountingMachine

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface SequencePuzzle {
  id: number;
  numbers: (number | null)[]; // null for blanks
  correctNumbers: number[]; // the full correct sequence
  missingIndices: number[]; // indices of blanks
  options: number[]; // numbers to choose from
  difficulty: Difficulty;
}

export interface UserProgress {
  userId: number;
  consecutiveCorrect: number;
  stars: number;
}

export interface Task {
  id: number;
  userId: number;
  sequenceId: number;
  date: string;
  completed: boolean;
  correct: boolean;
}
