import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/quizzes/$quizId')({
  component: QuizLayout,
});

function QuizLayout() {
  return <Outlet />;
}
