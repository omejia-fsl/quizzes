import { Link } from '@tanstack/react-router';
import { Brain, Target, TrendingUp, Trophy, Clock, Users } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../../components/Button/Button';

export const HomePage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="max-w-6xl mx-auto">
      {/* Hero Section */}
      <div className="text-center py-20">
        <div className="inline-block mb-4 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-semibold">
          Master AI Development
        </div>

        <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
          AI Development Quiz App
        </h1>

        <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 mb-8 max-w-3xl mx-auto">
          Test and improve your knowledge of AI agent design, prompt
          engineering, and model selection with interactive quizzes
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {isAuthenticated ? (
            <>
              <Link to="/quizzes">
                <Button variant="primary" size="lg">
                  Browse Quizzes
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button variant="secondary" size="lg">
                  My Dashboard
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Link to="/register">
                <Button variant="primary" size="lg">
                  Get Started Free
                </Button>
              </Link>
              <Link to="/quizzes">
                <Button variant="secondary" size="lg">
                  Explore Quizzes
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-20">
        <div className="text-center p-6">
          <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
            3+
          </div>
          <div className="text-slate-600 dark:text-slate-400">
            Quiz Categories
          </div>
        </div>
        <div className="text-center p-6">
          <div className="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2">
            25+
          </div>
          <div className="text-slate-600 dark:text-slate-400">
            Practice Questions
          </div>
        </div>
        <div className="text-center p-6">
          <div className="text-4xl font-bold text-pink-600 dark:text-pink-400 mb-2">
            ∞
          </div>
          <div className="text-slate-600 dark:text-slate-400">
            Learning Opportunities
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="mb-20">
        <h2 className="text-3xl font-bold text-center mb-12 text-slate-900 dark:text-slate-100">
          Why Choose QuizAI?
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-6 rounded-xl border-2 border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 transition-colors">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-4">
              <Target className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-slate-900 dark:text-slate-100">
              Test Your Skills
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              Challenge yourself with carefully crafted quizzes covering AI
              fundamentals, prompt engineering, and model selection
            </p>
          </div>

          <div className="p-6 rounded-xl border-2 border-slate-200 dark:border-slate-800 hover:border-purple-500 dark:hover:border-purple-500 transition-colors">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-slate-900 dark:text-slate-100">
              Track Progress
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              Monitor your improvement over time with detailed statistics, score
              history, and category-specific insights
            </p>
          </div>

          <div className="p-6 rounded-xl border-2 border-slate-200 dark:border-slate-800 hover:border-pink-500 dark:hover:border-pink-500 transition-colors">
            <div className="w-12 h-12 bg-pink-100 dark:bg-pink-900/30 rounded-lg flex items-center justify-center mb-4">
              <Trophy className="w-6 h-6 text-pink-600 dark:text-pink-400" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-slate-900 dark:text-slate-100">
              Compete & Learn
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              Join daily challenges, climb the leaderboard, and learn from
              detailed explanations for every question
            </p>
          </div>

          <div className="p-6 rounded-xl border-2 border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 transition-colors">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-4">
              <Brain className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-slate-900 dark:text-slate-100">
              Immediate Feedback
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              Get instant feedback on your answers with clear explanations to
              reinforce learning and understanding
            </p>
          </div>

          <div className="p-6 rounded-xl border-2 border-slate-200 dark:border-slate-800 hover:border-purple-500 dark:hover:border-purple-500 transition-colors">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mb-4">
              <Clock className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-slate-900 dark:text-slate-100">
              Daily Challenges
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              Stay engaged with fresh daily and weekly challenges that test your
              knowledge and keep you motivated
            </p>
          </div>

          <div className="p-6 rounded-xl border-2 border-slate-200 dark:border-slate-800 hover:border-pink-500 dark:hover:border-pink-500 transition-colors">
            <div className="w-12 h-12 bg-pink-100 dark:bg-pink-900/30 rounded-lg flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-pink-600 dark:text-pink-400" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-slate-900 dark:text-slate-100">
              Community Driven
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              Be part of a growing community of AI developers learning and
              improving together
            </p>
          </div>
        </div>
      </div>

      {/* Quiz Categories Preview */}
      <div className="mb-20">
        <h2 className="text-3xl font-bold text-center mb-12 text-slate-900 dark:text-slate-100">
          Explore Quiz Categories
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-8 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border border-blue-200 dark:border-blue-800">
            <h3 className="text-2xl font-bold mb-3 text-blue-900 dark:text-blue-100">
              Agent Fundamentals
            </h3>
            <p className="text-blue-700 dark:text-blue-300 mb-4">
              Learn the core concepts of AI agents, their purpose, structure,
              and design patterns
            </p>
            <div className="text-sm text-blue-600 dark:text-blue-400 font-medium">
              8-10 questions
            </div>
          </div>

          <div className="p-8 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border border-purple-200 dark:border-purple-800">
            <h3 className="text-2xl font-bold mb-3 text-purple-900 dark:text-purple-100">
              Prompt Engineering
            </h3>
            <p className="text-purple-700 dark:text-purple-300 mb-4">
              Master the art of writing effective prompts and controlling AI
              outputs
            </p>
            <div className="text-sm text-purple-600 dark:text-purple-400 font-medium">
              8-10 questions
            </div>
          </div>

          <div className="p-8 rounded-xl bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-950 dark:to-pink-900 border border-pink-200 dark:border-pink-800">
            <h3 className="text-2xl font-bold mb-3 text-pink-900 dark:text-pink-100">
              Model Selection
            </h3>
            <p className="text-pink-700 dark:text-pink-300 mb-4">
              Understand how to choose the right model and manage context
              effectively
            </p>
            <div className="text-sm text-pink-600 dark:text-pink-400 font-medium">
              8-10 questions
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="text-center py-20 px-6 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white mb-20">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Ready to Test Your Knowledge?
        </h2>
        <p className="text-xl mb-8 opacity-90">
          Join now and start your journey to AI development mastery
        </p>
        {isAuthenticated ? (
          <Link to="/quizzes">
            <Button
              variant="primary"
              size="lg"
              className="!bg-white !text-blue-600 hover:!bg-gray-100 !shadow-lg"
            >
              Start Learning
            </Button>
          </Link>
        ) : (
          <Link to="/register">
            <Button
              variant="primary"
              size="lg"
              className="!bg-white !text-blue-600 hover:!bg-gray-100 !shadow-lg"
            >
              Sign Up Free
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
};
