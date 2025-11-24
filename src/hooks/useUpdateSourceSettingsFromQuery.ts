import { useEffect } from 'react';
import { useSetAtom } from 'jotai';
import { useSearchParams } from 'react-router-dom';
import { getSourceSettingsFromQueryParamsWithDefault, sourceSettingsAtom } from '../jotai/sourceSettings';

/**
 * URLクエリパラメータからsourceSettingsAtomを更新するフック
 */
export function useUpdateSourceSettingsFromQuery() {
  const setSourceSettings = useSetAtom(sourceSettingsAtom);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const settings = getSourceSettingsFromQueryParamsWithDefault(searchParams);
    setSourceSettings(settings);
  }, [searchParams, setSourceSettings]);
}
