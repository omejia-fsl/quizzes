import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: HomeComponent,
});

function HomeComponent() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center py-20">
        <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          AI Development Quiz App
        </h1>
        <p className="text-xl text-slate-600 dark:text-slate-400 mb-8">
          Test your knowledge of AI agent design, prompt engineering, and model
          selection
        </p>
        <div className="flex gap-4 justify-center">
          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors">
            Get Started
          </button>
          <button className="px-6 py-3 border border-slate-300 dark:border-slate-700 rounded-lg font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            Browse Quizzes
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mt-20">
        <div className="p-6 rounded-lg border border-slate-200 dark:border-slate-800">
          <div className="text-3xl mb-3">🎯</div>
          <h3 className="text-lg font-semibold mb-2">Test Your Skills</h3>
          <p className="text-slate-600 dark:text-slate-400">
            Challenge yourself with quizzes on AI development fundamentals
          </p>
        </div>
        <div className="p-6 rounded-lg border border-slate-200 dark:border-slate-800">
          <div className="text-3xl mb-3">📊</div>
          <h3 className="text-lg font-semibold mb-2">Track Progress</h3>
          <p className="text-slate-600 dark:text-slate-400">
            Monitor your improvement over time with detailed statistics
          </p>
        </div>
        <div className="p-6 rounded-lg border border-slate-200 dark:border-slate-800">
          <div className="text-3xl mb-3">🏆</div>
          <h3 className="text-lg font-semibold mb-2">Compete</h3>
          <p className="text-slate-600 dark:text-slate-400">
            Join daily challenges and climb the leaderboard
          </p>
        </div>
      </div>
    </div>
  );
}
