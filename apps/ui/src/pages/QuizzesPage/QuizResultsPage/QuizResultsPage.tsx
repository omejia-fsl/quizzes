import { Link } from '@tanstack/react-router';
import { useAttempt, useQuiz } from '../../../hooks/useQuizzes';

interface QuizResultsProps {
  quizId: string;
  attemptId: string;
}

export const QuizResultsPage = ({ quizId, attemptId }: QuizResultsProps) => {
  const {
    data: attempt,
    isLoading: attemptLoading,
    error: attemptError,
  } = useAttempt(attemptId);
  const {
    data: quiz,
    isLoading: quizLoading,
    error: quizError,
  } = useQuiz(quizId);

  const isLoading = attemptLoading || quizLoading;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400"></div>
      </div>
    );
  }

  if (attemptError || quizError) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
          <h2 className="text-xl font-bold text-red-900 dark:text-red-200 mb-2">
            Error Loading Results
          </h2>
          <p className="text-red-700 dark:text-red-300">
            {attemptError instanceof Error
              ? attemptError.message
              : 'Failed to load attempt data'}
            {quizError instanceof Error
              ? quizError.message
              : 'Failed to load quiz data'}
          </p>
          <Link
            to="/quizzes"
            className="inline-block mt-4 px-6 py-3 bg-blue-600 dark:bg-blue-700 text-white font-medium rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
          >
            Back to Quizzes
          </Link>
        </div>
      </div>
    );
  }

  if (!attempt || !quiz) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-6">
          <h2 className="text-xl font-bold text-yellow-900 dark:text-yellow-200 mb-2">
            Results Not Found
          </h2>
          <p className="text-yellow-700 dark:text-yellow-300">
            Unable to find the quiz results. The attempt ID or quiz ID may be
            invalid.
          </p>
          <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-2">
            Quiz ID: {quizId} | Attempt ID: {attemptId}
          </p>
          <Link
            to="/quizzes"
            className="inline-block mt-4 px-6 py-3 bg-blue-600 dark:bg-blue-700 text-white font-medium rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
          >
            Back to Quizzes
          </Link>
        </div>
      </div>
    );
  }

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600 dark:text-green-400';
    if (percentage >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getScoreBgColor = (percentage: number) => {
    if (percentage >= 80)
      return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
    if (percentage >= 60)
      return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800';
    return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
  };

  const getFeedbackMessage = (percentage: number) => {
    if (percentage === 100) return 'Perfect Score! Outstanding work!';
    if (percentage >= 80)
      return 'Excellent job! You have a strong understanding.';
    if (percentage >= 60) return 'Good work! Review the areas you missed.';
    return 'Keep practicing! Review the material and try again.';
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg overflow-hidden">
          <div className="bg-linear-to-r from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800 text-white p-8 text-center">
            <h1 className="text-3xl font-bold mb-2">Quiz Complete!</h1>
            <p className="text-blue-100 dark:text-blue-200">{quiz.title}</p>
          </div>

          <div
            className={`p-8 border-b-4 ${getScoreBgColor(attempt.percentage)}`}
          >
            <div className="text-center">
              <div
                className={`text-6xl font-bold ${getScoreColor(attempt.percentage)} mb-2`}
              >
                {attempt.percentage}%
              </div>
              <div className="text-2xl text-gray-700 dark:text-slate-300 mb-4">
                {attempt.score} out of {attempt.totalQuestions} correct
              </div>
              <p className="text-lg text-gray-600 dark:text-slate-400">
                {getFeedbackMessage(attempt.percentage)}
              </p>
            </div>
          </div>

          <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-100 mb-6">
              Review Your Answers
            </h2>

            <div className="space-y-6">
              {attempt.results.map((result, index) => {
                const question = quiz.questions.find(
                  (q) => q.id === result.questionId,
                );
                if (!question) return null;

                const selectedAnswer = question.answers.find(
                  (a) => a.id === result.selectedAnswerId,
                );
                const correctAnswer = question.answers.find(
                  (a) => a.id === result.correctAnswerId,
                );

                return (
                  <div
                    key={result.questionId}
                    className={`border-2 rounded-lg p-6 ${
                      result.isCorrect
                        ? 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20'
                        : 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20'
                    }`}
                  >
                    <div className="flex items-start gap-3 mb-4">
                      <div
                        className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                          result.isCorrect
                            ? 'bg-green-500 dark:bg-green-600 text-white'
                            : 'bg-red-500 dark:bg-red-600 text-white'
                        }`}
                      >
                        {result.isCorrect ? '✓' : '✗'}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 dark:text-slate-100 mb-2">
                          Question {index + 1}: {question.text}
                        </h3>

                        <div className="space-y-2 mb-4">
                          <div className="flex items-start gap-2">
                            <span className="text-gray-600 dark:text-slate-400 font-medium">
                              Your answer:
                            </span>
                            <span
                              className={
                                result.isCorrect
                                  ? 'text-green-700 dark:text-green-400'
                                  : 'text-red-700 dark:text-red-400'
                              }
                            >
                              {selectedAnswer?.text}
                            </span>
                          </div>

                          {!result.isCorrect && (
                            <div className="flex items-start gap-2">
                              <span className="text-gray-600 dark:text-slate-400 font-medium">
                                Correct answer:
                              </span>
                              <span className="text-green-700 dark:text-green-400">
                                {correctAnswer?.text}
                              </span>
                            </div>
                          )}
                        </div>

                        {result.explanation && (
                          <div className="bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-md p-4">
                            <p className="text-sm text-gray-700 dark:text-slate-300 font-medium mb-1">
                              Explanation:
                            </p>
                            <p className="text-sm text-gray-600 dark:text-slate-400">
                              {result.explanation}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="border-t border-gray-200 dark:border-slate-700 p-6 bg-gray-50 dark:bg-slate-900 flex justify-center gap-4">
            <Link
              to="/quizzes/$quizId"
              params={{ quizId: quiz.id }}
              className="px-6 py-3 bg-blue-600 dark:bg-blue-700 text-white font-medium rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
            >
              Retake Quiz
            </Link>
            <Link
              to="/quizzes"
              className="px-6 py-3 bg-gray-600 dark:bg-gray-700 text-white font-medium rounded-lg hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
            >
              Browse Quizzes
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
