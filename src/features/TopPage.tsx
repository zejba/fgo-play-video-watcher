import { Header } from './Header';
import { FilterArea } from './FilterArea';
import { BasicInfoArea } from './BasicInfoArea';
import { ResultArea } from './ResultArea';
import { useUpdateSourceSettingsFromQuery } from '../hooks/useUpdateSourceSettingsFromQuery';

export function TopPage() {
  useUpdateSourceSettingsFromQuery();

  return (
    <>
      <Header />
      <BasicInfoArea />
      <FilterArea />
      <ResultArea />
    </>
  );
}
