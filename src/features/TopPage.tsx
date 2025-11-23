import { Header } from './Header';
import { FilterArea } from './FilterArea';
import { BasicInfoArea } from './BasicInfoArea';
import { ResultArea } from './ResultArea';

export function TopPage() {
  return (
    <>
      <Header />
      <BasicInfoArea />
      <FilterArea />
      <ResultArea />
    </>
  );
}
