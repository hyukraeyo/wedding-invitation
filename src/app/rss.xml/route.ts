import { SITE_DESCRIPTION, SITE_NAME, SITE_URL, absoluteUrl } from '@/lib/site';

interface RssItem {
  description: string;
  path: string;
  pubDate: string;
  title: string;
}

const RSS_ITEMS: RssItem[] = [
  {
    title: `${SITE_NAME} 홈`,
    path: '/',
    description: SITE_DESCRIPTION,
    pubDate: 'Tue, 10 Feb 2026 00:00:00 GMT',
  },
  {
    title: `${SITE_NAME} 브랜드 스토리`,
    path: '/brand-story',
    description: '바나나웨딩의 브랜드 철학과 모바일 청첩장 제작 경험을 소개합니다.',
    pubDate: 'Tue, 10 Feb 2026 00:00:00 GMT',
  },
  {
    title: `${SITE_NAME} 개인정보 처리방침`,
    path: '/privacy',
    description: '바나나웨딩 서비스 이용자를 위한 개인정보 처리방침입니다.',
    pubDate: 'Tue, 10 Feb 2026 00:00:00 GMT',
  },
  {
    title: `${SITE_NAME} 이용약관`,
    path: '/terms',
    description: '바나나웨딩 서비스 이용약관 안내 페이지입니다.',
    pubDate: 'Tue, 10 Feb 2026 00:00:00 GMT',
  },
];

const escapeXml = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

const buildRssItem = (item: RssItem): string => {
  const link = absoluteUrl(item.path);

  return [
    '<item>',
    `<title>${escapeXml(item.title)}</title>`,
    `<link>${escapeXml(link)}</link>`,
    `<guid isPermaLink="true">${escapeXml(link)}</guid>`,
    `<description>${escapeXml(item.description)}</description>`,
    `<pubDate>${item.pubDate}</pubDate>`,
    '</item>',
  ].join('');
};

export async function GET() {
  const lastBuildDate = new Date().toUTCString();

  const rss = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    '<channel>',
    `<title>${escapeXml(SITE_NAME)}</title>`,
    `<link>${escapeXml(SITE_URL)}</link>`,
    `<description>${escapeXml(SITE_DESCRIPTION)}</description>`,
    '<language>ko-kr</language>',
    `<lastBuildDate>${lastBuildDate}</lastBuildDate>`,
    `<atom:link href="${escapeXml(absoluteUrl('/rss.xml'))}" rel="self" type="application/rss+xml" />`,
    ...RSS_ITEMS.map(buildRssItem),
    '</channel>',
    '</rss>',
  ].join('');

  return new Response(rss, {
    headers: {
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      'Content-Type': 'application/rss+xml; charset=utf-8',
    },
  });
}
