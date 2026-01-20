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
        title: '초대합니다',
        content: '<p>곁에 있을 때 가장 나다운 모습이 되게 하는 사람<br>꿈을 꾸게 하고 그 꿈을 함께 나누는 사람<br>그런 사람을 만나 이제 하나가 되려 합니다.</p><p>저희의 뜻깊은 시작을 함께 나누어 주시고<br>따뜻한 마음으로 축복해 주시면 감사하겠습니다.</p>'
    },
    {
        subtitle: 'The Marriage',
        title: '소중한 분들을 초대합니다',
        content: '<p>함께 있으면 기분이 좋아지는 사람을 만났습니다.<br>이제 그 사람과 함께 인생의 먼 길을 떠나려 합니다.</p><p>저희의 앞날을 축복해 주시는 소중한 마음 잊지 않고<br>예쁘게 잘 살겠습니다.</p>'
    },
    {
        subtitle: 'Our Wedding Day',
        title: '저희 결혼합니다',
        content: '<p>서로가 마주 보며 다져온 사랑을<br>이제 함께 한 곳을 바라보며 걸어가려 합니다.</p><p>새로운 인생의 출발점에 선 저희 두 사람,<br>격려와 축복으로 함께해 주시면 큰 기쁨이겠습니다.</p>'
    }
];

/**
 * 마무리 섹션 샘플 문구
 */
export const CLOSING_SAMPLES: SamplePhraseItem[] = [
    {
        subtitle: 'CLOSING',
        title: '감사의 마음을 전합니다',
        content: '저희의 새로운 시작을 함께 축복해 주셔서 진심으로 감사합니다. 보내주신 소중한 마음 평생 잊지 않고 예쁘게 잘 살겠습니다.'
    },
    {
        subtitle: 'THANK YOU',
        title: '함께해주셔서 감사합니다',
        content: '귀한 걸음으로 저희의 앞날을 빛내주셔서 감사합니다. 서로 아끼고 배려하며 행복한 가정 이루며 살겠습니다.'
    },
    {
        subtitle: 'GRATITUDE',
        title: '소중한 인연에 감사합니다',
        content: '오늘 이 자리를 빛내주신 한 분 한 분의 따뜻한 마음을 마음속 깊이 간직하겠습니다. 항상 행복하시길 기원합니다.'
    },
    {
        subtitle: 'ETERNAL LOVE',
        title: '사랑하며 살겠습니다',
        content: '저희 두 사람이 사랑으로 맺어진 이 자리를 빛내주셔서 감사합니다. 서로를 깊이 아끼며 믿음직한 부부로 살아가겠습니다.'
    },
    {
        subtitle: 'NEW BEGINNING',
        title: '새로운 출발에 격려를',
        content: '두 사람이 하나 되어 내딛는 첫걸음에 따뜻한 축복을 보내주셔서 고맙습니다. 건강하고 밝은 가정을 일구어 나가겠습니다.'
    },
    {
        subtitle: 'WITH RESPECT',
        title: '믿음으로 살겠습니다',
        content: '앞날을 축복해 주신 소중한 분들의 마음을 잊지 않겠습니다. 존중하고 배려하며 아름다운 삶을 만들어가겠습니다.'
    }
];

/**
 * 메인 화면 타이틀 샘플
 */
export const MAIN_TITLE_SAMPLES: SamplePhraseItem[] = [
    { title: 'THE MARRIAGE', badge: 'Classic', content: '클래식한 영문 대문자 타이틀입니다.' },
    { title: 'Wedding Invitation', badge: 'Elegant', content: '세리프 문체와 잘 어울리는 우아한 타이틀입니다.' },
    { title: 'OUR WEDDING DAY', badge: 'Simple', content: '군더더기 없는 깔끔한 스타일의 메인 문구입니다.' },
    { title: 'WE ARE GETTING MARRIED', badge: 'Modern', content: '모던하고 직관적인 영문 타이틀입니다.' },
    { title: 'SAVE THE DATE', badge: 'Point', content: '날짜를 강조하는 트렌디한 타이틀입니다.' },
    { title: '저희 결혼합니다', badge: 'Basic', content: '가장 대중적이고 정중한 국문 타이틀입니다.' },
    { title: '우리 결혼해요', badge: 'Sweet', content: '다정하고 친근한 느낌의 국문 타이틀입니다.' },
    { title: '소중한 분들을 초대합니다', badge: 'Gentle', content: '격식을 갖춘 정중한 초대 문구입니다.' },
    { title: '지혜 & 현우의 결혼식', badge: 'Name', content: '이름을 직접 노출하여 특별함을 더하는 스타일입니다.' },
    { title: 'Happy Ever After', badge: 'Romantic', content: '동화 같은 시작을 알리는 로맨틱한 문구입니다.' },
    { title: '서로를 아끼며 살겠습니다', badge: 'Promise', content: '부부의 다짐을 메인에 담은 따뜻한 문구입니다.' },
];

/**
 * 카카오 공유 썸네일 샘플 문구
 */
export const KAKAO_SHARE_SAMPLES: SamplePhraseItem[] = [
    {
        subtitle: '심플',
        title: '우리 결혼합니다',
        content: '초대장을 보내드립니다.'
    },
    {
        subtitle: '정중',
        title: '소중한 분들을 초대합니다',
        content: '귀한 걸음 하시어 축복해 주세요.'
    },
    {
        subtitle: '날짜 강조',
        title: '저희 결혼식에 초대합니다',
        content: '2026년 4월 29일 토요일 오후 12시'
    },
    {
        subtitle: '영문',
        title: 'We Are Getting Married',
        content: 'Please join us for our wedding celebration'
    },
    {
        subtitle: '이름 강조',
        title: '신랑 ○○○ & 신부 ○○○',
        content: '저희의 시작을 함께 축복해 주세요.'
    },
    {
        subtitle: '감성',
        title: '세상에서 가장 행복한 날',
        content: '저희 두 사람 하나 되는 날, 함께해 주세요.'
    },
    {
        subtitle: '스타일리시',
        title: 'Wedding Invitation',
        content: '특별한 날, 소중한 당신을 초대합니다.'
    },
    {
        subtitle: '기쁨',
        title: '기쁜 날, 함께하고 싶습니다',
        content: '저희의 결혼식에 소중한 분들을 초대합니다.'
    }
];
