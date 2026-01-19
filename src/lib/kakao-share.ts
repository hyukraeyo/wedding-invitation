/**
 * 카카오톡 공유 기능을 위한 유틸리티 함수들
 */

export interface KakaoShareOptions {
    title: string;
    description: string;
    imageUrl: string;
    buttonType: 'none' | 'location' | 'rsvp';
}

export interface KakaoShareParams {
    invitationUrl: string;
    options: KakaoShareOptions;
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
    buttonType: 'none' | 'location' | 'rsvp'
): Array<{ title: string; link: { mobileWebUrl: string; webUrl: string } }> {
    const baseButton = {
        title: '모바일 초대장',
        link: {
            mobileWebUrl: invitationUrl,
            webUrl: invitationUrl,
        },
    };

    if (buttonType === 'none') {
        return [baseButton];
    }

    const secondButtonTitle = buttonType === 'location' ? '위치 안내' : '참석 여부';
    const anchor = buttonType === 'location' ? '#section-location' : '#section-account';

    return [
        baseButton,
        {
            title: secondButtonTitle,
            link: {
                mobileWebUrl: `${invitationUrl}${anchor}`,
                webUrl: `${invitationUrl}${anchor}`,
            },
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
        const imageUrl = normalizeImageUrl(options.imageUrl, origin);
        const buttons = createKakaoButtons(invitationUrl, options.buttonType);

        window.Kakao.Share.sendDefault({
            objectType: 'feed',
            content: {
                title: options.title,
                description: options.description,
                imageUrl,
                link: {
                    mobileWebUrl: invitationUrl,
                    webUrl: invitationUrl,
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
