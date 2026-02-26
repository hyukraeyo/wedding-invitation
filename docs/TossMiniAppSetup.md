# 🍌 바나나웨딩 × 앱인토스 출시 가이드

> 이 문서는 바나나웨딩 프로젝트를 토스 앱인토스(Apps in Toss)에 출시하기 위한 설정과 체크리스트를 정리합니다.

## 📦 설치된 패키지

```
@apps-in-toss/web-framework  ^1.14.0  # 앱인토스 프레임워크 (기존 설치)
@toss/tds-mobile              ^2.2.1   # TDS (Toss Design System) 컴포넌트
@toss/tds-mobile-ait          ^2.2.1   # TDS 앱인토스 WebView Provider
```

## 🏗️ 아키텍처: 듀얼 모드 전략

```
┌─────────────────────────────────────────────────────────┐
│                    ClientProviders                       │
│  ┌───────────────────────────────────────────────────┐  │
│  │                 TossProvider                       │  │
│  │  (토스 환경)                                        │  │
│  │  ├ TDSMobileAITProvider 활성화 (lazy-load)          │  │
│  │  ├ --header-height: 0px (토스 내비게이션바 대체)       │  │
│  │  └ data-toss="true" 속성 추가                       │  │
│  │                                                     │  │
│  │  (일반 웹): 패스스루, TDS 미로드                       │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### 핵심 파일

| 파일                                     | 역할                        |
| ---------------------------------------- | --------------------------- |
| `src/lib/toss.ts`                        | 토스 환경 감지 유틸리티     |
| `src/lib/toss-adapters.tsx`              | TDS/웹 자동 전환 어댑터     |
| `src/hooks/useTossEnvironment.ts`        | React Hook (환경 감지)      |
| `src/hooks/useTossBackEvent.ts`          | 뒤로가기 이벤트 처리 Hook   |
| `src/components/providers/TossProvider/` | TDS Provider + CSS override |
| `granite.config.ts`                      | 앱인토스 설정               |

## ✅ 비게임 검수 가이드 대응 현황

### 접속 및 앱 내 기능

- [x] 뒤로가기 버튼 정상 동작 (`useTossBackEvent` Hook)

### 내비게이션 바

- [x] 앱인토스 비게임 내비게이션 바 사용 (`webViewProps.type: 'partner'`)
- [x] 브랜드 로고/이름 노출 (`brand.displayName: '바나나 웨딩'`)
- [x] **자체 Header 숨김** — 토스 내비게이션 바와 중복 방지 (`Header.tsx`)
- [x] `--header-height: 0px` 설정으로 패딩 자동 조정

### 서비스 이용 동작

- [x] 제스처 확대·축소 비활성화 (`maximumScale: 1, userScalable: false`)
- [x] 라이트 모드 전용 (다크모드 미구현)
- [x] TDS 모달 사용 (`TossConfirmDialog` 어댑터)
- [x] 외부 스킴 규칙 (`intoss-private://` 미사용)
- [x] CSP `frame-ancestors`에 토스 도메인 허용
- [x] Server Actions `allowedOrigins`에 토스 도메인 추가

### UX

- [x] 바텀시트 자동 열기 없음 (검증 완료)
- [x] CTA 버튼 명확한 라벨링

### 토스 로그인

- [x] **소셜 로그인(카카오/네이버) 토스 환경에서 숨김** (`LoginPage.tsx`)
- [x] **Footer 로그인/로그아웃 버튼 토스 환경에서 숨김** (`HomeClient.tsx`)
- [x] 토스 로그인 안내 메시지 표시

### 기타

- [x] React 19 호환 overrides 설정
- [x] TypeScript 컴파일 에러 0
- [x] Dev 서버 정상 동작

## ⏳ 출시 전 남은 작업

### 콘솔 설정

- [ ] 앱인토스 콘솔에서 앱 등록 (`appName: 'banana-wedding'`)
- [ ] 앱 아이콘 업로드 → `granite.config.ts` `icon` URL 교체
- [ ] 토스 로그인 SDK 연동 (선택 — 로그인 필요 기능 제공 시)

### 테스트

- [ ] 기존 dev 서버 종료 → `npm run toss:dev` 실행
- [ ] 샌드박스 앱에서 TDS 컴포넌트 렌더링 확인
- [ ] 내비게이션 바 뒤로가기 동작 확인
- [ ] 최초 화면 뒤로가기 → 미니앱 종료 확인

### 배포

```bash
npm run toss:build   # .ait 번들 생성
npm run toss:deploy  # 토스 배포
```

## 📚 참고 문서

- [비게임 출시 가이드](https://developers-apps-in-toss.toss.im/checklist/app-nongame.html)
- [WebView 가이드](https://developers-apps-in-toss.toss.im/tutorials/webview.html)
- [이벤트 제어](https://developers-apps-in-toss.toss.im/bedrock/reference/framework/%EC%9D%B4%EB%B2%A4%ED%8A%B8%20%EC%A0%9C%EC%96%B4/back-event.html)
- [TDS Mobile 문서](https://tossmini-docs.toss.im/tds-mobile/)
