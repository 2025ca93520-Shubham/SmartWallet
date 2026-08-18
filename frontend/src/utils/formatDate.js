export function formatTargetDate(dateString) {
  if (!dateString) return 'No target date';

  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return 'No target date';

  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
}
