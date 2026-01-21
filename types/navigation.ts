// Type definitions for navigation
// These help with type-safe navigation in Expo Router

export type AuthRoutes = {
  '/': undefined;
  '/login': undefined;
  '/register': undefined;
  '/forgot-password': undefined;
  '/role-choice': undefined;
  '/onboarding-player': undefined;
  '/onboarding-player/step1': undefined;
  '/onboarding-player/step2': undefined;
  '/onboarding-player/step3': undefined;
  '/onboarding-pnj': undefined;
  '/onboarding-pnj/step1': undefined;
  '/onboarding-pnj/step2': undefined;
  '/onboarding-pnj/step3': undefined;
  '/onboarding-pnj/step4': undefined;
  '/onboarding-pnj/step5': undefined;
};

export type PlayerRoutes = {
  '/(player)': undefined;
  '/(player)/search': undefined;
  '/(player)/search/map': undefined;
  '/(player)/pnj/[id]': { id: string };
  '/(player)/book/[pnjId]': { pnjId: string };
  '/(player)/book/confirm/[id]': { id: string };
  '/(player)/missions': undefined;
  '/(player)/missions/[id]': { id: string };
  '/(player)/collection': undefined;
  '/(player)/collection/[id]': { id: string };
  '/(player)/profile': undefined;
};

export type PNJRoutes = {
  '/(pnj)': undefined;
  '/(pnj)/requests': undefined;
  '/(pnj)/calendar': undefined;
  '/(pnj)/earnings': undefined;
  '/(pnj)/profile': undefined;
  '/(pnj)/profile/edit': undefined;
  '/(pnj)/profile/preview': undefined;
  '/(pnj)/stats': undefined;
};

export type SharedRoutes = {
  '/(shared)/booking/[id]': { id: string };
  '/(shared)/chats': undefined;
  '/(shared)/chat/[id]': { id: string };
  '/(shared)/settings': undefined;
  '/(shared)/settings/account': undefined;
  '/(shared)/settings/notifications': undefined;
  '/(shared)/settings/security': undefined;
  '/(shared)/settings/help': undefined;
  '/(shared)/report': undefined;
  '/(shared)/emergency': undefined;
};

export type AllRoutes = AuthRoutes & PlayerRoutes & PNJRoutes & SharedRoutes;
