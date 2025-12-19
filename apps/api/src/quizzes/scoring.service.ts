import { Injectable, BadRequestException } from '@nestjs/common';
import { Types } from 'mongoose';
import type { QuizDocument } from '../database/schemas';
import type { SubmitQuizDto } from './dto/submit-quiz.dto';

export interface QuestionResult {
  questionId: string;
  selectedAnswerId: string;
  correctAnswerId: string;
  isCorrect: boolean;
  explanation: string;
}

export interface ScoringResult {
  score: number;
  totalQuestions: number;
  percentage: number;
  results: QuestionResult[];
}

@Injectable()
export class ScoringService {
  validateAnswers(quiz: QuizDocument, submission: SubmitQuizDto): void {
    const submittedQuestionIds = new Set<string>();

    for (const answer of submission.answers) {
      if (submittedQuestionIds.has(answer.questionId)) {
        throw new BadRequestException(
          `Duplicate answer for question ${answer.questionId}`,
        );
      }
      submittedQuestionIds.add(answer.questionId);

      const question = quiz.questions.find(
        (q) => q._id.toString() === answer.questionId,
      );

      if (!question) {
        throw new BadRequestException(
          `Invalid question ID: ${answer.questionId}`,
        );
      }

      const answerExists = question.answers.some(
        (a) => a._id.toString() === answer.answerId,
      );

      if (!answerExists) {
        throw new BadRequestException(
          `Invalid answer ID: ${answer.answerId} for question: ${answer.questionId}`,
        );
      }
    }

    if (submission.answers.length !== quiz.questions.length) {
      throw new BadRequestException(
        `Must answer all ${quiz.questions.length} questions. Only ${submission.answers.length} provided.`,
      );
    }
  }

  calculateScore(quiz: QuizDocument, submission: SubmitQuizDto): ScoringResult {
    this.validateAnswers(quiz, submission);

    let correctCount = 0;
    const results: QuestionResult[] = [];

    for (const answer of submission.answers) {
      const question = quiz.questions.find(
        (q) => q._id.toString() === answer.questionId,
      )!;

      const userAnswer = question.answers.find(
        (a) => a._id.toString() === answer.answerId,
      )!;

      const correctAnswer = question.answers.find((a) => a.isCorrect)!;

      const isCorrect = userAnswer._id.equals(
        correctAnswer._id as Types.ObjectId,
      );

      if (isCorrect) {
        correctCount++;
      }

      results.push({
        questionId: question._id.toString(),
        selectedAnswerId: userAnswer._id.toString(),
        correctAnswerId: correctAnswer._id.toString(),
        isCorrect,
        explanation: question.explanation || '',
      });
    }

    const totalQuestions = quiz.questions.length;
    const percentage = Math.round((correctCount / totalQuestions) * 100);

    return {
      score: correctCount,
      totalQuestions,
      percentage,
      results,
    };
  }
}
