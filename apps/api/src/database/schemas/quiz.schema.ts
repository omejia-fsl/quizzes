import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { CallbackError, Types } from 'mongoose';
import { Question, QuestionSchema } from './question.schema';
import type { QuizDocument } from './quiz.interface';

export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

@Schema({ timestamps: true })
export class Quiz {
  @Prop({ type: String, required: true, trim: true, maxlength: 100 })
  title!: string;

  @Prop({ type: String, required: true, maxlength: 500 })
  description!: string;

  @Prop({ type: String, required: true, trim: true, index: true })
  category!: string;

  @Prop({
    type: String,
    required: true,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner',
  })
  difficulty!: Difficulty;

  @Prop({ type: Number, required: true, min: 1 })
  estimatedMinutes!: number;

  @Prop({ type: [QuestionSchema], required: true, default: [] })
  questions!: Question[];

  @Prop({ type: Boolean, default: true, index: true })
  isActive!: boolean;

  @Prop({ type: Date, default: Date.now })
  createdAt!: Date;

  @Prop({ type: Date, default: Date.now })
  updatedAt!: Date;
}

export const QuizSchema = SchemaFactory.createForClass(Quiz);

QuizSchema.virtual('questionCount').get(function () {
  return this.questions?.length || 0;
});

QuizSchema.set('toJSON', { virtuals: true });
QuizSchema.set('toObject', { virtuals: true });

QuizSchema.pre('save', function (next: (err?: CallbackError) => void) {
  const quiz = this as unknown as QuizDocument;

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

QuizSchema.methods.getCorrectAnswerForQuestion = function (
  questionId: string,
): string | null {
  const quiz = this as unknown as QuizDocument;
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
  const quiz = this as unknown as QuizDocument;
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
  const quiz = this as unknown as QuizDocument;

  return {
    id: (quiz._id as Types.ObjectId).toString(),
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
  const quiz = this as unknown as QuizDocument;

  return {
    id: (quiz._id as Types.ObjectId).toString(),
    title: quiz.title,
    description: quiz.description,
    category: quiz.category,
    difficulty: quiz.difficulty,
    questionCount: quiz.questions.length,
    estimatedMinutes: quiz.estimatedMinutes,
  };
};

QuizSchema.index({ category: 1, isActive: 1 });
QuizSchema.index({ createdAt: -1 });
