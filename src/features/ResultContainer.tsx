import { styled } from '@mui/material';
import { ResultRow } from './ResultRow';
import { useEffect } from 'react';
import type { ResultItem } from '../jotai/result';

interface ResultContainerProps {
  data: ResultItem[];
}

const Container = styled('div')(() => ({
  display: 'flex',
  flexDirection: 'column',
  rowGap: '16px',
  marginBottom: '20px'
}));

export function ResultContainer({ data }: ResultContainerProps) {
  useEffect(() => {
    // tweetIdsが更新されたらTwitterウィジェットを再読み込み
    // DOMが完全にレンダリングされた後に実行するため、タイマーで遅延
    const timer = setTimeout(() => {
      if (data.length > 0) {
        const win = window as Window & { twttr?: { widgets: { load: () => void } } };
        win.twttr?.widgets.load();
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [data]);
  return (
    <Container>
      {data.map((item) => (
        <ResultRow
          key={item.id}
          collectionNo={item.collectionNo}
          servantName={item.servantName}
          videoId={item.videoId}
          videoType={item.videoType}
          turnCount={item.turnCount}
          note={item.note}
          questName={item.questName}
          date={item.date}
        />
      ))}
    </Container>
  );
}
