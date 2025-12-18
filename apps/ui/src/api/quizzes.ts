import { api } from './api';

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
}

export interface AttemptDetail {
  id: string;
  quizId: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  completedAt: string;
  results: QuestionResult[];
}

export const quizzesApi = {
  getQuizzes: (filters?: QuizFilters) => {
    const params = new URLSearchParams();
    if (filters?.category) params.append('category', filters.category);
    if (filters?.difficulty) params.append('difficulty', filters.difficulty);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());

    const queryString = params.toString();
    const endpoint = queryString ? `/quizzes?${queryString}` : '/quizzes';

    return api.get<QuizListResponse>(endpoint, { skipAuth: true });
  },

  getQuizById: (id: string) =>
    api.get<QuizDetail>(`/quizzes/${id}`, { skipAuth: true }),

  getCategories: () =>
    api.get<CategoriesResponse>('/quizzes/categories', { skipAuth: true }),

  submitQuiz: (quizId: string, submission: SubmitQuizDto) =>
    api.post<QuizResultDto>(`/quizzes/${quizId}/submit`, submission),

  getAttemptById: (attemptId: string) =>
    api.get<AttemptDetail>(`/attempts/me/${attemptId}`),
};
