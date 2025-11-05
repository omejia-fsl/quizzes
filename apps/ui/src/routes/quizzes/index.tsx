import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/quizzes/')({
  component: QuizzesComponent,
});

function QuizzesComponent() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Quizzes</h1>
      <p className="text-slate-600 dark:text-slate-400">
        Quiz list will be implemented in feature-quiz-core
      </p>
    </div>
  );
}
