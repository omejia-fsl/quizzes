import { useState } from 'react';
import { useQuizzes, useCategories } from '../../hooks/useQuizzes';
import type { QuizFilters } from '../../api/quizzes';
import { QuizCard } from '../../components/QuizCard/QuizCard.tsx';

export const QuizzesPage = () => {
  const [filters, setFilters] = useState<QuizFilters>({});
  const { data: quizzesData, isLoading, error } = useQuizzes(filters);
  const { data: categoriesData } = useCategories();

  const handleCategoryChange = (category: string) => {
    setFilters((prev) => ({
      ...prev,
      category: category === 'all' ? undefined : category,
    }));
  };

  const handleDifficultyChange = (difficulty: string) => {
    setFilters((prev) => ({
      ...prev,
      difficulty: difficulty === 'all' ? undefined : difficulty,
    }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-100 mb-6">
            Browse AI Development Quizzes
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2"
              >
                Category
              </label>
              <select
                id="category"
                className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400"
                value={filters.category || 'all'}
                onChange={(e) => handleCategoryChange(e.target.value)}
              >
                <option value="all">All Categories</option>
                {categoriesData?.categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="difficulty"
                className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2"
              >
                Difficulty
              </label>
              <select
                id="difficulty"
                className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400"
                value={filters.difficulty || 'all'}
                onChange={(e) => handleDifficultyChange(e.target.value)}
              >
                <option value="all">All Levels</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>

          <div className="text-sm text-gray-600 dark:text-slate-400">
            Showing {quizzesData?.quizzes.length || 0} of{' '}
            {quizzesData?.total || 0} quizzes
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="col-span-full flex justify-center items-center min-h-[400px]">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400"></div>
            </div>
          </div>
        ) : error ? (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-800 dark:text-red-200">
            <p className="font-semibold">Error loading quizzes</p>
            <p className="text-sm">{error.message || 'An error occurred'}</p>
          </div>
        ) : !quizzesData?.quizzes.length ? (
          <div className="bg-gray-50 dark:bg-slate-800 rounded-lg p-12 text-center">
            <p className="text-gray-600 dark:text-slate-400">
              No quizzes found matching your filters. Try adjusting your search
              criteria.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quizzesData.quizzes.map((quiz) => (
              <QuizCard key={quiz.id} quiz={quiz} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
