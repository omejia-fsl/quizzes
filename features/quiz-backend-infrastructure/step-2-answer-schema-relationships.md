# Step 2: Answer Schema Validation and Relationships

## Objective

Enhance the quiz schemas with validation logic to ensure data integrity, add helper methods for common operations, and establish proper document relationships. This step focuses on ensuring exactly one correct answer per question and providing utility methods for quiz management.

## Prerequisites

- Step 1 completed (Quiz, Question, Answer schemas created)
- MongoDB connection working
- Mongoose schemas compiling without errors

## Implementation Tasks

### 1. Add Schema Validation Middleware (`apps/api/src/quizzes/schemas/quiz.schema.ts`)

Update the Quiz schema to add validation ensuring each question has exactly one correct answer.

```typescript
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, CallbackError } from 'mongoose';
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

QuizSchema.pre('save', function (next: (err?: CallbackError) => void) {
  const quiz = this as QuizDocument;

  for (let i = 0; i < quiz.questions.length; i++) {
    const question = quiz.questions[i];
    const correctAnswers = question.answers.filter((a) => a.isCorrect);

    if (correctAnswers.length === 0) {
      return next(
        new Error(
          `Question ${i + 1} ("${question.text.substring(0, 30)}...") must have at least one correct answer`,
        ),
      );
    }

    if (correctAnswers.length > 1) {
      return next(
        new Error(
          `Question ${i + 1} ("${question.text.substring(0, 30)}...") has multiple correct answers. Only one is allowed.`,
        ),
      );
    }

    if (question.answers.length < 2) {
      return next(
        new Error(
          `Question ${i + 1} ("${question.text.substring(0, 30)}...") must have at least 2 answer options`,
        ),
      );
    }
  }

  next();
});

QuizSchema.index({ category: 1, isActive: 1 });
QuizSchema.index({ createdAt: -1 });
```

### 2. Add Instance Methods to Quiz Schema

Add helper methods for common quiz operations.

```typescript
QuizSchema.methods.getCorrectAnswerForQuestion = function (
  questionId: string,
): string | null {
  const quiz = this as QuizDocument;
  const question = quiz.questions.find((q) => q._id.toString() === questionId);

  if (!question) return null;

  const correctAnswer = question.answers.find((a) => a.isCorrect);
  return correctAnswer ? correctAnswer._id.toString() : null;
};

QuizSchema.methods.calculateScore = function (
  userAnswers: Array<{ questionId: string; answerId: string }>,
): {
  score: number;
  total: number;
  results: Array<{
    questionId: string;
    isCorrect: boolean;
    correctAnswerId: string;
  }>;
} {
  const quiz = this as QuizDocument;
  let score = 0;
  const results: Array<{
    questionId: string;
    isCorrect: boolean;
    correctAnswerId: string;
  }> = [];

  for (const question of quiz.questions) {
    const userAnswer = userAnswers.find(
      (a) => a.questionId === question._id.toString(),
    );
    const correctAnswer = question.answers.find((a) => a.isCorrect);
    const correctAnswerId = correctAnswer?._id.toString() || '';

    const isCorrect = userAnswer?.answerId === correctAnswerId;

    if (isCorrect) score++;

    results.push({
      questionId: question._id.toString(),
      isCorrect,
      correctAnswerId,
    });
  }

  return {
    score,
    total: quiz.questions.length,
    results,
  };
};

QuizSchema.methods.toPublicJSON = function () {
  const quiz = this as QuizDocument;

  return {
    id: quiz._id.toString(),
    title: quiz.title,
    description: quiz.description,
    category: quiz.category,
    difficulty: quiz.difficulty,
    estimatedMinutes: quiz.estimatedMinutes,
    questions: quiz.questions.map((q) => ({
      id: q._id.toString(),
      text: q.text,
      order: q.order,
      answers: q.answers.map((a) => ({
        id: a._id.toString(),
        text: a.text,
      })),
    })),
  };
};

QuizSchema.methods.toSummaryJSON = function () {
  const quiz = this as QuizDocument;

  return {
    id: quiz._id.toString(),
    title: quiz.title,
    description: quiz.description,
    category: quiz.category,
    difficulty: quiz.difficulty,
    questionCount: quiz.questions.length,
    estimatedMinutes: quiz.estimatedMinutes,
  };
};
```

### 3. Create Quiz Document Interface (`apps/api/src/quizzes/schemas/quiz.interface.ts`)

Define TypeScript interface for the enhanced document.

```typescript
import { Document, Types } from 'mongoose';

export interface AnswerDocument {
  _id: Types.ObjectId;
  text: string;
  isCorrect: boolean;
}

export interface QuestionDocument {
  _id: Types.ObjectId;
  text: string;
  explanation: string;
  order: number;
  answers: AnswerDocument[];
}

export interface QuizMethods {
  getCorrectAnswerForQuestion(questionId: string): string | null;
  calculateScore(
    userAnswers: Array<{ questionId: string; answerId: string }>,
  ): {
    score: number;
    total: number;
    results: Array<{
      questionId: string;
      isCorrect: boolean;
      correctAnswerId: string;
    }>;
  };
  toPublicJSON(): PublicQuiz;
  toSummaryJSON(): QuizSummary;
}

export interface PublicAnswer {
  id: string;
  text: string;
}

export interface PublicQuestion {
  id: string;
  text: string;
  order: number;
  answers: PublicAnswer[];
}

export interface PublicQuiz {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  estimatedMinutes: number;
  questions: PublicQuestion[];
}

export interface QuizSummary {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  questionCount: number;
  estimatedMinutes: number;
}

export interface QuizDocument extends Document, QuizMethods {
  title: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedMinutes: number;
  questions: QuestionDocument[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  questionCount: number;
}
```

### 4. Update Schema Index Export (`apps/api/src/quizzes/schemas/index.ts`)

```typescript
export * from './answer.schema';
export * from './question.schema';
export * from './quiz.schema';
export * from './quiz.interface';
```

### 5. Add Static Methods for Querying (`apps/api/src/quizzes/schemas/quiz.schema.ts`)

Add these static methods at the end of the schema file:

```typescript
QuizSchema.statics.findActiveQuizzes = function () {
  return this.find({ isActive: true })
    .select('title description category difficulty estimatedMinutes questions')
    .sort({ createdAt: -1 });
};

QuizSchema.statics.findByCategory = function (category: string) {
  return this.find({ isActive: true, category })
    .select('title description category difficulty estimatedMinutes questions')
    .sort({ createdAt: -1 });
};

QuizSchema.statics.getCategories = function () {
  return this.distinct('category', { isActive: true });
};
```

## Files to Create/Modify

| File                                             | Action | Purpose                               |
| ------------------------------------------------ | ------ | ------------------------------------- |
| `apps/api/src/quizzes/schemas/quiz.schema.ts`    | Modify | Add validation middleware and methods |
| `apps/api/src/quizzes/schemas/quiz.interface.ts` | Create | TypeScript interfaces for methods     |
| `apps/api/src/quizzes/schemas/index.ts`          | Modify | Export interfaces                     |

## Validation Rules Summary

| Rule                                    | Location      | Error Message                                      |
| --------------------------------------- | ------------- | -------------------------------------------------- |
| Exactly one correct answer per question | pre-save hook | "Question N must have at least one correct answer" |
| Minimum 2 answers per question          | pre-save hook | "Question N must have at least 2 answer options"   |
| No multiple correct answers             | pre-save hook | "Question N has multiple correct answers"          |

## Testing Approach

### 1. Validation Tests

Create `apps/api/src/quizzes/schemas/quiz-validation.spec.ts`:

```typescript
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Model } from 'mongoose';
import { Quiz, QuizSchema } from './quiz.schema';
import { QuizDocument } from './quiz.interface';

describe('Quiz Schema Validation', () => {
  let mongod: MongoMemoryServer;
  let quizModel: Model<QuizDocument>;
  let module: TestingModule;

  const validQuizData = {
    title: 'Test Quiz',
    description: 'A test quiz',
    category: 'Testing',
    difficulty: 'beginner',
    estimatedMinutes: 10,
    questions: [
      {
        text: 'What is 2 + 2?',
        explanation: 'Basic addition',
        order: 1,
        answers: [
          { text: '3', isCorrect: false },
          { text: '4', isCorrect: true },
          { text: '5', isCorrect: false },
        ],
      },
    ],
  };

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

  describe('Answer Validation', () => {
    it('should reject question with no correct answer', async () => {
      const quiz = new quizModel({
        ...validQuizData,
        questions: [
          {
            text: 'Question without correct answer',
            explanation: 'Test',
            order: 1,
            answers: [
              { text: 'A', isCorrect: false },
              { text: 'B', isCorrect: false },
            ],
          },
        ],
      });

      await expect(quiz.save()).rejects.toThrow(
        /must have at least one correct answer/,
      );
    });

    it('should reject question with multiple correct answers', async () => {
      const quiz = new quizModel({
        ...validQuizData,
        questions: [
          {
            text: 'Question with multiple correct',
            explanation: 'Test',
            order: 1,
            answers: [
              { text: 'A', isCorrect: true },
              { text: 'B', isCorrect: true },
            ],
          },
        ],
      });

      await expect(quiz.save()).rejects.toThrow(/has multiple correct answers/);
    });

    it('should reject question with only one answer option', async () => {
      const quiz = new quizModel({
        ...validQuizData,
        questions: [
          {
            text: 'Single answer question',
            explanation: 'Test',
            order: 1,
            answers: [{ text: 'Only option', isCorrect: true }],
          },
        ],
      });

      await expect(quiz.save()).rejects.toThrow(
        /must have at least 2 answer options/,
      );
    });

    it('should accept valid quiz with proper answers', async () => {
      const quiz = new quizModel(validQuizData);
      const saved = await quiz.save();

      expect(saved._id).toBeDefined();
      expect(saved.questions[0].answers).toHaveLength(3);
    });
  });

  describe('Instance Methods', () => {
    it('should calculate score correctly', async () => {
      const quiz = new quizModel(validQuizData);
      const saved = await quiz.save();

      const questionId = saved.questions[0]._id.toString();
      const correctAnswerId = saved.questions[0].answers
        .find((a) => a.isCorrect)
        ?._id.toString();

      const result = saved.calculateScore([
        { questionId, answerId: correctAnswerId! },
      ]);

      expect(result.score).toBe(1);
      expect(result.total).toBe(1);
      expect(result.results[0].isCorrect).toBe(true);
    });

    it('should return 0 for wrong answers', async () => {
      const quiz = new quizModel(validQuizData);
      const saved = await quiz.save();

      const questionId = saved.questions[0]._id.toString();
      const wrongAnswerId = saved.questions[0].answers
        .find((a) => !a.isCorrect)
        ?._id.toString();

      const result = saved.calculateScore([
        { questionId, answerId: wrongAnswerId! },
      ]);

      expect(result.score).toBe(0);
      expect(result.results[0].isCorrect).toBe(false);
    });

    it('should generate public JSON without isCorrect', async () => {
      const quiz = new quizModel(validQuizData);
      const saved = await quiz.save();

      const publicJson = saved.toPublicJSON();

      expect(publicJson.id).toBe(saved._id.toString());
      expect(publicJson.questions[0].answers[0]).not.toHaveProperty(
        'isCorrect',
      );
    });

    it('should generate summary JSON with question count', async () => {
      const quiz = new quizModel(validQuizData);
      const saved = await quiz.save();

      const summary = saved.toSummaryJSON();

      expect(summary.questionCount).toBe(1);
      expect(summary).not.toHaveProperty('questions');
    });
  });
});
```

### 2. Run Tests

```bash
pnpm test:api
```

## Success Criteria

- [ ] Pre-save validation prevents quizzes with invalid answer configurations
- [ ] Error messages are descriptive and include question identification
- [ ] `calculateScore` method returns accurate scoring
- [ ] `toPublicJSON` excludes `isCorrect` from answers
- [ ] `toSummaryJSON` excludes full questions array
- [ ] Static query methods work correctly
- [ ] All validation tests pass
- [ ] TypeScript interfaces match schema methods

## Design Rationale

### Why Validate in Pre-Save Hook?

1. **Database Integrity:** Ensures invalid data never persists
2. **Single Source of Truth:** Validation logic in one place
3. **Works with All Operations:** Applies to inserts and updates
4. **Early Failure:** Catches errors before write operations

### Why Instance Methods on Schema?

1. **Encapsulation:** Scoring logic lives with the data
2. **Reusability:** Methods available wherever quiz documents are used
3. **Type Safety:** TypeScript knows about the methods
4. **Testing:** Can test business logic independently

## Notes

### Handling Updates

The pre-save hook runs on:

- `document.save()`
- `Model.create()`

It does NOT run on:

- `Model.updateOne()`
- `Model.findByIdAndUpdate()`

For update operations, consider adding a pre-findOneAndUpdate hook or validating in the service layer.

### Performance Considerations

- Validation adds minimal overhead (array iteration)
- Methods are efficient for typical quiz sizes
- Static methods use indexes for fast queries

## Troubleshooting

**Issue:** Validation not running on updates

- **Fix:** Use `document.save()` instead of `findByIdAndUpdate()`
- Or add `runValidators: true` option to update operations

**Issue:** Methods not available on document

- **Fix:** Ensure methods are defined before `SchemaFactory.createForClass()`
- Verify interface extends Document

**Issue:** TypeScript errors with methods

- **Fix:** Ensure QuizDocument interface includes method signatures
- Cast model results to QuizDocument type

## Next Step

Proceed to **Step 3: QuizzesModule and List/Get Endpoints** to create the NestJS module and implement the API endpoints for listing and retrieving quizzes.
