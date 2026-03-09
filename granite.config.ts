import { defineConfig } from '@apps-in-toss/web-framework/config';

export default defineConfig({
  appName: 'bananawedding',
  brand: {
    displayName: '바나나웨딩',
    primaryColor: '#FBC02D',
    icon: 'https://static.toss.im/appsintoss/15407/b02e2dc.png',
  },
  web: {
    host: '192.168.1.223',
    port: 3000,
    commands: {
      dev: 'npm run dev:next',
      build: 'npm run build:toss',
    },
  },
  webViewProps: {
    type: 'partner', // 비게임 파트너사 콘텐츠
  },
  permissions: [],
  outdir: 'dist',
});
