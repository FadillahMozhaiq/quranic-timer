export type Seconds = number & { readonly __brand: 'Seconds' };
export type Minutes = number & { readonly __brand: 'Minutes' };
export type Milliseconds = number & { readonly __brand: 'Milliseconds' };

export type Volume = number & { readonly __brand: 'Volume' };
export type TrackId = number & { readonly __brand: 'TrackId' };
export type PlaylistId = string & { readonly __brand: 'PlaylistId' };

export type YouTubeVideoId = string & { readonly __brand: 'YouTubeVideoId' };
export type YouTubeUrl = string & { readonly __brand: 'YouTubeUrl' };

export type SessionCount = number & { readonly __brand: 'SessionCount' };

export const createSeconds = (value: number): Seconds => value as Seconds;
export const createMinutes = (value: number): Minutes => value as Minutes;
export const createMilliseconds = (value: number): Milliseconds => value as Milliseconds;
export const createVolume = (value: number): Volume => {
  if (value < 0 || value > 100) {
    throw new Error('Volume must be between 0 and 100');
  }
  return value as Volume;
};
export const createTrackId = (value: number): TrackId => value as TrackId;
export const createPlaylistId = (value: string): PlaylistId => value as PlaylistId;
export const createYouTubeVideoId = (value: string): YouTubeVideoId => value as YouTubeVideoId;
export const createYouTubeUrl = (value: string): YouTubeUrl => value as YouTubeUrl;
export const createSessionCount = (value: number): SessionCount => value as SessionCount;

export const secondsToMinutes = (seconds: Seconds): Minutes => createMinutes(seconds / 60);
export const minutesToSeconds = (minutes: Minutes): Seconds => createSeconds(minutes * 60);
export const secondsToMilliseconds = (seconds: Seconds): Milliseconds => createMilliseconds(seconds * 1000);
export const millisecondsToSeconds = (ms: Milliseconds): Seconds => createSeconds(ms / 1000);