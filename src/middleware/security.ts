export function securityHeaders() {
  return {
    headers: {
      // Security Headers
      'Content-Security-Policy': [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
        "style-src 'self' 'unsafe-inline'",
        "img-src 'self' data: https:",
        "font-src 'self'",
        "connect-src 'self'",
        "frame-ancestors 'none'",
      ].join('; '),
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
      'X-Frame-Options': 'DENY',
      'X-Content-Type-Options': 'nosniff',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',

      // Caching Headers
      'Cache-Control': 'public, max-age=3600, must-revalidate',
      'Surrogate-Control': 'public, max-age=3600',
      'Pragma': 'no-cache',

      // Resource Policy
      'Cross-Origin-Resource-Policy': 'same-origin',
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',

      // Additional Security Headers
      'Feature-Policy': "camera 'none'; microphone 'none'; geolocation 'none'",
      'X-Permitted-Cross-Domain-Policies': 'none',
      'Clear-Site-Data': '"cache","cookies","storage"',
    }
  };
}
