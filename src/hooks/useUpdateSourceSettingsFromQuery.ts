import { useEffect } from 'react';
import { useSetAtom } from 'jotai';
import { useSearchParams } from 'react-router-dom';
import { sourceSettingsAtom } from '../jotai/sourceSettings';
import { parseSourceSettingsFromQuery, sourceSettingsToQuery } from '../utils/sourceSettingsValidator';

/**
 * URLクエリパラメータからsourceSettingsAtomを更新するフック
 */
export function useUpdateSourceSettingsFromQuery() {
  const setSourceSettings = useSetAtom(sourceSettingsAtom);
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const { settings, hasInvalidValues } = parseSourceSettingsFromQuery(searchParams);
    setSourceSettings(settings);
    // 不正な値があった場合、クエリパラメータを正しい値に更新
    if (hasInvalidValues) {
      const validQueryParams = sourceSettingsToQuery(settings);
      setSearchParams(validQueryParams, { replace: true });
    }
  }, [searchParams, setSourceSettings, setSearchParams]);
}
