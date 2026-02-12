import type { Metadata } from 'next';
import { SITE_NAME, absoluteUrl } from '@/lib/site';
import styles from './page.module.scss';

export const metadata: Metadata = {
  title: `이용약관 | ${SITE_NAME}`,
  description: `${SITE_NAME} 서비스 이용약관 안내 페이지입니다.`,
  alternates: {
    canonical: '/terms',
  },
  openGraph: {
    title: `이용약관 | ${SITE_NAME}`,
    description: `${SITE_NAME} 서비스 이용약관 안내 페이지입니다.`,
    url: absoluteUrl('/terms'),
    type: 'article',
    locale: 'ko_KR',
  },
  twitter: {
    card: 'summary_large_image',
    title: `?댁슜?쎄? | ${SITE_NAME}`,
    description: `${SITE_NAME} ?쒕퉬???댁슜?쎄? ?덈궡 ?섏씠吏?낅땲??`,
    images: [absoluteUrl('/assets/icons/logo-banana-heart.png')],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
};

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: '홈',
      item: absoluteUrl('/'),
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: '이용약관',
      item: absoluteUrl('/terms'),
    },
  ],
};

export default function TermsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <div className={styles.container}>
        <h1 className={styles.title}>이용약관</h1>

      <p className={styles.lead}>
        본 약관은 바나나웨딩(이하 &apos;서비스&apos;)이 제공하는 모바일 청첩장 제작 및 관련
        서비스의 이용과 관련하여 서비스와 이용자 간의 권리, 의무 및 책임사항을 규정함을 목적으로
        합니다.
      </p>

      <h2 className={styles.sectionTitle}>제1조 (목적)</h2>
      <p>
        본 약관은 서비스가 제공하는 웹 기반 청첩장 제작 서비스 이용에 필요한 기본적인 사항을
        정합니다.
      </p>

      <h2 className={styles.sectionTitle}>제2조 (정의)</h2>
      <ul className={styles.list}>
        <li>
          <strong>이용자</strong>: 본 약관에 따라 서비스를 이용하는 회원 및 비회원을 말합니다.
        </li>
        <li>
          <strong>회원</strong>: 소셜 로그인(카카오/네이버 등)을 통해 계정을 생성하고 지속적으로
          서비스를 이용하는 자를 말합니다.
        </li>
        <li>
          <strong>콘텐츠</strong>: 이용자가 서비스에 업로드 또는 입력한 이미지, 문구, 계좌 정보 등
          청첩장 관련 데이터를 말합니다.
        </li>
      </ul>

      <h2 className={styles.sectionTitle}>제3조 (약관의 게시와 개정)</h2>
      <ul className={styles.list}>
        <li>서비스는 본 약관의 내용을 이용자가 쉽게 확인할 수 있도록 서비스 내에 게시합니다.</li>
        <li>
          서비스는 관계 법령을 위반하지 않는 범위 내에서 약관을 개정할 수 있으며, 변경 시 적용일자와
          변경 사유를 사전에 공지합니다.
        </li>
      </ul>

      <h2 className={styles.sectionTitle}>제4조 (서비스 제공 및 변경)</h2>
      <ul className={styles.list}>
        <li>서비스는 모바일 청첩장 생성, 수정, 공유, 미리보기 등 관련 기능을 제공합니다.</li>
        <li>
          서비스 운영상 또는 기술상 필요에 따라 제공 기능의 일부가 변경되거나 종료될 수 있으며,
          중대한 변경 시 사전 공지합니다.
        </li>
      </ul>

      <h2 className={styles.sectionTitle}>제5조 (이용자의 의무)</h2>
      <ul className={styles.list}>
        <li>이용자는 관계 법령 및 본 약관을 준수해야 합니다.</li>
        <li>타인의 권리를 침해하거나 불법·유해한 콘텐츠를 업로드해서는 안 됩니다.</li>
        <li>서비스의 안정적 운영을 방해하는 행위를 해서는 안 됩니다.</li>
      </ul>

      <h2 className={styles.sectionTitle}>제6조 (콘텐츠의 권리와 책임)</h2>
      <ul className={styles.list}>
        <li>이용자가 업로드한 콘텐츠에 대한 권리 및 책임은 이용자에게 있습니다.</li>
        <li>
          서비스는 법령 위반, 권리 침해, 서비스 운영 방해에 해당하는 콘텐츠를 사전 통지 후 또는 긴급
          시 사후 통지로 제한할 수 있습니다.
        </li>
      </ul>

      <h2 className={styles.sectionTitle}>제7조 (서비스 이용 제한)</h2>
      <p>
        서비스는 이용자가 본 약관 또는 관련 법령을 위반한 경우, 사안의 경중에 따라 이용 제한,
        콘텐츠 삭제, 계정 제한 등의 조치를 할 수 있습니다.
      </p>

      <h2 className={styles.sectionTitle}>제8조 (면책)</h2>
      <ul className={styles.list}>
        <li>서비스는 천재지변, 불가항력, 이용자 귀책사유로 인한 손해에 대해 책임을 지지 않습니다.</li>
        <li>이용자 간 또는 이용자와 제3자 간 분쟁에 대해 서비스는 법령상 책임 범위 내에서만 대응합니다.</li>
      </ul>

      <h2 className={styles.sectionTitle}>제9조 (준거법 및 관할)</h2>
      <p>
        본 약관은 대한민국 법령에 따르며, 서비스와 이용자 간 분쟁이 발생할 경우 관련 법령에 따른
        법원을 관할 법원으로 합니다.
      </p>

        <hr className={styles.divider} />
        <p className={styles.footerNote}>시행일자: 2026년 2월 10일</p>
      </div>
    </>
  );
}
