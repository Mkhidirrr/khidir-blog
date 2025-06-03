import { secureLog } from '../utils/logger';

interface SecurityEvent {
  type: 'auth' | 'api' | 'error' | 'csrf';
  severity: 'low' | 'medium' | 'high';
  message: string;
  metadata?: Record<string, any>;
}

export function monitorSecurityEvent(event: SecurityEvent) {
  secureLog({
    level: event.severity === 'high' ? 'error' : 'warn',
    message: `Security Event: ${event.type} - ${event.message}`,
    timestamp: new Date().toISOString(),
    context: {
      ...event.metadata,
      eventType: event.type,
      severity: event.severity
    }
  });

  // Alert if high severity
  if (event.severity === 'high') {
    // Send alert to security team
    notifySecurityTeam(event);
  }
}

function notifySecurityTeam(event: SecurityEvent) {
  // Implement notification logic (email, Slack, etc.)
  console.error('SECURITY ALERT:', event);
}
