import { generateToken, validateToken } from 'csrf';

const tokens = new Map();

export function generateCSRFToken(sessionId: string): string {
  const token = generateToken();
  tokens.set(sessionId, token);
  return token;
}

export function validateCSRFToken(sessionId: string, token: string): boolean {
  const storedToken = tokens.get(sessionId);
  return validateToken(storedToken, token);
}
