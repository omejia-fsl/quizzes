import { createFileRoute } from '@tanstack/react-router';
import { QuizResultsPage } from '../../../pages/QuizzesPage/QuizResultsPage/QuizResultsPage';

interface QuizResultsSearch {
  attemptId: string;
}

export const Route = createFileRoute('/quizzes/$quizId/results')({
  component: QuizResultsComponent,
  validateSearch: (search): QuizResultsSearch => {
    return {
      attemptId: (search.attemptId as string) || '',
    };
  },
});

function QuizResultsComponent() {
  const { quizId } = Route.useParams();
  const { attemptId } = Route.useSearch();

  return <QuizResultsPage quizId={quizId} attemptId={attemptId} />;
}
