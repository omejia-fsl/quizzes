import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { QuizAttempt, QuizAttemptDocument, Quiz } from '../database/schemas';

export interface UserStats {
  totalAttempts: number;
  averageScore: number;
  bestScore: number;
  quizzesCompleted: number;
}

export interface PaginationOptions {
  page?: number;
  limit?: number;
}

export interface AttemptsListResult {
  attempts: QuizAttempt[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@Injectable()
export class AttemptsService {
  constructor(
    @InjectModel(QuizAttempt.name)
    private attemptModel: Model<QuizAttemptDocument>,
    @InjectModel(Quiz.name)
    private quizModel: Model<Quiz>,
  ) {}

  async create(
    result: {
      quizId: string;
      score: number;
      totalQuestions: number;
      percentage: number;
      feedbackLevel: string;
      feedback: string;
      results: Array<{
        questionId: string;
        selectedAnswerId: string;
        isCorrect: boolean;
      }>;
    },
    userId: string,
  ): Promise<QuizAttemptDocument> {
    const attempt = new this.attemptModel({
      userId,
      quizId: result.quizId,
      quizTitle: 'Quiz',
      score: result.score,
      totalQuestions: result.totalQuestions,
      percentage: result.percentage,
      feedbackLevel: result.feedbackLevel,
      feedbackMessage: result.feedback,
      answers: result.results.map((r) => ({
        questionId: r.questionId,
        answerId: r.selectedAnswerId,
        isCorrect: r.isCorrect,
      })),
    });

    return attempt.save();
  }

  async findByUser(
    userId: string,
    pagination: PaginationOptions = {},
  ): Promise<AttemptsListResult> {
    const { page = 1, limit = 10 } = pagination;
    const skip = (page - 1) * limit;

    const [attempts, total] = await Promise.all([
      this.attemptModel
        .find({ userId })
        .select('-answers')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.attemptModel.countDocuments({ userId }).exec(),
    ]);

    return {
      attempts,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findById(attemptId: string, userId?: string): Promise<any> {
    const attempt = await this.attemptModel.findById(attemptId).exec();

    if (!attempt) {
      throw new NotFoundException(`Attempt with ID "${attemptId}" not found`);
    }

    if (userId && attempt.userId !== userId) {
      throw new ForbiddenException(
        'You do not have permission to view this attempt',
      );
    }

    const quiz = await this.quizModel.findById(attempt.quizId).exec();
    if (!quiz) {
      throw new NotFoundException(`Quiz with ID "${attempt.quizId}" not found`);
    }

    const results = attempt.answers
      .map((answer) => {
        const question = quiz.questions.find(
          (q) => q._id.toString() === answer.questionId,
        );
        if (!question) {
          return null;
        }

        const correctAnswer = question.answers.find((a) => a.isCorrect);
        return {
          questionId: answer.questionId,
          selectedAnswerId: answer.answerId,
          correctAnswerId: correctAnswer?._id.toString() || '',
          isCorrect: answer.isCorrect,
          explanation: question.explanation || '',
        };
      })
      .filter((r) => r !== null);

    return {
      id: attempt._id.toString(),
      quizId: attempt.quizId,
      score: attempt.score,
      totalQuestions: attempt.totalQuestions,
      percentage: attempt.percentage,
      completedAt: attempt.createdAt,
      results,
    };
  }

  async getUserStats(userId: string): Promise<UserStats> {
    const attempts = await this.attemptModel
      .find({ userId })
      .select('percentage quizId')
      .exec();

    if (attempts.length === 0) {
      return {
        totalAttempts: 0,
        averageScore: 0,
        bestScore: 0,
        quizzesCompleted: 0,
      };
    }

    const totalAttempts = attempts.length;
    const percentages = attempts.map((a) => a.percentage);
    const averageScore = Math.round(
      percentages.reduce((sum, p) => sum + p, 0) / totalAttempts,
    );
    const bestScore = Math.max(...percentages);
    const uniqueQuizzes = new Set(attempts.map((a) => a.quizId));
    const quizzesCompleted = uniqueQuizzes.size;

    return {
      totalAttempts,
      averageScore,
      bestScore,
      quizzesCompleted,
    };
  }

  async findByQuiz(
    quizId: string,
    userId: string,
    pagination: PaginationOptions = {},
  ): Promise<AttemptsListResult> {
    const { page = 1, limit = 10 } = pagination;
    const skip = (page - 1) * limit;

    const [attempts, total] = await Promise.all([
      this.attemptModel
        .find({ userId, quizId })
        .select('-answers')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.attemptModel.countDocuments({ userId, quizId }).exec(),
    ]);

    return {
      attempts,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}
