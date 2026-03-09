'use client';

import type { LoaderOptions } from 'react-kakao-maps-sdk';

export const KAKAO_LOADER_OPTIONS: LoaderOptions = {
  appkey: process.env.NEXT_PUBLIC_KAKAO_APP_KEY || '',
  libraries: ['services', 'clusterer'],
};
