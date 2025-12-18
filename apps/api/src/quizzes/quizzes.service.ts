import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Quiz,
  QuizDocument,
  QuizSummary,
  PublicQuiz,
} from '../database/schemas';
import type { SubmitQuizDto } from './dto/submit-quiz.dto';
import { ScoringService } from './scoring.service';
import { getFeedbackLevel, getFeedbackMessage } from './dto/submit-quiz.dto';
import type { QuizResultSchema } from '@quiz-app/shared-models/models/quiz';
import type { z } from 'zod';
import { AttemptsService } from '../attempts/attempts.service';

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
  constructor(
    @InjectModel(Quiz.name) private quizModel: Model<QuizDocument>,
    private scoringService: ScoringService,
    private attemptsService: AttemptsService,
  ) {}

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

  async submitQuiz(
    quizId: string,
    userId: string,
    submission: SubmitQuizDto,
  ): Promise<z.infer<typeof QuizResultSchema> & { attemptId: string }> {
    const quiz = await this.findByIdInternal(quizId);

    if (!quiz.isActive) {
      throw new BadRequestException(
        `Quiz "${quiz.title}" is not accepting submissions`,
      );
    }

    const scoringResult = this.scoringService.calculateScore(quiz, submission);

    const feedbackLevel = getFeedbackLevel(scoringResult.percentage);
    const feedback = getFeedbackMessage(
      scoringResult.percentage,
      feedbackLevel,
    );

    const attempt = await this.attemptsService.create(
      {
        quizId: (quiz._id as unknown as { toString: () => string }).toString(),
        score: scoringResult.score,
        totalQuestions: scoringResult.totalQuestions,
        percentage: scoringResult.percentage,
        feedbackLevel,
        feedback,
        results: scoringResult.results,
      },
      userId,
    );

    return {
      attemptId: (
        attempt._id as unknown as { toString: () => string }
      ).toString(),
      quizId: (quiz._id as unknown as { toString: () => string }).toString(),
      score: scoringResult.score,
      totalQuestions: scoringResult.totalQuestions,
      percentage: scoringResult.percentage,
      feedback,
      feedbackLevel,
      results: scoringResult.results,
      completedAt: new Date(),
    };
  }
}
