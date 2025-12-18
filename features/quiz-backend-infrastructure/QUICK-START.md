# Quick Start: Quiz Backend Infrastructure

## Overview

This guide helps you get started implementing the quiz backend infrastructure feature. The implementation is divided into 8 sequential steps, starting from shared package updates through to seed data population.

## Prerequisites

Before starting, ensure:

1. **MongoDB is running:**

   ```bash
   # Check MongoDB status (macOS with Homebrew)
   brew services list | grep mongodb

   # Or start MongoDB
   brew services start mongodb-community
   ```

2. **Dependencies are installed:**

   ```bash
   pnpm install
   ```

3. **Environment is configured:**
   - Ensure `apps/api/.env` exists with `MONGODB_URI` set
   - JWT configuration should be present from previous features

4. **Previous features completed:**
   - Authentication system working
   - User schema and service functional
   - Database connection established

## Implementation Roadmap

| Step | Title                                | Duration  | Focus Area     |
| ---- | ------------------------------------ | --------- | -------------- |
| 0    | Shared Packages Setup                | 30-45 min | Types, Schemas |
| 1    | Quiz and Question Schemas            | 45-60 min | Database       |
| 2    | Answer Schema and Relationships      | 30-45 min | Database       |
| 3    | QuizzesModule and List/Get Endpoints | 60-90 min | API            |
| 4    | Quiz Submission and Scoring          | 60-90 min | API, Logic     |
| 5    | Attempt Tracking Schema              | 45-60 min | Database       |
| 6    | User Attempts History Endpoints      | 60-90 min | API            |
| 7    | Seed Data and Population             | 45-60 min | Data           |

**Total estimated time:** 6-8 hours

## Starting Your First Step

### Step 0: Shared Packages Setup

This step creates the Zod schemas and TypeScript types that will be shared between frontend and backend.

**Start with:**

```bash
# Open the step documentation
cat features/quiz-backend-infrastructure/step-0-shared-packages-setup.md

# Or use the execute command
/execute-feature-step features/quiz-backend-infrastructure 0
```

**Key files to create:**

- `packages/shared-models/src/models/quiz/quiz.model.ts`
- `packages/shared-models/src/models/quiz/submission.model.ts`
- `packages/shared-models/src/models/attempt/attempt.model.ts`
- Query keys and API route constants in `shared-types`

**Verify completion:**

```bash
pnpm typecheck
```

## Development Workflow

### For Each Step

1. **Read the step documentation thoroughly**
2. **Create/modify files as specified**
3. **Run TypeScript check after each change:**
   ```bash
   pnpm typecheck
   ```
4. **Test your implementation:**
   ```bash
   pnpm test:api
   ```
5. **Start the API to verify:**
   ```bash
   pnpm dev:api
   ```

### Testing API Endpoints

Once you reach Step 3, you can test endpoints:

```bash
# List quizzes
curl http://localhost:3000/quizzes

# Get specific quiz
curl http://localhost:3000/quizzes/{quiz-id}

# Submit quiz (requires authentication)
curl -X POST http://localhost:3000/quizzes/{quiz-id}/submit \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"answers": [{"questionId": "q1", "answerId": "a1"}]}'
```

### Getting an Auth Token

```bash
# Register a user
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser", "email": "test@example.com", "password": "password123"}'

# Login to get token
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "password123"}'
```

## Key Patterns to Follow

### 1. Mongoose Schema Pattern

Follow the existing User schema pattern:

```typescript
@Schema({ timestamps: true })
export class Quiz {
  @Prop({ required: true })
  title!: string;
}

export const QuizSchema = SchemaFactory.createForClass(Quiz);
```

### 2. Service Pattern

Follow the UsersService pattern:

```typescript
@Injectable()
export class QuizzesService {
  constructor(@InjectModel(Quiz.name) private quizModel: Model<QuizDocument>) {}
}
```

### 3. Controller Pattern

Use class-based controllers with decorators:

```typescript
@Controller('quizzes')
export class QuizzesController {
  constructor(private readonly quizzesService: QuizzesService) {}

  @Get()
  findAll() {
    return this.quizzesService.findAll();
  }
}
```

### 4. DTO Pattern with Zod

Leverage shared-models schemas:

```typescript
import { createZodDto } from 'nestjs-zod';
import { QuizSubmissionSchema } from '@quiz-app/shared-models';

export class SubmitQuizDto extends createZodDto(QuizSubmissionSchema) {}
```

## Common Issues and Solutions

### Issue: Import errors for shared packages

**Solution:**

```bash
# Rebuild shared packages
pnpm typecheck:packages

# Restart your IDE's TypeScript server
```

### Issue: MongoDB connection errors

**Solution:**

```bash
# Verify MongoDB is running
mongosh --eval "db.runCommand({ ping: 1 })"

# Check your .env file
cat apps/api/.env | grep MONGODB
```

### Issue: Module not found in NestJS

**Solution:**

- Ensure module is imported in `app.module.ts`
- Check that exports are correct in the module file
- Restart the dev server

## File Structure After Completion

```
apps/api/src/
├── quizzes/
│   ├── schemas/
│   │   ├── quiz.schema.ts
│   │   ├── question.schema.ts
│   │   └── answer.schema.ts
│   ├── dto/
│   │   ├── quiz-response.dto.ts
│   │   ├── submit-quiz.dto.ts
│   │   └── quiz-result.dto.ts
│   ├── quizzes.module.ts
│   ├── quizzes.service.ts
│   ├── quizzes.service.spec.ts
│   └── quizzes.controller.ts
├── attempts/
│   ├── schemas/
│   │   ├── quiz-attempt.schema.ts
│   │   └── attempt-answer.schema.ts
│   ├── dto/
│   │   ├── attempt-response.dto.ts
│   │   └── attempt-detail.dto.ts
│   ├── attempts.module.ts
│   ├── attempts.service.ts
│   └── attempts.controller.ts
└── database/
    └── seeds/
        └── quiz-seed.service.ts

packages/shared-models/src/models/
├── quiz/
│   ├── quiz.model.ts
│   ├── submission.model.ts
│   └── index.ts
└── attempt/
    ├── attempt.model.ts
    └── index.ts
```

## Next Steps After Completion

Once all steps are complete:

1. **Verify all endpoints work** with Postman or curl
2. **Run the full test suite:**
   ```bash
   pnpm test
   ```
3. **Proceed to frontend implementation** (`quiz-frontend-experience` feature)

## Need Help?

- Review existing patterns in `apps/api/src/users/` and `apps/api/src/auth/`
- Check the PRD.md for business requirements
- Reference step documentation for detailed implementation guidance
