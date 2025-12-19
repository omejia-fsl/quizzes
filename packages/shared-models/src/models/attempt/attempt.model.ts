import { z } from 'zod';
import { QuizSummarySchema, DifficultySchema } from '../quiz/quiz.model';

export const AttemptAnswerSchema = z.object({
  questionId: z.string(),
  selectedAnswerId: z.string(),
  isCorrect: z.boolean(),
});

export type AttemptAnswer = z.infer<typeof AttemptAnswerSchema>;

export const QuizAttemptSchema = z.object({
  id: z.string(),
  userId: z.string(),
  quizId: z.string(),
  score: z.number().int().nonnegative(),
  totalQuestions: z.number().int().positive(),
  percentage: z.number().min(0).max(100),
  timeSpentSeconds: z.number().int().nonnegative().optional(),
  completedAt: z.date(),
  createdAt: z.date(),
});

export type QuizAttempt = z.infer<typeof QuizAttemptSchema>;

export const AttemptSummarySchema = z.object({
  id: z.string(),
  quizId: z.string(),
  quizTitle: z.string(),
  category: z.string(),
  difficulty: DifficultySchema,
  score: z.number(),
  totalQuestions: z.number(),
  percentage: z.number(),
  completedAt: z.date(),
});

export type AttemptSummary = z.infer<typeof AttemptSummarySchema>;

export const AttemptDetailSchema = z.object({
  id: z.string(),
  quiz: QuizSummarySchema,
  score: z.number(),
  totalQuestions: z.number(),
  percentage: z.number(),
  timeSpentSeconds: z.number().optional(),
  answers: z.array(AttemptAnswerSchema),
  completedAt: z.date(),
});

export type AttemptDetail = z.infer<typeof AttemptDetailSchema>;

export const UserAttemptsResponseSchema = z.object({
  attempts: z.array(AttemptSummarySchema),
  total: z.number(),
  stats: z.object({
    totalAttempts: z.number(),
    averageScore: z.number(),
    bestScore: z.number(),
    quizzesCompleted: z.number(),
  }),
});

export type UserAttemptsResponse = z.infer<typeof UserAttemptsResponseSchema>;
