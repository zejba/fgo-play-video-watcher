import { atom } from 'jotai';
import { atomWithQuery } from 'jotai-tanstack-query';
import { parse as parseCsv } from 'papaparse';
import { sourceSettingsAtom } from './sourceSettings';
import {
  selectedClassesAtom,
  selectedRaritiesAtom,
  minTurnCountAtom,
  maxTurnCountAtom,
  servantCollectionNoFilterAtom,
  servantNameFilterAtom,
  noteFilterAtom,
  questNameFilterAtom
} from './filter';
import { servantDataMap } from '../data/servantData';
import { extractVideoInfo, type VideoType } from '../utils/videoUtils';
import { validateAndFormatDate } from '../utils/spreadsheetValidator';

export interface ResultItem {
  id: string;
  videoId: string;
  videoType: VideoType;
  collectionNo: string | null;
  servantName: string | null;
  turnCount: number | null;
  note: string | null;
  questName: string | null;
  date: string | null;
}

/**
 * スプレッドシートのCSVデータを取得するatom
 */
export const csvRowsAtom = atomWithQuery((get) => {
  const settings = get(sourceSettingsAtom);
  return {
    queryKey: ['spreadsheet', settings.dataSource.type, settings.dataSource.id, settings.dataSource.gid],
    queryFn: async () => {
      // gidパラメータを追加してシートを指定
      const gidParam = settings.dataSource.gid ? `&gid=${settings.dataSource.gid}` : '';

      // urlTypeに応じて適切なURL形式を選択
      let csvUrl: string;
      if (settings.dataSource.type === 'public') {
        // 「ウェブに公開」形式
        csvUrl = `https://docs.google.com/spreadsheets/d/e/${settings.dataSource.id}/pub?output=csv${gidParam}`;
      } else {
        // 「リンク共有」形式
        csvUrl = `https://docs.google.com/spreadsheets/d/${settings.dataSource.id}/export?format=csv${gidParam}`;
      }

      const response = await fetch(csvUrl);
      if (!response.ok) {
        throw new Error('Failed to fetch spreadsheet data');
      }

      const csvText = await response.text();
      const { data } = parseCsv<string[]>(csvText, {
        skipEmptyLines: true,
        transform: (value) => value.trim()
      });
      return data;
    },
    enabled: !!settings.dataSource.id && !!settings.dataSource.type
  };
});

/**
 * CSVデータから全ResultItemを生成するatom
 */
export const allDataAtom = atom<ResultItem[]>((get) => {
  const { data: csvRows } = get(csvRowsAtom);
  const settings = get(sourceSettingsAtom);

  if (!csvRows) return [];

  const data: ResultItem[] = [];

  csvRows.forEach((cells, index) => {
    const servantIdentifyValue = cells[settings.mapping.servantIdentify.col] || null;
    const turnCountValue = settings.mapping.turn.mode === 'import' ? cells[settings.mapping.turn.col] || null : null;
    const noteValue =
      settings.mapping.notes.length > 0
        ? settings.mapping.notes
            .map((item) => cells[item.col] || '')
            .filter((v) => v)
            .join('\n') || null
        : null;
    const questNameValue =
      settings.mapping.questName.mode === 'import' ? cells[settings.mapping.questName.col] || null : null;
    const dateValue = settings.mapping.dateCol !== null ? cells[settings.mapping.dateCol] || null : null;
    const urlCellValue = cells[settings.mapping.urlCol];
    if (!urlCellValue) {
      return;
    }

    const urlValues = urlCellValue
      .split('\n')
      .map((v) => v.trim())
      .filter((v) => v.length > 0);
    urlValues.forEach((urlValue, index2) => {
      const { videoType, videoId } = extractVideoInfo(urlValue);
      if (videoType === 'unknown') {
        return;
      }
      const turnCount =
        settings.mapping.turn.mode === 'fixed'
          ? settings.mapping.turn.count
          : turnCountValue
          ? parseInt(turnCountValue, 10) || null
          : null;
      const collectionNo = settings.mapping.servantIdentify.mode === 'collectionNo' ? servantIdentifyValue : null;
      const servantName =
        settings.mapping.servantIdentify.mode === 'name'
          ? servantIdentifyValue
          : servantIdentifyValue
          ? servantDataMap[servantIdentifyValue]?.name || null
          : null;
      data.push({
        id: `${settings.dataSource.id}-${index}-${index2}`,
        videoId,
        videoType,
        collectionNo,
        servantName,
        turnCount,
        note: noteValue,
        questName: settings.mapping.questName.mode === 'fixed' ? settings.mapping.questName.name : questNameValue,
        date: dateValue ? validateAndFormatDate(dateValue) : null
      });
    });
  });

  return data;
});

/**
 * フィルタリング後のResultItemを返すatom
 */
export const filteredDataAtom = atom<ResultItem[]>((get) => {
  const allData = get(allDataAtom);
  const settings = get(sourceSettingsAtom);
  const selectedClasses = get(selectedClassesAtom);
  const selectedRarities = get(selectedRaritiesAtom);
  const minTurnCount = get(minTurnCountAtom);
  const maxTurnCount = get(maxTurnCountAtom);
  const servantIdFilter = get(servantCollectionNoFilterAtom);
  const servantNameFilter = get(servantNameFilterAtom);
  const noteFilter = get(noteFilterAtom);
  const questNameFilter = get(questNameFilterAtom);

  return allData.filter((item) => {
    const servant = item.collectionNo ? servantDataMap[item.collectionNo] : undefined;

    // サーヴァント識別モードがcollectionNoの場合のみクラス・レアリティフィルタを適用
    if (settings.mapping.servantIdentify.mode === 'collectionNo') {
      // クラスフィルタ
      if (selectedClasses.length > 0) {
        const servantClass = servant?.className;
        if (!servantClass || !selectedClasses.includes(servantClass)) {
          return false;
        }
      }

      // レアリティフィルタ
      if (selectedRarities.length > 0) {
        const rarity = servant?.rarity?.toString();
        if (!rarity || !selectedRarities.includes(rarity)) {
          // マシュの場合、3, 4, 5のいずれかでフィルタリング
          if (
            item.collectionNo === '1' &&
            (selectedRarities.includes('3') || selectedRarities.includes('4') || selectedRarities.includes('5'))
          ) {
            // OK
          } else {
            return false;
          }
        }
      }
    }

    // ターン数フィルタ（CSVから取得している場合のみ有効）
    if (settings.mapping.turn.mode === 'import') {
      if (minTurnCount !== null && (item.turnCount === null || item.turnCount < minTurnCount)) {
        return false;
      }
      if (maxTurnCount !== null && (item.turnCount === null || item.turnCount > maxTurnCount)) {
        return false;
      }
    }

    // サーヴァントフィルタ
    if (settings.mapping.servantIdentify.mode === 'collectionNo') {
      // マテリアルNo.モード: マテリアルNo.で絞り込み
      if (servantIdFilter !== null && servantIdFilter !== undefined) {
        const collectionNo = servant?.collectionNo ?? (item.collectionNo ? parseInt(item.collectionNo, 10) : NaN);
        if (Number(collectionNo) !== Number(servantIdFilter)) {
          return false;
        }
      }
    } else {
      // 名前モード: サーヴァント名で文字列一致
      if (servantNameFilter) {
        const servantName = item.servantName || '';
        if (!servantName.includes(servantNameFilter)) {
          return false;
        }
      }
    }

    // 補足文フィルタ
    if (noteFilter) {
      const note = item.note || '';
      if (!note.includes(noteFilter)) {
        return false;
      }
    }

    // クエスト名フィルタ（列参照モードのみ有効）
    if (settings.mapping.questName.mode === 'import' && questNameFilter) {
      const q = item.questName || '';
      if (!q.includes(questNameFilter)) {
        return false;
      }
    }

    return true;
  });
});

/**
 * クエスト名一覧を返すatom
 */
export const questNameOptionsAtom = atom<string[]>((get) => {
  const { data: csvRows } = get(csvRowsAtom);
  const settings = get(sourceSettingsAtom);
  const questName = settings.mapping.questName;

  if (!csvRows) return [];
  if (questName.mode !== 'import') {
    return [];
  }
  const set = new Set<string>();
  csvRows.forEach((row) => {
    const q = row[questName.col];
    if (q) set.add(q);
  });
  return Array.from(set).sort();
});

/**
 * サーヴァント名一覧を返すatom
 */
export const servantNameOptionsAtom = atom<string[]>((get) => {
  const { data: csvRows } = get(csvRowsAtom);
  const settings = get(sourceSettingsAtom);
  const servantIdentify = settings.mapping.servantIdentify;

  if (!csvRows) return [];
  if (servantIdentify.mode !== 'name') {
    return [];
  }
  const set = new Set<string>();
  csvRows.forEach((row) => {
    const name = row[servantIdentify.col];
    if (name) set.add(name);
  });
  return Array.from(set).sort();
});
