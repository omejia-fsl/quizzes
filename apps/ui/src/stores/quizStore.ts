import { create } from 'zustand';

export interface QuizQuestion {
  id: string;
  questionText: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface Quiz {
  id: string;
  title: string;
  category: string;
  questions: QuizQuestion[];
}

export interface UserAnswer {
  questionId: string;
  selectedAnswer: number;
  isCorrect: boolean;
}

interface QuizState {
  currentQuiz: Quiz | null;
  currentQuestionIndex: number;
  userAnswers: UserAnswer[];
  isComplete: boolean;
}

interface QuizActions {
  startQuiz: (quiz: Quiz) => void;
  answerQuestion: (questionId: string, selectedAnswer: number) => void;
  nextQuestion: () => void;
  resetQuiz: () => void;
  getScore: () => { correct: number; total: number; percentage: number };
}

type QuizStore = QuizState & QuizActions;

export const useQuizStore = create<QuizStore>()((set, get) => ({
  currentQuiz: null,
  currentQuestionIndex: 0,
  userAnswers: [],
  isComplete: false,

  startQuiz: (quiz) => {
    set({
      currentQuiz: quiz,
      currentQuestionIndex: 0,
      userAnswers: [],
      isComplete: false,
    });
  },

  answerQuestion: (questionId, selectedAnswer) => {
    const { currentQuiz, userAnswers } = get();
    if (!currentQuiz) return;

    const question = currentQuiz.questions.find((q) => q.id === questionId);
    if (!question) return;

    const isCorrect = selectedAnswer === question.correctAnswer;

    const existingIndex = userAnswers.findIndex(
      (a) => a.questionId === questionId,
    );
    if (existingIndex >= 0) {
      const newAnswers = [...userAnswers];
      newAnswers[existingIndex] = { questionId, selectedAnswer, isCorrect };
      set({ userAnswers: newAnswers });
    } else {
      set({
        userAnswers: [
          ...userAnswers,
          { questionId, selectedAnswer, isCorrect },
        ],
      });
    }
  },

  nextQuestion: () => {
    const { currentQuiz, currentQuestionIndex } = get();
    if (!currentQuiz) return;

    if (currentQuestionIndex < currentQuiz.questions.length - 1) {
      set({ currentQuestionIndex: currentQuestionIndex + 1 });
    } else {
      set({ isComplete: true });
    }
  },

  resetQuiz: () => {
    set({
      currentQuiz: null,
      currentQuestionIndex: 0,
      userAnswers: [],
      isComplete: false,
    });
  },

  getScore: () => {
    const { userAnswers } = get();
    const correct = userAnswers.filter((a) => a.isCorrect).length;
    const total = userAnswers.length;
    const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;
    return { correct, total, percentage };
  },
}));
