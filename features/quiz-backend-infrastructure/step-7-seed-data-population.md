# Step 7: Seed Data and Population

## Objective

Create a seed service to populate the database with sample quiz content for development and testing. This includes three quizzes aligned with the PRD topics: Agent Fundamentals, Prompt Engineering, and Model Selection.

## Prerequisites

- Step 6 completed (All endpoints working)
- Quiz schema working with validation
- MongoDB connection established

## Implementation Tasks

### 1. Create Seed Data Service (`apps/api/src/database/seeds/quiz-seed.service.ts`)

```typescript
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { Quiz, QuizDocument } from '../../quizzes/schemas/quiz.schema';

interface SeedQuiz {
  title: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedMinutes: number;
  questions: Array<{
    text: string;
    explanation: string;
    order: number;
    answers: Array<{
      text: string;
      isCorrect: boolean;
    }>;
  }>;
}

@Injectable()
export class QuizSeedService implements OnModuleInit {
  private readonly logger = new Logger(QuizSeedService.name);

  constructor(
    @InjectModel(Quiz.name) private quizModel: Model<QuizDocument>,
    private configService: ConfigService,
  ) {}

  async onModuleInit() {
    const shouldSeed =
      this.configService.get<string>('SEED_DATABASE') === 'true';
    const nodeEnv = this.configService.get<string>('NODE_ENV');

    if (shouldSeed || nodeEnv === 'development') {
      await this.seedIfEmpty();
    }
  }

  async seedIfEmpty(): Promise<void> {
    const count = await this.quizModel.countDocuments().exec();

    if (count > 0) {
      this.logger.log(`Database already has ${count} quizzes, skipping seed`);
      return;
    }

    this.logger.log('Seeding database with sample quizzes...');
    await this.seed();
    this.logger.log('Database seeding completed');
  }

  async seed(): Promise<void> {
    const quizzes = this.getSeedData();

    for (const quizData of quizzes) {
      try {
        const quiz = new this.quizModel({
          ...quizData,
          isActive: true,
        });
        await quiz.save();
        this.logger.log(`Created quiz: ${quizData.title}`);
      } catch (error) {
        this.logger.error(`Failed to create quiz: ${quizData.title}`, error);
      }
    }
  }

  async clearAndSeed(): Promise<void> {
    this.logger.warn('Clearing all quizzes...');
    await this.quizModel.deleteMany({}).exec();
    await this.seed();
  }

  private getSeedData(): SeedQuiz[] {
    return [
      this.getAgentFundamentalsQuiz(),
      this.getPromptEngineeringQuiz(),
      this.getModelSelectionQuiz(),
    ];
  }

  private getAgentFundamentalsQuiz(): SeedQuiz {
    return {
      title: 'Agent Fundamentals',
      description:
        'Test your understanding of AI agent design, architecture, and core concepts. Learn about how agents perceive, reason, and act in their environment.',
      category: 'Agent Design',
      difficulty: 'beginner',
      estimatedMinutes: 10,
      questions: [
        {
          text: 'What is the primary purpose of an AI agent?',
          explanation:
            'An AI agent is software designed to perceive its environment through sensors, reason about the information, and take actions to achieve specific goals autonomously.',
          order: 1,
          answers: [
            { text: 'To store large amounts of data', isCorrect: false },
            {
              text: 'To autonomously accomplish tasks and goals',
              isCorrect: true,
            },
            { text: 'To display information to users', isCorrect: false },
            { text: 'To compress files efficiently', isCorrect: false },
          ],
        },
        {
          text: 'Which component is responsible for an agent receiving information about its environment?',
          explanation:
            'Sensors (or perception modules) allow agents to gather information about their environment, which forms the basis for decision-making.',
          order: 2,
          answers: [
            { text: 'Actuators', isCorrect: false },
            { text: 'Sensors', isCorrect: true },
            { text: 'Memory', isCorrect: false },
            { text: 'Goals', isCorrect: false },
          ],
        },
        {
          text: 'What is the "agent loop" in AI systems?',
          explanation:
            'The agent loop is the continuous cycle of perceive-reason-act that agents execute to interact with their environment and work toward their goals.',
          order: 3,
          answers: [
            { text: 'A debugging tool for agents', isCorrect: false },
            { text: 'A type of neural network architecture', isCorrect: false },
            {
              text: 'The perceive-reason-act cycle agents continuously execute',
              isCorrect: true,
            },
            {
              text: 'A method for training reinforcement learning models',
              isCorrect: false,
            },
          ],
        },
        {
          text: 'What is a "tool" in the context of AI agents?',
          explanation:
            'Tools are external capabilities or APIs that agents can invoke to perform specific actions, such as searching the web, executing code, or accessing databases.',
          order: 4,
          answers: [
            {
              text: 'Physical hardware used to run the agent',
              isCorrect: false,
            },
            {
              text: 'External capabilities the agent can invoke to take actions',
              isCorrect: true,
            },
            { text: 'A type of machine learning model', isCorrect: false },
            { text: 'The user interface of the agent', isCorrect: false },
          ],
        },
        {
          text: 'What distinguishes a reactive agent from a deliberative agent?',
          explanation:
            'Reactive agents respond directly to stimuli without internal state, while deliberative agents maintain world models and plan before acting.',
          order: 5,
          answers: [
            {
              text: 'Reactive agents are faster but less intelligent',
              isCorrect: false,
            },
            {
              text: 'Reactive agents respond to stimuli directly, deliberative agents plan first',
              isCorrect: true,
            },
            {
              text: 'Reactive agents use neural networks, deliberative agents use rules',
              isCorrect: false,
            },
            { text: 'There is no difference between them', isCorrect: false },
          ],
        },
        {
          text: 'What is "goal decomposition" in agent planning?',
          explanation:
            'Goal decomposition is breaking down a high-level goal into smaller, manageable sub-goals that can be addressed sequentially or in parallel.',
          order: 6,
          answers: [
            {
              text: 'Removing unnecessary goals from the system',
              isCorrect: false,
            },
            {
              text: 'Breaking high-level goals into smaller sub-goals',
              isCorrect: true,
            },
            { text: 'Combining multiple goals into one', isCorrect: false },
            {
              text: 'Deleting goals that cannot be achieved',
              isCorrect: false,
            },
          ],
        },
        {
          text: 'Why is memory important for AI agents?',
          explanation:
            'Memory allows agents to maintain context, learn from past interactions, and make more informed decisions based on historical information.',
          order: 7,
          answers: [
            { text: 'It is not important for most agents', isCorrect: false },
            {
              text: 'It allows agents to store passwords securely',
              isCorrect: false,
            },
            {
              text: 'It enables context retention and learning from past interactions',
              isCorrect: true,
            },
            { text: 'It is only needed for physical robots', isCorrect: false },
          ],
        },
      ],
    };
  }

  private getPromptEngineeringQuiz(): SeedQuiz {
    return {
      title: 'Prompt Engineering',
      description:
        'Master the art of crafting effective prompts for large language models. Learn techniques for getting better outputs and controlling model behavior.',
      category: 'Prompt Engineering',
      difficulty: 'intermediate',
      estimatedMinutes: 12,
      questions: [
        {
          text: 'What is "few-shot prompting"?',
          explanation:
            'Few-shot prompting involves providing a few examples of the desired input-output behavior to help the model understand the task pattern.',
          order: 1,
          answers: [
            { text: 'Training a model with limited data', isCorrect: false },
            {
              text: 'Providing examples to guide the model response',
              isCorrect: true,
            },
            { text: 'Using very short prompts', isCorrect: false },
            { text: 'Limiting the model response length', isCorrect: false },
          ],
        },
        {
          text: 'What is the purpose of a "system prompt"?',
          explanation:
            'A system prompt sets the context, role, and behavioral guidelines for the AI assistant, establishing how it should respond throughout the conversation.',
          order: 2,
          answers: [
            { text: 'To check if the system is working', isCorrect: false },
            {
              text: 'To set the AI role, context, and behavioral guidelines',
              isCorrect: true,
            },
            { text: 'To restart the conversation', isCorrect: false },
            { text: 'To display system errors', isCorrect: false },
          ],
        },
        {
          text: 'What is "chain-of-thought" prompting?',
          explanation:
            'Chain-of-thought prompting encourages the model to show its reasoning step-by-step, which often leads to more accurate results on complex problems.',
          order: 3,
          answers: [
            { text: 'Connecting multiple models together', isCorrect: false },
            {
              text: 'Asking the model to explain its reasoning step-by-step',
              isCorrect: true,
            },
            { text: 'A way to make responses shorter', isCorrect: false },
            { text: 'Prompting multiple times in sequence', isCorrect: false },
          ],
        },
        {
          text: 'What is "prompt injection" and why is it a concern?',
          explanation:
            'Prompt injection is when malicious inputs attempt to override the system instructions, potentially causing the model to behave in unintended ways.',
          order: 4,
          answers: [
            {
              text: 'Adding more context to improve responses',
              isCorrect: false,
            },
            { text: 'A technique for faster inference', isCorrect: false },
            {
              text: 'Malicious input attempting to override system instructions',
              isCorrect: true,
            },
            { text: 'A method for model fine-tuning', isCorrect: false },
          ],
        },
        {
          text: 'What is the benefit of specifying an output format in your prompt?',
          explanation:
            'Specifying output format (like JSON, markdown, or specific structure) makes responses more predictable and easier to parse programmatically.',
          order: 5,
          answers: [
            { text: 'It makes the model respond faster', isCorrect: false },
            { text: 'It reduces token usage', isCorrect: false },
            {
              text: 'It makes responses predictable and easier to parse',
              isCorrect: true,
            },
            { text: 'It improves model accuracy', isCorrect: false },
          ],
        },
        {
          text: 'What is "zero-shot" prompting?',
          explanation:
            'Zero-shot prompting asks the model to perform a task without providing any examples, relying on its pre-trained knowledge to understand the request.',
          order: 6,
          answers: [
            { text: 'Prompting without any context at all', isCorrect: false },
            {
              text: 'Asking the model to perform a task without examples',
              isCorrect: true,
            },
            {
              text: 'Using the model without any fine-tuning',
              isCorrect: false,
            },
            { text: 'A failed prompt attempt', isCorrect: false },
          ],
        },
        {
          text: 'Why might you include "negative examples" in a prompt?',
          explanation:
            'Negative examples show the model what NOT to do, helping it understand boundaries and avoid common mistakes or undesired outputs.',
          order: 7,
          answers: [
            { text: 'To confuse the model', isCorrect: false },
            { text: 'To show what outputs to avoid', isCorrect: true },
            { text: 'To reduce the response length', isCorrect: false },
            {
              text: 'Negative examples should never be used',
              isCorrect: false,
            },
          ],
        },
        {
          text: 'What is "temperature" in the context of language models?',
          explanation:
            'Temperature controls randomness in model outputs. Lower values (0-0.3) produce more deterministic responses, higher values (0.7-1.0) increase creativity and variation.',
          order: 8,
          answers: [
            { text: 'The CPU temperature during inference', isCorrect: false },
            {
              text: 'A parameter controlling output randomness and creativity',
              isCorrect: true,
            },
            { text: 'The training time required', isCorrect: false },
            { text: 'The model size in parameters', isCorrect: false },
          ],
        },
      ],
    };
  }

  private getModelSelectionQuiz(): SeedQuiz {
    return {
      title: 'Model Selection & Context Management',
      description:
        'Learn how to choose the right AI model for different tasks and effectively manage context windows for optimal performance.',
      category: 'Model Selection',
      difficulty: 'advanced',
      estimatedMinutes: 15,
      questions: [
        {
          text: 'What is a "context window" in language models?',
          explanation:
            'The context window is the maximum amount of text (measured in tokens) that a model can process at once, including both the input prompt and generated output.',
          order: 1,
          answers: [
            {
              text: 'The physical screen where output is displayed',
              isCorrect: false,
            },
            {
              text: 'The maximum tokens a model can process at once',
              isCorrect: true,
            },
            { text: 'A GUI window showing model settings', isCorrect: false },
            { text: 'The time window for API requests', isCorrect: false },
          ],
        },
        {
          text: 'When should you prefer a smaller, faster model over a larger one?',
          explanation:
            'Smaller models are better for simple tasks, high-volume applications, latency-sensitive use cases, and when cost efficiency is important.',
          order: 2,
          answers: [
            { text: 'Always, they are simply better', isCorrect: false },
            {
              text: 'For simple tasks, high volume, or latency-sensitive applications',
              isCorrect: true,
            },
            {
              text: 'Never, larger models are always superior',
              isCorrect: false,
            },
            { text: 'Only when training new models', isCorrect: false },
          ],
        },
        {
          text: 'What is "retrieval-augmented generation" (RAG)?',
          explanation:
            'RAG combines language models with external knowledge retrieval, allowing models to access and cite specific documents beyond their training data.',
          order: 3,
          answers: [
            { text: 'A type of model fine-tuning', isCorrect: false },
            {
              text: 'Combining LLMs with external knowledge retrieval',
              isCorrect: true,
            },
            { text: 'Random answer generation', isCorrect: false },
            { text: 'A method for compressing models', isCorrect: false },
          ],
        },
        {
          text: 'What is "token efficiency" and why does it matter?',
          explanation:
            'Token efficiency is about using context window space effectively. It matters because tokens cost money, affect latency, and determine how much information can be processed.',
          order: 4,
          answers: [
            { text: 'How quickly tokens are generated', isCorrect: false },
            {
              text: 'Optimal use of limited context window space',
              isCorrect: true,
            },
            { text: 'The encryption strength of tokens', isCorrect: false },
            { text: 'Token efficiency is not important', isCorrect: false },
          ],
        },
        {
          text: 'What is "model distillation"?',
          explanation:
            'Model distillation is training a smaller model to mimic a larger model behavior, creating more efficient models that retain much of the capability.',
          order: 5,
          answers: [
            { text: 'Removing water from model weights', isCorrect: false },
            {
              text: 'Training smaller models to mimic larger ones',
              isCorrect: true,
            },
            { text: 'Combining multiple models into one', isCorrect: false },
            {
              text: 'Extracting specific capabilities from a model',
              isCorrect: false,
            },
          ],
        },
        {
          text: 'What factors should influence model selection for production use?',
          explanation:
            'Key factors include task complexity, latency requirements, cost constraints, accuracy needs, context length requirements, and compliance considerations.',
          order: 6,
          answers: [
            { text: 'Only the model parameter count', isCorrect: false },
            {
              text: 'Cost, latency, accuracy, context needs, and compliance',
              isCorrect: true,
            },
            { text: 'Only the release date of the model', isCorrect: false },
            { text: 'The popularity of the model', isCorrect: false },
          ],
        },
        {
          text: 'What is "context stuffing" and when is it problematic?',
          explanation:
            'Context stuffing is filling the entire context window with information. It can be problematic because it increases costs, latency, and may degrade quality due to information overload.',
          order: 7,
          answers: [
            { text: 'Adding minimal context to prompts', isCorrect: false },
            {
              text: 'Filling the context window with excessive information',
              isCorrect: true,
            },
            { text: 'A technique for improving responses', isCorrect: false },
            { text: 'Encrypting sensitive context data', isCorrect: false },
          ],
        },
        {
          text: 'What is the purpose of "embeddings" in AI applications?',
          explanation:
            'Embeddings convert text into numerical vectors that capture semantic meaning, enabling similarity search, clustering, and efficient retrieval operations.',
          order: 8,
          answers: [
            { text: 'To embed images into documents', isCorrect: false },
            {
              text: 'To convert text into semantic numerical vectors',
              isCorrect: true,
            },
            { text: 'To compress model size', isCorrect: false },
            { text: 'To speed up model training', isCorrect: false },
          ],
        },
        {
          text: 'When might you need to fine-tune a model instead of using prompting alone?',
          explanation:
            'Fine-tuning is useful for specialized domains, consistent formatting needs, specific tone requirements, or when prompt engineering alone cannot achieve desired behavior.',
          order: 9,
          answers: [
            {
              text: 'Always, fine-tuning is better than prompting',
              isCorrect: false,
            },
            { text: 'Never, prompting is always sufficient', isCorrect: false },
            {
              text: 'For specialized domains or consistent specific behaviors',
              isCorrect: true,
            },
            { text: 'Only when cost is not a concern', isCorrect: false },
          ],
        },
        {
          text: 'What is "model routing" in multi-model architectures?',
          explanation:
            'Model routing dynamically selects which model to use based on the task complexity, cost considerations, or specific requirements of each request.',
          order: 10,
          answers: [
            { text: 'Physical routing of model servers', isCorrect: false },
            {
              text: 'Dynamically selecting models based on task requirements',
              isCorrect: true,
            },
            { text: 'A method for model training', isCorrect: false },
            { text: 'Routing error messages to models', isCorrect: false },
          ],
        },
      ],
    };
  }
}
```

### 2. Create Seeds Directory and Index

Create `apps/api/src/database/seeds/index.ts`:

```typescript
export * from './quiz-seed.service';
```

### 3. Update DatabaseModule (`apps/api/src/database/database.module.ts`)

```typescript
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Quiz, QuizSchema } from '../quizzes/schemas/quiz.schema';
import { QuizSeedService } from './seeds/quiz-seed.service';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
        retryAttempts: 3,
        retryDelay: 1000,
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([{ name: Quiz.name, schema: QuizSchema }]),
  ],
  providers: [QuizSeedService],
  exports: [QuizSeedService],
})
export class DatabaseModule {}
```

### 4. Add Environment Variable

Update `.env` file:

```env
# Seeding
SEED_DATABASE=true
```

### 5. Create Seed Command (Optional CLI)

Create `apps/api/src/database/seeds/seed.command.ts`:

```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../app.module';
import { QuizSeedService } from './quiz-seed.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const seedService = app.get(QuizSeedService);

  const args = process.argv.slice(2);
  const shouldClear = args.includes('--clear');

  if (shouldClear) {
    console.log('Clearing and reseeding database...');
    await seedService.clearAndSeed();
  } else {
    console.log('Seeding database if empty...');
    await seedService.seedIfEmpty();
  }

  await app.close();
  console.log('Done!');
}

bootstrap().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
```

### 6. Add Seed Script to package.json

Update `apps/api/package.json`:

```json
{
  "scripts": {
    "seed": "ts-node src/database/seeds/seed.command.ts",
    "seed:clear": "ts-node src/database/seeds/seed.command.ts --clear"
  }
}
```

## Files to Create/Modify

| File                                               | Action | Purpose                     |
| -------------------------------------------------- | ------ | --------------------------- |
| `apps/api/src/database/seeds/quiz-seed.service.ts` | Create | Seed service with quiz data |
| `apps/api/src/database/seeds/index.ts`             | Create | Barrel export               |
| `apps/api/src/database/seeds/seed.command.ts`      | Create | CLI seed runner             |
| `apps/api/src/database/database.module.ts`         | Modify | Register seed service       |
| `apps/api/package.json`                            | Modify | Add seed scripts            |
| `.env`                                             | Modify | Add SEED_DATABASE variable  |

## Seed Data Overview

### Quiz 1: Agent Fundamentals

| Property   | Value        |
| ---------- | ------------ |
| Category   | Agent Design |
| Difficulty | Beginner     |
| Questions  | 7            |
| Duration   | 10 minutes   |

**Topics Covered:**

- Agent purpose and definition
- Sensors and perception
- Agent loop (perceive-reason-act)
- Tools and capabilities
- Reactive vs deliberative agents
- Goal decomposition
- Memory importance

### Quiz 2: Prompt Engineering

| Property   | Value              |
| ---------- | ------------------ |
| Category   | Prompt Engineering |
| Difficulty | Intermediate       |
| Questions  | 8                  |
| Duration   | 12 minutes         |

**Topics Covered:**

- Few-shot prompting
- System prompts
- Chain-of-thought reasoning
- Prompt injection security
- Output format specification
- Zero-shot prompting
- Negative examples
- Temperature parameter

### Quiz 3: Model Selection

| Property   | Value           |
| ---------- | --------------- |
| Category   | Model Selection |
| Difficulty | Advanced        |
| Questions  | 10              |
| Duration   | 15 minutes      |

**Topics Covered:**

- Context windows
- Model size trade-offs
- RAG architecture
- Token efficiency
- Model distillation
- Production factors
- Context stuffing
- Embeddings
- Fine-tuning decisions
- Model routing

## Testing Approach

### 1. Seed Service Tests

Create `apps/api/src/database/seeds/quiz-seed.service.spec.ts`:

```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { QuizSeedService } from './quiz-seed.service';
import { Quiz } from '../../quizzes/schemas/quiz.schema';

describe('QuizSeedService', () => {
  let service: QuizSeedService;
  let mockQuizModel: any;

  beforeEach(async () => {
    mockQuizModel = {
      countDocuments: vi.fn().mockReturnValue({ exec: vi.fn() }),
      deleteMany: vi.fn().mockReturnValue({ exec: vi.fn() }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QuizSeedService,
        {
          provide: getModelToken(Quiz.name),
          useValue: mockQuizModel,
        },
        {
          provide: ConfigService,
          useValue: {
            get: vi.fn().mockImplementation((key: string) => {
              if (key === 'NODE_ENV') return 'test';
              if (key === 'SEED_DATABASE') return 'false';
              return null;
            }),
          },
        },
      ],
    }).compile();

    service = module.get<QuizSeedService>(QuizSeedService);
  });

  describe('getSeedData', () => {
    it('should return 3 quizzes', () => {
      const data = (service as any).getSeedData();

      expect(data).toHaveLength(3);
    });

    it('should have all required fields for each quiz', () => {
      const data = (service as any).getSeedData();

      for (const quiz of data) {
        expect(quiz).toHaveProperty('title');
        expect(quiz).toHaveProperty('description');
        expect(quiz).toHaveProperty('category');
        expect(quiz).toHaveProperty('difficulty');
        expect(quiz).toHaveProperty('estimatedMinutes');
        expect(quiz).toHaveProperty('questions');
        expect(quiz.questions.length).toBeGreaterThan(0);
      }
    });

    it('should have exactly one correct answer per question', () => {
      const data = (service as any).getSeedData();

      for (const quiz of data) {
        for (const question of quiz.questions) {
          const correctAnswers = question.answers.filter(
            (a: any) => a.isCorrect,
          );
          expect(correctAnswers).toHaveLength(1);
        }
      }
    });

    it('should have at least 2 answers per question', () => {
      const data = (service as any).getSeedData();

      for (const quiz of data) {
        for (const question of quiz.questions) {
          expect(question.answers.length).toBeGreaterThanOrEqual(2);
        }
      }
    });
  });

  describe('seedIfEmpty', () => {
    it('should skip seeding if database has quizzes', async () => {
      mockQuizModel.countDocuments.mockReturnValue({
        exec: vi.fn().mockResolvedValue(3),
      });

      const seedSpy = vi.spyOn(service, 'seed');

      await service.seedIfEmpty();

      expect(seedSpy).not.toHaveBeenCalled();
    });
  });
});
```

### 2. Manual Verification

```bash
# Start fresh (optional)
mongosh mongodb://localhost:27017/quiz-app
db.quizzes.drop()

# Start API (seeds on startup in dev)
pnpm dev:api

# Verify quizzes were created
curl http://localhost:3000/quizzes

# Check quiz details
curl http://localhost:3000/quizzes/{quiz-id}

# Run seed manually
pnpm --filter api seed

# Clear and reseed
pnpm --filter api seed:clear
```

### 3. Verify Quiz Content

```bash
# Connect to MongoDB
mongosh mongodb://localhost:27017/quiz-app

# Count quizzes
db.quizzes.countDocuments()
# Should return 3

# Check a quiz structure
db.quizzes.findOne({ category: "Agent Design" })

# Verify question count per quiz
db.quizzes.aggregate([
  { $project: { title: 1, questionCount: { $size: "$questions" } } }
])
```

## Success Criteria

- [ ] Seed service created and registered
- [ ] 3 quizzes created with proper structure
- [ ] Each question has exactly one correct answer
- [ ] Each question has 2+ answer options
- [ ] Seed runs automatically on dev startup
- [ ] Seed skips if data already exists
- [ ] Manual seed commands work
- [ ] All quiz validation passes
- [ ] Seed tests pass

## Quiz Content Guidelines

### Educational Value

Each question should:

- Test understanding, not memorization
- Have clear, unambiguous correct answers
- Include explanations that teach the concept
- Progress from basic to advanced within the quiz

### Answer Design

Good answer options:

- One clearly correct answer
- Plausible but incorrect alternatives
- Cover common misconceptions
- Avoid "trick" questions

### Explanation Quality

Explanations should:

- Clarify why the correct answer is right
- Briefly address why others are wrong
- Provide context for learning
- Be concise but comprehensive

## Notes

### Seed Behavior

| Environment | SEED_DATABASE | Behavior             |
| ----------- | ------------- | -------------------- |
| development | any           | Seeds if empty       |
| production  | false         | No seeding           |
| production  | true          | Seeds if empty       |
| test        | any           | No automatic seeding |

### Data Consistency

- Quiz IDs will change on each seed
- Use categories/titles for identification in tests
- Consider fixed IDs for specific test scenarios

### Extending Seed Data

To add more quizzes:

1. Create new method like `getNewTopicQuiz()`
2. Add to `getSeedData()` array
3. Follow existing format precisely

## Troubleshooting

**Issue:** Validation errors during seeding

- **Fix:** Ensure exactly one `isCorrect: true` per question
- Check all required fields are present

**Issue:** Seed runs in production

- **Fix:** Set `SEED_DATABASE=false` in production environment
- Verify `NODE_ENV=production`

**Issue:** Duplicate quiz creation

- **Fix:** Check `countDocuments` logic
- Ensure `seedIfEmpty` is called, not `seed`

**Issue:** Quiz not appearing in API

- **Fix:** Verify `isActive: true` is set
- Check MongoDB connection

## Feature Completion

Congratulations! With this step complete, the Quiz Backend Infrastructure feature is fully implemented:

- [x] Shared Zod schemas and types (Step 0)
- [x] Quiz/Question/Answer schemas (Steps 1-2)
- [x] List and get quiz endpoints (Step 3)
- [x] Quiz submission and scoring (Step 4)
- [x] Attempt tracking (Step 5)
- [x] User history endpoints (Step 6)
- [x] Seed data (Step 7)

## Next Feature

Proceed to **quiz-frontend-experience** to build the React UI for taking quizzes.
