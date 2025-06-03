interface SafeError {
  message: string;
  code: string;
  status: number;
}

export function handleError(error: Error): SafeError {
  console.error('Error:', {
    name: error.name,
    message: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString()
  });

  // Return safe error message
  return {
    message: 'An unexpected error occurred',
    code: 'INTERNAL_ERROR',
    status: 500
  };
}

export function createSafeError(message: string, code: string, status: number): SafeError {
  return { message, code, status };
}
