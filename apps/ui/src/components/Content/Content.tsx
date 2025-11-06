import { type ReactNode } from 'react';

interface ContentProps {
  children: ReactNode;
}

export const Content = ({ children }: ContentProps) => {
  return (
    <main className="flex-1 container mx-auto px-4 py-8">
      {children}
    </main>
  );
};
