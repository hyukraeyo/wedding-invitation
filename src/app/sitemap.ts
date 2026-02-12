import type { MetadataRoute } from 'next';
import { absoluteUrl } from '@/lib/site';

const LAST_MODIFIED = new Date('2026-02-12T00:00:00.000Z');

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: absoluteUrl('/'),
      lastModified: LAST_MODIFIED,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: absoluteUrl('/privacy'),
      lastModified: LAST_MODIFIED,
      changeFrequency: 'yearly',
      priority: 0.4,
    },
    {
      url: absoluteUrl('/terms'),
      lastModified: LAST_MODIFIED,
      changeFrequency: 'yearly',
      priority: 0.4,
    },
  ];
}
