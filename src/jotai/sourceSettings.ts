import { atom } from 'jotai';

export interface SourceSettings {
  dataSource: {
    type: 'public' | 'shared';
    id: string | null;
    gid: string | null;
  };
  mapping: {
    urlCol: number;
    notes: { label: string | null; col: number }[];
    questName:
      | {
          mode: 'import';
          col: number;
        }
      | {
          mode: 'fixed';
          name: string | null;
        };
    turn:
      | {
          mode: 'import';
          col: number;
        }
      | {
          mode: 'fixed';
          count: number | null;
        };
    servantIdentify:
      | {
          mode: 'collectionNo';
          col: number;
        }
      | {
          mode: 'name';
          col: number;
        };
  };
}

export const sourceSettingsDefault: SourceSettings = {
  dataSource: {
    type: 'public',
    id: null,
    gid: null
  },
  mapping: {
    urlCol: 3,
    notes: [],
    questName: {
      mode: 'import',
      col: 0
    },
    turn: {
      mode: 'import',
      col: 1
    },
    servantIdentify: {
      mode: 'collectionNo',
      col: 2
    }
  }
};

export const sourceSettingsAtom = atom<SourceSettings>(sourceSettingsDefault);

export function convertSourceSettingsToQueryParams(settings: SourceSettings): URLSearchParams {
  const params = new URLSearchParams({
    dataSource: JSON.stringify(settings.dataSource),
    mapping: JSON.stringify(settings.mapping)
  });
  return params;
}

export function getSourceSettingsFromQueryParamsWithDefault(params: URLSearchParams): SourceSettings {
  const dataSourceParam = params.get('dataSource');
  const mappingParam = params.get('mapping');
  try {
    const dataSource = dataSourceParam
      ? validateDataSourceWithDefault(JSON.parse(dataSourceParam))
      : sourceSettingsDefault.dataSource;

    const mapping = mappingParam ? validateMappingWithDefault(JSON.parse(mappingParam)) : sourceSettingsDefault.mapping;
    return {
      dataSource,
      mapping
    };
  } catch {
    return sourceSettingsDefault;
  }
}

// unknown型が numberか、数字の文字列であればnumber型を返す
function toNonNegativeInteger(value: unknown): number | null {
  if (typeof value === 'number' && Number.isInteger(value) && value >= 0) {
    return value;
  }
  if (typeof value === 'string') {
    const parsed = Number(value);
    if (Number.isInteger(parsed) && parsed >= 0) {
      return parsed;
    }
  }
  return null;
}

export function validateDataSourceWithDefault(dataSource: unknown): SourceSettings['dataSource'] {
  if (!dataSource || typeof dataSource !== 'object') {
    return sourceSettingsDefault.dataSource;
  }
  const ret: SourceSettings['dataSource'] = {
    type: 'public',
    id: null,
    gid: null
  };
  if ('type' in dataSource && (dataSource.type === 'public' || dataSource.type === 'shared')) {
    ret.type = dataSource.type;
  }
  if ('id' in dataSource && typeof dataSource.id === 'string' && dataSource.id) {
    ret.id = dataSource.id;
  }
  if ('gid' in dataSource && typeof dataSource.gid === 'string' && dataSource.gid) {
    ret.gid = dataSource.gid;
  }

  return ret;
}

export function validateMappingWithDefault(mapping: unknown): SourceSettings['mapping'] {
  if (!mapping || typeof mapping !== 'object') {
    return sourceSettingsDefault.mapping;
  }
  const ret: SourceSettings['mapping'] = {
    urlCol: 3,
    notes: [],
    questName: {
      mode: 'import',
      col: 0
    },
    turn: {
      mode: 'import',
      col: 1
    },
    servantIdentify: {
      mode: 'collectionNo',
      col: 2
    }
  };
  if ('urlCol' in mapping) {
    ret.urlCol = toNonNegativeInteger(mapping.urlCol) ?? 3;
  }
  if ('notes' in mapping && Array.isArray(mapping.notes)) {
    ret.notes = (mapping.notes as unknown[])
      .map((note) => {
        if (typeof note === 'object' && note !== null && 'col' in note) {
          const col = toNonNegativeInteger(note.col);
          if (col === null) {
            return null;
          }
          return {
            col,
            label: 'label' in note && typeof note.label === 'string' && note.label ? note.label : null
          };
        }
        return null;
      })
      .filter((note) => note !== null);
  }
  if ('questName' in mapping && typeof mapping.questName === 'object' && mapping.questName !== null) {
    if ('mode' in mapping.questName && mapping.questName.mode === 'import') {
      if ('col' in mapping.questName) {
        ret.questName = {
          mode: 'import',
          col: toNonNegativeInteger(mapping.questName.col) ?? 0
        };
      }
    } else if ('mode' in mapping.questName && mapping.questName.mode === 'fixed') {
      ret.questName = {
        mode: 'fixed',
        name:
          'name' in mapping.questName && typeof mapping.questName.name === 'string' && mapping.questName.name
            ? mapping.questName.name
            : null
      };
    }
  }
  if ('turn' in mapping && typeof mapping.turn === 'object' && mapping.turn !== null) {
    if ('mode' in mapping.turn && mapping.turn.mode === 'import') {
      if ('col' in mapping.turn) {
        ret.turn = {
          mode: 'import',
          col: toNonNegativeInteger(mapping.turn.col) ?? 1
        };
      }
    } else if ('mode' in mapping.turn && mapping.turn.mode === 'fixed') {
      ret.turn = {
        mode: 'fixed',
        count: 'count' in mapping.turn ? toNonNegativeInteger(mapping.turn.count) : null
      };
    }
  }
  if ('servantIdentify' in mapping && typeof mapping.servantIdentify === 'object' && mapping.servantIdentify !== null) {
    if ('mode' in mapping.servantIdentify && mapping.servantIdentify.mode === 'collectionNo') {
      if ('col' in mapping.servantIdentify) {
        ret.servantIdentify = {
          mode: 'collectionNo',
          col: toNonNegativeInteger(mapping.servantIdentify.col) ?? 2
        };
      }
    } else if ('mode' in mapping.servantIdentify && mapping.servantIdentify.mode === 'name') {
      if ('col' in mapping.servantIdentify) {
        ret.servantIdentify = {
          mode: 'name',
          col: toNonNegativeInteger(mapping.servantIdentify.col) ?? 2
        };
      }
    }
  }
  return ret;
}
