interface TwitterProps {
  tweetId: string;
}

export function Twitter({ tweetId }: TwitterProps) {
  return (
    <blockquote className="twitter-tweet twitter-video" data-media-max-width="560">
      <a
        href={`https://twitter.com/x/status/${tweetId}?ref_src=twsrc%5Etfw`}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          maxWidth: '560px',
          wordBreak: 'break-all'
        }}
      >
        https://twitter.com/x/status/{tweetId}
      </a>
    </blockquote>
  );
}
