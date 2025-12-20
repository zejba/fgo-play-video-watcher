import { Autocomplete, TextField } from '@mui/material';
import { useAtom, useAtomValue } from 'jotai';
import { servantCollectionNoFilterAtom, servantNameFilterAtom } from '../jotai/filter';
import { sourceSettingsAtom } from '../jotai/sourceSettings';
import { servantDataMap } from '../data/servantData';
import { servantNameOptionsAtom } from '../jotai/result';

const servantOptions = Object.values(servantDataMap).map((servant) => ({
  id: servant.collectionNo,
  label: `${servant.collectionNo} - ${servant.name}`
}));

function ServantIdFilter() {
  const [servantIdFilter, setServantIdFilter] = useAtom(servantCollectionNoFilterAtom);
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

function ServantNameFilter() {
  const [servantNameFilter, setServantNameFilter] = useAtom(servantNameFilterAtom);
  const options = useAtomValue(servantNameOptionsAtom);

  return (
    <Autocomplete
      options={options}
      freeSolo
      getOptionLabel={(option) => option}
      isOptionEqualToValue={(option, value) => option === value}
      value={servantNameFilter}
      onChange={(_, newValue) => setServantNameFilter(newValue ?? '')}
      renderOption={(props, option) => (
        <li {...props} title={option}>
          {option}
        </li>
      )}
      renderInput={(params) => <TextField {...params} label="サーヴァント名" size="small" fullWidth />}
    />
  );
}

export function ServantFilter() {
  const settings = useAtomValue(sourceSettingsAtom);

  if (settings.mapping.servantIdentify.mode === 'name') {
    return <ServantNameFilter />;
  }

  return <ServantIdFilter />;
}
