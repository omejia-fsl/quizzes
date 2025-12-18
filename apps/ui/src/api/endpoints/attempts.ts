import { apiFetch } from '../fetch';
import type { QuestionResult } from './quizzes';

export interface AttemptDetail {
  id: string;
  quizId: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  completedAt: string;
  results: QuestionResult[];
}

export const getAttemptById = (attemptId: string) =>
  apiFetch<AttemptDetail>(`/attempts/me/${attemptId}`, {
    method: 'GET',
  });
