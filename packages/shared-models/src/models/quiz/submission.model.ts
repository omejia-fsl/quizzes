import { z } from 'zod';

export const AnswerSubmissionSchema = z.object({
  questionId: z.string(),
  answerId: z.string(),
});

export type AnswerSubmission = z.infer<typeof AnswerSubmissionSchema>;

export const QuizSubmissionSchema = z.object({
  answers: z
    .array(AnswerSubmissionSchema)
    .min(1, 'At least one answer required'),
  timeSpentSeconds: z.number().int().nonnegative().optional(),
});

export type QuizSubmission = z.infer<typeof QuizSubmissionSchema>;

export const QuestionResultSchema = z.object({
  questionId: z.string(),
  selectedAnswerId: z.string(),
  correctAnswerId: z.string(),
  isCorrect: z.boolean(),
  explanation: z.string(),
});

export type QuestionResult = z.infer<typeof QuestionResultSchema>;

export const FeedbackLevel = z.enum([
  'excellent',
  'good',
  'needs_improvement',
  'keep_practicing',
]);
export type FeedbackLevelType = z.infer<typeof FeedbackLevel>;

export const QuizResultSchema = z.object({
  attemptId: z.string(),
  quizId: z.string(),
  score: z.number().int().nonnegative(),
  totalQuestions: z.number().int().positive(),
  percentage: z.number().min(0).max(100),
  feedback: z.string(),
  feedbackLevel: FeedbackLevel,
  results: z.array(QuestionResultSchema),
  completedAt: z.date(),
});

export type QuizResult = z.infer<typeof QuizResultSchema>;
