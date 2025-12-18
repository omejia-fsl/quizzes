import { Link } from '@tanstack/react-router';
import type { QuizListItem } from '../../api/quizzes';

interface QuizCardProps {
  quiz: QuizListItem;
}

export const QuizCard = ({ quiz }: QuizCardProps) => {
  const difficultyColors = {
    beginner: 'bg-green-100 text-green-800',
    intermediate: 'bg-yellow-100 text-yellow-800',
    advanced: 'bg-red-100 text-red-800',
  };

  const difficultyColor =
    difficultyColors[quiz.difficulty as keyof typeof difficultyColors] ||
    'bg-gray-100 text-gray-800';

  return (
    <Link
      to="/quizzes/$quizId"
      params={{ quizId: quiz.id }}
      className="block bg-white dark:bg-slate-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden"
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-slate-100">
            {quiz.title}
          </h3>
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${difficultyColor}`}
          >
            {quiz.difficulty}
          </span>
        </div>

        <p className="text-gray-600 dark:text-slate-300 mb-4 line-clamp-2">
          {quiz.description}
        </p>

        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-slate-400">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {quiz.questionCount} questions
            </span>
            <span className="flex items-center gap-1">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {quiz.estimatedMinutes} min
            </span>
          </div>
          <span className="inline-flex items-center px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-md text-xs font-medium">
            {quiz.category}
          </span>
        </div>
      </div>
    </Link>
  );
};
