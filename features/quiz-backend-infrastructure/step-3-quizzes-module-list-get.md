# Step 3: QuizzesModule and List/Get Endpoints

## Objective

Create the QuizzesModule with service and controller to provide API endpoints for listing and retrieving quizzes. This step implements `GET /quizzes` (list all) and `GET /quizzes/:id` (get single quiz) endpoints with proper data transformation to hide correct answers.

## Prerequisites

- Step 2 completed (Quiz schemas with validation)
- MongoDB connection working
- Shared models imported and available

## Implementation Tasks

### 1. Create QuizzesService (`apps/api/src/quizzes/quizzes.service.ts`)

```typescript
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Quiz } from './schemas/quiz.schema';
import {
  QuizDocument,
  QuizSummary,
  PublicQuiz,
} from './schemas/quiz.interface';

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

@Injectable()
export class QuizzesService {
  constructor(@InjectModel(Quiz.name) private quizModel: Model<QuizDocument>) {}

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
}
```

### 2. Create Response DTOs (`apps/api/src/quizzes/dto/quiz-response.dto.ts`)

```typescript
import { createZodDto } from 'nestjs-zod';
import {
  QuizSummarySchema,
  QuizDetailSchema,
  QuizListResponseSchema,
  DifficultySchema,
} from '@quiz-app/shared-models';
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
```

### 3. Create DTO Index (`apps/api/src/quizzes/dto/index.ts`)

```typescript
export * from './quiz-response.dto';
```

### 4. Create QuizzesController (`apps/api/src/quizzes/quizzes.controller.ts`)

```typescript
import {
  Controller,
  Get,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { QuizzesService, QuizListResult } from './quizzes.service';
import { QuizFiltersDto, CategoriesResponseDto } from './dto';
import { PublicQuiz } from './schemas/quiz.interface';

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
}
```

### 5. Create QuizzesModule (`apps/api/src/quizzes/quizzes.module.ts`)

```typescript
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { QuizzesController } from './quizzes.controller';
import { QuizzesService } from './quizzes.service';
import { Quiz, QuizSchema } from './schemas/quiz.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Quiz.name, schema: QuizSchema }]),
  ],
  controllers: [QuizzesController],
  providers: [QuizzesService],
  exports: [QuizzesService],
})
export class QuizzesModule {}
```

### 6. Register Module in AppModule (`apps/api/src/app.module.ts`)

```typescript
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { QuizzesModule } from './quizzes/quizzes.module';

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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

### 7. Create Module Index (`apps/api/src/quizzes/index.ts`)

```typescript
export * from './quizzes.module';
export * from './quizzes.service';
export * from './quizzes.controller';
export * from './schemas';
export * from './dto';
```

## Files to Create/Modify

| File                                            | Action | Purpose                            |
| ----------------------------------------------- | ------ | ---------------------------------- |
| `apps/api/src/quizzes/quizzes.service.ts`       | Create | Business logic for quiz operations |
| `apps/api/src/quizzes/quizzes.controller.ts`    | Create | API endpoint handlers              |
| `apps/api/src/quizzes/quizzes.module.ts`        | Create | Module definition                  |
| `apps/api/src/quizzes/dto/quiz-response.dto.ts` | Create | Response DTOs with Zod             |
| `apps/api/src/quizzes/dto/index.ts`             | Create | Barrel export                      |
| `apps/api/src/quizzes/index.ts`                 | Create | Module barrel export               |
| `apps/api/src/app.module.ts`                    | Modify | Import QuizzesModule               |

## API Endpoints

### GET /quizzes

**Description:** List all active quizzes with pagination and filtering.

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| category | string | - | Filter by category |
| difficulty | string | - | Filter by difficulty level |
| page | number | 1 | Page number |
| limit | number | 10 | Items per page (max 50) |

**Response (200):**

```json
{
  "quizzes": [
    {
      "id": "507f1f77bcf86cd799439011",
      "title": "Agent Fundamentals",
      "description": "Test your knowledge of AI agents",
      "category": "Agent Design",
      "difficulty": "beginner",
      "questionCount": 10,
      "estimatedMinutes": 15
    }
  ],
  "total": 25
}
```

### GET /quizzes/categories

**Description:** Get list of unique quiz categories.

**Response (200):**

```json
{
  "categories": ["Agent Design", "Prompt Engineering", "Model Selection"]
}
```

### GET /quizzes/:id

**Description:** Get a single quiz with questions (without correct answers).

**Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| id | string | Quiz MongoDB ObjectId |

**Response (200):**

```json
{
  "id": "507f1f77bcf86cd799439011",
  "title": "Agent Fundamentals",
  "description": "Test your knowledge of AI agents",
  "category": "Agent Design",
  "difficulty": "beginner",
  "estimatedMinutes": 15,
  "questions": [
    {
      "id": "507f1f77bcf86cd799439012",
      "text": "What is the primary purpose of an AI agent?",
      "order": 1,
      "answers": [
        { "id": "507f1f77bcf86cd799439013", "text": "To store data" },
        {
          "id": "507f1f77bcf86cd799439014",
          "text": "To autonomously accomplish tasks"
        }
      ]
    }
  ]
}
```

**Response (404):**

```json
{
  "statusCode": 404,
  "message": "Quiz with ID \"invalid-id\" not found",
  "error": "Not Found"
}
```

## Testing Approach

### 1. Unit Tests for Service

Create `apps/api/src/quizzes/quizzes.service.spec.ts`:

```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { QuizzesService } from './quizzes.service';
import { Quiz } from './schemas/quiz.schema';
import { NotFoundException } from '@nestjs/common';

describe('QuizzesService', () => {
  let service: QuizzesService;
  let mockQuizModel: any;

  const mockQuiz = {
    _id: '507f1f77bcf86cd799439011',
    title: 'Test Quiz',
    description: 'Test Description',
    category: 'Testing',
    difficulty: 'beginner',
    estimatedMinutes: 10,
    isActive: true,
    questions: [
      {
        _id: '507f1f77bcf86cd799439012',
        text: 'Question 1',
        explanation: 'Explanation',
        order: 1,
        answers: [
          {
            _id: '507f1f77bcf86cd799439013',
            text: 'Answer 1',
            isCorrect: true,
          },
          {
            _id: '507f1f77bcf86cd799439014',
            text: 'Answer 2',
            isCorrect: false,
          },
        ],
      },
    ],
    toSummaryJSON: vi.fn().mockReturnValue({
      id: '507f1f77bcf86cd799439011',
      title: 'Test Quiz',
      description: 'Test Description',
      category: 'Testing',
      difficulty: 'beginner',
      questionCount: 1,
      estimatedMinutes: 10,
    }),
    toPublicJSON: vi.fn().mockReturnValue({
      id: '507f1f77bcf86cd799439011',
      title: 'Test Quiz',
      description: 'Test Description',
      category: 'Testing',
      difficulty: 'beginner',
      estimatedMinutes: 10,
      questions: [
        {
          id: '507f1f77bcf86cd799439012',
          text: 'Question 1',
          order: 1,
          answers: [
            { id: '507f1f77bcf86cd799439013', text: 'Answer 1' },
            { id: '507f1f77bcf86cd799439014', text: 'Answer 2' },
          ],
        },
      ],
    }),
  };

  beforeEach(async () => {
    mockQuizModel = {
      find: vi.fn().mockReturnThis(),
      findById: vi.fn().mockReturnThis(),
      countDocuments: vi.fn().mockReturnThis(),
      distinct: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      sort: vi.fn().mockReturnThis(),
      skip: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      exec: vi.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QuizzesService,
        {
          provide: getModelToken(Quiz.name),
          useValue: mockQuizModel,
        },
      ],
    }).compile();

    service = module.get<QuizzesService>(QuizzesService);
  });

  describe('findAll', () => {
    it('should return paginated quizzes', async () => {
      mockQuizModel.exec
        .mockResolvedValueOnce([mockQuiz])
        .mockResolvedValueOnce(1);

      const result = await service.findAll();

      expect(result.quizzes).toHaveLength(1);
      expect(result.total).toBe(1);
      expect(mockQuiz.toSummaryJSON).toHaveBeenCalled();
    });

    it('should apply category filter', async () => {
      mockQuizModel.exec
        .mockResolvedValueOnce([mockQuiz])
        .mockResolvedValueOnce(1);

      await service.findAll({ category: 'Testing' });

      expect(mockQuizModel.find).toHaveBeenCalledWith(
        expect.objectContaining({ category: 'Testing' }),
      );
    });

    it('should apply pagination', async () => {
      mockQuizModel.exec
        .mockResolvedValueOnce([mockQuiz])
        .mockResolvedValueOnce(1);

      await service.findAll({}, { page: 2, limit: 5 });

      expect(mockQuizModel.skip).toHaveBeenCalledWith(5);
      expect(mockQuizModel.limit).toHaveBeenCalledWith(5);
    });
  });

  describe('findById', () => {
    it('should return public quiz data', async () => {
      mockQuizModel.exec.mockResolvedValue(mockQuiz);

      const result = await service.findById('507f1f77bcf86cd799439011');

      expect(result).toEqual(mockQuiz.toPublicJSON());
      expect(result.questions[0].answers[0]).not.toHaveProperty('isCorrect');
    });

    it('should throw NotFoundException for non-existent quiz', async () => {
      mockQuizModel.exec.mockResolvedValue(null);

      await expect(service.findById('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw NotFoundException for inactive quiz', async () => {
      mockQuizModel.exec.mockResolvedValue({ ...mockQuiz, isActive: false });

      await expect(
        service.findById('507f1f77bcf86cd799439011'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('getCategories', () => {
    it('should return unique categories', async () => {
      mockQuizModel.exec.mockResolvedValue([
        'Agent Design',
        'Prompt Engineering',
      ]);

      const result = await service.getCategories();

      expect(result).toContain('Agent Design');
      expect(result).toContain('Prompt Engineering');
    });
  });
});
```

### 2. Integration Tests for Controller

Create `apps/api/src/quizzes/quizzes.controller.spec.ts`:

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { QuizzesController } from './quizzes.controller';
import { QuizzesService } from './quizzes.service';

describe('QuizzesController', () => {
  let controller: QuizzesController;
  let service: QuizzesService;

  const mockQuizzesService = {
    findAll: vi.fn(),
    findById: vi.fn(),
    getCategories: vi.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QuizzesController],
      providers: [
        {
          provide: QuizzesService,
          useValue: mockQuizzesService,
        },
      ],
    }).compile();

    controller = module.get<QuizzesController>(QuizzesController);
    service = module.get<QuizzesService>(QuizzesService);
  });

  describe('findAll', () => {
    it('should return quiz list', async () => {
      const expected = { quizzes: [], total: 0 };
      mockQuizzesService.findAll.mockResolvedValue(expected);

      const result = await controller.findAll({});

      expect(result).toEqual(expected);
    });
  });

  describe('getCategories', () => {
    it('should return categories object', async () => {
      mockQuizzesService.getCategories.mockResolvedValue(['Cat1', 'Cat2']);

      const result = await controller.getCategories();

      expect(result.categories).toEqual(['Cat1', 'Cat2']);
    });
  });

  describe('findOne', () => {
    it('should return single quiz', async () => {
      const expected = { id: '123', title: 'Test' };
      mockQuizzesService.findById.mockResolvedValue(expected);

      const result = await controller.findOne('123');

      expect(result).toEqual(expected);
    });
  });
});
```

### 3. Manual API Testing

```bash
# Start the API
pnpm dev:api

# Test list endpoint
curl http://localhost:3000/quizzes

# Test with filters
curl "http://localhost:3000/quizzes?category=Testing&page=1&limit=5"

# Test categories
curl http://localhost:3000/quizzes/categories

# Test get by ID (use actual ID from database)
curl http://localhost:3000/quizzes/507f1f77bcf86cd799439011
```

## Success Criteria

- [ ] QuizzesModule registered in AppModule
- [ ] GET /quizzes returns paginated quiz list
- [ ] GET /quizzes supports category and difficulty filters
- [ ] GET /quizzes/categories returns unique categories
- [ ] GET /quizzes/:id returns quiz without isCorrect field
- [ ] 404 returned for non-existent or inactive quizzes
- [ ] Service unit tests pass
- [ ] Controller integration tests pass
- [ ] API responds correctly to manual testing

## Notes

### Security Considerations

- `toPublicJSON()` ensures `isCorrect` is never exposed
- Only active quizzes are returned
- ObjectId validation handled by Mongoose

### Performance Considerations

- Pagination prevents loading all quizzes at once
- Select only needed fields for list view
- Index on `category` and `isActive` for fast filtering

### Future Improvements

- Add search functionality (text index on title/description)
- Add sorting options (newest, popular, difficulty)
- Cache categories list (rarely changes)
- Rate limiting for public endpoints

## Troubleshooting

**Issue:** Module not found errors

- **Fix:** Ensure QuizzesModule is imported in AppModule
- Check all files are in correct locations

**Issue:** Empty quizzes array

- **Fix:** Verify MongoDB has quiz documents
- Check `isActive: true` filter matches your data

**Issue:** TypeScript errors with Zod DTOs

- **Fix:** Ensure @quiz-app/shared-models is built
- Run `pnpm typecheck:packages`

**Issue:** Cannot resolve @quiz-app/shared-models

- **Fix:** Check tsconfig paths configuration
- Restart TypeScript server

## Next Step

Proceed to **Step 4: Quiz Submission and Scoring** to implement the quiz submission endpoint with automatic scoring logic.
