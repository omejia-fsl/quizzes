import { useQuery } from '@tanstack/react-query';
import { getAttemptById } from '../endpoints/attempts.ts';
import { QueryKeys } from '@quiz-app/shared-types/query-keys';

export function useAttemptQuery(attemptId: string) {
  return useQuery({
    queryKey: [QueryKeys.ATTEMPT],
    queryFn: () => getAttemptById(attemptId),
    enabled: !!attemptId,
  });
}
