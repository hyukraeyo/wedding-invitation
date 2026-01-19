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
    }
];

/**
 * 메인 화면 타이틀 샘플
 */
export const MAIN_TITLE_SAMPLES: SamplePhraseItem[] = [
    { title: 'THE MARRIAGE', subtitle: '영문 타이틀', content: '영문 타이틀' },
    { title: 'WEDDING INVITATION', subtitle: '영문 초대장', content: '영문 초대장' },
    { title: 'OUR WEDDING DAY', subtitle: '우리의 결혼식', content: '우리의 결혼식' },
    { title: 'WE ARE GETTING MARRIED', subtitle: '우리 결혼합니다 (영문)', content: '우리 결혼합니다 (영문)' },
    { title: 'SAVE THE DATE', subtitle: '날짜를 비워두세요', content: '날짜를 비워두세요' },
    { title: '결혼합니다', subtitle: '국문 심플', content: '국문 심플' },
    { title: '우리 결혼해요', subtitle: '국문 데이트', content: '국문 데이트' },
    { title: '소중한 분들을 초대합니다', subtitle: '국문 정중', content: '국문 정중' },
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
    }
];
