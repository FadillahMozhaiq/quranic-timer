import {
  YouTubeVideoId,
  YouTubeUrl,
  Seconds,
  InvalidYouTubeUrlError,
  createYouTubeVideoId,
  createYouTubeUrl,
  createSeconds
} from '../types';

export function extractYouTubeVideoId(url: string): YouTubeVideoId | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/watch\?.*v=([^&\n?#]+)/
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return createYouTubeVideoId(match[1]);
    }
  }
  
  return null;
}

export function isYouTubeUrl(url: string): url is YouTubeUrl {
  return extractYouTubeVideoId(url) !== null;
}

export function createValidYouTubeUrl(url: string): YouTubeUrl {
  if (!isYouTubeUrl(url)) {
    throw new InvalidYouTubeUrlError(url);
  }
  return createYouTubeUrl(url);
}

export function extractStartTime(url: string): Seconds {
  const patterns = [
    /[?&]t=(\d+)s?/,
    /[?&]start=(\d+)/,
    /[?&]t=(\d+)m(\d+)s/,
    /[?&]t=(\d+)h(\d+)m(\d+)s/
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      if (pattern.source.includes('h') && match[3]) {
        const hours = parseInt(match[1]) || 0;
        const minutes = parseInt(match[2]) || 0;
        const seconds = parseInt(match[3]) || 0;
        return createSeconds(hours * 3600 + minutes * 60 + seconds);
      } else if (pattern.source.includes('m') && match[2]) {
        const minutes = parseInt(match[1]) || 0;
        const seconds = parseInt(match[2]) || 0;
        return createSeconds(minutes * 60 + seconds);
      } else {
        return createSeconds(parseInt(match[1]) || 0);
      }
    }
  }
  
  return createSeconds(0);
}

export function buildYouTubeEmbedUrl(
  videoId: YouTubeVideoId,
  options: {
    autoplay?: boolean;
    controls?: boolean;
    start?: Seconds;
    mute?: boolean;
  } = {}
): string {
  const params = new URLSearchParams();
  
  if (options.autoplay) params.set('autoplay', '1');
  if (options.controls === false) params.set('controls', '0');
  if (options.start) params.set('start', options.start.toString());
  if (options.mute) params.set('mute', '1');
  
  const queryString = params.toString();
  return `https://www.youtube.com/embed/${videoId}${queryString ? `?${queryString}` : ''}`;
}

declare global {
  interface Window {
    YT: {
      Player: new (elementId: string, config: YouTubePlayerConfig) => YouTubePlayer;
      PlayerState: YouTubePlayerState;
      ready: (callback: () => void) => void;
    };
    onYouTubeIframeAPIReady: () => void;
  }
}

export interface YouTubePlayerConfig {
  height?: string | number;
  width?: string | number;
  videoId?: string;
  playerVars?: {
    autoplay?: 0 | 1;
    controls?: 0 | 1;
    disablekb?: 0 | 1;
    fs?: 0 | 1;
    modestbranding?: 0 | 1;
    rel?: 0 | 1;
    showinfo?: 0 | 1;
    start?: number;
    mute?: 0 | 1;
    origin?: string;
    enablejsapi?: 0 | 1;
  };
  events?: {
    onReady?: (event: { target: YouTubePlayer }) => void;
    onStateChange?: (event: { target: YouTubePlayer; data: number }) => void;
    onError?: (event: { target: YouTubePlayer; data: number }) => void;
  };
}

export interface YouTubePlayer {
  loadVideoById(videoId: string | { videoId: string; startSeconds?: number }): void;
  playVideo(): void;
  pauseVideo(): void;
  stopVideo(): void;
  setVolume(volume: number): void;
  getVolume(): number;
  mute(): void;
  unMute(): void;
  isMuted(): boolean;
  getCurrentTime(): number;
  getDuration(): number;
  getPlayerState(): number;
  destroy(): void;
}

export interface YouTubePlayerState {
  UNSTARTED: -1;
  ENDED: 0;
  PLAYING: 1;
  PAUSED: 2;
  BUFFERING: 3;
  CUED: 5;
}

export const YT_PLAYER_STATE: YouTubePlayerState = {
  UNSTARTED: -1,
  ENDED: 0,
  PLAYING: 1,
  PAUSED: 2,
  BUFFERING: 3,
  CUED: 5
} as const;

export const YOUTUBE_ERROR_CODES = {
  INVALID_PARAMETER: 2,
  HTML5_ERROR: 5,
  VIDEO_NOT_FOUND: 100,
  EMBED_NOT_ALLOWED: 101,
  EMBED_NOT_ALLOWED_DISGUISE: 150
} as const;

export type YouTubeErrorCode = typeof YOUTUBE_ERROR_CODES[keyof typeof YOUTUBE_ERROR_CODES];

export function getYouTubeErrorMessage(errorCode: number): string {
  switch (errorCode) {
    case YOUTUBE_ERROR_CODES.INVALID_PARAMETER:
      return 'Invalid video parameter';
    case YOUTUBE_ERROR_CODES.HTML5_ERROR:
      return 'HTML5 player error';
    case YOUTUBE_ERROR_CODES.VIDEO_NOT_FOUND:
      return 'Video not found or private';
    case YOUTUBE_ERROR_CODES.EMBED_NOT_ALLOWED:
    case YOUTUBE_ERROR_CODES.EMBED_NOT_ALLOWED_DISGUISE:
      return 'Video cannot be embedded';
    default:
      return `Unknown YouTube error (code: ${errorCode})`;
  }
}