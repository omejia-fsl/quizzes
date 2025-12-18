# Step 1: Quiz and Question Mongoose Schemas

## Objective

Create the core Mongoose schemas for Quiz and Question entities. These schemas define the database structure and will be used by the QuizzesService to store and retrieve quiz data. Questions are embedded within Quiz documents for optimized read performance.

## Prerequisites

- Step 0 completed (shared-models with Zod schemas)
- MongoDB connection working
- Mongoose installed and configured

## Implementation Tasks

### 1. Create Answer Schema (`apps/api/src/quizzes/schemas/answer.schema.ts`)

The Answer schema is embedded within Questions. Each answer has text and a correctness indicator.

```typescript
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ _id: true })
export class Answer {
  _id!: Types.ObjectId;

  @Prop({ required: true, trim: true })
  text!: string;

  @Prop({ required: true, default: false })
  isCorrect!: boolean;
}

export const AnswerSchema = SchemaFactory.createForClass(Answer);
```

### 2. Create Question Schema (`apps/api/src/quizzes/schemas/question.schema.ts`)

Questions are embedded within Quizzes. Each question contains multiple answers.

```typescript
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Answer, AnswerSchema } from './answer.schema';

@Schema({ _id: true })
export class Question {
  _id!: Types.ObjectId;

  @Prop({ required: true, trim: true })
  text!: string;

  @Prop({ required: true })
  explanation!: string;

  @Prop({ required: true, min: 1 })
  order!: number;

  @Prop({ type: [AnswerSchema], required: true })
  answers!: Answer[];
}

export const QuestionSchema = SchemaFactory.createForClass(Question);
```

### 3. Create Quiz Schema (`apps/api/src/quizzes/schemas/quiz.schema.ts`)

The main Quiz schema containing all quiz metadata and embedded questions.

```typescript
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Question, QuestionSchema } from './question.schema';

export type QuizDocument = Quiz & Document;

export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

@Schema({ timestamps: true })
export class Quiz {
  @Prop({ required: true, trim: true, maxlength: 100 })
  title!: string;

  @Prop({ required: true, maxlength: 500 })
  description!: string;

  @Prop({ required: true, trim: true, index: true })
  category!: string;

  @Prop({
    required: true,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner',
  })
  difficulty!: Difficulty;

  @Prop({ required: true, min: 1 })
  estimatedMinutes!: number;

  @Prop({ type: [QuestionSchema], required: true, default: [] })
  questions!: Question[];

  @Prop({ default: true, index: true })
  isActive!: boolean;

  @Prop({ default: Date.now })
  createdAt!: Date;

  @Prop({ default: Date.now })
  updatedAt!: Date;
}

export const QuizSchema = SchemaFactory.createForClass(Quiz);

QuizSchema.virtual('questionCount').get(function () {
  return this.questions?.length || 0;
});

QuizSchema.set('toJSON', { virtuals: true });
QuizSchema.set('toObject', { virtuals: true });
```

### 4. Create Schema Index File (`apps/api/src/quizzes/schemas/index.ts`)

Barrel export for all quiz-related schemas.

```typescript
export * from './answer.schema';
export * from './question.schema';
export * from './quiz.schema';
```

### 5. Create Directory Structure

```bash
mkdir -p apps/api/src/quizzes/schemas
mkdir -p apps/api/src/quizzes/dto
```

## Files to Create/Modify

| File                                              | Action | Purpose                           |
| ------------------------------------------------- | ------ | --------------------------------- |
| `apps/api/src/quizzes/schemas/answer.schema.ts`   | Create | Answer embedded document schema   |
| `apps/api/src/quizzes/schemas/question.schema.ts` | Create | Question embedded document schema |
| `apps/api/src/quizzes/schemas/quiz.schema.ts`     | Create | Main Quiz collection schema       |
| `apps/api/src/quizzes/schemas/index.ts`           | Create | Barrel export                     |

## Schema Design Notes

### Why Embedded Documents?

**Advantages:**

- Single query retrieves entire quiz with all questions and answers
- Atomic updates (no transaction needed)
- Better read performance for quiz-taking flow
- Simpler data model

**Trade-offs:**

- Cannot query questions independently
- Quiz document size grows with questions
- Updating single question requires updating entire document

### Field Choices

| Field                  | Type      | Rationale                                 |
| ---------------------- | --------- | ----------------------------------------- |
| `_id` on embedded docs | ObjectId  | Enables referencing in submissions        |
| `order` on Question    | number    | Explicit ordering, supports randomization |
| `isCorrect` on Answer  | boolean   | Simple scoring, exactly one per question  |
| `isActive` on Quiz     | boolean   | Soft delete, draft support                |
| `timestamps: true`     | automatic | Track creation and updates                |

### Indexes

Created indexes:

- `category` - Filter quizzes by topic
- `isActive` - Filter active quizzes efficiently

Consider adding:

- Compound index on `{ isActive: 1, category: 1 }` for common queries
- Text index on `title` and `description` for search

## Testing Approach

### 1. Schema Validation Test

Create `apps/api/src/quizzes/schemas/quiz.schema.spec.ts`:

```typescript
import { describe, it, expect, beforeAll } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Model } from 'mongoose';
import { Quiz, QuizSchema, QuizDocument } from './quiz.schema';

describe('Quiz Schema', () => {
  let mongod: MongoMemoryServer;
  let quizModel: Model<QuizDocument>;
  let module: TestingModule;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();

    module = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(uri),
        MongooseModule.forFeature([{ name: Quiz.name, schema: QuizSchema }]),
      ],
    }).compile();

    quizModel = module.get<Model<QuizDocument>>(getModelToken(Quiz.name));
  });

  afterAll(async () => {
    await module.close();
    await mongod.stop();
  });

  it('should create a valid quiz', async () => {
    const quiz = new quizModel({
      title: 'Test Quiz',
      description: 'A test quiz description',
      category: 'Testing',
      difficulty: 'beginner',
      estimatedMinutes: 10,
      questions: [
        {
          text: 'What is 2 + 2?',
          explanation: 'Basic math',
          order: 1,
          answers: [
            { text: '3', isCorrect: false },
            { text: '4', isCorrect: true },
          ],
        },
      ],
    });

    const saved = await quiz.save();

    expect(saved._id).toBeDefined();
    expect(saved.title).toBe('Test Quiz');
    expect(saved.questions).toHaveLength(1);
    expect(saved.questions[0].answers).toHaveLength(2);
  });

  it('should reject quiz without required fields', async () => {
    const quiz = new quizModel({
      title: 'Incomplete Quiz',
    });

    await expect(quiz.save()).rejects.toThrow();
  });

  it('should validate difficulty enum', async () => {
    const quiz = new quizModel({
      title: 'Test',
      description: 'Test',
      category: 'Test',
      difficulty: 'invalid' as any,
      estimatedMinutes: 10,
      questions: [],
    });

    await expect(quiz.save()).rejects.toThrow();
  });

  it('should include questionCount virtual', async () => {
    const quiz = new quizModel({
      title: 'Virtual Test',
      description: 'Testing virtuals',
      category: 'Testing',
      difficulty: 'beginner',
      estimatedMinutes: 5,
      questions: [
        {
          text: 'Q1',
          explanation: 'E1',
          order: 1,
          answers: [{ text: 'A1', isCorrect: true }],
        },
        {
          text: 'Q2',
          explanation: 'E2',
          order: 2,
          answers: [{ text: 'A2', isCorrect: true }],
        },
      ],
    });

    const saved = await quiz.save();
    expect(saved.toJSON().questionCount).toBe(2);
  });
});
```

### 2. Install Test Dependency

```bash
pnpm --filter api add -D mongodb-memory-server
```

### 3. Manual Verification

```bash
# Start the API
pnpm dev:api

# Connect to MongoDB and verify schema
mongosh mongodb://localhost:27017/quiz-app

# In MongoDB shell
db.quizzes.insertOne({
  title: "Test Quiz",
  description: "Test description",
  category: "Agent Fundamentals",
  difficulty: "beginner",
  estimatedMinutes: 10,
  questions: [{
    text: "What is an AI agent?",
    explanation: "An AI agent is...",
    order: 1,
    answers: [
      { text: "A software that acts autonomously", isCorrect: true },
      { text: "A database", isCorrect: false }
    ]
  }],
  isActive: true
})

# Verify insertion
db.quizzes.find().pretty()
```

## Success Criteria

- [ ] All schema files created in correct location
- [ ] TypeScript compilation succeeds
- [ ] Mongoose schema validates required fields
- [ ] Difficulty enum validation works
- [ ] Virtual `questionCount` returns correct value
- [ ] Embedded documents have `_id` fields
- [ ] Indexes created on `category` and `isActive`
- [ ] Schema tests pass

## Notes

### MongoDB Document Size Limit

MongoDB documents have a 16MB size limit. With typical quiz content:

- Average question: ~500 bytes
- Average quiz with 100 questions: ~50KB
- Safe limit: ~30,000 questions per quiz (well beyond realistic needs)

### Future Considerations

1. **Image Support:** Add `imageUrl` fields to Question and Answer schemas
2. **Multiple Correct Answers:** Change `isCorrect` to support multiple selections
3. **Question Types:** Add `type` field for different question formats
4. **Tags:** Add tags array for more granular categorization

## Troubleshooting

**Issue:** Mongoose validation errors

- **Fix:** Check all required fields are provided
- Verify enum values match exactly

**Issue:** Virtual not appearing in JSON

- **Fix:** Ensure `toJSON: { virtuals: true }` is set on schema

**Issue:** Embedded document \_id not generated

- **Fix:** Ensure `@Schema({ _id: true })` decorator is used

**Issue:** Index not created

- **Fix:** Indexes are created on first document insert or manually via `ensureIndexes()`

## Next Step

Proceed to **Step 2: Answer Schema and Relationships** to complete the data model with answer validation and relationship establishment.
