import Link from 'next/link';

export const metadata = {
  title: '페이지를 찾을 수 없어요 | 바나나웨딩',
  description: '요청하신 페이지를 찾을 수 없어요.',
};

export default function NotFound() {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        flexDirection: 'column',
        textAlign: 'center',
      }}
    >
      <div>
        <h1
          style={{ fontSize: '4rem', fontWeight: 'bold', color: '#FBC02D', marginBottom: '1rem' }}
        >
          404
        </h1>
        <p style={{ fontSize: '1.2rem', marginBottom: '2rem', color: '#333' }}>
          요청하신 페이지를 찾을 수 없어요.
          <br />
          주소를 다시 확인해 주세요.
        </p>
        <Link
          href="/"
          prefetch={false}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#FBC02D',
            color: '#fff',
            borderRadius: '8px',
            textDecoration: 'none',
            fontWeight: 'bold',
          }}
        >
          홈으로 돌아가기
        </Link>
      </div>
    </div>
  );
}
