export function getReadingTime(content: string | undefined): number {
  if (!content) return 1;
  
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  const time = Math.ceil(words / wordsPerMinute);
  
  return Math.max(time, 1); // Return at least 1 minute
}
