export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
  },
  CLAIMS: {
    LIST: '/claims',
    CREATE: '/claims',
    DETAILS: (id: string) => `/claims/${id}`,
    UPDATE_STATUS: (id: string) => `/claims/${id}/status`,
  },
} as const;
