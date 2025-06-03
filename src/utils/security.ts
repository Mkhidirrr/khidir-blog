import DOMPurify from 'dompurify';

export function sanitizeInput(input: string): string {
  return input.replace(/[<>]/g, '');
}

export function sanitizeHTML(html: string): string {
  if (typeof window !== 'undefined') {
    return DOMPurify.sanitize(html, {
      ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a'],
      ALLOWED_ATTR: ['href', 'target', 'rel']
    });
  }
  return html;
}

export function validateSearchQuery(query: string): boolean {
  return query.length >= 2 && query.length <= 50 && /^[a-zA-Z0-9\s-_]+$/.test(query);
}
