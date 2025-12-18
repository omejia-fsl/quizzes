import { useState } from 'react';
import { useNavigate, Link } from '@tanstack/react-router';
import { useAuth } from '../../../hooks/useAuth';
import { useSubmitQuizMutation } from '../../../api/mutations/quizzes.ts';
import type { SubmitAnswerDto } from '../../../api/endpoints/quizzes.ts';
import { useQuizQuery } from '../../../api/queries/quizzes.ts';

interface QuizDetailProps {
  quizId: string;
}

export const QuizDetailPage = ({ quizId }: QuizDetailProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: quiz, isLoading, error } = useQuizQuery(quizId);
  const { mutate: submitQuiz } = useSubmitQuizMutation();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<string, string>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-800 dark:text-red-200">
        <p className="font-semibold">Error loading quiz</p>
        <p className="text-sm">{error?.message || 'An error occurred'}</p>
      </div>
    );
  }

  if (!quiz) {
    return <div>Quiz not found</div>;
  }

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg overflow-hidden">
          <div className="bg-blue-600 dark:bg-blue-700 text-white p-6">
            <h1 className="text-2xl font-bold mb-2">{quiz.title}</h1>
            <p className="text-blue-100 dark:text-blue-200">
              {quiz.description}
            </p>
            <div className="flex items-center gap-4 mt-4 text-sm">
              <span className="bg-blue-500 dark:bg-blue-600 px-3 py-1 rounded-full">
                {quiz.difficulty}
              </span>
              <span>{quiz.questionCount} questions</span>
              <span>{quiz.estimatedMinutes} minutes</span>
            </div>
          </div>

          <div className="p-8 bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 dark:border-yellow-600">
            <div className="flex items-start gap-4">
              <svg
                className="w-8 h-8 text-yellow-600 dark:text-yellow-400 shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900 dark:text-slate-100 mb-2">
                  Login Required
                </h2>
                <p className="text-gray-700 dark:text-slate-300 mb-4">
                  You must be logged in to take quizzes and save your results.
                  Create an account or sign in to track your progress and view
                  your quiz history.
                </p>
                <div className="flex gap-3">
                  <Link
                    to="/login"
                    className="px-6 py-3 bg-blue-600 dark:bg-blue-700 text-white font-medium rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="px-6 py-3 bg-green-600 dark:bg-green-700 text-white font-medium rounded-lg hover:bg-green-700 dark:hover:bg-green-600 transition-colors"
                  >
                    Register
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="p-8">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-4">
              Preview: This quiz contains {quiz.questionCount} questions
            </h3>
            <p className="text-gray-600 dark:text-slate-300">
              Topics covered: {quiz.category} • Difficulty: {quiz.difficulty}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;
  const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;
  const hasSelectedAnswer = !!selectedAnswers[currentQuestion.id];

  const handleAnswerSelect = (answerId: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: answerId,
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    const answers: SubmitAnswerDto[] = quiz.questions.map((question) => ({
      questionId: question.id,
      answerId: selectedAnswers[question.id],
    }));

    submitQuiz(
      {
        quizId: quiz.id,
        submission: { answers },
      },
      {
        onSuccess: (data) => {
          setIsSubmitting(false);
          void navigate({
            to: '/quizzes/$quizId/results',
            params: { quizId: quiz.id },
            search: { attemptId: data.attemptId },
          });
        },
        onError: () => {
          setIsSubmitting(false);
        },
      },
    );
  };

  const allQuestionsAnswered = quiz.questions.every(
    (question) => selectedAnswers[question.id],
  );

  if (isSubmitting) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg overflow-hidden p-12">
          <div className="flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 dark:border-blue-400 mb-4"></div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-100 mb-2">
              Submitting Your Quiz...
            </h2>
            <p className="text-gray-600 dark:text-slate-300">
              Please wait while we process your answers.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg overflow-hidden">
        <div className="bg-blue-600 dark:bg-blue-700 text-white p-6">
          <h1 className="text-2xl font-bold mb-2">{quiz.title}</h1>
          <p className="text-blue-100 dark:text-blue-200">{quiz.description}</p>
          <div className="flex items-center gap-4 mt-4 text-sm">
            <span className="bg-blue-500 dark:bg-blue-600 px-3 py-1 rounded-full">
              {quiz.difficulty}
            </span>
            <span>{quiz.questionCount} questions</span>
            <span>{quiz.estimatedMinutes} minutes</span>
          </div>
        </div>

        <div className="p-2 bg-gray-100 dark:bg-slate-700">
          <div className="relative h-2 bg-gray-300 dark:bg-slate-600 rounded-full overflow-hidden">
            <div
              className="absolute top-0 left-0 h-full bg-blue-600 dark:bg-blue-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="text-xs text-gray-600 dark:text-slate-300 mt-1 text-center">
            Question {currentQuestionIndex + 1} of {quiz.questions.length}
          </div>
        </div>

        <div className="p-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-slate-100 mb-6">
            {currentQuestion.text}
          </h2>

          <div className="space-y-3">
            {currentQuestion.answers.map((answer) => {
              const isSelected =
                selectedAnswers[currentQuestion.id] === answer.id;

              return (
                <button
                  key={answer.id}
                  onClick={() => handleAnswerSelect(answer.id)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                    isSelected
                      ? 'border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/30'
                      : 'border-gray-200 dark:border-slate-600 hover:border-gray-300 dark:hover:border-slate-500 hover:bg-gray-50 dark:hover:bg-slate-700'
                  }`}
                >
                  <div className="flex items-center">
                    <div
                      className={`w-5 h-5 rounded-full border-2 mr-3 shrink-0 flex items-center justify-center ${
                        isSelected
                          ? 'border-blue-500 dark:border-blue-400 bg-blue-500 dark:bg-blue-400'
                          : 'border-gray-300 dark:border-slate-500'
                      }`}
                    >
                      {isSelected && (
                        <svg
                          className="w-3 h-3 text-white"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </div>
                    <span className="text-gray-900 dark:text-slate-100">
                      {answer.text}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-slate-700 p-6 bg-gray-50 dark:bg-slate-900 flex justify-between items-center">
          <button
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className="px-6 py-2 text-gray-700 dark:text-slate-200 font-medium rounded-lg border border-gray-300 dark:border-slate-600 hover:bg-gray-100 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>

          <div className="text-sm text-gray-600 dark:text-slate-300">
            {Object.keys(selectedAnswers).length} of {quiz.questions.length}{' '}
            answered
          </div>

          {!isLastQuestion ? (
            <button
              onClick={handleNext}
              disabled={!hasSelectedAnswer}
              className="px-6 py-2 bg-blue-600 dark:bg-blue-700 text-white font-medium rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!allQuestionsAnswered || isSubmitting}
              className="px-6 py-2 bg-green-600 dark:bg-green-700 text-white font-medium rounded-lg hover:bg-green-700 dark:hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Quiz'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
