export function isBlobUrl(url?: string | null) {
  return typeof url === 'string' && url.startsWith('blob:');
}
