import { type ReactNode } from 'react';
import { Navbar } from '../Navbar/Navbar.tsx';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-stone-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <Navbar />

      <main className="container mx-auto px-4 py-8">{children}</main>

      <footer className="border-t border-slate-200 dark:border-slate-800 py-6 mt-auto">
        <div className="container mx-auto px-4 text-center text-sm text-slate-600 dark:text-slate-400">
          <p>&copy; {new Date().getFullYear()} AI Development Quiz App</p>
        </div>
      </footer>
    </div>
  );
};
