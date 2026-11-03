// Ticket age thresholds (minutes) that drive the kitchen display colors.
export const URGENCY_THRESHOLDS = { WARNING_MINUTES: 5, LATE_MINUTES: 10 };

export const URGENCY = { OK: 'ok', WARNING: 'warning', LATE: 'late' };

export function getUrgency(ageSeconds) {
  const minutes = ageSeconds / 60;
  if (minutes >= URGENCY_THRESHOLDS.LATE_MINUTES) return URGENCY.LATE;
  if (minutes >= URGENCY_THRESHOLDS.WARNING_MINUTES) return URGENCY.WARNING;
  return URGENCY.OK;
}

export function formatElapsed(ageSeconds) {
  const minutes = Math.floor(ageSeconds / 60);
  const seconds = String(ageSeconds % 60).padStart(2, '0');
  return `${minutes}:${seconds}`;
}
