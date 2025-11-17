/**
 * Media utility functions for extracting video IDs and generating embed URLs
 */

export interface MediaInfo {
  type: 'youtube' | 'vimeo' | 'video' | 'audio' | 'unknown';
  id?: string;
  embedUrl?: string;
}

/**
 * Extract YouTube video ID from various URL formats
 * Supports:
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://youtu.be/VIDEO_ID
 * - https://www.youtube.com/embed/VIDEO_ID
 */
export function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/watch\?.*?v=([a-zA-Z0-9_-]{11})/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
}

/**
 * Extract Vimeo video ID from URL
 * Supports:
 * - https://vimeo.com/VIDEO_ID
 * - https://player.vimeo.com/video/VIDEO_ID
 */
export function extractVimeoId(url: string): string | null {
  const patterns = [
    /vimeo\.com\/(\d+)/,
    /player\.vimeo\.com\/video\/(\d+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
}

/**
 * Detect media type and extract relevant information from URL
 */
export function getMediaInfo(url: string): MediaInfo {
  // Check for YouTube
  const youtubeId = extractYouTubeId(url);
  if (youtubeId) {
    return {
      type: 'youtube',
      id: youtubeId,
      embedUrl: `https://www.youtube.com/embed/${youtubeId}`,
    };
  }

  // Check for Vimeo
  const vimeoId = extractVimeoId(url);
  if (vimeoId) {
    return {
      type: 'vimeo',
      id: vimeoId,
      embedUrl: `https://player.vimeo.com/video/${vimeoId}`,
    };
  }

  // Check for direct video files
  if (url.match(/\.(mp4|webm|ogg)$/i)) {
    return {
      type: 'video',
      embedUrl: url,
    };
  }

  // Check for audio files
  if (url.match(/\.(mp3|wav|ogg|m4a)$/i)) {
    return {
      type: 'audio',
      embedUrl: url,
    };
  }

  return {
    type: 'unknown',
  };
}

/**
 * Generate embed URL for media
 */
export function getEmbedUrl(url: string, type?: 'youtube' | 'vimeo' | 'video' | 'audio'): string {
  if (type === 'youtube') {
    const id = extractYouTubeId(url);
    return id ? `https://www.youtube.com/embed/${id}` : url;
  }

  if (type === 'vimeo') {
    const id = extractVimeoId(url);
    return id ? `https://player.vimeo.com/video/${id}` : url;
  }

  // For direct video/audio or unknown types, return as-is
  return url;
}
