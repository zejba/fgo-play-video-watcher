import { Autocomplete, TextField } from '@mui/material';
import { useAtom, useAtomValue } from 'jotai';
import { servantCollectionNoFilterAtom, servantNameFilterAtom } from '../jotai/filter';
import { sourceSettingsAtom } from '../jotai/sourceSettings';
import { servantDataMap } from '../data/servantData';

const servantOptions = Object.values(servantDataMap).map((servant) => ({
  id: servant.collectionNo,
  label: `${servant.collectionNo} - ${servant.name}`
}));

export function ServantNameFilter() {
  const settings = useAtomValue(sourceSettingsAtom);
  const [servantIdFilter, setServantIdFilter] = useAtom(servantCollectionNoFilterAtom);
  const [servantNameFilter, setServantNameFilter] = useAtom(servantNameFilterAtom);

  if (settings.servantIdentifyMode === 'name') {
    return (
      <TextField
        label="サーヴァント名"
        value={servantNameFilter}
        onChange={(e) => setServantNameFilter(e.target.value)}
        size="small"
        fullWidth
        placeholder="部分一致で検索"
      />
    );
  }

  const selectedOption = servantOptions.find((option) => option.id === servantIdFilter) || null;

  return (
    <Autocomplete
      options={servantOptions}
      getOptionLabel={(option) => option.label}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      value={selectedOption}
      onChange={(_, newValue) => setServantIdFilter(newValue?.id ?? null)}
      renderInput={(params) => <TextField {...params} label="サーヴァント" size="small" fullWidth />}
    />
  );
}
