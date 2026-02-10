const DEFAULT_SITE_URL = 'https://wedding-invitation-zeta-one.vercel.app';

const normalizeBaseUrl = (url: string): string => {
  return url.replace(/\/+$/, '');
};

const toValidAbsoluteUrl = (url: string): string => {
  const normalized = normalizeBaseUrl(url.trim());
  const candidate = /^https?:\/\//i.test(normalized) ? normalized : `https://${normalized}`;

  try {
    return new URL(candidate).toString().replace(/\/+$/, '');
  } catch {
    return DEFAULT_SITE_URL;
  }
};

export const SITE_NAME = '바나나웨딩';
export const SITE_NAME_EN = 'Banana Wedding';
export const SITE_DESCRIPTION =
  '복잡한 과정 없이 바로 시작하는 모바일 청첩장 제작, 바나나웨딩에서 지금 만들어보세요.';
export const SITE_URL = toValidAbsoluteUrl(process.env.NEXT_PUBLIC_BASE_URL || DEFAULT_SITE_URL);

export const absoluteUrl = (path: string = '/'): string => {
  if (!path.startsWith('/')) {
    return `${SITE_URL}/${path}`;
  }

  return `${SITE_URL}${path}`;
};
