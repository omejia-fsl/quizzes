import { createZodDto } from 'nestjs-zod';
import {
  QuizAttemptSchema,
  AttemptSummarySchema,
} from '@quiz-app/shared-models/models/attempt';
import { z } from 'zod';

export class QuizAttemptDto extends createZodDto(QuizAttemptSchema) {}

export class QuizAttemptSummaryDto extends createZodDto(AttemptSummarySchema) {}

export const AttemptFiltersSchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(50).optional().default(10),
});

export class AttemptFiltersDto extends createZodDto(AttemptFiltersSchema) {}

export const UserStatsSchema = z.object({
  totalAttempts: z.number().int().nonnegative(),
  averageScore: z.number().min(0).max(100),
  bestScore: z.number().min(0).max(100),
  quizzesCompleted: z.number().int().nonnegative(),
});

export class UserStatsDto extends createZodDto(UserStatsSchema) {}
