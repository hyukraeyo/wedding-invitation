import type { InvitationData } from '@/store/useInvitationStore';
import { htmlToPlainText } from '@/lib/richText';
import { isBlank, isValidName } from '@/lib/utils';

export const SECTION_VALUE_TO_EDITOR_KEY = {
  'basic-info': 'basic',
  theme: 'theme',
  main: 'mainScreen',
  greeting: 'message',
  gallery: 'gallery',
  'date-time': 'date',
  location: 'location',
  accounts: 'account',
  closing: 'closing',
  'kakao-share': 'kakao',
} as const;

export type EditorSectionKey =
  (typeof SECTION_VALUE_TO_EDITOR_KEY)[keyof typeof SECTION_VALUE_TO_EDITOR_KEY];

export const EDITOR_KEY_TO_SECTION_VALUE: Record<EditorSectionKey, string> = {
  basic: 'basic-info',
  theme: 'theme',
  mainScreen: 'main',
  message: 'greeting',
  gallery: 'gallery',
  date: 'date-time',
  location: 'location',
  account: 'accounts',
  closing: 'closing',
  kakao: 'kakao-share',
};

export const EDITOR_SECTION_LABEL: Record<EditorSectionKey, string> = {
  basic: '기본 정보',
  theme: '테마',
  mainScreen: '메인 화면',
  message: '인사말',
  gallery: '웨딩 갤러리',
  date: '예식 일시',
  location: '예식 장소',
  account: '계좌 정보',
  closing: '마무리',
  kakao: '카카오 공유',
};

export interface BuilderValidationIssue {
  sectionKey: EditorSectionKey;
  fieldId: string; // DOM element ID for highlighting
  fieldLabel: string;
  message: string;
}

export const REQUIRED_FIELD_KEYS = [
  'groomName',
  'brideName',
  'mainImage',
  'weddingDate',
  'weddingTime',
  'locationVenue',
  'locationAddress',
  'greetingTitle',
  'greetingMessage',
  'galleryImages',
] as const;

export type RequiredFieldKey = (typeof REQUIRED_FIELD_KEYS)[number];

const hasIncompleteAccount = (accounts: InvitationData['accounts']): boolean =>
  accounts.some((account) => {
    const hasAnyValue = Boolean(
      account.bank || account.accountNumber || account.holder || account.relation
    );
    if (!hasAnyValue) {
      return false;
    }

    return !account.bank || !account.accountNumber || !account.holder;
  });

export const getBuilderValidationIssues = (data: InvitationData): BuilderValidationIssue[] => {
  const issues: BuilderValidationIssue[] = [];

  const groomFullName = `${data.groom.lastName}${data.groom.firstName}`;
  const brideFullName = `${data.bride.lastName}${data.bride.firstName}`;

  if (!isValidName(groomFullName)) {
    issues.push({
      sectionKey: 'basic',
      fieldId: 'groom-name',
      fieldLabel: '신랑',
      message: isBlank(groomFullName)
        ? '기본 정보의 신랑 이름을 입력해주세요.'
        : '신랑 이름을 올바른 형식으로 입력해주세요 (한글 또는 영문).',
    });
  }

  if (!isValidName(brideFullName)) {
    issues.push({
      sectionKey: 'basic',
      fieldId: 'bride-name',
      fieldLabel: '신부',
      message: isBlank(brideFullName)
        ? '기본 정보의 신부 이름을 입력해주세요.'
        : '신부 이름을 올바른 형식으로 입력해주세요 (한글 또는 영문).',
    });
  }

  if (!data.imageUrl) {
    issues.push({
      sectionKey: 'mainScreen',
      fieldId: 'main-image',
      fieldLabel: '메인 사진',
      message: '메인 섹션 이미지를 등록해주세요.',
    });
  }

  if (isBlank(data.date)) {
    issues.push({
      sectionKey: 'date',
      fieldId: 'wedding-date',
      fieldLabel: '예식 날짜',
      message: '예식 날짜를 입력해주세요.',
    });
  }

  if (isBlank(data.time)) {
    issues.push({
      sectionKey: 'date',
      fieldId: 'wedding-time',
      fieldLabel: '예식 시간',
      message: '예식 시간을 입력해주세요.',
    });
  }

  if (isBlank(data.location)) {
    issues.push({
      sectionKey: 'location',
      fieldId: 'location-venue',
      fieldLabel: '예식 장소명',
      message: '예식 장소명을 입력해주세요.',
    });
  }

  if (isBlank(data.address)) {
    issues.push({
      sectionKey: 'location',
      fieldId: 'location-address',
      fieldLabel: '주소',
      message: '예식 주소를 입력해주세요.',
    });
  }

  if (isBlank(data.greetingTitle)) {
    issues.push({
      sectionKey: 'message',
      fieldId: 'greeting-title',
      fieldLabel: '제목',
      message: '인사말 제목을 입력해주세요.',
    });
  }

  const messageText = htmlToPlainText(data.message);
  if (isBlank(messageText)) {
    issues.push({
      sectionKey: 'message',
      fieldId: 'greeting-message-required',
      fieldLabel: '내용',
      message: '인사말 내용을 입력해주세요.',
    });
  }

  if (!data.gallery || data.gallery.length === 0) {
    issues.push({
      sectionKey: 'gallery',
      fieldId: 'gallery-images-required',
      fieldLabel: '갤러리 이미지',
      message: '갤러리 이미지를 최소 1장 등록해주세요.',
    });
  }

  if (hasIncompleteAccount(data.accounts)) {
    issues.push({
      sectionKey: 'account',
      fieldId: 'accounts',
      fieldLabel: '계좌 정보',
      message: '계좌 정보는 은행, 계좌번호, 예금주를 모두 입력해주세요.',
    });
  }

  return issues;
};
