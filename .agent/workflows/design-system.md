---
description: TDS Mobile 디자인 시스템 참조 및 커스터마이징 가이드
---

# TDS Mobile 디자인 시스템 참조 가이드

이 프로젝트는 **[TDS Mobile (Toss Design System)](https://tossmini-docs.toss.im/tds-mobile/)**을 기본 베이스로 참조하여 커스터마이징합니다.

## 디자인 시스템 개요

TDS는 토스 제품을 만들 때 공통적으로 사용하는 디자인 시스템으로, 다음 목표를 지향합니다:

1. **제품의 최소 품질 보장** - 일관된 UI로 사용자 경험 일관성 유지
2. **생산성 향상** - 재사용 가능한 아름다운 디자인 시스템으로 UI 개발 효율화
3. **업계 최고 수준의 완성도** - 일관성 있는 인터랙션, 애니메이션, 디자인 템플릿 활용

## 참조 문서

| 문서 | URL | 용도 |
|------|-----|------|
| TDS 소개 | https://tossmini-docs.toss.im/tds-mobile/ | 디자인 시스템 개요 |
| 시작하기 | https://tossmini-docs.toss.im/tds-mobile/start/ | 빠른 시작 가이드 |
| Colors | https://tossmini-docs.toss.im/tds-mobile/foundation/colors/ | 컬러 시스템 |
| Typography | https://tossmini-docs.toss.im/tds-mobile/foundation/typography/ | 타이포그래피 시스템 |

## 새 컴포넌트 작성 워크플로우

1. **TDS 문서 확인**: 새 UI 컴포넌트를 만들기 전에 TDS 문서에서 해당 컴포넌트가 있는지 확인
2. **스타일 참조**: TDS 컴포넌트의 다음 속성을 참조
   - 컬러 (배경, 텍스트, 보더)
   - 타이포그래피 (폰트 크기, 두께, 행간)
   - 간격 (패딩, 마진)
   - 라운딩 (border-radius)
   - 그림자 (box-shadow)
   - 애니메이션/트랜지션
3. **커스터마이징**: 웨딩 테마에 맞게 필요한 부분만 조정
4. **파일 위치**:
   - 컬러: `src/styles/_tds_colors.scss`
   - 타이포그래피: `src/styles/_tds_typography.scss`
   - 컴포넌트: `src/components/builder/`

## 프로젝트 적용 파일

```
src/styles/
├── _tds_colors.scss      # TDS 컬러 팔레트 커스텀
├── _tds_typography.scss  # TDS 타이포그래피 커스텀
└── variables.scss        # 전역 변수 (TDS 기반)
```

## 주의사항

- TDS는 외부 디자인 시스템이므로 직접 라이브러리를 설치하지 않음
- 공식 문서의 스타일 가이드만 참조하여 프로젝트에 맞게 구현
- 컴포넌트 스타일 작성 시 TDS 문서를 먼저 확인하는 것을 습관화
