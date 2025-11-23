interface YouTubeProps {
  videoId: string;
}

export function YouTube({ videoId }: YouTubeProps) {
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
          className="yt-video"
          src={`https://www.youtube.com/embed/${videoId}`}
          title="YouTube video player"
          style={{ border: 'none', width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    </div>
  );
}
