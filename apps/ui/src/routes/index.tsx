import { createFileRoute } from '@tanstack/react-router';
import { useTestQuery } from '../hooks/useTestQuery';

export const Route = createFileRoute('/')({
  component: HomeComponent,
});

function HomeComponent() {
  const { data, isLoading, error } = useTestQuery();

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">AI Development Quiz App</h1>
        <p className="text-xl text-slate-600 dark:text-slate-400 mb-4">
          Welcome! Routing is working.
        </p>

        <div className="mt-8 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Query Test:</h2>
          {isLoading && <p>Loading...</p>}
          {error && <p className="text-red-500">Error occurred</p>}
          {data && (
            <p className="text-green-600 dark:text-green-400">{data.message}</p>
          )}
        </div>
      </div>
    </div>
  );
}
