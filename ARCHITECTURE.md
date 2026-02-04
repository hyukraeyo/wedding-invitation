# 🏗 바나나웨딩 아키텍처 가이드 (Architecture Guide)

이 문서는 바나나웨딩 프로젝트의 아키텍처 원칙과 공통 패턴을 정의합니다.

## 1. 전역 상태 관리 (Zustand)

### **useInvitationStore**
- 청첩장 데이터의 모든 상태를 관리하는 단일 소스입니다.
- **수정 모드**: `/builder?mode=edit` 진입 시 기존 데이터를 스토어에 로드합니다.
- **생성 모드**: `/builder` 진입 시 스토어를 초기화합니다.

```typescript
const { invitation, updateInvitation } = useInvitationStore(
  useShallow((state) => ({
    invitation: state.invitation,
    updateInvitation: state.updateInvitation,
  }))
);
```

## 2. 공통 UI 패턴

### **ResponsiveModal**
- 데스크톱에서는 `Dialog`(중앙 팝업), 모바일에서는 `Drawer`(바텀 시트)로 동작하는 하이브리드 모달입니다.

### **ConfirmDialog**
- 사용자 확인이 필요한 액션(삭제, 변경 취소 등)에 사용합니다.

## 3. 데이터 패칭 (Data Fetching)

- **Server Components**: 데이터 조회를 위해 서버 컴포넌트에서 직접 Service 레이어를 호출합니다.
- **Server Actions**: 데이터 변이(Create, Update, Delete)를 비동기적으로 처리합니다.
- **Client Side**: 실시간 UI 업데이트가 필요한 경우에만 TanStack Query를 보조적으로 사용합니다.

## 4. 스타일링 시스템

- **디자인 토큰**: `src/styles/_variables.scss`에 모든 색상, 간격, 타이포그래피 상수를 정의합니다.
- **믹스인**: `src/styles/_mixins.scss`에서 공통 레이아웃(Flex, Grid) 및 미디어 쿼리를 관리합니다.

## 5. 접근성 (Accessibility)

- Radix UI Primitives를 활용하여 키보드 네비게이션과 스크린 리더 호환성을 보장합니다.
- 모달이 열릴 때 백그라운드 요소가 `aria-hidden="true"`로 설정되는 환경에서 포커스 트랩이 정확히 작동하도록 관리합니다.
