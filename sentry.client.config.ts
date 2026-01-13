import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,

  integrations: [
    Sentry.replayIntegration({
      maskAllText: true,
      blockAllMedia: true,
    }),
    Sentry.browserTracingIntegration(),
    Sentry.captureConsoleIntegration({
      levels: ['error'],
    }),
  ],

  beforeSend(event) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[Sentry]', event);
    }
    return event;
  },

  environment: process.env.NODE_ENV,
  enabled: process.env.NODE_ENV === 'production',
});
