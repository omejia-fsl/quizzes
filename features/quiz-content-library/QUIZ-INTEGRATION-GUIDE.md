# Quiz Integration Guide

## Overview

This guide walks through integrating the quiz content into the AI Development Quiz App. Three comprehensive quizzes with 30 total questions are ready for import.

## Files Included

1. **quizzes-content.json** - Complete quiz data with metadata (human-readable format)
2. **quiz-seed-data.json** - MongoDB-compatible seed data with ObjectIds
3. **QUIZZES-DOCUMENTATION.md** - Comprehensive content documentation with pedagogical design details
4. **QUIZ-INTEGRATION-GUIDE.md** - This file

## Quick Start: Database Seeding

### Option 1: MongoDB Direct Import

```bash
# Navigate to project root
cd /Users/omejia/Documents/Claude\ Training/quizzes

# Import with mongoimport
mongoimport --uri "mongodb://[connection-string]" \
  --collection quizzes \
  --file quiz-seed-data.json \
  --jsonArray

# Or if using MongoDB Atlas:
mongoimport --uri "mongodb+srv://[user]:[password]@[cluster]" \
  --collection quizzes \
  --file quiz-seed-data.json \
  --jsonArray
```

### Option 2: NestJS Service

Create a seeding service in your API:

```typescript
// apps/api/src/quizzes/quizzes.seeding.service.ts

import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Quiz } from './schemas/quiz.schema';
import quizzesData from '../../../quizzes-content.json';

@Injectable()
export class QuizzesSeededService {
  private readonly logger = new Logger(QuizzesSeededService.name);

  constructor(@InjectModel(Quiz.name) private quizModel: Model<Quiz>) {}

  async seedQuizzes(): Promise<void> {
    try {
      // Check if quizzes already exist
      const count = await this.quizModel.countDocuments();

      if (count > 0) {
        this.logger.log('Quizzes already seeded, skipping...');
        return;
      }

      // Insert quizzes
      const result = await this.quizModel.insertMany(quizzesData.quizzes);
      this.logger.log(`Successfully seeded ${result.length} quizzes`);
    } catch (error) {
      this.logger.error('Failed to seed quizzes', error);
      throw error;
    }
  }
}
```

Use in your app initialization:

```typescript
// apps/api/src/app.module.ts

@Module({
  imports: [
    // ... other imports
    QuizzesModule,
  ],
})
export class AppModule implements OnModuleInit {
  constructor(private quizzesSeededService: QuizzesSeededService) {}

  async onModuleInit() {
    await this.quizzesSeededService.seedQuizzes();
  }
}
```

## Schema Definition

### MongoDB Schema

```typescript
// apps/api/src/quizzes/schemas/quiz.schema.ts

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Question {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  questionText: string;

  @Prop({ required: true, type: [String] })
  options: string[];

  @Prop({ required: true })
  correctAnswerIndex: number;

  @Prop({ required: true })
  explanation: string;

  @Prop({ required: true, enum: ['easy', 'medium', 'hard'] })
  difficulty: string;

  @Prop({ type: [String] })
  tags: string[];
}

@Schema({ timestamps: true })
export class Quiz extends Document {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  title: string;

  @Prop({
    required: true,
    enum: ['agent-design', 'prompt-engineering', 'model-selection'],
  })
  category: string;

  @Prop({ required: true })
  description: string;

  @Prop()
  estimatedCompletionTime: string;

  @Prop({
    required: true,
    enum: ['easy', 'intermediate', 'intermediate-advanced', 'hard'],
  })
  difficulty: string;

  @Prop({ type: [String] })
  tags: string[];

  @Prop({ type: [Question] })
  questions: Question[];
}

export const QuizSchema = SchemaFactory.createForClass(Quiz);
```

## API Endpoints

### Recommended NestJS Controller

```typescript
// apps/api/src/quizzes/quizzes.controller.ts

import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { QuizzesService } from './quizzes.service';

@Controller('api/quizzes')
export class QuizzesController {
  constructor(private readonly quizzesService: QuizzesService) {}

  @Get()
  async getAllQuizzes() {
    return this.quizzesService.findAll();
  }

  @Get('/category/:category')
  async getQuizzesByCategory(@Param('category') category: string) {
    return this.quizzesService.findByCategory(category);
  }

  @Get('/:id')
  async getQuiz(@Param('id') id: string) {
    return this.quizzesService.findById(id);
  }

  @Post('/:id/submit')
  async submitQuizAnswer(
    @Param('id') quizId: string,
    @Body() submitData: { questionId: string; selectedIndex: number },
  ) {
    return this.quizzesService.validateAnswer(
      quizId,
      submitData.questionId,
      submitData.selectedIndex,
    );
  }
}
```

### Service Implementation

```typescript
// apps/api/src/quizzes/quizzes.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Quiz } from './schemas/quiz.schema';

@Injectable()
export class QuizzesService {
  constructor(@InjectModel(Quiz.name) private quizModel: Model<Quiz>) {}

  async findAll() {
    return this.quizModel.find().select('-questions.explanation');
  }

  async findByCategory(category: string) {
    return this.quizModel.find({ category }).select('-questions.explanation');
  }

  async findById(id: string) {
    const quiz = await this.quizModel.findOne({ id });
    if (!quiz) {
      throw new NotFoundException(`Quiz with id ${id} not found`);
    }
    // Don't send explanations initially
    return {
      ...quiz.toObject(),
      questions: quiz.questions.map((q) => ({
        ...q,
        explanation: undefined, // Revealed after submission
      })),
    };
  }

  async validateAnswer(
    quizId: string,
    questionId: string,
    selectedIndex: number,
  ) {
    const quiz = await this.quizModel.findOne({ id: quizId });
    if (!quiz) {
      throw new NotFoundException(`Quiz with id ${quizId} not found`);
    }

    const question = quiz.questions.find((q) => q.id === questionId);
    if (!question) {
      throw new NotFoundException(`Question with id ${questionId} not found`);
    }

    const isCorrect = selectedIndex === question.correctAnswerIndex;
    return {
      isCorrect,
      correctAnswerIndex: question.correctAnswerIndex,
      explanation: question.explanation,
    };
  }
}
```

## Frontend Integration

### React Hook for Quiz Fetching

```typescript
// apps/ui/src/hooks/useQuiz.ts

import { useQuery } from '@tanstack/react-query';

const QUIZ_QUERY_KEYS = {
  all: ['quizzes'] as const,
  lists: () => [...QUIZ_QUERY_KEYS.all, 'list'] as const,
  byCategory: (category: string) =>
    [...QUIZ_QUERY_KEYS.all, 'category', category] as const,
  detail: (id: string) => [...QUIZ_QUERY_KEYS.all, 'detail', id] as const,
};

export const useQuiz = (id: string) => {
  return useQuery({
    queryKey: QUIZ_QUERY_KEYS.detail(id),
    queryFn: async () => {
      const response = await fetch(`/api/quizzes/${id}`);
      if (!response.ok) throw new Error('Failed to fetch quiz');
      return response.json();
    },
  });
};

export const useQuizzes = () => {
  return useQuery({
    queryKey: QUIZ_QUERY_KEYS.lists(),
    queryFn: async () => {
      const response = await fetch('/api/quizzes');
      if (!response.ok) throw new Error('Failed to fetch quizzes');
      return response.json();
    },
  });
};

export const useQuizzesByCategory = (category: string) => {
  return useQuery({
    queryKey: QUIZ_QUERY_KEYS.byCategory(category),
    queryFn: async () => {
      const response = await fetch(`/api/quizzes/category/${category}`);
      if (!response.ok) throw new Error('Failed to fetch quizzes');
      return response.json();
    },
  });
};
```

## Content Statistics

### Quiz Distribution

| Quiz               | Questions | Easy  | Medium | Hard  | Est. Time   |
| ------------------ | --------- | ----- | ------ | ----- | ----------- |
| Agent Design       | 10        | 2     | 5      | 3     | 12-15 min   |
| Prompt Engineering | 10        | 2     | 6      | 2     | 12-15 min   |
| Model Selection    | 11        | 2     | 6      | 3     | 15-18 min   |
| **Total**          | **31**    | **6** | **17** | **8** | **~45 min** |

### Category Distribution

- Agent Design Fundamentals: 10 questions
- Prompt Engineering Best Practices: 10 questions
- Model Selection and Usage: 11 questions

### Question Tags (for filtering/recommendations)

**Agent Design Tags**:

- agent-loop, planning, tools, agent-design, scalability, memory
- reflection, multi-step-tasks, state-management, error-handling
- reactive-agents, prompting, hierarchical-agents, modularity
- agent-safety, loops, reliability, agent-autonomy, safety, governance

**Prompt Engineering Tags**:

- system-prompt, prompting, few-shot, accuracy, chain-of-thought
- reasoning, context-management, efficiency, prompt-optimization, temperature
- user-prompt, context, prompt-design, examples, code-generation
- prompt-structure, specifications, output-format, structured-output
- negative-prompting, prompt-strategy, optimization

**Model Selection Tags**:

- context-window, tokens, model-selection, batch-processing, streaming
- cost-optimization, temperature, model-parameters, creativity, consistency
- factual-tasks, trade-offs, cost-quality, user-experience, latency
- top-p, nucleus-sampling, max-tokens, cost-control, parameters
- multimodal, vision

## Testing Integration

### Unit Tests for Seeding

```typescript
// apps/api/src/quizzes/quizzes.seeding.service.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { QuizzesSeededService } from './quizzes.seeding.service';
import { Quiz } from './schemas/quiz.schema';

describe('QuizzesSeededService', () => {
  let service: QuizzesSeededService;
  let mockQuizModel: any;

  beforeEach(async () => {
    mockQuizModel = {
      countDocuments: jest.fn(),
      insertMany: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QuizzesSeededService,
        {
          provide: getModelToken(Quiz.name),
          useValue: mockQuizModel,
        },
      ],
    }).compile();

    service = module.get<QuizzesSeededService>(QuizzesSeededService);
  });

  it('should seed quizzes on first run', async () => {
    mockQuizModel.countDocuments.mockResolvedValue(0);
    mockQuizModel.insertMany.mockResolvedValue([{}, {}, {}]);

    await service.seedQuizzes();

    expect(mockQuizModel.insertMany).toHaveBeenCalled();
  });

  it('should skip seeding if quizzes already exist', async () => {
    mockQuizModel.countDocuments.mockResolvedValue(3);

    await service.seedQuizzes();

    expect(mockQuizModel.insertMany).not.toHaveBeenCalled();
  });
});
```

## Validation Checklist

Before deploying, verify:

- [ ] MongoDB connection is configured
- [ ] All 31 questions are imported
- [ ] Quiz categories are correctly indexed
- [ ] API endpoints respond with correct structure
- [ ] Frontend can fetch and display quizzes
- [ ] Explanations are hidden until submission
- [ ] Correct answer validation works
- [ ] Score calculation is accurate
- [ ] User progress persists across sessions

## Performance Optimization

### Database Indexing

```typescript
// apps/api/src/quizzes/schemas/quiz.schema.ts

QuizSchema.index({ category: 1 });
QuizSchema.index({ difficulty: 1 });
QuizSchema.index({ tags: 1 });
QuizSchema.index({ 'questions.tags': 1 });
```

### Query Optimization

```typescript
// apps/api/src/quizzes/quizzes.service.ts

// Avoid N+1 queries - select only needed fields
async findAll() {
  return this.quizModel
    .find()
    .select('id title category difficulty estimatedCompletionTime');
}

// Use lean() for read-only operations
async findByCategory(category: string) {
  return this.quizModel
    .find({ category })
    .lean()
    .select('id title difficulty');
}
```

## Monitoring & Maintenance

### Track Quiz Performance

Monitor:

1. Average completion time vs estimated time
2. Score distribution by quiz
3. Question difficulty calibration
4. Common incorrect answer patterns
5. Quiz completion rates

Use this data to:

- Identify questions that may be poorly calibrated
- Update explanations based on common errors
- Improve difficult questions
- Add new questions based on learner needs

## Support & Resources

For detailed pedagogical design:

- See `QUIZZES-DOCUMENTATION.md` for complete design rationale
- Review question-by-question breakdown with teaching points
- Check explanation quality and distractor analysis

For technical issues:

- Verify MongoDB connectivity
- Check API response schemas
- Validate question data structure
- Test authentication/authorization if needed

For content updates:

- Follow the same question structure format
- Ensure difficulty is properly calibrated
- Include comprehensive explanations
- Use plausible, relevant distractors
