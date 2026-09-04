export function formatDateRange(start: Date, end: Date) {
  const fmt = (d: Date) =>
    new Date(d).toLocaleDateString('default', {
      month: 'short',
      day: 'numeric',
    });
  return `${fmt(start)} – ${fmt(end)}`;
}
