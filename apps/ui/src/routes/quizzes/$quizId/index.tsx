import { createFileRoute } from '@tanstack/react-router';
import { QuizDetailPage } from '../../../pages/QuizzesPage/QuizDetailPage/QuizDetailPage';

export const Route = createFileRoute('/quizzes/$quizId/')({
  component: QuizDetailComponent,
});

function QuizDetailComponent() {
  const { quizId } = Route.useParams();

  return (
    <div className="container mx-auto px-4 py-8">
      <QuizDetailPage quizId={quizId} />
    </div>
  );
}
