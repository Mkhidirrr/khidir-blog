import { describe, it, expect } from 'vitest';
import { sanitizeInput, validateSearchQuery } from '../utils/security';
import { handleError } from '../utils/errorHandler';

describe('Security Utils', () => {
  it('should sanitize dangerous input', () => {
    const input = '<script>alert("xss")</script>';
    expect(sanitizeInput(input)).not.toContain('<script>');
  });

  it('should validate search queries correctly', () => {
    expect(validateSearchQuery('valid query')).toBe(true);
    expect(validateSearchQuery('<dangerous>')).toBe(false);
  });

  it('should handle errors safely', () => {
    const error = new Error('test error');
    const safeError = handleError(error);
    expect(safeError.message).not.toContain(error.stack);
  });
});
