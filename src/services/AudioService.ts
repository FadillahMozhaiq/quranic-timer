import {
  AudioTrack, 
  AudioLoadError, 
  AudioPlaybackError,
  Volume,
  TrackId,
  createVolume,
  createTrackId,
  isAppError,
  createErrorHandler
} from '../types';

export interface AudioServiceConfig {
  preloadMetadata?: boolean;
  crossOrigin?: string;
  onError?: (error: AudioLoadError | AudioPlaybackError) => void;
}

export class AudioService {
  private audio: HTMLAudioElement;
  private currentTrack: AudioTrack | null = null;
  private errorHandler = createErrorHandler('AUDIO');

  constructor(private config: AudioServiceConfig = {}) {
    this.audio = new Audio();
    this.setupAudioElement();
  }

  private setupAudioElement(): void {
    this.audio.preload = this.config.preloadMetadata ? 'metadata' : 'none';
    
    if (this.config.crossOrigin) {
      this.audio.crossOrigin = this.config.crossOrigin;
    }

    this.audio.addEventListener('error', this.handleAudioError.bind(this));
    this.audio.addEventListener('loadstart', () => {
      console.debug('Audio loading started');
    });
    this.audio.addEventListener('canplay', () => {
      console.debug('Audio can start playing');
    });
  }

  private handleAudioError(event: Event): void {
    const audio = event.target as HTMLAudioElement;
    const error = audio.error;
    
    let audioError: AudioLoadError | AudioPlaybackError;
    
    if (error) {
      switch (error.code) {
        case MediaError.MEDIA_ERR_ABORTED:
          audioError = new AudioPlaybackError('Playback aborted by user');
          break;
        case MediaError.MEDIA_ERR_NETWORK:
          audioError = new AudioLoadError(audio.src || 'unknown');
          break;
        case MediaError.MEDIA_ERR_DECODE:
          audioError = new AudioPlaybackError('Audio decoding failed');
          break;
        case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
          audioError = new AudioLoadError(audio.src || 'unknown');
          break;
        default:
          audioError = new AudioPlaybackError('Unknown audio error');
      }
    } else {
      audioError = new AudioPlaybackError('Audio error occurred');
    }

    this.errorHandler(audioError);
    this.config.onError?.(audioError);
  }

  async loadTrack(track: AudioTrack): Promise<void> {
    try {
      if (this.currentTrack?.id === track.id && this.audio.src === track.url) {
        return;
      }

      this.currentTrack = track;
      this.audio.src = track.url;
      
      await new Promise<void>((resolve, reject) => {
        const handleLoadedMetadata = () => {
          this.audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
          this.audio.removeEventListener('error', handleError);
          resolve();
        };

        const handleError = () => {
          this.audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
          this.audio.removeEventListener('error', handleError);
          reject(new AudioLoadError(track.url));
        };

        this.audio.addEventListener('loadedmetadata', handleLoadedMetadata);
        this.audio.addEventListener('error', handleError);
        
        this.audio.load();
      });

    } catch (error) {
      if (isAppError(error)) {
        throw error;
      }
      throw new AudioLoadError(track.url, error as Error);
    }
  }

  async play(): Promise<void> {
    try {
      await this.audio.play();
    } catch (error) {
      const playbackError = new AudioPlaybackError(
        'Failed to start playback',
        error as Error
      );
      this.errorHandler(playbackError);
      throw playbackError;
    }
  }

  pause(): void {
    this.audio.pause();
  }

  stop(): void {
    this.audio.pause();
    this.audio.currentTime = 0;
  }

  setVolume(volume: Volume): void {
    this.audio.volume = Math.max(0, Math.min(1, volume / 100));
  }

  getCurrentTime(): number {
    return this.audio.currentTime;
  }

  getDuration(): number {
    return this.audio.duration || 0;
  }

  isPlaying(): boolean {
    return !this.audio.paused && !this.audio.ended;
  }

  isPaused(): boolean {
    return this.audio.paused;
  }

  getCurrentTrack(): AudioTrack | null {
    return this.currentTrack;
  }

  addEventListener<K extends keyof HTMLMediaElementEventMap>(
    type: K,
    listener: (this: HTMLAudioElement, ev: HTMLMediaElementEventMap[K]) => void
  ): void {
    this.audio.addEventListener(type, listener);
  }

  removeEventListener<K extends keyof HTMLMediaElementEventMap>(
    type: K,
    listener: (this: HTMLAudioElement, ev: HTMLMediaElementEventMap[K]) => void
  ): void {
    this.audio.removeEventListener(type, listener);
  }

  dispose(): void {
    this.audio.pause();
    this.audio.src = '';
    this.audio.load();
    this.currentTrack = null;
  }
}