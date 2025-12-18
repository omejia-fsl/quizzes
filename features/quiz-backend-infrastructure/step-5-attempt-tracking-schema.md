# Step 5: Attempt Tracking Schema

## Objective

Create the QuizAttempt and AttemptAnswer schemas to persist user quiz submissions. This enables tracking quiz history, displaying past results, and building analytics/leaderboard features.

## Prerequisites

- Step 4 completed (Quiz submission and scoring)
- MongoDB connection working
- User schema exists and working

## Implementation Tasks

### 1. Create AttemptAnswer Schema (`apps/api/src/attempts/schemas/attempt-answer.schema.ts`)

```typescript
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ _id: false })
export class AttemptAnswer {
  @Prop({ type: Types.ObjectId, required: true })
  questionId!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true })
  selectedAnswerId!: Types.ObjectId;

  @Prop({ required: true })
  isCorrect!: boolean;
}

export const AttemptAnswerSchema = SchemaFactory.createForClass(AttemptAnswer);
```

### 2. Create QuizAttempt Schema (`apps/api/src/attempts/schemas/quiz-attempt.schema.ts`)

```typescript
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { AttemptAnswer, AttemptAnswerSchema } from './attempt-answer.schema';

export type QuizAttemptDocument = QuizAttempt & Document;

@Schema({ timestamps: true })
export class QuizAttempt {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  userId!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Quiz', required: true, index: true })
  quizId!: Types.ObjectId;

  @Prop({ type: [AttemptAnswerSchema], required: true })
  answers!: AttemptAnswer[];

  @Prop({ required: true, min: 0 })
  score!: number;

  @Prop({ required: true, min: 1 })
  totalQuestions!: number;

  @Prop({ required: true, min: 0, max: 100 })
  percentage!: number;

  @Prop({ min: 0 })
  timeSpentSeconds?: number;

  @Prop({ required: true, default: Date.now })
  completedAt!: Date;

  @Prop({ default: Date.now })
  createdAt!: Date;

  @Prop({ default: Date.now })
  updatedAt!: Date;
}

export const QuizAttemptSchema = SchemaFactory.createForClass(QuizAttempt);

QuizAttemptSchema.index({ userId: 1, completedAt: -1 });
QuizAttemptSchema.index({ quizId: 1, percentage: -1 });
QuizAttemptSchema.index({ userId: 1, quizId: 1 });
```

### 3. Create Schema Interface (`apps/api/src/attempts/schemas/quiz-attempt.interface.ts`)

```typescript
import { Document, Types } from 'mongoose';

export interface AttemptAnswerDocument {
  questionId: Types.ObjectId;
  selectedAnswerId: Types.ObjectId;
  isCorrect: boolean;
}

export interface QuizAttemptDocument extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  quizId: Types.ObjectId;
  answers: AttemptAnswerDocument[];
  score: number;
  totalQuestions: number;
  percentage: number;
  timeSpentSeconds?: number;
  completedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface AttemptSummary {
  id: string;
  quizId: string;
  quizTitle: string;
  category: string;
  difficulty: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  completedAt: Date;
}

export interface AttemptDetail {
  id: string;
  userId: string;
  quizId: string;
  quizTitle: string;
  quizCategory: string;
  quizDifficulty: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  timeSpentSeconds?: number;
  answers: AttemptAnswerDocument[];
  completedAt: Date;
}

export interface UserStats {
  totalAttempts: number;
  averageScore: number;
  bestScore: number;
  quizzesCompleted: number;
}
```

### 4. Create Schema Index File (`apps/api/src/attempts/schemas/index.ts`)

```typescript
export * from './attempt-answer.schema';
export * from './quiz-attempt.schema';
export * from './quiz-attempt.interface';
```

### 5. Create AttemptsService (`apps/api/src/attempts/attempts.service.ts`)

```typescript
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { QuizAttempt } from './schemas/quiz-attempt.schema';
import {
  QuizAttemptDocument,
  AttemptSummary,
  AttemptDetail,
  UserStats,
} from './schemas/quiz-attempt.interface';
import { QuizzesService, SubmissionResult } from '../quizzes/quizzes.service';

export interface CreateAttemptDto {
  userId: string;
  quizId: string;
  answers: Array<{
    questionId: string;
    selectedAnswerId: string;
    isCorrect: boolean;
  }>;
  score: number;
  totalQuestions: number;
  percentage: number;
  timeSpentSeconds?: number;
}

export interface UserAttemptsResult {
  attempts: AttemptSummary[];
  total: number;
  stats: UserStats;
}

@Injectable()
export class AttemptsService {
  constructor(
    @InjectModel(QuizAttempt.name)
    private attemptModel: Model<QuizAttemptDocument>,
    private readonly quizzesService: QuizzesService,
  ) {}

  async create(data: CreateAttemptDto): Promise<QuizAttemptDocument> {
    const attempt = new this.attemptModel({
      userId: new Types.ObjectId(data.userId),
      quizId: new Types.ObjectId(data.quizId),
      answers: data.answers.map((a) => ({
        questionId: new Types.ObjectId(a.questionId),
        selectedAnswerId: new Types.ObjectId(a.selectedAnswerId),
        isCorrect: a.isCorrect,
      })),
      score: data.score,
      totalQuestions: data.totalQuestions,
      percentage: data.percentage,
      timeSpentSeconds: data.timeSpentSeconds,
      completedAt: new Date(),
    });

    return attempt.save();
  }

  async createFromSubmission(
    userId: string,
    submission: SubmissionResult,
  ): Promise<QuizAttemptDocument> {
    return this.create({
      userId,
      quizId: submission.quizId,
      answers: submission.results.map((r) => ({
        questionId: r.questionId,
        selectedAnswerId: r.selectedAnswerId,
        isCorrect: r.isCorrect,
      })),
      score: submission.score,
      totalQuestions: submission.totalQuestions,
      percentage: submission.percentage,
      timeSpentSeconds: submission.timeSpentSeconds,
    });
  }

  async findByUser(
    userId: string,
    page = 1,
    limit = 10,
  ): Promise<UserAttemptsResult> {
    const skip = (page - 1) * limit;
    const userObjectId = new Types.ObjectId(userId);

    const [attempts, total, stats] = await Promise.all([
      this.attemptModel
        .find({ userId: userObjectId })
        .sort({ completedAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('quizId', 'title category difficulty')
        .exec(),
      this.attemptModel.countDocuments({ userId: userObjectId }).exec(),
      this.getUserStats(userId),
    ]);

    const summaries: AttemptSummary[] = attempts.map((attempt) => {
      const quiz = attempt.quizId as any;
      return {
        id: attempt._id.toString(),
        quizId: quiz._id.toString(),
        quizTitle: quiz.title || 'Unknown Quiz',
        category: quiz.category || 'Unknown',
        difficulty: quiz.difficulty || 'unknown',
        score: attempt.score,
        totalQuestions: attempt.totalQuestions,
        percentage: attempt.percentage,
        completedAt: attempt.completedAt,
      };
    });

    return {
      attempts: summaries,
      total,
      stats,
    };
  }

  async findById(userId: string, attemptId: string): Promise<AttemptDetail> {
    const attempt = await this.attemptModel
      .findOne({
        _id: new Types.ObjectId(attemptId),
        userId: new Types.ObjectId(userId),
      })
      .populate('quizId', 'title category difficulty')
      .exec();

    if (!attempt) {
      throw new NotFoundException(
        `Attempt with ID "${attemptId}" not found for this user`,
      );
    }

    const quiz = attempt.quizId as any;

    return {
      id: attempt._id.toString(),
      userId: attempt.userId.toString(),
      quizId: quiz._id.toString(),
      quizTitle: quiz.title || 'Unknown Quiz',
      quizCategory: quiz.category || 'Unknown',
      quizDifficulty: quiz.difficulty || 'unknown',
      score: attempt.score,
      totalQuestions: attempt.totalQuestions,
      percentage: attempt.percentage,
      timeSpentSeconds: attempt.timeSpentSeconds,
      answers: attempt.answers,
      completedAt: attempt.completedAt,
    };
  }

  async getUserStats(userId: string): Promise<UserStats> {
    const userObjectId = new Types.ObjectId(userId);

    const [aggregateResult, quizCount] = await Promise.all([
      this.attemptModel
        .aggregate([
          { $match: { userId: userObjectId } },
          {
            $group: {
              _id: null,
              totalAttempts: { $sum: 1 },
              averageScore: { $avg: '$percentage' },
              bestScore: { $max: '$percentage' },
            },
          },
        ])
        .exec(),
      this.attemptModel
        .distinct('quizId', { userId: userObjectId })
        .then((ids) => ids.length),
    ]);

    const stats = aggregateResult[0];

    return {
      totalAttempts: stats?.totalAttempts || 0,
      averageScore: Math.round(stats?.averageScore || 0),
      bestScore: stats?.bestScore || 0,
      quizzesCompleted: quizCount,
    };
  }

  async getQuizAttemptsByUser(
    userId: string,
    quizId: string,
  ): Promise<QuizAttemptDocument[]> {
    return this.attemptModel
      .find({
        userId: new Types.ObjectId(userId),
        quizId: new Types.ObjectId(quizId),
      })
      .sort({ completedAt: -1 })
      .exec();
  }

  async getQuizLeaderboard(
    quizId: string,
    limit = 10,
  ): Promise<
    Array<{
      rank: number;
      userId: string;
      percentage: number;
      completedAt: Date;
    }>
  > {
    const results = await this.attemptModel
      .aggregate([
        { $match: { quizId: new Types.ObjectId(quizId) } },
        { $sort: { percentage: -1, completedAt: 1 } },
        {
          $group: {
            _id: '$userId',
            percentage: { $first: '$percentage' },
            completedAt: { $first: '$completedAt' },
          },
        },
        { $sort: { percentage: -1, completedAt: 1 } },
        { $limit: limit },
      ])
      .exec();

    return results.map((r, index) => ({
      rank: index + 1,
      userId: r._id.toString(),
      percentage: r.percentage,
      completedAt: r.completedAt,
    }));
  }
}
```

### 6. Create AttemptsModule (`apps/api/src/attempts/attempts.module.ts`)

```typescript
import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AttemptsService } from './attempts.service';
import { QuizAttempt, QuizAttemptSchema } from './schemas/quiz-attempt.schema';
import { QuizzesModule } from '../quizzes/quizzes.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: QuizAttempt.name, schema: QuizAttemptSchema },
    ]),
    forwardRef(() => QuizzesModule),
  ],
  providers: [AttemptsService],
  exports: [AttemptsService],
})
export class AttemptsModule {}
```

### 7. Create Module Index (`apps/api/src/attempts/index.ts`)

```typescript
export * from './attempts.module';
export * from './attempts.service';
export * from './schemas';
```

### 8. Create Directory Structure

```bash
mkdir -p apps/api/src/attempts/schemas
mkdir -p apps/api/src/attempts/dto
```

### 9. Update QuizzesModule for Circular Dependency

Update `apps/api/src/quizzes/quizzes.module.ts`:

```typescript
import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { QuizzesController } from './quizzes.controller';
import { QuizzesService } from './quizzes.service';
import { ScoringService } from './scoring.service';
import { Quiz, QuizSchema } from './schemas/quiz.schema';
import { AttemptsModule } from '../attempts/attempts.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Quiz.name, schema: QuizSchema }]),
    forwardRef(() => AttemptsModule),
  ],
  controllers: [QuizzesController],
  providers: [QuizzesService, ScoringService],
  exports: [QuizzesService, ScoringService],
})
export class QuizzesModule {}
```

### 10. Update QuizzesController to Save Attempts

Update `apps/api/src/quizzes/quizzes.controller.ts`:

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
  Inject,
  forwardRef,
} from '@nestjs/common';
import {
  QuizzesService,
  QuizListResult,
  SubmissionResult,
} from './quizzes.service';
import { QuizFiltersDto, CategoriesResponseDto, SubmitQuizDto } from './dto';
import { PublicQuiz } from './schemas/quiz.interface';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AttemptsService } from '../attempts/attempts.service';

interface AuthenticatedRequest {
  user: {
    userId: string;
    email: string;
  };
}

interface SubmissionResponse extends SubmissionResult {
  attemptId: string;
  userId: string;
}

@Controller('quizzes')
export class QuizzesController {
  constructor(
    private readonly quizzesService: QuizzesService,
    @Inject(forwardRef(() => AttemptsService))
    private readonly attemptsService: AttemptsService,
  ) {}

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
  ): Promise<SubmissionResponse> {
    const { answers, timeSpentSeconds } = submitQuizDto;
    const userId = req.user.userId;

    const result = await this.quizzesService.submitQuiz(
      id,
      answers,
      timeSpentSeconds,
    );

    const attempt = await this.attemptsService.createFromSubmission(
      userId,
      result,
    );

    return {
      ...result,
      attemptId: attempt._id.toString(),
      userId,
    };
  }
}
```

### 11. Register AttemptsModule in AppModule

Update `apps/api/src/app.module.ts`:

```typescript
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { QuizzesModule } from './quizzes/quizzes.module';
import { AttemptsModule } from './attempts/attempts.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '../../.env',
    }),
    DatabaseModule,
    UsersModule,
    AuthModule,
    QuizzesModule,
    AttemptsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

## Files to Create/Modify

| File                                                      | Action | Purpose                           |
| --------------------------------------------------------- | ------ | --------------------------------- |
| `apps/api/src/attempts/schemas/attempt-answer.schema.ts`  | Create | Embedded answer document          |
| `apps/api/src/attempts/schemas/quiz-attempt.schema.ts`    | Create | Main attempt collection           |
| `apps/api/src/attempts/schemas/quiz-attempt.interface.ts` | Create | TypeScript interfaces             |
| `apps/api/src/attempts/schemas/index.ts`                  | Create | Barrel export                     |
| `apps/api/src/attempts/attempts.service.ts`               | Create | Business logic                    |
| `apps/api/src/attempts/attempts.module.ts`                | Create | Module definition                 |
| `apps/api/src/attempts/index.ts`                          | Create | Module barrel export              |
| `apps/api/src/quizzes/quizzes.module.ts`                  | Modify | Add forwardRef for AttemptsModule |
| `apps/api/src/quizzes/quizzes.controller.ts`              | Modify | Save attempt on submission        |
| `apps/api/src/app.module.ts`                              | Modify | Import AttemptsModule             |

## Database Indexes

| Collection   | Index                     | Purpose                   |
| ------------ | ------------------------- | ------------------------- |
| quizattempts | `userId`                  | Fast user history queries |
| quizattempts | `quizId`                  | Fast quiz statistics      |
| quizattempts | `{ userId, completedAt }` | User history with sorting |
| quizattempts | `{ quizId, percentage }`  | Leaderboard queries       |
| quizattempts | `{ userId, quizId }`      | User's attempts per quiz  |

## Testing Approach

### 1. AttemptsService Unit Tests

Create `apps/api/src/attempts/attempts.service.spec.ts`:

```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { AttemptsService } from './attempts.service';
import { QuizAttempt } from './schemas/quiz-attempt.schema';
import { QuizzesService } from '../quizzes/quizzes.service';
import { Types } from 'mongoose';

describe('AttemptsService', () => {
  let service: AttemptsService;
  let mockAttemptModel: any;

  const mockQuizzesService = {
    findByIdInternal: vi.fn(),
  };

  const mockAttempt = {
    _id: new Types.ObjectId(),
    userId: new Types.ObjectId(),
    quizId: {
      _id: new Types.ObjectId(),
      title: 'Test Quiz',
      category: 'Testing',
      difficulty: 'beginner',
    },
    answers: [],
    score: 8,
    totalQuestions: 10,
    percentage: 80,
    completedAt: new Date(),
    save: vi.fn().mockResolvedValue(this),
  };

  beforeEach(async () => {
    mockAttemptModel = {
      find: vi.fn().mockReturnThis(),
      findOne: vi.fn().mockReturnThis(),
      countDocuments: vi.fn().mockReturnThis(),
      distinct: vi.fn().mockReturnThis(),
      aggregate: vi.fn().mockReturnThis(),
      sort: vi.fn().mockReturnThis(),
      skip: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      populate: vi.fn().mockReturnThis(),
      exec: vi.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AttemptsService,
        {
          provide: getModelToken(QuizAttempt.name),
          useValue: mockAttemptModel,
        },
        {
          provide: QuizzesService,
          useValue: mockQuizzesService,
        },
      ],
    }).compile();

    service = module.get<AttemptsService>(AttemptsService);
  });

  describe('findByUser', () => {
    it('should return paginated user attempts with stats', async () => {
      mockAttemptModel.exec
        .mockResolvedValueOnce([mockAttempt])
        .mockResolvedValueOnce(1);

      mockAttemptModel.aggregate.mockReturnValue({
        exec: vi
          .fn()
          .mockResolvedValue([
            { totalAttempts: 1, averageScore: 80, bestScore: 80 },
          ]),
      });

      mockAttemptModel.distinct.mockReturnValue({
        then: vi
          .fn()
          .mockImplementation((cb) => Promise.resolve(cb(['quiz1']))),
      });

      const result = await service.findByUser(
        mockAttempt.userId.toString(),
        1,
        10,
      );

      expect(result.attempts).toHaveLength(1);
      expect(result.total).toBe(1);
      expect(result.stats).toBeDefined();
    });
  });

  describe('getUserStats', () => {
    it('should calculate user statistics', async () => {
      mockAttemptModel.aggregate.mockReturnValue({
        exec: vi
          .fn()
          .mockResolvedValue([
            { totalAttempts: 5, averageScore: 75.5, bestScore: 100 },
          ]),
      });

      mockAttemptModel.distinct.mockReturnValue({
        then: vi
          .fn()
          .mockImplementation((cb) =>
            Promise.resolve(cb(['quiz1', 'quiz2', 'quiz3'])),
          ),
      });

      const userId = new Types.ObjectId().toString();
      const stats = await service.getUserStats(userId);

      expect(stats.totalAttempts).toBe(5);
      expect(stats.averageScore).toBe(76);
      expect(stats.bestScore).toBe(100);
      expect(stats.quizzesCompleted).toBe(3);
    });

    it('should return zero stats for new user', async () => {
      mockAttemptModel.aggregate.mockReturnValue({
        exec: vi.fn().mockResolvedValue([]),
      });

      mockAttemptModel.distinct.mockReturnValue({
        then: vi.fn().mockImplementation((cb) => Promise.resolve(cb([]))),
      });

      const userId = new Types.ObjectId().toString();
      const stats = await service.getUserStats(userId);

      expect(stats.totalAttempts).toBe(0);
      expect(stats.averageScore).toBe(0);
      expect(stats.bestScore).toBe(0);
      expect(stats.quizzesCompleted).toBe(0);
    });
  });
});
```

### 2. Manual Verification

```bash
# Start the API
pnpm dev:api

# Submit a quiz (saves attempt)
TOKEN="your-jwt-token"
curl -X POST http://localhost:3000/quizzes/{quiz-id}/submit \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "answers": [...],
    "timeSpentSeconds": 300
  }'

# Response should include attemptId
# { "attemptId": "...", "score": ..., ... }

# Verify in MongoDB
mongosh mongodb://localhost:27017/quiz-app
db.quizattempts.find().pretty()
```

## Success Criteria

- [ ] QuizAttempt schema created with proper fields
- [ ] AttemptAnswer embedded schema working
- [ ] Indexes created on userId, quizId, and compound fields
- [ ] AttemptsService creates attempts from submissions
- [ ] Quiz submission now returns attemptId
- [ ] User stats aggregation works correctly
- [ ] Leaderboard query returns ranked results
- [ ] Service unit tests pass
- [ ] Attempts persist to MongoDB

## Notes

### Circular Dependency Handling

QuizzesModule and AttemptsModule need to reference each other:

- QuizzesController needs AttemptsService to save attempts
- AttemptsService might need QuizzesService for quiz details

Use `forwardRef()` to resolve the circular dependency.

### Stats Calculation

User stats are calculated on-demand using aggregation:

- **Pros:** Always accurate, no stale data
- **Cons:** Slower for users with many attempts

Consider caching stats for high-traffic scenarios.

### Leaderboard Query

The leaderboard uses aggregation to:

1. Group by user (best score per user)
2. Sort by percentage descending
3. Limit to top N results

## Troubleshooting

**Issue:** Circular dependency error

- **Fix:** Use `forwardRef()` in both module imports
- Inject with `@Inject(forwardRef(() => ServiceName))`

**Issue:** Attempt not saved after submission

- **Fix:** Verify AttemptsService is properly injected
- Check for errors in controller error handling

**Issue:** Stats returning NaN or undefined

- **Fix:** Handle empty aggregation results
- Provide default values for missing data

**Issue:** Quiz population returning null

- **Fix:** Ensure quizId is correctly stored as ObjectId
- Verify Quiz collection name matches ref

## Next Step

Proceed to **Step 6: User Attempts History Endpoints** to create the API endpoints for retrieving user quiz history.
