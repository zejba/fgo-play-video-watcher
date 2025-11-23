import { useAtom } from 'jotai';
import { selectedClassesAtom } from '../jotai/filter';
import { MultiSelectFilter } from '../components/MultiSelectFilter';
import { FormControl, InputLabel } from '@mui/material';
import { servantClasses } from '../data/options';

export function ClassFilter() {
  const [selectedClasses, setSelectedClasses] = useAtom(selectedClassesAtom);

  return (
    <FormControl fullWidth size="small">
      <InputLabel>クラス</InputLabel>
      <MultiSelectFilter
        label="クラス"
        options={servantClasses}
        selectedValues={selectedClasses}
        onChange={setSelectedClasses}
      />
    </FormControl>
  );
}
