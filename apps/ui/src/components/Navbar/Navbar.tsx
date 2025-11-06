import { Link } from '@tanstack/react-router';
import { Menu, X, User, Moon, Sun, LogOut } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth.ts';
import { useTheme } from '../../hooks/useTheme.ts';
import { useLogoutMutation } from '../../hooks/mutations/useAuthMutations';
import { Button } from '../Button/Button';

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, user } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const logoutMutation = useLogoutMutation();

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/quizzes', label: 'Quizzes' },
    ...(isAuthenticated ? [{ to: '/dashboard', label: 'Dashboard' }] : []),
  ];

  return (
    <nav className="relative h-16 border-b border-slate-200 dark:border-slate-800 bg-stone-50 dark:bg-slate-900">
      <div className="container mx-auto px-4 h-full flex items-center justify-between">
        <Link
          to="/"
          className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hover:opacity-80 transition-opacity"
        >
          QuizAI
        </Link>

        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
              activeProps={{
                className: 'text-blue-600 dark:text-blue-400 font-semibold',
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Toggle dark mode"
          >
            {isDark ? (
              <Sun className="w-5 h-5 text-yellow-500" />
            ) : (
              <Moon className="w-5 h-5 text-slate-700" />
            )}
          </button>

          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800">
                <User className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {user?.username || 'User'}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => logoutMutation.mutate()}
                disabled={logoutMutation.isPending}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Login
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="primary" size="sm">
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
        </div>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 border-t border-slate-200 dark:border-slate-800 bg-stone-50 dark:bg-slate-900 z-50 shadow-lg">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-3">
            <div className="flex items-center justify-between py-2 border-b border-slate-200 dark:border-slate-800">
              <span className="text-sm font-medium">Dark Mode</span>
              <button
                onClick={toggleTheme}
                className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Toggle dark mode"
              >
                {isDark ? (
                  <Sun className="w-5 h-5 text-yellow-500" />
                ) : (
                  <Moon className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                )}
              </button>
            </div>

            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
                activeProps={{
                  className: 'text-blue-600 dark:text-blue-400 font-semibold',
                }}
              >
                {link.label}
              </Link>
            ))}

            {!isAuthenticated && (
              <>
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" fullWidth>
                    Login
                  </Button>
                </Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="primary" fullWidth>
                    Sign Up
                  </Button>
                </Link>
              </>
            )}

            {isAuthenticated && (
              <div className="space-y-3">
                <div className="py-2 text-sm text-slate-600 dark:text-slate-400">
                  Logged in as{' '}
                  <span className="font-medium">{user?.username}</span>
                </div>
                <Button
                  variant="ghost"
                  fullWidth
                  onClick={() => {
                    logoutMutation.mutate();
                    setMobileMenuOpen(false);
                  }}
                  disabled={logoutMutation.isPending}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
