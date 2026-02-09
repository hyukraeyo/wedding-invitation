import type { CSSProperties } from 'react';

const buttonBase: CSSProperties = {
  border: 'none',
  borderRadius: '12px',
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontFamily: 'var(--font-pretendard)',
  fontSize: '15px',
  fontWeight: 600,
  gap: '8px',
  minHeight: '44px',
  padding: '12px 24px',
};

export const errorFallbackStyles = {
  container: {
    minHeight: '100dvh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'var(--background)',
    padding: '24px',
    fontFamily: 'var(--font-pretendard)',
  } satisfies CSSProperties,
  card: {
    width: '100%',
    maxWidth: '400px',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    textAlign: 'center',
  } satisfies CSSProperties,
  iconWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  } satisfies CSSProperties,
  iconBg: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px',
    borderRadius: '9999px',
    backgroundColor: '#fff1f2',
  } satisfies CSSProperties,
  title: {
    margin: 0,
    marginBottom: '8px',
    color: 'var(--foreground)',
    fontSize: '24px',
    fontWeight: 700,
  } satisfies CSSProperties,
  description: {
    margin: 0,
    color: 'var(--text-sub)',
    fontSize: '15px',
    lineHeight: 1.5,
  } satisfies CSSProperties,
  errorBox: {
    borderRadius: '12px',
    padding: '16px',
    backgroundColor: 'var(--color-grey-100)',
    textAlign: 'left',
    fontSize: '13px',
  } satisfies CSSProperties,
  code: {
    margin: 0,
    color: 'var(--color-grey-600)',
    fontFamily: 'monospace',
    wordBreak: 'break-all',
  } satisfies CSSProperties,
  digest: {
    marginTop: '8px',
    fontSize: '11px',
  } satisfies CSSProperties,
  buttonGroup: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: '12px',
  } satisfies CSSProperties,
  primaryButton: {
    ...buttonBase,
    backgroundColor: 'var(--primary)',
    color: '#020202',
  } satisfies CSSProperties,
  outlineButton: {
    ...buttonBase,
    backgroundColor: '#ffffff',
    border: '1px solid var(--color-grey-100)',
    color: 'var(--foreground)',
  } satisfies CSSProperties,
} as const;
