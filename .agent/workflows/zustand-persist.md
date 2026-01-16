---
description: Zustand persist 미들웨어와 Next.js 페이지 간 상태 관리 패턴
---

# Zustand Persist + Next.js 상태 관리 가이드

## 개요

이 프로젝트는 `useInvitationStore`에서 Zustand `persist` 미들웨어를 사용하여 IndexedDB에 상태를 영속화합니다. 이로 인해 페이지 간 이동 시에도 상태가 유지되므로, 특정 페이지 진입 시 모드에 따른 상태 초기화가 필수입니다.

## 공통 전제
- React/Next.js 관련 변경은 `.codex/skills/vercel-react-best-practices/SKILL.md`를 최우선으로 준수합니다.

## 핵심 패턴: URL 기반 모드 구분

### 빌더 페이지 (`/builder`)

| URL | 모드 | 동작 |
|-----|------|------|
| `/builder?mode=edit` | 수정 모드 | 스토어 상태 유지 (기존 청첩장 수정) |
| `/builder` | 생성 모드 | `reset()` 호출하여 새 청첩장 생성 |

### 필수 구현 체크리스트

1. **페이지 진입 시 모드 확인**
   ```tsx
   const isEditMode = searchParams.get('mode') === 'edit';
   ```

2. **StrictMode 이중 실행 방지**
   ```tsx
   const initRef = useRef(false);
   useEffect(() => {
     if (initRef.current) return;
     initRef.current = true;
     // 초기화 로직
   }, []);
   ```

3. **생성 모드에서 스토어 리셋**
   ```tsx
   if (!isEditMode) {
     reset();
   }
   ```

4. **초기화 완료 전 사용자 액션 차단**
   ```tsx
   const [isReady, setIsReady] = useState(false);
   // 초기화 후 setIsReady(true)
   if (!isReady) {
     toast.error('잠시 후 다시 시도해주세요.');
     return;
   }
   ```

## 마이페이지에서 수정 버튼 클릭 시

```tsx
const handleEdit = useCallback((inv: InvitationRecord) => {
  // 1. 스토어에 기존 데이터 로드
  useInvitationStore.setState(inv.invitation_data);
  useInvitationStore.getState().setSlug(inv.slug);
  
  // 2. mode=edit 쿼리 파라미터와 함께 빌더로 이동
  router.push('/builder?mode=edit');
}, [router]);
```

## 금지 사항 (DO NOT)

- ❌ `/builder` URL로 직접 접속 시 이전 데이터로 저장되도록 방치
- ❌ `sessionStorage`나 `localStorage`에 의존하는 복잡한 slug 관리 로직
- ❌ Zustand persist hydration 완료 전 데이터 접근

## 권장 사항 (DO)

- ✅ URL 쿼리 파라미터(`mode=edit`)로 명시적인 모드 구분
- ✅ `initRef`로 React StrictMode의 이중 실행 방지
- ✅ `isReady` 상태로 초기화 완료 전 사용자 액션 차단
- ✅ 중첩 객체는 `merge` 옵션으로 deep merge 처리

## 관련 파일

- `src/app/builder/page.tsx` - 빌더 페이지 (모드 확인 및 초기화)
- `src/app/mypage/MyPageClient.tsx` - 마이페이지 (수정 버튼 핸들러)
- `src/store/useInvitationStore.ts` - Zustand 스토어 (persist 설정)
- `ARCHITECTURE.md` - 아키텍처 가이드 (섹션 7)

## 참고 문서

- [Zustand Persist Middleware](https://docs.pmnd.rs/zustand/integrations/persisting-store-data)
- [Next.js App Router + Zustand](https://docs.pmnd.rs/zustand/integrations/persisting-store-data#usage-in-nextjs)
