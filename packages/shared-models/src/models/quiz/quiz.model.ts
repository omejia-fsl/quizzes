import { z } from 'zod';

export const DifficultySchema = z.enum([
  'beginner',
  'intermediate',
  'advanced',
]);
export type Difficulty = z.infer<typeof DifficultySchema>;

export const AnswerSchema = z.object({
  id: z.string(),
  text: z.string().min(1, 'Answer text is required'),
  isCorrect: z.boolean().optional(),
});

export type Answer = z.infer<typeof AnswerSchema>;

export const PublicAnswerSchema = AnswerSchema.omit({ isCorrect: true });
export type PublicAnswer = z.infer<typeof PublicAnswerSchema>;

export const QuestionSchema = z.object({
  id: z.string(),
  text: z.string().min(1, 'Question text is required'),
  explanation: z.string(),
  order: z.number().int().positive(),
  answers: z.array(AnswerSchema).min(2, 'At least 2 answers required'),
});

export type Question = z.infer<typeof QuestionSchema>;

export const PublicQuestionSchema = z.object({
  id: z.string(),
  text: z.string(),
  order: z.number(),
  answers: z.array(PublicAnswerSchema),
});

export type PublicQuestion = z.infer<typeof PublicQuestionSchema>;

export const QuizSchema = z.object({
  id: z.string(),
  title: z.string().min(1, 'Title is required').max(100),
  description: z.string().max(500),
  category: z.string().min(1, 'Category is required'),
  difficulty: DifficultySchema,
  estimatedMinutes: z.number().int().positive(),
  questionCount: z.number().int().positive(),
  isActive: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Quiz = z.infer<typeof QuizSchema>;

export const QuizSummarySchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  category: z.string(),
  difficulty: DifficultySchema,
  questionCount: z.number(),
  estimatedMinutes: z.number(),
});

export type QuizSummary = z.infer<typeof QuizSummarySchema>;

export const QuizDetailSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  category: z.string(),
  difficulty: DifficultySchema,
  estimatedMinutes: z.number(),
  questions: z.array(PublicQuestionSchema),
});

export type QuizDetail = z.infer<typeof QuizDetailSchema>;

export const QuizListResponseSchema = z.object({
  quizzes: z.array(QuizSummarySchema),
  total: z.number(),
});

export type QuizListResponse = z.infer<typeof QuizListResponseSchema>;
