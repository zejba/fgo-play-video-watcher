export const truncate = (s?: string) => {
  if (!s) return '';
  return s.length > 50 ? s.slice(0, 50) + '…' : s;
};
