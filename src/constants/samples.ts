/**
 * 빌더에서 사용하는 샘플/추천 문구 상수
 *
 * 각 섹션에서 공통으로 사용하는 샘플 문구들을 정의합니다.
 */

import type { SamplePhraseItem } from '@/types/builder';

/**
 * 인사말 섹션 샘플 문구
 */
export const GREETING_SAMPLES: SamplePhraseItem[] = [
  {
    subtitle: 'Hello & Welcome',
    title: '초대해요',
    content:
      '<p>곁에 있을 때 가장 나다운 모습이 되게 하는 사람<br>꿈을 꾸게 하고 그 꿈을 함께 나누는 사람<br>그런 사람을 만나 이제 하나가 되려고 해요.</p><p>저희의 뜻깊은 시작을 함께 나누어 주시고<br>따뜻한 마음으로 축복해 주시면 감사하겠어요.</p>',
  },
  {
    subtitle: 'The Marriage',
    title: '소중한 분들을 초대해요',
    content:
      '<p>함께 있으면 기분이 좋아지는 사람을 만났어요.<br>이제 그 사람과 함께 인생의 먼 길을 떠나려고 해요.</p><p>저희의 앞날을 축복해 주시는 소중한 마음 잊지 않고<br>예쁘게 잘 살게요.</p>',
  },
  {
    subtitle: 'Our Wedding Day',
    title: '저희 결혼해요',
    content:
      '<p>서로가 마주 보며 다져온 사랑을<br>이제 함께 한 곳을 바라보며 걸어가려고 해요.</p><p>새로운 인생의 출발점에 선 저희 두 사람,<br>격려와 축복으로 함께해 주시면 큰 기쁨이겠어요.</p>',
  },
  {
    subtitle: 'True Love',
    title: '사랑의 결실',
    content:
      '<p>서로 다른 색으로 물들어 온 두 사람이<br>이제는 하나의 빛으로 어우러지려고 해요.</p><p>서로를 이해하고 아껴주는 마음으로<br>아름다운 세상을 만들어 갈게요.<br>귀한 걸음 하시어 축복해 주시면 더없는 기쁨이겠어요.</p>',
  },
  {
    subtitle: 'Happy Together',
    title: '아름다운 동행',
    content:
      '<p>오랜 시간 친구로 지내며 쌓아온 우정이<br>이제 사랑이라는 이름으로 결실을 맺어요.</p><p>같은 곳을 바라보며 걸어갈 저희의 첫걸음에<br>따뜻한 사랑과 응원을 보내주세요.</p>',
  },
  {
    subtitle: 'New Beginning',
    title: '시작하는 마음',
    content:
      '<p>작은 인연이 닿아 연인이 되었고<br>이제는 평생의 반려자가 되려고 해요.</p><p>서로의 부족함을 채워주고 기쁨은 나누며<br>행복하게 살게요.<br>저희의 약속을 지켜봐 주시고 응원해 주세요.</p>',
  },
  {
    subtitle: 'Beautiful Day',
    title: '꽃피는 날',
    content:
      '<p>계절의 포근함 속에서<br>저희 두 사람 사랑의 서약을 맺어요.</p><p>서로에게 든든한 나무가 되어주고<br>때로는 시원한 그늘이 되어주며 살게요.<br>이 아름다운 시작에 증인이 되어주세요.</p>',
  },
  {
    subtitle: 'Promise',
    title: '평생의 약속',
    content:
      '<p>서로가 서로에게 가장 소중한 선물이 되어<br>평생을 아끼고 사랑하며 살게요.</p><p>진실된 마음으로 맺는 이 약속의 자리에<br>소중한 분들을 모셔요.</p>',
  },
  {
    subtitle: 'First Love',
    title: '첫 마음 그대로',
    content:
      '<p>첫 만남의 설렘을 기억하며<br>매 순간을 소중히 여길게요.</p><p>때로는 친구처럼, 때로는 연인처럼<br>서로의 곁을 지키며 살아가겠어요.<br>저희의 행복한 동행을 축복해 주세요.</p>',
  },
  {
    subtitle: 'Wedding Vow',
    title: '사랑의 서약',
    content:
      '<p>두 사람이 하나 되어 걷는 이 길에<br>사랑과 믿음만이 가득하기를 소망해요.</p><p>기쁠 때나 슬플 때나<br>서로의 손을 놓지 않고 함께할게요.<br>그 약속의 시간에 함께 해주시면 감사하겠어요.</p>',
  },
];

/**
 * 마무리 섹션 샘플 문구
 */
export const CLOSING_SAMPLES: SamplePhraseItem[] = [
  {
    subtitle: 'CLOSING',
    title: '감사의 마음을 전해요',
    content:
      '저희의 새로운 시작을 함께 축복해 주셔서 진심으로 감사해요. 보내주신 소중한 마음 평생 잊지 않고 예쁘게 잘 살게요.',
  },
  {
    subtitle: 'THANK YOU',
    title: '함께해주셔서 감사해요',
    content:
      '귀한 걸음으로 저희의 앞날을 빛내주셔서 감사해요. 서로 아끼고 배려하며 행복한 가정 이루며 살게요.',
  },
  {
    subtitle: 'GRATITUDE',
    title: '소중한 인연에 감사해요',
    content:
      '오늘 이 자리를 빛내주신 한 분 한 분의 따뜻한 마음을 마음속 깊이 간직할게요. 항상 행복하시길 기원해요.',
  },
  {
    subtitle: 'ETERNAL LOVE',
    title: '사랑하며 살게요',
    content:
      '저희 두 사람이 사랑으로 맺어진 이 자리를 빛내주셔서 감사해요. 서로를 깊이 아끼며 믿음직한 부부로 살아가겠어요.',
  },
  {
    subtitle: 'NEW BEGINNING',
    title: '새로운 출발에 격려를',
    content:
      '두 사람이 하나 되어 내딛는 첫걸음에 따뜻한 축복을 보내주셔서 고마워요. 건강하고 밝은 가정을 일구어 나갈게요.',
  },
  {
    subtitle: 'WITH RESPECT',
    title: '믿음으로 살게요',
    content:
      '앞날을 축복해 주신 소중한 분들의 마음을 잊지 않을게요. 존중하고 배려하며 아름다운 삶을 만들어갈게요.',
  },
];

/**
 * 메인 화면 타이틀 샘플
 */
export const MAIN_TITLE_SAMPLES: SamplePhraseItem[] = [
  {
    title: 'THE MARRIAGE',
    subtitle: 'Our Precious Beginning',
    badge: '클래식',
  },
  {
    title: 'Wedding Invitation',
    subtitle: 'Save the Date',
    badge: '우아함',
  },
  {
    title: 'OUR WEDDING DAY',
    subtitle: 'Together Forever',
    badge: '심플',
  },
  {
    title: 'WE ARE GETTING MARRIED',
    subtitle: 'For All the Days to Come',
    badge: '모던',
  },
  {
    title: 'SAVE THE DATE',
    subtitle: "You're Invited",
    badge: '포인트',
  },
  {
    title: '저희 결혼해요',
    subtitle: '소중한 날에 초대합니다',
    badge: '베이직',
  },
  {
    title: '우리 결혼해요',
    subtitle: '따뜻한 동행의 시작',
    badge: '스윗',
  },
  {
    title: '소중한 분들을 초대해요',
    subtitle: '저희의 시작을 함께해주세요',
    badge: '격식',
  },
  {
    title: '지혜 & 현우의 결혼식',
    subtitle: 'Special Wedding Day',
    badge: '이름 강조',
  },
  {
    title: 'Happy Ever After',
    subtitle: 'A New Chapter Begins',
    badge: '로맨틱',
  },
  {
    title: '서로를 아끼며 살게요',
    subtitle: '변치 않는 사랑으로',
    badge: '다짐',
  },
];

/**
 * 카카오 공유 썸네일 샘플 문구
 */
export const KAKAO_SHARE_SAMPLES: SamplePhraseItem[] = [
  {
    badge: '심플',
    title: '우리 결혼해요',
    subtitle: '초대장을 보내드려요.',
  },
  {
    badge: '정중',
    title: '소중한 분들을 초대해요',
    subtitle: '귀한 걸음 하시어 축복해 주세요.',
  },
  {
    badge: '날짜 강조',
    title: '저희 결혼식에 초대해요',
    subtitle: '2026년 4월 29일 토요일 오후 12시',
  },
  {
    badge: '영문',
    title: 'We Are Getting Married',
    subtitle: 'Please join us for our wedding celebration',
  },
  {
    badge: '이름 강조',
    title: '신랑 ○○○ & 신부 ○○○',
    subtitle: '저희의 시작을 함께 축복해 주세요.',
  },
  {
    badge: '감성',
    title: '세상에서 가장 행복한 날',
    subtitle: '저희 두 사람 하나 되는 날, 함께해 주세요.',
  },
  {
    badge: '스타일리시',
    title: 'Wedding Invitation',
    subtitle: '특별한 날, 소중한 당신을 초대해요.',
  },
  {
    badge: '기쁨',
    title: '기쁜 날, 함께하고 싶어요',
    subtitle: '저희의 결혼식에 소중한 분들을 초대해요.',
  },
];

/**
 * 메인 화면 스타일 프리셋
 */
export const STYLE_PRESETS = [
  {
    id: 'classic',
    label: '클래식',
    layout: 'classic',
    imageShape: 'rect',
    isComingSoon: false,
  },
  {
    id: 'full',
    label: '추가 예정',
    layout: 'full',
    imageShape: 'rect',
    isComingSoon: true,
  },
  {
    id: 'modern',
    label: '추가 예정',
    layout: 'modern',
    imageShape: 'rect',
    isComingSoon: true,
  },
];
