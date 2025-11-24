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

export interface ResultItem {
  id: string;
  videoId: string;
  videoType: VideoType;
  collectionNo: string | null;
  servantName: string | null;
  turnCount: number | null;
  note: string | null;
  questName: string | null;
}

/**
 * スプレッドシートのCSVデータを取得するatom
 */
export const csvRowsAtom = atomWithQuery((get) => {
  const settings = get(sourceSettingsAtom);
  return {
    queryKey: ['spreadsheet', settings.urlType, settings.spreadsheetId, settings.sheetGid],
    queryFn: async () => {
      // gidパラメータを追加してシートを指定
      const gidParam = settings.sheetGid ? `&gid=${settings.sheetGid}` : '';

      // urlTypeに応じて適切なURL形式を選択
      let csvUrl: string;
      if (settings.urlType === 'public') {
        // 「ウェブに公開」形式
        csvUrl = `https://docs.google.com/spreadsheets/d/e/${settings.spreadsheetId}/pub?output=csv${gidParam}`;
      } else {
        // 「リンク共有」形式
        csvUrl = `https://docs.google.com/spreadsheets/d/${settings.spreadsheetId}/export?format=csv${gidParam}`;
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
    enabled: !!settings.spreadsheetId && !!settings.urlType
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
    const servantColumnIndex =
      settings.servantIdentify.mode === 'collectionNo'
        ? settings.servantIdentify.collectionNoColumnIndex
        : settings.servantIdentify.nameColumnIndex;
    const servantIdentifyValue = cells[servantColumnIndex] || null;
    const turnCountValue = settings.turnCount.mode === 'import' ? cells[settings.turnCount.columnIndex] || null : null;
    const noteValue =
      settings.noteColumns.length > 0
        ? settings.noteColumns
            .map((item) => cells[item.columnIndex] || '')
            .filter((v) => v)
            .join('\n') || null
        : null;
    const questNameValue = settings.questName.mode === 'import' ? cells[settings.questName.columnIndex] || null : null;

    const urlCellValue = cells[settings.urlColumnIndex];
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
        settings.turnCount.mode === 'fixed'
          ? settings.turnCount.fixedCount
          : turnCountValue
          ? parseInt(turnCountValue, 10) || null
          : null;
      const collectionNo = settings.servantIdentify.mode === 'collectionNo' ? servantIdentifyValue : null;
      const servantName =
        settings.servantIdentify.mode === 'name'
          ? servantIdentifyValue
          : servantIdentifyValue
          ? servantDataMap[servantIdentifyValue]?.name || null
          : null;
      data.push({
        id: `${settings.spreadsheetId}-${index}-${index2}`,
        videoId,
        videoType,
        collectionNo,
        servantName,
        turnCount,
        note: noteValue,
        questName: settings.questName.mode === 'fixed' ? settings.questName.fixedName : questNameValue
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
    if (settings.servantIdentify.mode === 'collectionNo') {
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
    if (settings.turnCount.mode === 'import') {
      if (minTurnCount !== null && (item.turnCount === null || item.turnCount < minTurnCount)) {
        return false;
      }
      if (maxTurnCount !== null && (item.turnCount === null || item.turnCount > maxTurnCount)) {
        return false;
      }
    }

    // サーヴァントフィルタ
    if (settings.servantIdentify.mode === 'collectionNo') {
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
        const servantName = item.collectionNo || '';
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
    if (settings.questName.mode === 'import' && questNameFilter) {
      const q = item.questName || '';
      if (!q.includes(questNameFilter)) {
        return false;
      }
    }

    return true;
  });
});
