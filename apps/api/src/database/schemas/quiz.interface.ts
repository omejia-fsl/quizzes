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
