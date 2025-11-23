import { useAtom } from 'jotai';
import { selectedRaritiesAtom } from '../jotai/filter';
import { MultiSelectFilter } from '../components/MultiSelectFilter';
import { InputLabel, FormControl } from '@mui/material';
import { servantRarities } from '../data/options';

export function RarityFilter() {
  const [selectedRarities, setSelectedRarities] = useAtom(selectedRaritiesAtom);

  return (
    <FormControl fullWidth size="small">
      <InputLabel>レアリティ</InputLabel>
      <MultiSelectFilter
        label="レアリティ"
        options={servantRarities}
        selectedValues={selectedRarities}
        onChange={setSelectedRarities}
      />
    </FormControl>
  );
}
