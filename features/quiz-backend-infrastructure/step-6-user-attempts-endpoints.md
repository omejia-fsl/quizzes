# Step 6: User Attempts History Endpoints

## Objective

Create API endpoints for retrieving user quiz attempt history. This includes `GET /users/:userId/attempts` for listing all attempts and `GET /users/:userId/attempts/:attemptId` for detailed attempt information. Both endpoints require authentication and authorization.

## Prerequisites

- Step 5 completed (Attempt tracking schema and service)
- Authentication system working
- AttemptsService with findByUser and findById methods

## Implementation Tasks

### 1. Create Attempt DTOs (`apps/api/src/attempts/dto/attempt-response.dto.ts`)

```typescript
import { createZodDto } from 'nestjs-zod';
import {
  AttemptSummarySchema,
  AttemptDetailSchema,
  UserAttemptsResponseSchema,
} from '@quiz-app/shared-models';
import { z } from 'zod';

export class AttemptSummaryDto extends createZodDto(AttemptSummarySchema) {}

export class AttemptDetailDto extends createZodDto(AttemptDetailSchema) {}

export class UserAttemptsResponseDto extends createZodDto(
  UserAttemptsResponseSchema,
) {}

export const AttemptQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(50).optional().default(10),
});

export class AttemptQueryDto extends createZodDto(AttemptQuerySchema) {}
```

### 2. Create DTO Index (`apps/api/src/attempts/dto/index.ts`)

```typescript
export * from './attempt-response.dto';
```

### 3. Create AttemptsController (`apps/api/src/attempts/attempts.controller.ts`)

```typescript
import {
  Controller,
  Get,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
  Request,
  ForbiddenException,
} from '@nestjs/common';
import { AttemptsService, UserAttemptsResult } from './attempts.service';
import { AttemptQueryDto } from './dto';
import { AttemptDetail } from './schemas/quiz-attempt.interface';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

interface AuthenticatedRequest {
  user: {
    userId: string;
    email: string;
  };
}

@Controller('users')
@UseGuards(JwtAuthGuard)
export class AttemptsController {
  constructor(private readonly attemptsService: AttemptsService) {}

  @Get(':userId/attempts')
  @HttpCode(HttpStatus.OK)
  async getUserAttempts(
    @Param('userId') userId: string,
    @Query() query: AttemptQueryDto,
    @Request() req: AuthenticatedRequest,
  ): Promise<UserAttemptsResult> {
    this.verifyUserAccess(userId, req.user.userId);

    const { page, limit } = query;
    return this.attemptsService.findByUser(userId, page, limit);
  }

  @Get(':userId/attempts/:attemptId')
  @HttpCode(HttpStatus.OK)
  async getAttemptDetail(
    @Param('userId') userId: string,
    @Param('attemptId') attemptId: string,
    @Request() req: AuthenticatedRequest,
  ): Promise<AttemptDetail> {
    this.verifyUserAccess(userId, req.user.userId);

    return this.attemptsService.findById(userId, attemptId);
  }

  private verifyUserAccess(
    requestedUserId: string,
    authenticatedUserId: string,
  ): void {
    if (requestedUserId !== authenticatedUserId) {
      throw new ForbiddenException(
        'You do not have permission to access this resource',
      );
    }
  }
}
```

### 4. Update AttemptsModule (`apps/api/src/attempts/attempts.module.ts`)

```typescript
import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AttemptsController } from './attempts.controller';
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
  controllers: [AttemptsController],
  providers: [AttemptsService],
  exports: [AttemptsService],
})
export class AttemptsModule {}
```

### 5. Update Module Index (`apps/api/src/attempts/index.ts`)

```typescript
export * from './attempts.module';
export * from './attempts.service';
export * from './attempts.controller';
export * from './schemas';
export * from './dto';
```

### 6. Create Extended Attempt Detail Response

Update `apps/api/src/attempts/attempts.service.ts` to include question details in attempt responses:

Add this method to AttemptsService:

```typescript
async findByIdWithQuestionDetails(
  userId: string,
  attemptId: string,
): Promise<AttemptDetail & { questionDetails: QuestionDetail[] }> {
  const attempt = await this.attemptModel
    .findOne({
      _id: new Types.ObjectId(attemptId),
      userId: new Types.ObjectId(userId),
    })
    .populate('quizId')
    .exec();

  if (!attempt) {
    throw new NotFoundException(
      `Attempt with ID "${attemptId}" not found for this user`,
    );
  }

  const quiz = attempt.quizId as any;

  const questionDetails = attempt.answers.map((answer) => {
    const question = quiz.questions?.find(
      (q: any) => q._id.toString() === answer.questionId.toString(),
    );

    const selectedAnswer = question?.answers?.find(
      (a: any) => a._id.toString() === answer.selectedAnswerId.toString(),
    );

    const correctAnswer = question?.answers?.find((a: any) => a.isCorrect);

    return {
      questionId: answer.questionId.toString(),
      questionText: question?.text || 'Question not found',
      selectedAnswerId: answer.selectedAnswerId.toString(),
      selectedAnswerText: selectedAnswer?.text || 'Answer not found',
      correctAnswerId: correctAnswer?._id.toString() || '',
      correctAnswerText: correctAnswer?.text || '',
      isCorrect: answer.isCorrect,
      explanation: question?.explanation || '',
    };
  });

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
    questionDetails,
  };
}
```

Add the interface:

```typescript
export interface QuestionDetail {
  questionId: string;
  questionText: string;
  selectedAnswerId: string;
  selectedAnswerText: string;
  correctAnswerId: string;
  correctAnswerText: string;
  isCorrect: boolean;
  explanation: string;
}
```

### 7. Update Controller for Detailed Response (Optional Enhancement)

```typescript
@Get(':userId/attempts/:attemptId/detailed')
@HttpCode(HttpStatus.OK)
async getAttemptDetailedView(
  @Param('userId') userId: string,
  @Param('attemptId') attemptId: string,
  @Request() req: AuthenticatedRequest,
): Promise<AttemptDetail & { questionDetails: QuestionDetail[] }> {
  this.verifyUserAccess(userId, req.user.userId);

  return this.attemptsService.findByIdWithQuestionDetails(userId, attemptId);
}
```

## Files to Create/Modify

| File                                                | Action | Purpose                   |
| --------------------------------------------------- | ------ | ------------------------- |
| `apps/api/src/attempts/dto/attempt-response.dto.ts` | Create | Response DTOs             |
| `apps/api/src/attempts/dto/index.ts`                | Create | Barrel export             |
| `apps/api/src/attempts/attempts.controller.ts`      | Create | Endpoint handlers         |
| `apps/api/src/attempts/attempts.module.ts`          | Modify | Register controller       |
| `apps/api/src/attempts/attempts.service.ts`         | Modify | Add detailed query method |
| `apps/api/src/attempts/index.ts`                    | Modify | Export controller         |

## API Endpoints

### GET /users/:userId/attempts

**Description:** Get paginated list of user's quiz attempts with stats.

**Authentication:** Required (Bearer token)

**Authorization:** User can only access their own attempts.

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| userId | string | User's MongoDB ObjectId |

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| page | number | 1 | Page number |
| limit | number | 10 | Items per page (max 50) |

**Response (200):**

```json
{
  "attempts": [
    {
      "id": "507f1f77bcf86cd799439021",
      "quizId": "507f1f77bcf86cd799439011",
      "quizTitle": "Agent Fundamentals",
      "category": "Agent Design",
      "difficulty": "beginner",
      "score": 8,
      "totalQuestions": 10,
      "percentage": 80,
      "completedAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "total": 15,
  "stats": {
    "totalAttempts": 15,
    "averageScore": 75,
    "bestScore": 100,
    "quizzesCompleted": 5
  }
}
```

**Response (401 - Unauthorized):**

```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

**Response (403 - Forbidden):**

```json
{
  "statusCode": 403,
  "message": "You do not have permission to access this resource"
}
```

### GET /users/:userId/attempts/:attemptId

**Description:** Get detailed information about a specific quiz attempt.

**Authentication:** Required (Bearer token)

**Authorization:** User can only access their own attempts.

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| userId | string | User's MongoDB ObjectId |
| attemptId | string | Attempt's MongoDB ObjectId |

**Response (200):**

```json
{
  "id": "507f1f77bcf86cd799439021",
  "userId": "507f1f77bcf86cd799439020",
  "quizId": "507f1f77bcf86cd799439011",
  "quizTitle": "Agent Fundamentals",
  "quizCategory": "Agent Design",
  "quizDifficulty": "beginner",
  "score": 8,
  "totalQuestions": 10,
  "percentage": 80,
  "timeSpentSeconds": 420,
  "answers": [
    {
      "questionId": "507f1f77bcf86cd799439012",
      "selectedAnswerId": "507f1f77bcf86cd799439013",
      "isCorrect": true
    }
  ],
  "completedAt": "2024-01-15T10:30:00.000Z"
}
```

**Response (404 - Not Found):**

```json
{
  "statusCode": 404,
  "message": "Attempt with ID \"507f1f77bcf86cd799439021\" not found for this user"
}
```

### GET /users/:userId/attempts/:attemptId/detailed (Optional)

**Description:** Get attempt with full question and answer details for review.

**Response (200):**

```json
{
  "id": "507f1f77bcf86cd799439021",
  "userId": "507f1f77bcf86cd799439020",
  "quizId": "507f1f77bcf86cd799439011",
  "quizTitle": "Agent Fundamentals",
  "quizCategory": "Agent Design",
  "quizDifficulty": "beginner",
  "score": 8,
  "totalQuestions": 10,
  "percentage": 80,
  "timeSpentSeconds": 420,
  "completedAt": "2024-01-15T10:30:00.000Z",
  "questionDetails": [
    {
      "questionId": "507f1f77bcf86cd799439012",
      "questionText": "What is the primary purpose of an AI agent?",
      "selectedAnswerId": "507f1f77bcf86cd799439013",
      "selectedAnswerText": "To autonomously accomplish tasks",
      "correctAnswerId": "507f1f77bcf86cd799439013",
      "correctAnswerText": "To autonomously accomplish tasks",
      "isCorrect": true,
      "explanation": "An AI agent is designed to perceive its environment and take actions to achieve specific goals autonomously."
    }
  ]
}
```

## Testing Approach

### 1. Controller Unit Tests

Create `apps/api/src/attempts/attempts.controller.spec.ts`:

```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { AttemptsController } from './attempts.controller';
import { AttemptsService } from './attempts.service';
import { ForbiddenException } from '@nestjs/common';

describe('AttemptsController', () => {
  let controller: AttemptsController;

  const mockAttemptsService = {
    findByUser: vi.fn(),
    findById: vi.fn(),
  };

  const mockUserId = '507f1f77bcf86cd799439020';
  const mockAttemptId = '507f1f77bcf86cd799439021';

  const mockRequest = {
    user: {
      userId: mockUserId,
      email: 'test@example.com',
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AttemptsController],
      providers: [
        {
          provide: AttemptsService,
          useValue: mockAttemptsService,
        },
      ],
    }).compile();

    controller = module.get<AttemptsController>(AttemptsController);
  });

  describe('getUserAttempts', () => {
    it('should return user attempts for authenticated user', async () => {
      const expectedResult = {
        attempts: [],
        total: 0,
        stats: {
          totalAttempts: 0,
          averageScore: 0,
          bestScore: 0,
          quizzesCompleted: 0,
        },
      };

      mockAttemptsService.findByUser.mockResolvedValue(expectedResult);

      const result = await controller.getUserAttempts(
        mockUserId,
        { page: 1, limit: 10 },
        mockRequest as any,
      );

      expect(result).toEqual(expectedResult);
      expect(mockAttemptsService.findByUser).toHaveBeenCalledWith(
        mockUserId,
        1,
        10,
      );
    });

    it('should throw ForbiddenException for different user', async () => {
      const differentUserId = '507f1f77bcf86cd799439999';

      await expect(
        controller.getUserAttempts(
          differentUserId,
          { page: 1, limit: 10 },
          mockRequest as any,
        ),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('getAttemptDetail', () => {
    it('should return attempt detail for authenticated user', async () => {
      const expectedResult = {
        id: mockAttemptId,
        userId: mockUserId,
        score: 8,
        totalQuestions: 10,
        percentage: 80,
      };

      mockAttemptsService.findById.mockResolvedValue(expectedResult);

      const result = await controller.getAttemptDetail(
        mockUserId,
        mockAttemptId,
        mockRequest as any,
      );

      expect(result).toEqual(expectedResult);
    });

    it('should throw ForbiddenException when accessing another user attempt', async () => {
      const differentUserId = '507f1f77bcf86cd799439999';

      await expect(
        controller.getAttemptDetail(
          differentUserId,
          mockAttemptId,
          mockRequest as any,
        ),
      ).rejects.toThrow(ForbiddenException);
    });
  });
});
```

### 2. Integration Tests

Create `apps/api/src/attempts/attempts.e2e.spec.ts` (for e2e test suite):

```typescript
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../app.module';

describe('Attempts Endpoints (e2e)', () => {
  let app: INestApplication;
  let authToken: string;
  let userId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'test@example.com', password: 'password123' });

    authToken = loginResponse.body.access_token;
    userId = loginResponse.body.user.id;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /users/:userId/attempts', () => {
    it('should return 401 without auth token', async () => {
      return request(app.getHttpServer())
        .get(`/users/${userId}/attempts`)
        .expect(401);
    });

    it('should return 403 for different user', async () => {
      return request(app.getHttpServer())
        .get('/users/507f1f77bcf86cd799439999/attempts')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(403);
    });

    it('should return attempts for authenticated user', async () => {
      return request(app.getHttpServer())
        .get(`/users/${userId}/attempts`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('attempts');
          expect(res.body).toHaveProperty('total');
          expect(res.body).toHaveProperty('stats');
        });
    });
  });
});
```

### 3. Manual API Testing

```bash
# Get auth token
TOKEN=$(curl -s -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "password123"}' \
  | jq -r '.access_token')

# Get user ID from profile
USER_ID=$(curl -s http://localhost:3000/auth/profile \
  -H "Authorization: Bearer $TOKEN" \
  | jq -r '.id')

# Get user attempts
curl http://localhost:3000/users/$USER_ID/attempts \
  -H "Authorization: Bearer $TOKEN"

# Get specific attempt detail
ATTEMPT_ID="your-attempt-id"
curl http://localhost:3000/users/$USER_ID/attempts/$ATTEMPT_ID \
  -H "Authorization: Bearer $TOKEN"

# Test forbidden access (different user ID)
curl http://localhost:3000/users/507f1f77bcf86cd799439999/attempts \
  -H "Authorization: Bearer $TOKEN"
# Should return 403 Forbidden
```

## Success Criteria

- [ ] GET /users/:userId/attempts requires authentication
- [ ] GET /users/:userId/attempts/:attemptId requires authentication
- [ ] Users can only access their own attempts (403 for others)
- [ ] Pagination works correctly on attempt list
- [ ] Stats are calculated and returned with attempt list
- [ ] Attempt detail includes all relevant information
- [ ] Non-existent attempts return 404
- [ ] Controller unit tests pass
- [ ] Manual API testing confirms correct behavior

## Authorization Design

### Why User-Scoped URLs?

The URL pattern `/users/:userId/attempts` explicitly shows resource ownership:

- Clear REST hierarchy
- Easy to understand access patterns
- Supports future admin override scenarios

### Authorization Flow

1. JWT authentication via guard
2. Extract authenticated userId from JWT
3. Compare with requested userId in URL
4. Throw ForbiddenException if mismatch

### Future Enhancements

- Admin role can access any user's attempts
- User can share specific attempts (public links)
- Organization-level access for team features

## Notes

### Performance Considerations

- Stats are calculated per request (could cache for heavy users)
- Quiz population happens on each query
- Consider adding lean() for read-only queries

### Data Privacy

- Only authenticated users can access attempts
- Users cannot access other users' data
- Consider what data to expose in detailed view

## Troubleshooting

**Issue:** Empty attempts list

- **Fix:** Verify user has submitted quizzes
- Check userId matches authenticated user

**Issue:** Quiz details missing in response

- **Fix:** Ensure quiz documents exist in database
- Check populate() is working correctly

**Issue:** 403 even for correct user

- **Fix:** Verify JWT contains correct userId
- Check userId format matches (string vs ObjectId)

**Issue:** Stats showing NaN

- **Fix:** Handle empty aggregation results
- Provide default values for new users

## Next Step

Proceed to **Step 7: Seed Data and Population** to create sample quiz data for development and testing.
