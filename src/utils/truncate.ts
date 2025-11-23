export const truncate = (s?: string) => {
  if (!s) return '';
  return s.length > 20 ? s.slice(0, 20) + '…' : s;
};
