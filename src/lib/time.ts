/** Relative Portuguese timestamps for feed cards. */
export function formatRelativeTime(date: Date | string, now = new Date()): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const seconds = Math.max(0, Math.floor((now.getTime() - d.getTime()) / 1000));

  if (seconds < 60) return 'agora';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} d`;
  return d.toLocaleDateString('pt-MZ', { day: 'numeric', month: 'short' });
}
