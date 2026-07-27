export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
  },
  CLAIMS: {
    LIST: '/claims',
    CREATE: '/claims',
    DETAILS: (id: string) => `/claims/${id}`,
    UPDATE: (id: string) => `/claims/${id}`,
    UPDATE_STATUS: (id: string) => `/claims/${id}`,
  },
  DASHBOARD: {
    METRICS: '/dashboard',
  },
} as const;
