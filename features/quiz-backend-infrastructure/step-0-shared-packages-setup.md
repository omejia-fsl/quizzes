# Step 0: Shared Packages Setup for Quiz Infrastructure

## Objective

Extend the shared packages with quiz-related Zod schemas and TypeScript types. These schemas will be used by both the backend (for validation and DTOs) and frontend (for form validation and type safety).

## Prerequisites

- Step 0 from `feature-init-app` completed (shared packages structure exists)
- Zod installed at root level
- Path aliases configured in tsconfig files

## Implementation Tasks

### 1. Create Quiz Model (`packages/shared-models/src/models/quiz/quiz.model.ts`)

```typescript
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
```

### 2. Create Quiz Submission Models (`packages/shared-models/src/models/quiz/submission.model.ts`)

```typescript
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
```

### 3. Create Attempt Models (`packages/shared-models/src/models/attempt/attempt.model.ts`)

```typescript
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
```

### 4. Create Index Files for New Models

**`packages/shared-models/src/models/quiz/index.ts`:**

```typescript
export * from './quiz.model';
export * from './submission.model';
```

**`packages/shared-models/src/models/attempt/index.ts`:**

```typescript
export * from './attempt.model';
```

### 5. Update Main Barrel Export (`packages/shared-models/src/index.ts`)

Add the new exports:

```typescript
export * from './models/auth';
export * from './models/user';
export * from './models/quiz';
export * from './models/attempt';
```

### 6. Update Query Keys (`packages/shared-types/src/query-keys/query-keys.ts`)

Add quiz-related query keys:

```typescript
export enum QueryKeys {
  // Auth
  AUTH_PROFILE = 'auth.profile',

  // Users
  USERS = 'users',
  USER_BY_ID = 'users.byId',

  // Quizzes
  QUIZZES = 'quizzes',
  QUIZ_BY_ID = 'quizzes.byId',
  QUIZ_CATEGORIES = 'quizzes.categories',

  // Attempts
  USER_ATTEMPTS = 'attempts.user',
  ATTEMPT_BY_ID = 'attempts.byId',

  // Dashboard
  DASHBOARD = 'dashboard',
  USER_PROGRESS = 'progress.user',

  // Leaderboard
  LEADERBOARD = 'leaderboard',
  LEADERBOARD_BY_QUIZ = 'leaderboard.byQuiz',

  // Challenges
  DAILY_CHALLENGE = 'challenges.daily',
  WEEKLY_CHALLENGE = 'challenges.weekly',
}

export const createQueryKey = {
  userById: (id: string) => [QueryKeys.USER_BY_ID, id] as const,
  quizById: (id: string) => [QueryKeys.QUIZ_BY_ID, id] as const,
  attemptById: (id: string) => [QueryKeys.ATTEMPT_BY_ID, id] as const,
  userAttempts: (userId: string) => [QueryKeys.USER_ATTEMPTS, userId] as const,
  leaderboardByQuiz: (quizId: string) =>
    [QueryKeys.LEADERBOARD_BY_QUIZ, quizId] as const,
};
```

### 7. Add API Route Constants (`packages/shared-types/src/api-routes/api-routes.ts`)

Create a new file for API route constants:

```typescript
export const API_ROUTES = {
  // Auth
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    PROFILE: '/auth/profile',
  },

  // Quizzes
  QUIZZES: {
    LIST: '/quizzes',
    BY_ID: (id: string) => `/quizzes/${id}`,
    SUBMIT: (id: string) => `/quizzes/${id}/submit`,
    CATEGORIES: '/quizzes/categories',
  },

  // User Attempts
  ATTEMPTS: {
    USER_HISTORY: (userId: string) => `/users/${userId}/attempts`,
    DETAIL: (userId: string, attemptId: string) =>
      `/users/${userId}/attempts/${attemptId}`,
  },
} as const;
```

### 8. Update Shared Types Index

**`packages/shared-types/src/index.ts`:**

```typescript
export * from './query-keys';
export * from './api-routes/api-routes';
```

**Create `packages/shared-types/src/api-routes/index.ts`:**

```typescript
export * from './api-routes';
```

## Files to Create/Modify

| File                                                         | Action | Purpose                        |
| ------------------------------------------------------------ | ------ | ------------------------------ |
| `packages/shared-models/src/models/quiz/quiz.model.ts`       | Create | Quiz, Question, Answer schemas |
| `packages/shared-models/src/models/quiz/submission.model.ts` | Create | Submission and result schemas  |
| `packages/shared-models/src/models/quiz/index.ts`            | Create | Barrel export                  |
| `packages/shared-models/src/models/attempt/attempt.model.ts` | Create | Attempt tracking schemas       |
| `packages/shared-models/src/models/attempt/index.ts`         | Create | Barrel export                  |
| `packages/shared-models/src/index.ts`                        | Modify | Add new exports                |
| `packages/shared-types/src/query-keys/query-keys.ts`         | Modify | Add quiz query keys            |
| `packages/shared-types/src/api-routes/api-routes.ts`         | Create | API route constants            |
| `packages/shared-types/src/api-routes/index.ts`              | Create | Barrel export                  |
| `packages/shared-types/src/index.ts`                         | Modify | Add api-routes export          |

## Testing Approach

1. **TypeScript Compilation:**

   ```bash
   pnpm typecheck
   ```

2. **Import Verification:**
   Create a test file to verify imports work:

   ```typescript
   // Test in apps/api/src/test-imports.ts (delete after testing)
   import {
     QuizSchema,
     QuizSubmissionSchema,
     QuizAttemptSchema,
   } from '@quiz-app/shared-models';
   import { QueryKeys, API_ROUTES } from '@quiz-app/shared-types';

   console.log('Quiz schema:', QuizSchema);
   console.log('Query key:', QueryKeys.QUIZZES);
   console.log('API route:', API_ROUTES.QUIZZES.LIST);
   ```

3. **Unit Tests:**
   Create tests for schema validation:

   ```typescript
   // packages/shared-models/src/models/quiz/quiz.model.test.ts
   import { describe, it, expect } from 'vitest';
   import { QuizSubmissionSchema, DifficultySchema } from './quiz.model';

   describe('Quiz Models', () => {
     describe('DifficultySchema', () => {
       it('should accept valid difficulty levels', () => {
         expect(DifficultySchema.parse('beginner')).toBe('beginner');
         expect(DifficultySchema.parse('intermediate')).toBe('intermediate');
         expect(DifficultySchema.parse('advanced')).toBe('advanced');
       });

       it('should reject invalid difficulty levels', () => {
         expect(() => DifficultySchema.parse('expert')).toThrow();
       });
     });
   });
   ```

## Success Criteria

- [ ] All new model files created in correct locations
- [ ] TypeScript compilation succeeds without errors
- [ ] Imports work in both api and ui apps
- [ ] Zod schemas validate correctly
- [ ] Query keys include quiz-related entries
- [ ] API routes constants are accessible

## Notes

- The `isCorrect` field is optional in `AnswerSchema` to support both internal (with correct marking) and public (without) representations
- `PublicQuestionSchema` and `PublicAnswerSchema` are used for API responses to avoid exposing correct answers
- Feedback levels enable consistent UI treatment of quiz results
- Stats object in `UserAttemptsResponse` supports dashboard features

## Troubleshooting

**Issue:** Cannot find module '@quiz-app/shared-models'

- **Fix:** Ensure path aliases are configured in all tsconfig files
- Restart TypeScript server in your IDE

**Issue:** Zod parsing errors

- **Fix:** Check that all required fields are provided
- Verify date fields use Date objects, not strings

**Issue:** Circular dependencies

- **Fix:** Ensure models import from specific files, not barrel exports within the same package

## Next Step

Proceed to **Step 1: Quiz and Question Mongoose Schemas** to create the database models.
