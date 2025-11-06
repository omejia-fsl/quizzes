import { type ReactNode } from 'react';
import { Navbar } from '../../components/Navbar/Navbar.tsx';
import { Content } from '../../components/Content/Content.tsx';
import { Footer } from '../../components/Footer/Footer.tsx';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-stone-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <Navbar />
      <Content>{children}</Content>
      <Footer />
    </div>
  );
};
