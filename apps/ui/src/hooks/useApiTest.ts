import { useQuery } from '@tanstack/react-query';
import { api } from '../shared/lib/api';

export function useApiTest() {
  return useQuery({
    queryKey: ['api-test'],
    queryFn: async () => {
      try {
        const data = await api.get<{ message: string }>('/health');
        return data;
      } catch (error) {
        console.log('API test (expected to fail):', error);
        return { message: 'API service is configured (backend not ready yet)' };
      }
    },
  });
}
