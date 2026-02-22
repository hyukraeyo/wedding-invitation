/**
 * 카카오톡 공유 기능을 위한 유틸리티 함수들
 */

export interface KakaoShareOptions {
  title: string;
  description: string;
  imageUrl: string;
  buttonType: 'none' | 'location' | 'rsvp';
  address?: string | undefined;
  location?: string | undefined;
}

export interface KakaoShareParams {
  invitationUrl: string;
  options: KakaoShareOptions;
  slug?: string | undefined; // Add slug to build canonical URL
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
}

/**
 * 이미지 URL을 카카오 서버에서 접근 가능한 형태로 정규화
 * - blob: URL은 기본 로고로 대체
 * - 상대 경로는 절대 경로로 변환
 */
export function normalizeImageUrl(imageUrl: string | null | undefined, origin: string): string {
  const fallbackUrl = `${origin}/logo.png`;

  if (!imageUrl) {
    return fallbackUrl;
  }

  if (imageUrl.startsWith('blob:')) {
    return fallbackUrl;
  }

  if (imageUrl.startsWith('/')) {
    return `${origin}${imageUrl}`;
  }

  return imageUrl;
}

/**
 * 카카오톡 공유 버튼 배열 생성
 */
export function createKakaoButtons(
  invitationUrl: string,
  buttonType: 'none' | 'location' | 'rsvp',
  address?: string | null,
  location?: string | null
): Array<{ title: string; link: { mobileWebUrl: string; webUrl: string } }> {
  // 앵커 링크와 검색 링크를 구분하여 생성
  // invitationUrl에 이미 해시가 있을 경우를 대비해 해시 제거
  const cleanUrl = invitationUrl.split('#')[0] || '';

  const baseButton = {
    title: '모바일 초대장',
    link: {
      mobileWebUrl: cleanUrl,
      webUrl: cleanUrl,
    },
  };

  if (buttonType === 'none') {
    return [baseButton];
  }

  const secondButtonTitle = buttonType === 'location' ? '위치 안내' : '참석 여부';

  let secondButtonLink: { mobileWebUrl: string; webUrl: string };

  if (buttonType === 'location') {
    const searchQuery = (address || location || '').trim();
    if (searchQuery && searchQuery !== 'undefined' && searchQuery !== 'null') {
      // 카카오 SDK의 도메인 제한을 우회하기 위해 자사 도메인의 리다이렉트 페이지를 사용합니다.
      const origin = new URL(cleanUrl).origin;
      const redirectUrl = `${origin}/out/map?q=${encodeURIComponent(searchQuery)}`;

      secondButtonLink = {
        mobileWebUrl: redirectUrl,
        webUrl: redirectUrl,
      };
    } else {
      secondButtonLink = {
        mobileWebUrl: `${cleanUrl}#section-location`,
        webUrl: `${cleanUrl}#section-location`,
      };
    }
  } else {
    // rsvp (참석 여부) 등 다른 버튼 타입은 기존처럼 앵커 링크 사용
    const anchor = '#section-account';
    secondButtonLink = {
      mobileWebUrl: `${cleanUrl}${anchor}`,
      webUrl: `${cleanUrl}${anchor}`,
    };
  }

  return [
    baseButton,
    {
      title: secondButtonTitle,
      link: secondButtonLink,
    },
  ];
}

/**
 * 카카오 SDK 초기화
 */
export function initKakaoSdk(): boolean {
  if (!window.Kakao) {
    return false;
  }

  const kakaoAppKey = process.env.NEXT_PUBLIC_KAKAO_APP_KEY;
  if (!window.Kakao.isInitialized() && kakaoAppKey) {
    window.Kakao.init(kakaoAppKey);
  }

  return window.Kakao.isInitialized();
}

/**
 * 카카오톡 공유 메시지 전송
 */
export function sendKakaoShare({
  invitationUrl,
  options,
  slug,
  onSuccess,
  onError,
}: KakaoShareParams): void {
  try {
    if (!initKakaoSdk()) {
      throw new Error('Kakao SDK not available');
    }

    if (!window.Kakao.Share?.sendDefault) {
      throw new Error('Kakao Share API not available');
    }

    const origin = new URL(invitationUrl).origin;
    // 슬러그가 있으면 정규 URL(Live URL)을 우선 사용
    const canonicalUrl = slug ? `${origin}/v/${slug}` : invitationUrl.split('#')[0] || '';

    const imageUrl = normalizeImageUrl(options.imageUrl, origin);
    const buttons = createKakaoButtons(
      canonicalUrl,
      options.buttonType,
      options.address,
      options.location
    );

    window.Kakao.Share.sendDefault({
      objectType: 'feed',
      content: {
        title: options.title,
        description: options.description,
        imageUrl,
        link: {
          mobileWebUrl: canonicalUrl,
          webUrl: canonicalUrl,
        },
      },
      buttons,
    });

    onSuccess?.();
  } catch (error) {
    console.error('Kakao Share Error:', error);
    onError?.(error);
  }
}
