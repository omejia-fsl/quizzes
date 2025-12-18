# Step 4: Quiz Submission and Scoring

## Objective

Implement the quiz submission endpoint (`POST /quizzes/:id/submit`) with automatic scoring logic. This endpoint accepts user answers, calculates the score, provides feedback, and prepares data for attempt tracking. Authentication is required for submission.

## Prerequisites

- Step 3 completed (QuizzesModule with list/get endpoints)
- Authentication module working (JWT strategy)
- Quiz schemas with `calculateScore` method

## Implementation Tasks

### 1. Create Submission DTOs (`apps/api/src/quizzes/dto/submit-quiz.dto.ts`)

```typescript
import { createZodDto } from 'nestjs-zod';
import {
  QuizSubmissionSchema,
  QuizResultSchema,
  FeedbackLevel,
} from '@quiz-app/shared-models';
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
```

### 2. Update DTO Index (`apps/api/src/quizzes/dto/index.ts`)

```typescript
export * from './quiz-response.dto';
export * from './submit-quiz.dto';
```

### 3. Create Scoring Service (`apps/api/src/quizzes/scoring.service.ts`)

Separate scoring logic for better testability.

```typescript
import { Injectable } from '@nestjs/common';
import { QuizDocument, QuestionDocument } from './schemas/quiz.interface';
import {
  getFeedbackLevel,
  getFeedbackMessage,
  FEEDBACK_THRESHOLDS,
} from './dto/submit-quiz.dto';

export interface UserAnswer {
  questionId: string;
  answerId: string;
}

export interface QuestionResult {
  questionId: string;
  selectedAnswerId: string;
  correctAnswerId: string;
  isCorrect: boolean;
  explanation: string;
}

export interface ScoringResult {
  score: number;
  totalQuestions: number;
  percentage: number;
  feedback: string;
  feedbackLevel: 'excellent' | 'good' | 'needs_improvement' | 'keep_practicing';
  results: QuestionResult[];
}

@Injectable()
export class ScoringService {
  calculateScore(quiz: QuizDocument, userAnswers: UserAnswer[]): ScoringResult {
    const results: QuestionResult[] = [];
    let correctCount = 0;

    for (const question of quiz.questions) {
      const userAnswer = userAnswers.find(
        (a) => a.questionId === question._id.toString(),
      );

      const correctAnswer = question.answers.find((a) => a.isCorrect);
      const correctAnswerId = correctAnswer?._id.toString() || '';

      const selectedAnswerId = userAnswer?.answerId || '';
      const isCorrect = selectedAnswerId === correctAnswerId;

      if (isCorrect) correctCount++;

      results.push({
        questionId: question._id.toString(),
        selectedAnswerId,
        correctAnswerId,
        isCorrect,
        explanation: question.explanation,
      });
    }

    const totalQuestions = quiz.questions.length;
    const percentage =
      totalQuestions > 0
        ? Math.round((correctCount / totalQuestions) * 100)
        : 0;

    const feedbackLevel = getFeedbackLevel(percentage);
    const feedback = getFeedbackMessage(percentage, feedbackLevel);

    return {
      score: correctCount,
      totalQuestions,
      percentage,
      feedback,
      feedbackLevel,
      results,
    };
  }

  validateAnswers(
    quiz: QuizDocument,
    userAnswers: UserAnswer[],
  ): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    const questionIds = new Set(quiz.questions.map((q) => q._id.toString()));
    const answeredQuestionIds = new Set<string>();

    for (const answer of userAnswers) {
      if (!questionIds.has(answer.questionId)) {
        errors.push(`Invalid question ID: ${answer.questionId}`);
        continue;
      }

      if (answeredQuestionIds.has(answer.questionId)) {
        errors.push(`Duplicate answer for question: ${answer.questionId}`);
        continue;
      }

      answeredQuestionIds.add(answer.questionId);

      const question = quiz.questions.find(
        (q) => q._id.toString() === answer.questionId,
      );

      if (question) {
        const answerExists = question.answers.some(
          (a) => a._id.toString() === answer.answerId,
        );

        if (!answerExists) {
          errors.push(
            `Invalid answer ID "${answer.answerId}" for question "${answer.questionId}"`,
          );
        }
      }
    }

    const unansweredQuestions = [...questionIds].filter(
      (qId) => !answeredQuestionIds.has(qId),
    );

    if (unansweredQuestions.length > 0) {
      errors.push(
        `Missing answers for ${unansweredQuestions.length} question(s)`,
      );
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}
```

### 4. Update QuizzesService (`apps/api/src/quizzes/quizzes.service.ts`)

Add submission method to the service.

```typescript
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Quiz } from './schemas/quiz.schema';
import {
  QuizDocument,
  QuizSummary,
  PublicQuiz,
} from './schemas/quiz.interface';
import { ScoringService, UserAnswer, ScoringResult } from './scoring.service';

export interface QuizListResult {
  quizzes: QuizSummary[];
  total: number;
}

export interface QuizFilters {
  category?: string;
  difficulty?: string;
  isActive?: boolean;
}

export interface PaginationOptions {
  page?: number;
  limit?: number;
}

export interface SubmissionResult extends ScoringResult {
  quizId: string;
  timeSpentSeconds?: number;
}

@Injectable()
export class QuizzesService {
  constructor(
    @InjectModel(Quiz.name) private quizModel: Model<QuizDocument>,
    private readonly scoringService: ScoringService,
  ) {}

  async findAll(
    filters: QuizFilters = {},
    pagination: PaginationOptions = {},
  ): Promise<QuizListResult> {
    const { category, difficulty, isActive = true } = filters;
    const { page = 1, limit = 10 } = pagination;
    const skip = (page - 1) * limit;

    const query: Record<string, unknown> = { isActive };

    if (category) {
      query.category = category;
    }

    if (difficulty) {
      query.difficulty = difficulty;
    }

    const [quizzes, total] = await Promise.all([
      this.quizModel
        .find(query)
        .select(
          'title description category difficulty estimatedMinutes questions',
        )
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.quizModel.countDocuments(query).exec(),
    ]);

    return {
      quizzes: quizzes.map((quiz) => quiz.toSummaryJSON()),
      total,
    };
  }

  async findById(id: string): Promise<PublicQuiz> {
    const quiz = await this.quizModel.findById(id).exec();

    if (!quiz) {
      throw new NotFoundException(`Quiz with ID "${id}" not found`);
    }

    if (!quiz.isActive) {
      throw new NotFoundException(`Quiz with ID "${id}" is not available`);
    }

    return quiz.toPublicJSON();
  }

  async findByIdInternal(id: string): Promise<QuizDocument> {
    const quiz = await this.quizModel.findById(id).exec();

    if (!quiz) {
      throw new NotFoundException(`Quiz with ID "${id}" not found`);
    }

    return quiz;
  }

  async getCategories(): Promise<string[]> {
    return this.quizModel.distinct('category', { isActive: true }).exec();
  }

  async findByCategory(
    category: string,
    pagination: PaginationOptions = {},
  ): Promise<QuizListResult> {
    return this.findAll({ category }, pagination);
  }

  async exists(id: string): Promise<boolean> {
    const count = await this.quizModel.countDocuments({ _id: id }).exec();
    return count > 0;
  }

  async submitQuiz(
    quizId: string,
    answers: UserAnswer[],
    timeSpentSeconds?: number,
  ): Promise<SubmissionResult> {
    const quiz = await this.findByIdInternal(quizId);

    if (!quiz.isActive) {
      throw new BadRequestException('This quiz is no longer available');
    }

    const validation = this.scoringService.validateAnswers(quiz, answers);

    if (!validation.valid) {
      throw new BadRequestException({
        message: 'Invalid submission',
        errors: validation.errors,
      });
    }

    const scoringResult = this.scoringService.calculateScore(quiz, answers);

    return {
      ...scoringResult,
      quizId: quiz._id.toString(),
      timeSpentSeconds,
    };
  }
}
```

### 5. Update QuizzesModule (`apps/api/src/quizzes/quizzes.module.ts`)

```typescript
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { QuizzesController } from './quizzes.controller';
import { QuizzesService } from './quizzes.service';
import { ScoringService } from './scoring.service';
import { Quiz, QuizSchema } from './schemas/quiz.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Quiz.name, schema: QuizSchema }]),
  ],
  controllers: [QuizzesController],
  providers: [QuizzesService, ScoringService],
  exports: [QuizzesService, ScoringService],
})
export class QuizzesModule {}
```

### 6. Update QuizzesController (`apps/api/src/quizzes/quizzes.controller.ts`)

Add the submission endpoint with authentication.

```typescript
import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  QuizzesService,
  QuizListResult,
  SubmissionResult,
} from './quizzes.service';
import { QuizFiltersDto, CategoriesResponseDto, SubmitQuizDto } from './dto';
import { PublicQuiz } from './schemas/quiz.interface';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

interface AuthenticatedRequest {
  user: {
    userId: string;
    email: string;
  };
}

@Controller('quizzes')
export class QuizzesController {
  constructor(private readonly quizzesService: QuizzesService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() filters: QuizFiltersDto): Promise<QuizListResult> {
    const { category, difficulty, page, limit } = filters;

    return this.quizzesService.findAll(
      { category, difficulty },
      { page, limit },
    );
  }

  @Get('categories')
  @HttpCode(HttpStatus.OK)
  async getCategories(): Promise<CategoriesResponseDto> {
    const categories = await this.quizzesService.getCategories();
    return { categories };
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string): Promise<PublicQuiz> {
    return this.quizzesService.findById(id);
  }

  @Post(':id/submit')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async submitQuiz(
    @Param('id') id: string,
    @Body() submitQuizDto: SubmitQuizDto,
    @Request() req: AuthenticatedRequest,
  ): Promise<SubmissionResult & { userId: string }> {
    const { answers, timeSpentSeconds } = submitQuizDto;

    const result = await this.quizzesService.submitQuiz(
      id,
      answers,
      timeSpentSeconds,
    );

    return {
      ...result,
      userId: req.user.userId,
    };
  }
}
```

## Files to Create/Modify

| File                                          | Action | Purpose                            |
| --------------------------------------------- | ------ | ---------------------------------- |
| `apps/api/src/quizzes/dto/submit-quiz.dto.ts` | Create | Submission DTOs and feedback logic |
| `apps/api/src/quizzes/dto/index.ts`           | Modify | Export new DTOs                    |
| `apps/api/src/quizzes/scoring.service.ts`     | Create | Scoring logic service              |
| `apps/api/src/quizzes/quizzes.service.ts`     | Modify | Add submitQuiz method              |
| `apps/api/src/quizzes/quizzes.module.ts`      | Modify | Register ScoringService            |
| `apps/api/src/quizzes/quizzes.controller.ts`  | Modify | Add submit endpoint                |

## API Endpoint

### POST /quizzes/:id/submit

**Description:** Submit quiz answers and receive score with feedback.

**Authentication:** Required (Bearer token)

**Request Body:**

```json
{
  "answers": [
    {
      "questionId": "507f1f77bcf86cd799439012",
      "answerId": "507f1f77bcf86cd799439013"
    },
    {
      "questionId": "507f1f77bcf86cd799439015",
      "answerId": "507f1f77bcf86cd799439016"
    }
  ],
  "timeSpentSeconds": 420
}
```

**Response (200):**

```json
{
  "quizId": "507f1f77bcf86cd799439011",
  "userId": "507f1f77bcf86cd799439020",
  "score": 8,
  "totalQuestions": 10,
  "percentage": 80,
  "feedback": "Great job! You have a solid understanding.",
  "feedbackLevel": "good",
  "results": [
    {
      "questionId": "507f1f77bcf86cd799439012",
      "selectedAnswerId": "507f1f77bcf86cd799439013",
      "correctAnswerId": "507f1f77bcf86cd799439013",
      "isCorrect": true,
      "explanation": "An AI agent is software that can perceive its environment and take actions to achieve goals."
    }
  ],
  "timeSpentSeconds": 420
}
```

**Response (400 - Invalid Submission):**

```json
{
  "statusCode": 400,
  "message": "Invalid submission",
  "errors": [
    "Invalid question ID: invalid-id",
    "Missing answers for 2 question(s)"
  ]
}
```

**Response (401 - Unauthorized):**

```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

**Response (404 - Quiz Not Found):**

```json
{
  "statusCode": 404,
  "message": "Quiz with ID \"invalid-id\" not found"
}
```

## Testing Approach

### 1. ScoringService Unit Tests

Create `apps/api/src/quizzes/scoring.service.spec.ts`:

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { ScoringService } from './scoring.service';
import { QuizDocument } from './schemas/quiz.interface';
import { Types } from 'mongoose';

describe('ScoringService', () => {
  let service: ScoringService;

  const createMockQuiz = (): Partial<QuizDocument> => ({
    _id: new Types.ObjectId('507f1f77bcf86cd799439011'),
    questions: [
      {
        _id: new Types.ObjectId('507f1f77bcf86cd799439012'),
        text: 'Question 1',
        explanation: 'Explanation 1',
        order: 1,
        answers: [
          {
            _id: new Types.ObjectId('507f1f77bcf86cd799439013'),
            text: 'Correct',
            isCorrect: true,
          },
          {
            _id: new Types.ObjectId('507f1f77bcf86cd799439014'),
            text: 'Wrong',
            isCorrect: false,
          },
        ],
      },
      {
        _id: new Types.ObjectId('507f1f77bcf86cd799439015'),
        text: 'Question 2',
        explanation: 'Explanation 2',
        order: 2,
        answers: [
          {
            _id: new Types.ObjectId('507f1f77bcf86cd799439016'),
            text: 'Wrong',
            isCorrect: false,
          },
          {
            _id: new Types.ObjectId('507f1f77bcf86cd799439017'),
            text: 'Correct',
            isCorrect: true,
          },
        ],
      },
    ],
  });

  beforeEach(() => {
    service = new ScoringService();
  });

  describe('calculateScore', () => {
    it('should return 100% for all correct answers', () => {
      const quiz = createMockQuiz() as QuizDocument;
      const answers = [
        {
          questionId: '507f1f77bcf86cd799439012',
          answerId: '507f1f77bcf86cd799439013',
        },
        {
          questionId: '507f1f77bcf86cd799439015',
          answerId: '507f1f77bcf86cd799439017',
        },
      ];

      const result = service.calculateScore(quiz, answers);

      expect(result.score).toBe(2);
      expect(result.totalQuestions).toBe(2);
      expect(result.percentage).toBe(100);
      expect(result.feedbackLevel).toBe('excellent');
    });

    it('should return 0% for all wrong answers', () => {
      const quiz = createMockQuiz() as QuizDocument;
      const answers = [
        {
          questionId: '507f1f77bcf86cd799439012',
          answerId: '507f1f77bcf86cd799439014',
        },
        {
          questionId: '507f1f77bcf86cd799439015',
          answerId: '507f1f77bcf86cd799439016',
        },
      ];

      const result = service.calculateScore(quiz, answers);

      expect(result.score).toBe(0);
      expect(result.percentage).toBe(0);
      expect(result.feedbackLevel).toBe('keep_practicing');
    });

    it('should return 50% for half correct answers', () => {
      const quiz = createMockQuiz() as QuizDocument;
      const answers = [
        {
          questionId: '507f1f77bcf86cd799439012',
          answerId: '507f1f77bcf86cd799439013',
        },
        {
          questionId: '507f1f77bcf86cd799439015',
          answerId: '507f1f77bcf86cd799439016',
        },
      ];

      const result = service.calculateScore(quiz, answers);

      expect(result.score).toBe(1);
      expect(result.percentage).toBe(50);
      expect(result.feedbackLevel).toBe('needs_improvement');
    });

    it('should include explanations in results', () => {
      const quiz = createMockQuiz() as QuizDocument;
      const answers = [
        {
          questionId: '507f1f77bcf86cd799439012',
          answerId: '507f1f77bcf86cd799439013',
        },
        {
          questionId: '507f1f77bcf86cd799439015',
          answerId: '507f1f77bcf86cd799439017',
        },
      ];

      const result = service.calculateScore(quiz, answers);

      expect(result.results[0].explanation).toBe('Explanation 1');
      expect(result.results[1].explanation).toBe('Explanation 2');
    });
  });

  describe('validateAnswers', () => {
    it('should return valid for correct answer format', () => {
      const quiz = createMockQuiz() as QuizDocument;
      const answers = [
        {
          questionId: '507f1f77bcf86cd799439012',
          answerId: '507f1f77bcf86cd799439013',
        },
        {
          questionId: '507f1f77bcf86cd799439015',
          answerId: '507f1f77bcf86cd799439017',
        },
      ];

      const result = service.validateAnswers(quiz, answers);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should detect invalid question IDs', () => {
      const quiz = createMockQuiz() as QuizDocument;
      const answers = [
        { questionId: 'invalid-id', answerId: '507f1f77bcf86cd799439013' },
      ];

      const result = service.validateAnswers(quiz, answers);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Invalid question ID: invalid-id');
    });

    it('should detect invalid answer IDs', () => {
      const quiz = createMockQuiz() as QuizDocument;
      const answers = [
        { questionId: '507f1f77bcf86cd799439012', answerId: 'invalid-id' },
        {
          questionId: '507f1f77bcf86cd799439015',
          answerId: '507f1f77bcf86cd799439017',
        },
      ];

      const result = service.validateAnswers(quiz, answers);

      expect(result.valid).toBe(false);
      expect(result.errors[0]).toContain('Invalid answer ID');
    });

    it('should detect duplicate answers', () => {
      const quiz = createMockQuiz() as QuizDocument;
      const answers = [
        {
          questionId: '507f1f77bcf86cd799439012',
          answerId: '507f1f77bcf86cd799439013',
        },
        {
          questionId: '507f1f77bcf86cd799439012',
          answerId: '507f1f77bcf86cd799439014',
        },
      ];

      const result = service.validateAnswers(quiz, answers);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain(
        'Duplicate answer for question: 507f1f77bcf86cd799439012',
      );
    });

    it('should detect missing answers', () => {
      const quiz = createMockQuiz() as QuizDocument;
      const answers = [
        {
          questionId: '507f1f77bcf86cd799439012',
          answerId: '507f1f77bcf86cd799439013',
        },
      ];

      const result = service.validateAnswers(quiz, answers);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Missing answers for 1 question(s)');
    });
  });
});
```

### 2. Manual API Testing

```bash
# First, get an auth token
TOKEN=$(curl -s -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "password123"}' \
  | jq -r '.access_token')

# Submit quiz answers
curl -X POST http://localhost:3000/quizzes/{quiz-id}/submit \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "answers": [
      {"questionId": "q1-id", "answerId": "a1-id"},
      {"questionId": "q2-id", "answerId": "a2-id"}
    ],
    "timeSpentSeconds": 300
  }'

# Test without auth (should fail)
curl -X POST http://localhost:3000/quizzes/{quiz-id}/submit \
  -H "Content-Type: application/json" \
  -d '{"answers": []}'
```

## Success Criteria

- [ ] POST /quizzes/:id/submit requires authentication
- [ ] Submission validates all question IDs exist
- [ ] Submission validates all answer IDs exist
- [ ] Score calculation is accurate
- [ ] Feedback level matches score percentage
- [ ] Explanations included in results
- [ ] Invalid submissions return 400 with error details
- [ ] ScoringService unit tests pass
- [ ] Manual API testing confirms correct behavior

## Feedback Level Thresholds

| Score Range | Level             | Example Messages                                    |
| ----------- | ----------------- | --------------------------------------------------- |
| 90-100%     | excellent         | "Outstanding! You have mastered this topic!"        |
| 70-89%      | good              | "Great job! You have a solid understanding."        |
| 50-69%      | needs_improvement | "Good effort! Review the explanations to improve."  |
| 0-49%       | keep_practicing   | "Keep studying! Review the material and try again." |

## Notes

### Validation Strategy

1. **Question Validation:** Ensures all submitted question IDs exist in the quiz
2. **Answer Validation:** Ensures all submitted answer IDs exist for their questions
3. **Duplicate Detection:** Prevents multiple answers for the same question
4. **Completeness Check:** Verifies all questions are answered

### Why Separate ScoringService?

- **Testability:** Pure logic without database dependencies
- **Reusability:** Can be used for practice mode, analytics
- **Single Responsibility:** Clear separation of concerns

### Time Tracking

- `timeSpentSeconds` is optional in submission
- Validated as non-negative integer
- Useful for analytics and user experience features

## Troubleshooting

**Issue:** 401 Unauthorized

- **Fix:** Include valid Bearer token in Authorization header
- Verify token is not expired

**Issue:** Invalid question/answer IDs

- **Fix:** Use exact ObjectId strings from GET /quizzes/:id response
- Check ID format (24-character hex string)

**Issue:** Score calculation incorrect

- **Fix:** Verify `isCorrect` is set on exactly one answer per question
- Check answer ID matching logic

## Next Step

Proceed to **Step 5: Attempt Tracking Schema** to create the QuizAttempt schema for persisting user submission history.
