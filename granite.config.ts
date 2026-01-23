import { defineConfig } from '@apps-in-toss/web-framework/config';

export default defineConfig({
  appName: 'banana-wedding',
  brand: {
    displayName: '바나나웨딩',
    primaryColor: '#FBC02D',
    icon: 'https://wedding-invitation-zeta-one.vercel.app/assets/icons/logo-banana-heart.png',
  },
  permissions: [],
  web: {
    host: '192.168.1.214',
    port: 3000,
    commands: {
      dev: 'npm run dev',
      build: 'npm run build',
    },
  },
  webViewProps: {
    type: 'partner',
  },
});
