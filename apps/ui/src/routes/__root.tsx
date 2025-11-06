import { createRootRoute, Outlet } from '@tanstack/react-router';
import { Layout } from '../pages/Layout/Layout';

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}
