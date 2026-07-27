export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  PATIENT: {
    DASHBOARD: '/patient/dashboard',
    NEW_CLAIM: '/patient/new-claim',
    MY_CLAIMS: '/patient/my-claims',
  },
  INSURER: {
    DASHBOARD: '/insurer/dashboard',
    CLAIMS: '/insurer/claims',
  },
  NOT_FOUND: '/404',
} as const;
