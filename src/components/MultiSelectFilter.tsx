import { Select, MenuItem, Chip } from '@mui/material';
import { HighlightOff } from '@mui/icons-material';

interface MultiSelectFilterProps<T extends string> {
  label: string;
  options: readonly { value: T; label: string }[];
  selectedValues: T[];
  onChange: (values: T[]) => void;
}

const handleMouseDown = (event: React.MouseEvent) => {
  event.stopPropagation();
};

export function MultiSelectFilter<T extends string>({
  label,
  options,
  selectedValues,
  onChange
}: MultiSelectFilterProps<T>) {
  const handleDelete = (valueToDelete: T) => {
    onChange(selectedValues.filter((value) => value !== valueToDelete));
  };

  return (
    <Select
      multiple
      value={selectedValues}
      onChange={(e) => onChange(e.target.value as T[])}
      label={label}
      renderValue={(selected) => (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
          {selected.map((value) => (
            <Chip
              key={value}
              label={options.find((option) => option.value === value)?.label || value}
              size="small"
              deleteIcon={<HighlightOff />}
              onDelete={() => handleDelete(value)}
              onMouseDown={handleMouseDown}
            />
          ))}
        </div>
      )}
    >
      {options.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </Select>
  );
}
