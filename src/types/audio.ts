export interface AudioTrack {
  id: number;
  title: string;
  url: string;
  duration: number;
  reciter?: string;
  source?: string;
}

export interface AudioPlaylist {
  id: string;
  name: string;
  tracks: AudioTrack[];
}

export interface AudioState {
  isPlaying: boolean;
  volume: number;
  currentTrack: number;
  playlist: AudioTrack[];
  isMuted: boolean;
  isLoading: boolean;
  isYouTubePlayerReady: boolean;
}

export type AudioAction =
  | { type: 'PLAY' }
  | { type: 'PAUSE' }
  | { type: 'STOP' }
  | { type: 'SET_VOLUME'; payload: { volume: number } }
  | { type: 'TOGGLE_MUTE' }
  | { type: 'NEXT_TRACK' }
  | { type: 'PREVIOUS_TRACK' }
  | { type: 'SET_TRACK'; payload: { trackIndex: number } }
  | { type: 'SET_PLAYLIST'; payload: { playlist: AudioTrack[] } }
  | { type: 'SET_LOADING'; payload: { isLoading: boolean } }
  | { type: 'SET_YOUTUBE_READY'; payload: { isReady: boolean } };