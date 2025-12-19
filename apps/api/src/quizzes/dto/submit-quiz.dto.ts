import { createZodDto } from 'nestjs-zod';
import {
  QuizSubmissionSchema,
  QuizResultSchema,
  FeedbackLevel,
} from '@quiz-app/shared-models/models/quiz';
import { z } from 'zod';

export class SubmitQuizDto extends createZodDto(QuizSubmissionSchema) {}

export class QuizResultDto extends createZodDto(QuizResultSchema) {}

export const FEEDBACK_THRESHOLDS = {
  excellent: 90,
  good: 70,
  needs_improvement: 50,
  keep_practicing: 0,
} as const;

export const getFeedbackLevel = (
  percentage: number,
): z.infer<typeof FeedbackLevel> => {
  if (percentage >= FEEDBACK_THRESHOLDS.excellent) return 'excellent';
  if (percentage >= FEEDBACK_THRESHOLDS.good) return 'good';
  if (percentage >= FEEDBACK_THRESHOLDS.needs_improvement)
    return 'needs_improvement';
  return 'keep_practicing';
};

export const getFeedbackMessage = (
  percentage: number,
  feedbackLevel: z.infer<typeof FeedbackLevel>,
): string => {
  const messages: Record<z.infer<typeof FeedbackLevel>, string[]> = {
    excellent: [
      'Outstanding! You have mastered this topic!',
      'Excellent work! You truly understand this material.',
      'Brilliant! You aced this quiz!',
    ],
    good: [
      'Great job! You have a solid understanding.',
      'Well done! Keep building on this foundation.',
      'Nice work! You are on the right track.',
    ],
    needs_improvement: [
      'Good effort! Review the explanations to improve.',
      'You are getting there! Focus on the areas you missed.',
      'Keep practicing! You are making progress.',
    ],
    keep_practicing: [
      'Keep studying! Review the material and try again.',
      'Do not give up! Learning takes time and practice.',
      'Consider reviewing the fundamentals before retrying.',
    ],
  };

  const levelMessages = messages[feedbackLevel];
  return levelMessages[Math.floor(Math.random() * levelMessages.length)];
};
