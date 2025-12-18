import { useQuery } from '@tanstack/react-query';
import {
  getQuizzes,
  getQuizById,
  getQuizCategories,
} from '../endpoints/quizzes.ts';
import type { QuizFilters } from '../endpoints/quizzes.ts';
import { QueryKeys } from '@quiz-app/shared-types/query-keys';

export function useQuizzesQuery(filters?: QuizFilters) {
  return useQuery({
    queryKey: [QueryKeys.QUIZZES],
    queryFn: () => getQuizzes(filters),
  });
}

export function useQuizQuery(id: string) {
  return useQuery({
    queryKey: [QueryKeys.QUIZ],
    queryFn: () => getQuizById(id),
    enabled: !!id,
  });
}

export function useQuizCategoriesQuery() {
  return useQuery({
    queryKey: [QueryKeys.QUIZ_CATEGORIES],
    queryFn: () => getQuizCategories(),
  });
}
