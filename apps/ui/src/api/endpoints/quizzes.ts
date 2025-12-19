import { apiFetch } from '../fetch';

export interface QuizAnswer {
  id: string;
  text: string;
}

export interface QuizQuestion {
  id: string;
  text: string;
  order: number;
  answers: QuizAnswer[];
}

export interface QuizListItem {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  questionCount: number;
  estimatedMinutes: number;
}

export interface QuizDetail {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  questionCount: number;
  estimatedMinutes: number;
  questions: QuizQuestion[];
}

export interface QuizListResponse {
  quizzes: QuizListItem[];
  total: number;
}

export interface CategoriesResponse {
  categories: string[];
}

export interface SubmitAnswerDto {
  questionId: string;
  answerId: string;
}

export interface SubmitQuizDto {
  answers: SubmitAnswerDto[];
  [key: string]: unknown;
}

export interface QuestionResult {
  questionId: string;
  selectedAnswerId: string;
  correctAnswerId: string;
  isCorrect: boolean;
  explanation: string;
}

export interface QuizResultDto {
  attemptId: string;
  quizId: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  feedback: string;
  feedbackLevel: 'excellent' | 'good' | 'needs_improvement' | 'keep_practicing';
  results: QuestionResult[];
  completedAt: string;
}

export interface QuizFilters {
  category?: string;
  difficulty?: string;
  page?: number;
  limit?: number;
  [key: string]: string | number | boolean | undefined;
}

export const getQuizzes = (filters?: QuizFilters) =>
  apiFetch<QuizListResponse>('/quizzes', {
    method: 'GET',
    params: filters,
    skipAuth: true,
  });

export const getQuizById = (id: string) =>
  apiFetch<QuizDetail>(`/quizzes/${id}`, {
    method: 'GET',
    skipAuth: true,
  });

export const getQuizCategories = () =>
  apiFetch<CategoriesResponse>('/quizzes/categories', {
    method: 'GET',
    skipAuth: true,
  });

export const submitQuiz = (quizId: string, submission: SubmitQuizDto) =>
  apiFetch<QuizResultDto>(`/quizzes/${quizId}/submit`, {
    method: 'POST',
    body: submission,
  });
