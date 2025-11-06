import { Link } from '@tanstack/react-router';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="border-t border-slate-200 dark:border-slate-800 py-8 bg-stone-50 dark:bg-slate-900"
      role="contentinfo"
    >
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
          <div>
            <h3 className="text-lg font-bold mb-3 text-slate-900 dark:text-slate-100">
              QuizAI
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Master AI development through interactive quizzes and hands-on
              practice.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-3 text-slate-900 dark:text-slate-100">
              Quick Links
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/quizzes"
                  className="text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Quizzes
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard"
                  className="text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-3 text-slate-900 dark:text-slate-100">
              Legal
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-200 dark:border-slate-800 text-center">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            &copy; {currentYear} AI Development Quiz App. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
