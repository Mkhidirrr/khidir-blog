export function getCacheHeaders(type: 'static' | 'dynamic') {
  const baseHeaders = {
    'Cache-Control': type === 'static' 
      ? 'public, max-age=31536000, immutable' 
      : 'public, max-age=3600, must-revalidate',
    'Vary': 'Accept-Encoding'
  };

  return baseHeaders;
}

export function getETag(content: string): string {
  return Buffer.from(content).toString('base64').substring(0, 27);
}
