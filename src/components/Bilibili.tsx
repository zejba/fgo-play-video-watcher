interface BilibiliProps {
  videoId: string;
}

export function Bilibili({ videoId }: BilibiliProps) {
  return (
    <div style={{ maxWidth: '560px', margin: '8px 0px' }}>
      <div
        style={{
          maxWidth: '100%',
          maxHeight: '315px',
          paddingBottom: '56.25%',
          height: 0,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <iframe
          className="bilibili-video"
          src={`https://player.bilibili.com/player.html?bvid=${videoId}&high_quality=1&autoplay=0`}
          title="Bilibili video player"
          style={{
            border: 'none',
            width: '100%',
            height: '100%',
            position: 'absolute',
            top: 0,
            left: 0,
            overflowY: 'hidden'
          }}
          allowFullScreen
        />
      </div>
    </div>
  );
}
