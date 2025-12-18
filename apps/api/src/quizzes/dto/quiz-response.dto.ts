import { createZodDto } from 'nestjs-zod';
import {
  QuizSummarySchema,
  QuizDetailSchema,
  QuizListResponseSchema,
  DifficultySchema,
} from '@quiz-app/shared-models/models/quiz';
import { z } from 'zod';

export class QuizSummaryDto extends createZodDto(QuizSummarySchema) {}

export class QuizDetailDto extends createZodDto(QuizDetailSchema) {}

export class QuizListResponseDto extends createZodDto(QuizListResponseSchema) {}

export const QuizFiltersSchema = z.object({
  category: z.string().optional(),
  difficulty: DifficultySchema.optional(),
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(50).optional().default(10),
});

export class QuizFiltersDto extends createZodDto(QuizFiltersSchema) {}

export const CategoriesResponseSchema = z.object({
  categories: z.array(z.string()),
});

export class CategoriesResponseDto extends createZodDto(
  CategoriesResponseSchema,
) {}
