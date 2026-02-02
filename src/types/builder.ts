/**
 * Builder Section 공통 타입 정의
 *
 * 모든 빌더 섹션 컴포넌트에서 사용하는 공통 인터페이스입니다.
 */

/**
 * 아코디언 섹션 컴포넌트의 기본 Props
 * @property value - 아코디언 아이템의 고유 식별자
 * @property isOpen - 현재 섹션이 열려있는지 여부
 */
export interface SectionProps {
  value: string;
  isOpen: boolean;
  onToggle: (isOpen: boolean) => void;
}

/**
 * 샘플/추천 문구 아이템 타입
 * ExampleSelectorModal의 ExampleItem과 호환됩니다.
 */
export interface SamplePhraseItem {
  subtitle?: string;
  title: string;
  content?: string;
  badge?: string;
  [key: string]: unknown;
}
