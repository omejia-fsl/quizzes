import { useQuery } from '@tanstack/react-query';

export function useTestQuery() {
  return useQuery({
    queryKey: ['test'],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return { message: 'TanStack Query is working!' };
    },
  });
}
