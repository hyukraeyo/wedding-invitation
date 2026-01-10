'use server';

export interface ServerActionResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export async function saveInvitation(data: FormData): Promise<ServerActionResponse> {
  try {
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Production에서는 실제 저장 로직으로 대체
    void data;

    return {
      success: true,
      message: '청첩장이 성공적으로 저장되었습니다.',
    };
  } catch {
    return {
      success: false,
      error: '청첩장 저장에 실패했습니다.',
    };
  }
}

export async function generateInvitationPreview(
  invitationId: string
): Promise<ServerActionResponse<string>> {
  try {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      success: true,
      data: `/preview/${invitationId}`,
      message: '미리보기가 생성되었습니다.',
    };
  } catch {
    return {
      success: false,
      error: '미리보기 생성에 실패했습니다.',
    };
  }
}

export async function exportInvitation(
  _invitationId: string,
  format: 'pdf' | 'image'
): Promise<ServerActionResponse<Blob>> {
  try {
    await new Promise(resolve => setTimeout(resolve, 2000));
    const mockBlob = new Blob(['mock content'], {
      type: format === 'pdf' ? 'application/pdf' : 'image/png'
    });

    return {
      success: true,
      data: mockBlob,
      message: `${format.toUpperCase()} 파일이 생성되었습니다.`,
    };
  } catch {
    return {
      success: false,
      error: `${format.toUpperCase()} 내보내기에 실패했습니다.`,
    };
  }
}

export async function sendInvitation(
  _invitationId: string,
  guestEmails: string[]
): Promise<ServerActionResponse> {
  try {
    await new Promise(resolve => setTimeout(resolve, 1500));
    return {
      success: true,
      message: `${guestEmails.length}명의 게스트에게 초대장이 발송되었습니다.`,
    };
  } catch {
    return {
      success: false,
      error: '초대장 발송에 실패했습니다.',
    };
  }
}

export async function updateGuestRSVP(
  _guestId: string,
  _rsvpData: {
    attending: boolean;
    numberOfGuests: number;
    dietaryRestrictions?: string[];
    specialRequests?: string;
  }
): Promise<ServerActionResponse> {
  void _guestId;
  void _rsvpData;

  try {
    await new Promise(resolve => setTimeout(resolve, 800));
    return {
      success: true,
      message: '참석 여부가 업데이트되었습니다.',
    };
  } catch {
    return {
      success: false,
      error: '참석 여부 업데이트에 실패했습니다.',
    };
  }
}

export async function uploadImage(
  formData: FormData
): Promise<ServerActionResponse<{ url: string; id: string }>> {
  try {
    const file = formData.get('image') as File;

    if (!file) {
      return { success: false, error: '이미지 파일이 제공되지 않았습니다.' };
    }

    if (!file.type.startsWith('image/')) {
      return { success: false, error: '유효하지 않은 이미지 파일입니다.' };
    }

    if (file.size > 5 * 1024 * 1024) {
      return { success: false, error: '파일 크기는 5MB를 초과할 수 없습니다.' };
    }

    await new Promise(resolve => setTimeout(resolve, 1200));

    return {
      success: true,
      data: {
        url: `https://example.com/uploads/${Date.now()}-${file.name}`,
        id: `img_${Date.now()}`
      },
      message: '이미지가 성공적으로 업로드되었습니다.',
    };
  } catch {
    return { success: false, error: '이미지 업로드에 실패했습니다.' };
  }
}

export async function trackEvent(
  _eventName: string,
  _properties: Record<string, unknown>
): Promise<ServerActionResponse> {
  // Production에서는 실제 analytics 서비스로 전송
  void _eventName;
  void _properties;

  if (process.env.NODE_ENV !== 'production') {
    return { success: true };
  }

  try {
    await new Promise(resolve => setTimeout(resolve, 100));
    return { success: true };
  } catch {
    return { success: true };
  }
}

export async function validateInvitationData(
  data: Record<string, unknown>
): Promise<ServerActionResponse<{ valid: boolean; errors: string[] }>> {
  const errors: string[] = [];

  if (!data.groom || typeof data.groom !== 'object') {
    errors.push('신랑 정보가 올바르지 않습니다.');
  }
  if (!data.bride || typeof data.bride !== 'object') {
    errors.push('신부 정보가 올바르지 않습니다.');
  }
  if (!data.date || typeof data.date !== 'string') {
    errors.push('결혼식 날짜가 필요합니다.');
  }
  if (!data.location || typeof data.location !== 'string') {
    errors.push('결혼식 장소가 필요합니다.');
  }

  return {
    success: true,
    data: { valid: errors.length === 0, errors },
  };
}

export function handleServerActionError(error: unknown): ServerActionResponse {
  if (process.env.NODE_ENV !== 'production') {
    console.error('Server Action Error:', error);
  }

  return {
    success: false,
    error: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.',
  };
}