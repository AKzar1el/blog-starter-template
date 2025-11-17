'use client';

import { getEmbedUrl } from '@/lib/media-utils';

export interface MediaEmbedProps {
  url: string;
  type: 'youtube' | 'vimeo' | 'video' | 'audio';
  position?: 'inline' | 'right' | 'left' | 'full-width';
  caption?: string;
}

/**
 * MediaEmbed Component
 *
 * Embeds YouTube, Vimeo, and other media with responsive layouts
 *
 * Positions:
 * - inline: Embedded within content flow (centered, responsive)
 * - right: Video on right, text wraps on left (desktop), stacks on mobile
 * - left: Video on left, text wraps on right (desktop), stacks on mobile
 * - full-width: Spans full content width
 */
export default function MediaEmbed({ url, type, position = 'inline', caption }: MediaEmbedProps) {
  const embedUrl = getEmbedUrl(url, type);

  // Render iframe for YouTube and Vimeo
  const renderIframe = () => (
    <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
      <iframe
        src={embedUrl}
        className="absolute top-0 left-0 w-full h-full rounded-lg shadow-lg"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        title={caption || 'Embedded video'}
      />
    </div>
  );

  // Render video player for direct video files
  const renderVideo = () => (
    <video
      src={embedUrl}
      controls
      className="w-full rounded-lg shadow-lg"
      preload="metadata"
    >
      Your browser does not support the video tag.
    </video>
  );

  // Render audio player
  const renderAudio = () => (
    <audio
      src={embedUrl}
      controls
      className="w-full"
      preload="metadata"
    >
      Your browser does not support the audio tag.
    </audio>
  );

  // Select appropriate renderer
  const renderMedia = () => {
    switch (type) {
      case 'youtube':
      case 'vimeo':
        return renderIframe();
      case 'video':
        return renderVideo();
      case 'audio':
        return renderAudio();
      default:
        return null;
    }
  };

  // Container with caption
  const MediaContainer = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
    <div className={className}>
      {children}
      {caption && (
        <p className="mt-2 text-sm text-gray-600 italic text-center">
          {caption}
        </p>
      )}
    </div>
  );

  // Position-specific layouts
  switch (position) {
    case 'right':
      // Video on right, content on left (desktop), stack on mobile
      return (
        <MediaContainer className="float-none lg:float-right lg:w-1/2 lg:ml-6 mb-6 clear-right">
          {renderMedia()}
        </MediaContainer>
      );

    case 'left':
      // Video on left, content on right (desktop), stack on mobile
      return (
        <MediaContainer className="float-none lg:float-left lg:w-1/2 lg:mr-6 mb-6 clear-left">
          {renderMedia()}
        </MediaContainer>
      );

    case 'full-width':
      // Full width
      return (
        <MediaContainer className="w-full my-8">
          {renderMedia()}
        </MediaContainer>
      );

    case 'inline':
    default:
      // Inline centered (responsive)
      return (
        <MediaContainer className="max-w-3xl mx-auto my-8">
          {renderMedia()}
        </MediaContainer>
      );
  }
}
