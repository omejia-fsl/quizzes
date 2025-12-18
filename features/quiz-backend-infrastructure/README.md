# Feature: Quiz Backend Infrastructure

## Overview

This feature establishes the complete backend infrastructure for the quiz application, including database schemas, API endpoints, scoring logic, and user attempt tracking. It builds upon the existing authentication system and follows the established patterns from `feature-init-app`.

**Location:** `features/quiz-backend-infrastructure/` (in project root)

## Goals

- Design and implement database schemas for quizzes, questions, and answers
- Create RESTful API endpoints for quiz operations
- Implement quiz submission and automatic scoring
- Track user quiz attempts and history
- Provide seed data for initial quiz content
- Ensure all components are testable and follow project conventions

## Architecture Decisions

### Database Technology: MongoDB with Mongoose

**Rationale:**

- Already configured in the project (see `DatabaseModule`)
- Mongoose provides schema validation and relationships
- Flexible document structure ideal for quiz data
- Consistent with existing User schema pattern

### Data Model Design

```
Quiz (1) ----< (N) Question (1) ----< (N) Answer
  |
  +----< (N) QuizAttempt >---- (1) User
                |
                +----< (N) AttemptAnswer
```

**Key Design Decisions:**

1. **Embedded vs Referenced Documents:**
   - Questions are **embedded** within Quiz documents (they don't exist independently)
   - Answers are **embedded** within Question documents
   - QuizAttempts **reference** Quiz and User (they exist independently)
   - This optimizes read performance for quiz-taking while maintaining flexibility for analytics

2. **Correct Answer Storage:**
   - Each Answer has an `isCorrect` boolean
   - Only one answer per question should be marked correct
   - Validation enforced at the application level

3. **Scoring:**
   - Calculated at submission time, stored in QuizAttempt
   - Percentage score and raw score both stored
   - Enables historical tracking without recalculation

### API Design

Following RESTful conventions:

| Method | Endpoint                             | Description                | Auth     |
| ------ | ------------------------------------ | -------------------------- | -------- |
| GET    | `/quizzes`                           | List all quizzes (summary) | Public   |
| GET    | `/quizzes/:id`                       | Get quiz with questions    | Public   |
| POST   | `/quizzes/:id/submit`                | Submit quiz answers        | Required |
| GET    | `/users/:userId/attempts`            | Get user's quiz history    | Required |
| GET    | `/users/:userId/attempts/:attemptId` | Get specific attempt       | Required |

### Module Structure

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
```

## Implementation Roadmap

| Step | Title                                | Duration  | Focus Area     | File Count |
| ---- | ------------------------------------ | --------- | -------------- | ---------- |
| 0    | Shared Packages Setup                | 30-45 min | Types, Schemas | 8-10 files |
| 1    | Quiz and Question Schemas            | 45-60 min | Database       | 4-5 files  |
| 2    | Answer Schema and Validation         | 30-45 min | Database       | 2-3 files  |
| 3    | QuizzesModule and List/Get Endpoints | 60-90 min | API            | 6-7 files  |
| 4    | Quiz Submission and Scoring          | 60-90 min | API, Logic     | 4-5 files  |
| 5    | Attempt Tracking Schema              | 45-60 min | Database       | 6-7 files  |
| 6    | User Attempts History Endpoints      | 60-90 min | API            | 4-5 files  |
| 7    | Seed Data and Population             | 45-60 min | Data           | 3-4 files  |

**Total estimated time:** 6-8 hours

## Steps Overview

### Step 0: Shared Packages Setup

Update shared packages with quiz-related Zod schemas and types that will be used by both frontend and backend.

- Creates Quiz, Question, Answer models in shared-models
- Adds submission and result schemas
- Updates query keys and API routes

### Step 1: Quiz and Question Schemas

Create the core database schemas for Quiz and Question with Mongoose, including embedded document structure.

- Answer schema (embedded)
- Question schema (embedded)
- Quiz schema with virtuals

### Step 2: Answer Schema and Relationships

Complete the answer schema with correct answer marking and establish the full quiz data model.

- Pre-save validation hooks
- Instance methods for scoring
- Public/internal data transformation

### Step 3: QuizzesModule and List/Get Endpoints

Implement the QuizzesModule with service and controller for listing and retrieving quizzes.

- GET /quizzes (list with pagination)
- GET /quizzes/:id (detail without correct answers)
- GET /quizzes/categories

### Step 4: Quiz Submission and Scoring

Implement the quiz submission endpoint with automatic scoring logic.

- POST /quizzes/:id/submit (auth required)
- ScoringService for calculation
- Feedback generation

### Step 5: Attempt Tracking Schema

Create QuizAttempt and AttemptAnswer schemas for tracking user quiz history.

- QuizAttempt schema with references
- AttemptsService for persistence
- Integration with quiz submission

### Step 6: User Attempts History Endpoints

Implement endpoints for retrieving user's quiz attempt history and details.

- GET /users/:userId/attempts
- GET /users/:userId/attempts/:attemptId
- User stats aggregation

### Step 7: Seed Data and Population

Create seed data service with sample quiz content for development and testing.

- 3 quizzes: Agent Fundamentals, Prompt Engineering, Model Selection
- Auto-seeding in development
- CLI seed commands

## Tech Stack

- **Database:** MongoDB (via Mongoose ODM)
- **Backend Framework:** NestJS
- **Validation:** Zod (shared schemas) + class-validator (NestJS DTOs)
- **Authentication:** JWT (existing implementation)
- **Testing:** Vitest

## Data Models

### Quiz Schema

```typescript
{
  _id: ObjectId,
  title: string,
  description: string,
  category: string,           // e.g., "Agent Fundamentals"
  difficulty: "beginner" | "intermediate" | "advanced",
  estimatedMinutes: number,
  questions: Question[],      // Embedded documents
  isActive: boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Question Schema (Embedded)

```typescript
{
  _id: ObjectId,
  text: string,
  explanation: string,        // Shown after answering
  order: number,              // Question sequence
  answers: Answer[]           // Embedded documents
}
```

### Answer Schema (Embedded)

```typescript
{
  _id: ObjectId,
  text: string,
  isCorrect: boolean
}
```

### QuizAttempt Schema

```typescript
{
  _id: ObjectId,
  userId: ObjectId,           // Reference to User
  quizId: ObjectId,           // Reference to Quiz
  answers: AttemptAnswer[],   // User's answers
  score: number,              // Raw score (correct count)
  totalQuestions: number,
  percentage: number,         // Score percentage
  completedAt: Date,
  timeSpentSeconds: number,   // Optional: time tracking
  createdAt: Date
}
```

### AttemptAnswer Schema (Embedded)

```typescript
{
  questionId: ObjectId,
  selectedAnswerId: ObjectId,
  isCorrect: boolean
}
```

## API Response Formats

### GET /quizzes (List)

```json
{
  "quizzes": [
    {
      "id": "quiz_id",
      "title": "Agent Fundamentals",
      "description": "Test your knowledge of AI agents",
      "category": "Agent Design",
      "difficulty": "beginner",
      "questionCount": 10,
      "estimatedMinutes": 15
    }
  ]
}
```

### GET /quizzes/:id (Detail)

```json
{
  "id": "quiz_id",
  "title": "Agent Fundamentals",
  "description": "...",
  "category": "Agent Design",
  "difficulty": "beginner",
  "estimatedMinutes": 15,
  "questions": [
    {
      "id": "question_id",
      "text": "What is the primary purpose of an AI agent?",
      "order": 1,
      "answers": [
        { "id": "answer_id", "text": "To autonomously accomplish tasks" },
        { "id": "answer_id", "text": "To store data" }
      ]
    }
  ]
}
```

### POST /quizzes/:id/submit

Request:

```json
{
  "answers": [
    { "questionId": "q1", "answerId": "a1" },
    { "questionId": "q2", "answerId": "a3" }
  ],
  "timeSpentSeconds": 420
}
```

Response:

```json
{
  "attemptId": "attempt_id",
  "score": 8,
  "totalQuestions": 10,
  "percentage": 80,
  "feedback": "Great job!",
  "results": [
    {
      "questionId": "q1",
      "correct": true,
      "explanation": "..."
    }
  ]
}
```

## Success Criteria

After completing all steps:

- [ ] Quizzes can be listed and retrieved via API
- [ ] Quiz questions are returned without revealing correct answers
- [ ] Quiz submission calculates and stores score
- [ ] User can view their quiz attempt history
- [ ] Detailed attempt results include explanations
- [ ] Seed data populates initial quiz content
- [ ] All endpoints have appropriate authentication
- [ ] Unit tests cover core business logic

## Execution Instructions

### Sequential Execution

Execute steps in order (0 -> 1 -> 2 -> ... -> 7). Each step builds on the previous.

### Running the API During Development

```bash
# Start the API in watch mode
pnpm dev:api

# The API will be available at http://localhost:3000
```

### Testing Endpoints

```bash
# List quizzes
curl http://localhost:3000/quizzes

# Get specific quiz
curl http://localhost:3000/quizzes/{id}

# Submit quiz (requires auth token)
curl -X POST http://localhost:3000/quizzes/{id}/submit \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"answers": [...]}'
```

## Dependencies on Previous Features

This feature requires:

- `feature-init-app` completed (authentication, database setup)
- MongoDB running and configured
- User authentication working

## Next Feature

After completing `quiz-backend-infrastructure`:

- **quiz-frontend-experience** - Build the React UI for quiz taking
- **user-dashboard** - Create user progress dashboard

## Notes

- Keep correct answers server-side only until after submission
- Consider pagination for quiz lists as content grows
- Explanations should provide educational value
- Performance feedback based on percentage thresholds
