export const API_ROUTES = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    PROFILE: '/auth/profile',
  },

  QUIZZES: {
    LIST: '/quizzes',
    BY_ID: (id: string) => `/quizzes/${id}`,
    SUBMIT: (id: string) => `/quizzes/${id}/submit`,
    CATEGORIES: '/quizzes/categories',
  },

  ATTEMPTS: {
    USER_HISTORY: (userId: string) => `/users/${userId}/attempts`,
    DETAIL: (userId: string, attemptId: string) =>
      `/users/${userId}/attempts/${attemptId}`,
  },
} as const;
