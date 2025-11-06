export const Footer = () => {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 py-6 bg-stone-50 dark:bg-slate-900">
      <div className="container mx-auto px-4 text-center text-sm text-slate-600 dark:text-slate-400">
        <p>&copy; {new Date().getFullYear()} AI Development Quiz App</p>
      </div>
    </footer>
  );
};
