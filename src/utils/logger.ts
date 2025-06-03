interface LogEvent {
  level: 'info' | 'warn' | 'error';
  message: string;
  timestamp: string;
  context?: Record<string, any>;
}

export function secureLog(event: LogEvent): void {
  // Remove sensitive data
  const sanitizedContext = event.context ? sanitizeLogData(event.context) : {};
  
  console[event.level]({
    ...event,
    context: sanitizedContext,
    timestamp: new Date().toISOString()
  });
}

function sanitizeLogData(data: Record<string, any>): Record<string, any> {
  const sensitiveKeys = ['password', 'token', 'key', 'secret', 'authorization'];
  const sanitized = { ...data };
  
  Object.keys(sanitized).forEach(key => {
    if (sensitiveKeys.some(k => key.toLowerCase().includes(k))) {
      sanitized[key] = '[REDACTED]';
    }
  });
  
  return sanitized;
}
