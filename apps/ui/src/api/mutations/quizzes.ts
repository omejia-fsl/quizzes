import { useMutation, useQueryClient } from '@tanstack/react-query';
import { submitQuiz } from '../endpoints/quizzes.ts';
import type { SubmitQuizDto } from '../endpoints/quizzes.ts';
import { QueryKeys } from '@quiz-app/shared-types/query-keys';

export function useSubmitQuizMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      quizId,
      submission,
    }: {
      quizId: string;
      submission: SubmitQuizDto;
    }) => submitQuiz(quizId, submission),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [QueryKeys.ATTEMPTS] });
    },
  });
}
