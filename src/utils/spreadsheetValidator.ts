/**
 * Google SpreadsheetのURLを解析してタイプ、ID、GIDを抽出する
 * @param url - スプレッドシートのURL
 * @returns 抽出結果
 */
export function parseSpreadsheetUrl(url: string): {
  urlType: 'public' | 'shared' | null;
  spreadsheetId: string | null;
  sheetGid: string | null;
} {
  const trimmedUrl = url.trim();

  // GIDの抽出
  const gidPattern = /[#&?]gid=([0-9]+)/;
  const gidMatch = trimmedUrl.match(gidPattern);
  const sheetGid = gidMatch?.[1] || null;

  // 「ウェブに公開」形式: https://docs.google.com/spreadsheets/d/e/{SPREADSHEET_ID}/...
  const publicPattern = /\/spreadsheets\/d\/e\/([a-zA-Z0-9_-]+)/;
  const publicMatch = trimmedUrl.match(publicPattern);
  if (publicMatch?.[1]) {
    return {
      urlType: 'public',
      spreadsheetId: publicMatch[1],
      sheetGid
    };
  }

  // 「リンク共有」形式: https://docs.google.com/spreadsheets/d/{SPREADSHEET_ID}/...
  const sharedPattern = /\/spreadsheets\/d\/([a-zA-Z0-9_-]+)/;
  const sharedMatch = trimmedUrl.match(sharedPattern);
  if (sharedMatch?.[1]) {
    return {
      urlType: 'shared',
      spreadsheetId: sharedMatch[1],
      sheetGid
    };
  }

  return {
    urlType: null,
    spreadsheetId: null,
    sheetGid: null
  };
}

/**
 * Google SpreadsheetのURLからGIDを抽出する
 * @param input - スプレッドシートのURL
 * @returns 抽出されたGID、抽出できない場合はnull
 */
export function extractGidFromUrl(input: string): string | null {
  // URLからGIDを抽出する正規表現
  // 例: https://docs.google.com/spreadsheets/d/.../edit#gid=123456789
  // 例: https://docs.google.com/spreadsheets/d/.../edit?gid=123456789
  const gidPattern = /[#&?]gid=([0-9]+)/;

  const match = input.match(gidPattern);
  if (match && match[1]) {
    return match[1];
  }

  return null;
}

/**
 * Google SpreadsheetのURLからIDを抽出する
 * @param input - スプレッドシートのURLまたはID
 * @returns 抽出されたID、抽出できない場合は入力値そのまま
 */
export function extractSpreadsheetId(input: string): string {
  // URLからIDを抽出する正規表現
  // 公開: https://docs.google.com/spreadsheets/d/e/{SPREADSHEET_ID}/...
  const urlPatternWithE = /\/spreadsheets\/d\/e\/([a-zA-Z0-9_-]+)/;

  const matchWithE = input.match(urlPatternWithE);
  if (matchWithE && matchWithE[1]) {
    return matchWithE[1];
  }

  // URLからIDを抽出する正規表現
  // 通常: https://docs.google.com/spreadsheets/d/{SPREADSHEET_ID}/...
  const urlPattern = /\/spreadsheets\/d\/([a-zA-Z0-9_-]+)/;

  const match = input.match(urlPattern);
  if (match && match[1]) {
    return match[1];
  }

  // マッチしなければ入力値をそのままIDとみなす
  return input.trim();
}

/**
 * Google SpreadsheetのIDが有効な形式かどうかをチェックする
 * @param spreadsheetId - チェックするスプレッドシートID
 * @returns バリデーション結果
 */
export function validateSpreadsheetId(spreadsheetId: string): {
  isValid: boolean;
  error?: string;
} {
  // Google SpreadsheetのIDは通常44文字の英数字とハイフン、アンダースコア
  // 公開用のIDは「2PACX-」で始まることが多い
  const spreadsheetIdPattern = /^[a-zA-Z0-9_-]+$/;

  if (!spreadsheetIdPattern.test(spreadsheetId)) {
    return {
      isValid: false,
      error: '形式が正しくありません'
    };
  }

  return {
    isValid: true
  };
}

/**
 * シートGIDが有効な形式かどうかをチェックする
 * @param gid - チェックするシートGID
 * @returns バリデーション結果
 */
export function validateSheetGid(gid: string): {
  isValid: boolean;
  error?: string;
} {
  // シートGIDは数値のみ
  const gidPattern = /^\d+$/;
  if (!gidPattern.test(gid.trim())) {
    return {
      isValid: false,
      error: '数値を入力してください'
    };
  }

  return {
    isValid: true
  };
}

/**
 * 列のインデックスが有効かどうかをチェックする
 * @param columnIndex - チェックする列インデックス
 * @returns バリデーション結果
 */
export function validateColumnIndex(columnIndex: number): {
  isValid: boolean;
  error?: string;
} {
  // 数値でない、またはマイナスの場合
  if (typeof columnIndex !== 'number' || isNaN(columnIndex) || columnIndex < 0) {
    return {
      isValid: false,
      error: '値が不正です'
    };
  }

  return {
    isValid: true
  };
}
