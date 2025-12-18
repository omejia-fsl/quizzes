import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  quizzesApi,
  type QuizFilters,
  type SubmitQuizDto,
} from '../api/quizzes';

export const QUERY_KEYS = {
  quizzes: (filters?: QuizFilters) => ['quizzes', filters] as const,
  quiz: (id: string) => ['quiz', id] as const,
  categories: () => ['categories'] as const,
  attempt: (id: string) => ['attempt', id] as const,
  attempts: () => ['attempts'] as const,
};

export function useQuizzes(filters?: QuizFilters) {
  return useQuery({
    queryKey: QUERY_KEYS.quizzes(filters),
    queryFn: () => quizzesApi.getQuizzes(filters),
  });
}

export function useQuiz(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.quiz(id),
    queryFn: () => quizzesApi.getQuizById(id),
    enabled: !!id,
  });
}

export function useCategories() {
  return useQuery({
    queryKey: QUERY_KEYS.categories(),
    queryFn: () => quizzesApi.getCategories(),
  });
}

export function useAttempt(attemptId: string) {
  return useQuery({
    queryKey: QUERY_KEYS.attempt(attemptId),
    queryFn: () => quizzesApi.getAttemptById(attemptId),
    enabled: !!attemptId,
  });
}

export function useSubmitQuiz() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      quizId,
      submission,
    }: {
      quizId: string;
      submission: SubmitQuizDto;
    }) => quizzesApi.submitQuiz(quizId, submission),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.attempts() });
    },
  });
}
