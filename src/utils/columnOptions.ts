export const columns = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N'] as const;

export const columnOptions = columns.map((col, idx) => ({
  value: idx.toString(),
  label: `${col}列`
}));
