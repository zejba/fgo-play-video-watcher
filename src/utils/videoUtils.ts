export type VideoType = 'twitter' | 'youtube' | 'bilibili' | 'unknown';

export interface VideoInfo {
  videoType: VideoType;
  videoId: string;
}

export function extractVideoInfo(url: string): VideoInfo {
  // YouTube URL (様々なフォーマットに対応)
  // https://www.youtube.com/watch?v=VIDEO_ID
  // https://youtu.be/VIDEO_ID
  // https://www.youtube.com/embed/VIDEO_ID
  const youtubeMatch =
    url.match(/youtube\.com\/watch\?v=([^&]+)/i) ||
    url.match(/youtu\.be\/([^?]+)/i) ||
    url.match(/youtube\.com\/embed\/([^?]+)/i);

  if (youtubeMatch && youtubeMatch[1]) {
    const videoId = youtubeMatch[1];
    // YouTube video IDのバリデーション
    // - 11文字（標準的な長さ）
    // - 英数字、ハイフン、アンダースコアのみ許可
    if (/^[A-Za-z0-9_-]{11}$/.test(videoId)) {
      return {
        videoType: 'youtube',
        videoId: videoId
      };
    }
  }

  // Bilibili URL (BV番号に対応)
  // https://www.bilibili.com/video/BV1xx411c7XZ
  // https://bilibili.com/video/BV1xx411c7XZ
  const bilibiliMatch = url.match(/bilibili\.com\/video\/(BV[A-Za-z0-9]+)/i);
  if (bilibiliMatch && bilibiliMatch[1]) {
    return {
      videoType: 'bilibili',
      videoId: bilibiliMatch[1]
    };
  }

  // Twitter URL
  const twitterMatch = url.match(/twitter\.com\/.*\/status\/(\d+)/i) || url.match(/x\.com\/.*\/status\/(\d+)/i);
  if (twitterMatch && twitterMatch[1]) {
    return {
      videoType: 'twitter',
      videoId: twitterMatch[1]
    };
  }

  return {
    videoType: 'unknown',
    videoId: url
  };
}
