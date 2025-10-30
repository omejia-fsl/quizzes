export enum QueryKeys {
  AUTH_PROFILE = 'auth.profile',

  USERS = 'users',
  USER_BY_ID = 'users.byId',

  QUIZZES = 'quizzes',
  QUIZ_BY_ID = 'quizzes.byId',
  QUIZ_CATEGORIES = 'quizzes.categories',

  USER_ATTEMPTS = 'attempts.user',
  ATTEMPT_BY_ID = 'attempts.byId',

  DASHBOARD = 'dashboard',
  USER_PROGRESS = 'progress.user',

  LEADERBOARD = 'leaderboard',
  LEADERBOARD_BY_QUIZ = 'leaderboard.byQuiz',

  DAILY_CHALLENGE = 'challenges.daily',
  WEEKLY_CHALLENGE = 'challenges.weekly',
}

export const createQueryKey = {
  userById: (id: string) => [QueryKeys.USER_BY_ID, id] as const,
  quizById: (id: string) => [QueryKeys.QUIZ_BY_ID, id] as const,
  attemptById: (id: string) => [QueryKeys.ATTEMPT_BY_ID, id] as const,
  leaderboardByQuiz: (quizId: string) => [QueryKeys.LEADERBOARD_BY_QUIZ, quizId] as const,
}