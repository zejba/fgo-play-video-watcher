import { useState } from 'react';
import { styled } from '@mui/material';
import { Twitter } from '../components/Twitter';
import { YouTube } from '../components/YouTube';
import { Bilibili } from '../components/Bilibili';
import { localizedServantClass } from '../data/options';
import { servantDataMap } from '../data/servantData';
import type { VideoType } from '../utils/videoUtils';
import { useAtomValue } from 'jotai';
import { sourceSettingsAtom } from '../jotai/sourceSettings';
import { truncate } from '../utils/truncate';

interface ResultRowProps {
  collectionNo: string | null;
  servantName: string | null;
  videoId: string;
  videoType: VideoType;
  turnCount: number | null;
  note: string | null;
  questName: string | null;
}

const Card = styled('div')(({ theme }) => ({
  padding: '12px 8px',
  border: '1px solid #ccc',
  borderRadius: '4px',
  [theme.breakpoints.up('md')]: {
    display: 'flex',
    gap: '16px'
  }
}));

const InfoSection = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    flex: 1,
    minWidth: 0
  }
}));

const VideoSection = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    flex: 1,
    minWidth: 0
  }
}));

const Text = styled('div')(() => ({
  fontSize: '14px',
  fontWeight: 'bold',
  color: '#666'
}));

const Title = styled('div')(({ theme }) => ({
  display: 'flex',
  columnGap: '4px',
  flexWrap: 'wrap',
  [theme.breakpoints.up('md')]: {
    paddingTop: '8px'
  }
}));

const Note = styled('div')<{ isExpanded: boolean }>(({ theme, isExpanded }) => ({
  fontSize: '13px',
  color: '#555',
  marginTop: '4px',
  lineHeight: '1.5',
  cursor: 'pointer',
  userSelect: 'none',
  ...(isExpanded
    ? {
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word'
      }
    : {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        display: 'block'
      }),
  '&:hover': {
    opacity: 0.7
  },
  [theme.breakpoints.up('md')]: {
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
    overflow: isExpanded ? 'visible' : 'hidden',
    textOverflow: isExpanded ? 'clip' : 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: isExpanded ? 'unset' : 10,
    WebkitBoxOrient: 'vertical'
  }
}));

// const UnknownVideoArea = styled('div')(() => ({
//   maxWidth: '558px',
//   width: '100%',
//   margin: '8px 0',
//   aspectRatio: '16 / 9',
//   backgroundColor: '#f0f0f0',
//   border: '1px solid #ccc',
//   display: 'flex',
//   flexDirection: 'column',
//   alignItems: 'center',
//   justifyContent: 'center',
//   fontSize: '14px',
//   color: '#666',
//   textAlign: 'center',
//   wordBreak: 'break-all'
// }));

export function ResultRow({
  collectionNo,
  servantName,
  videoId,
  videoType,
  turnCount,
  note,
  questName
}: ResultRowProps) {
  const settings = useAtomValue(sourceSettingsAtom);
  const [isNoteExpanded, setIsNoteExpanded] = useState(false);
  const servant = collectionNo ? servantDataMap[collectionNo] : undefined;
  const localizedServantClassName = servant ? localizedServantClass[servant.className] : null;
  const rarity = servant ? (collectionNo === '1' ? '3-5' : servant.rarity?.toString() ?? '?') : '?';

  return (
    <Card>
      <VideoSection>
        {videoType === 'twitter' && <Twitter tweetId={videoId} />}
        {videoType === 'youtube' && <YouTube videoId={videoId} />}
        {videoType === 'bilibili' && <Bilibili videoId={videoId} />}
      </VideoSection>
      <InfoSection>
        <Title>
          <Text>
            {settings.questName.mode === 'import' ? (questName ? `${truncate(questName)} ` : '') : ''}
            {settings.turnCount.mode === 'import' ? (turnCount || '?') + 'T' : ''}
          </Text>
          {settings.servantIdentify.mode === 'collectionNo' ? (
            <>
              <Text>{servantName ?? '不明なサーヴァント'}</Text>
              <Text>
                ★{rarity} {localizedServantClassName}
              </Text>
            </>
          ) : (
            <Text>{collectionNo || '不明'}</Text>
          )}
        </Title>
        {note && (
          <Note isExpanded={isNoteExpanded} onClick={() => setIsNoteExpanded(!isNoteExpanded)}>
            {note}
          </Note>
        )}
      </InfoSection>
    </Card>
  );
}
