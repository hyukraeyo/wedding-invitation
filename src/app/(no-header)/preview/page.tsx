import InvitationCanvas from '@/components/preview/InvitationCanvas';

export default function PreviewPage() {
  return (
    <div style={{ width: '100%', minHeight: '100dvh', backgroundColor: 'var(--background)' }}>
      <InvitationCanvas disableInternalScroll />
    </div>
  );
}
