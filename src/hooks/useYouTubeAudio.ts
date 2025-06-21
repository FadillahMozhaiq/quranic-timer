import { useReducer, useRef, useCallback, useEffect, useMemo } from 'react';
import { AudioState, AudioAction, AudioTrack } from '../types/audio';
import {
  isYouTubeUrl,
  extractYouTubeVideoId,
  extractStartTime,
  YT_PLAYER_STATE,
  YouTubePlayer,
  getYouTubeErrorMessage,
  YOUTUBE_ERROR_CODES
} from '../utils/youtube';
import {
  YouTubePlayerError,
  YouTubeApiError,
  AudioLoadError,
  createErrorHandler
} from '../types';

const initialAudioState: AudioState = {
  isPlaying: false,
  volume: 50,
  currentTrack: 0,
  playlist: [],
  isMuted: false,
  isLoading: false,
  isYouTubePlayerReady: false
};

function audioReducer(state: AudioState, action: AudioAction): AudioState {
  switch (action.type) {
    case 'PLAY':
      return { ...state, isPlaying: true };
    
    case 'PAUSE':
      return { ...state, isPlaying: false };
    
    case 'STOP':
      return { ...state, isPlaying: false, currentTrack: 0 };
    
    case 'SET_VOLUME':
      return { ...state, volume: action.payload.volume };
    
    case 'TOGGLE_MUTE':
      return { ...state, isMuted: !state.isMuted };
    
    case 'NEXT_TRACK':
      const nextTrack = (state.currentTrack + 1) % state.playlist.length;
      return { ...state, currentTrack: nextTrack, isLoading: true };
    
    case 'PREVIOUS_TRACK':
      const prevTrack = state.currentTrack === 0
        ? state.playlist.length - 1
        : state.currentTrack - 1;
      return { ...state, currentTrack: prevTrack, isLoading: true };
    
    case 'SET_TRACK':
      return { ...state, currentTrack: action.payload.trackIndex, isLoading: true };
    
    case 'SET_PLAYLIST':
      return {
        ...state,
        playlist: action.payload.playlist,
        currentTrack: 0,
        isLoading: true
      };
    
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload.isLoading };
    
    case 'SET_YOUTUBE_READY':
      return { ...state, isYouTubePlayerReady: action.payload.isReady };
    
    default:
      return state;
  }
}

export function useYouTubeAudio(initialPlaylist: AudioTrack[] = []) {
  const [state, dispatch] = useReducer(audioReducer, {
    ...initialAudioState,
    playlist: initialPlaylist
  });
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const youtubePlayerRef = useRef<YouTubePlayer | null>(null);
  const currentTrackRef = useRef<AudioTrack | null>(null);
  const isYouTubePlayerReady = useRef<boolean>(false);
  const bufferingTimeoutRef = useRef<number | null>(null);
  const errorHandler = useMemo(() => createErrorHandler('YOUTUBE'), []);

  useEffect(() => {
    let initializationTimeout: number;
    
    const initYouTubePlayer = () => {
      if (window.YT && window.YT.Player) {
        try {
          let playerDiv = document.getElementById('youtube-player');
          if (!playerDiv) {
            playerDiv = document.createElement('div');
            playerDiv.id = 'youtube-player';
            playerDiv.style.display = 'none';
            playerDiv.style.position = 'absolute';
            playerDiv.style.top = '-9999px';
            playerDiv.style.left = '-9999px';
            document.body.appendChild(playerDiv);
          }

          youtubePlayerRef.current = new window.YT.Player('youtube-player', {
            height: '1',
            width: '1',
            playerVars: {
              autoplay: 0,
              controls: 0,
              disablekb: 1,
              fs: 0,
              modestbranding: 1,
              rel: 0,
              showinfo: 0,
              origin: window.location.origin,
              enablejsapi: 1
            },
            events: {
              onReady: (event) => {
                console.log('YouTube player initialized successfully');
                isYouTubePlayerReady.current = true;
                dispatch({ type: 'SET_YOUTUBE_READY', payload: { isReady: true } });
                
                try {
                  event.target.setVolume(state.volume);
                } catch (error) {
                  console.warn('Error setting initial volume:', error);
                }
              },
              onStateChange: (event) => {
                console.log('YouTube player state changed:', event.data);
                switch (event.data) {
                  case YT_PLAYER_STATE.ENDED:
                    dispatch({ type: 'NEXT_TRACK' });
                    break;
                  case YT_PLAYER_STATE.PLAYING:
                    if (bufferingTimeoutRef.current) {
                      clearTimeout(bufferingTimeoutRef.current);
                      bufferingTimeoutRef.current = null;
                    }
                    dispatch({ type: 'PLAY' });
                    dispatch({ type: 'SET_LOADING', payload: { isLoading: false } });
                    break;
                  case YT_PLAYER_STATE.PAUSED:
                    dispatch({ type: 'PAUSE' });
                    break;
                  case YT_PLAYER_STATE.BUFFERING:
                    dispatch({ type: 'SET_LOADING', payload: { isLoading: true } });
                    
                    if (bufferingTimeoutRef.current) {
                      clearTimeout(bufferingTimeoutRef.current);
                    }
                    
                    bufferingTimeoutRef.current = setTimeout(() => {
                      console.warn('YouTube buffering timeout, clearing loading state');
                      dispatch({ type: 'SET_LOADING', payload: { isLoading: false } });
                      dispatch({ type: 'PAUSE' });
                    }, 10000);
                    break;
                  case YT_PLAYER_STATE.UNSTARTED:
                    setTimeout(() => {
                      dispatch({ type: 'SET_LOADING', payload: { isLoading: false } });
                    }, 3000);
                    break;
                  case YT_PLAYER_STATE.CUED:
                    dispatch({ type: 'SET_LOADING', payload: { isLoading: false } });
                    break;
                }
              },
              onError: (event) => {
                console.error('YouTube player error:', event.data);
                const error = new YouTubePlayerError(event.data);
                errorHandler(error);
                dispatch({ type: 'PAUSE' });
                dispatch({ type: 'SET_LOADING', payload: { isLoading: false } });
                
                setTimeout(() => {
                  if (state.playlist.length > 1) {
                    dispatch({ type: 'NEXT_TRACK' });
                  }
                }, 500);
              }
            }
          });
        } catch (error) {
          console.error('Failed to initialize YouTube player:', error);
          const apiError = new YouTubeApiError('Failed to initialize player', error as Error);
          errorHandler(apiError);
        }
      } else {
        console.warn('YouTube API not available');
      }
    };

    if (!window.YT) {
      console.log('Loading YouTube API...');
      const script = document.createElement('script');
      script.src = 'https://www.youtube.com/iframe_api';
      script.async = true;
      script.onload = () => console.log('YouTube API script loaded');
      script.onerror = () => console.error('Failed to load YouTube API script');
      document.head.appendChild(script);
      
      window.onYouTubeIframeAPIReady = () => {
        console.log('YouTube API ready');
        initYouTubePlayer();
      };
      
      initializationTimeout = setTimeout(() => {
        console.warn('YouTube API initialization timeout');
      }, 10000);
    } else if (window.YT.Player) {
      console.log('YouTube API already available, initializing player');
      initYouTubePlayer();
    } else {
      console.log('YouTube API loaded but Player not ready, waiting...');
      window.onYouTubeIframeAPIReady = initYouTubePlayer;
    }

    audioRef.current = new Audio();
    audioRef.current.preload = 'metadata';
    audioRef.current.crossOrigin = 'anonymous';
    
    const audio = audioRef.current;
    
    const handleEnded = () => dispatch({ type: 'NEXT_TRACK' });
    const handleError = (e: Event) => {
      const target = e.target as HTMLAudioElement;
      console.error('Audio error:', e);
      const error = new AudioLoadError(target.src || 'unknown');
      errorHandler(error);
      dispatch({ type: 'PAUSE' });
      dispatch({ type: 'SET_LOADING', payload: { isLoading: false } });
      
      setTimeout(() => {
        if (state.playlist.length > 1) {
          dispatch({ type: 'NEXT_TRACK' });
        }
      }, 500);
    };
    
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);
    
    return () => {
      if (initializationTimeout) {
        clearTimeout(initializationTimeout);
      }
      
      if (bufferingTimeoutRef.current) {
        clearTimeout(bufferingTimeoutRef.current);
      }
      
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.pause();
      
      if (youtubePlayerRef.current?.destroy) {
        try {
          youtubePlayerRef.current.destroy();
          youtubePlayerRef.current = null;
        } catch (error) {
          console.warn('Error destroying YouTube player:', error);
        }
      }
      
      isYouTubePlayerReady.current = false;
    };
  }, []);

  useEffect(() => {
    if (state.playlist.length === 0) return;

    const currentTrack = state.playlist[state.currentTrack];
    if (!currentTrack) return;

    currentTrackRef.current = currentTrack;
    
    if (isYouTubeUrl(currentTrack.url)) {
      const videoId = extractYouTubeVideoId(currentTrack.url);
      const startTime = extractStartTime(currentTrack.url);
      
      if (videoId && youtubePlayerRef.current && isYouTubePlayerReady.current) {
        if (audioRef.current) {
          audioRef.current.pause();
        }
        
        try {
          dispatch({ type: 'SET_LOADING', payload: { isLoading: true } });
          youtubePlayerRef.current.loadVideoById({
            videoId: videoId,
            startSeconds: startTime
          });
          
          setTimeout(() => {
            dispatch({ type: 'SET_LOADING', payload: { isLoading: false } });
          }, 5000);
        } catch (error) {
          console.error('Failed to load YouTube video:', error);
          dispatch({ type: 'SET_LOADING', payload: { isLoading: false } });
          const loadError = new YouTubeApiError('Failed to load video', error as Error);
          errorHandler(loadError);
          
          setTimeout(() => {
            if (state.playlist.length > 1) {
              dispatch({ type: 'NEXT_TRACK' });
            }
          }, 500);
        }
      } else if (!youtubePlayerRef.current || !isYouTubePlayerReady.current) {
        console.warn('YouTube player not ready, skipping YouTube track');
        setTimeout(() => {
          if (state.playlist.length > 1) {
            dispatch({ type: 'NEXT_TRACK' });
          }
        }, 100);
      }
    } else {
      if (audioRef.current && audioRef.current.src !== currentTrack.url) {
        if (youtubePlayerRef.current && isYouTubePlayerReady.current) {
          try {
            youtubePlayerRef.current.pauseVideo();
          } catch (error) {
            console.warn('Error pausing YouTube player:', error);
          }
        }
        
        dispatch({ type: 'SET_LOADING', payload: { isLoading: true } });
        audioRef.current.src = currentTrack.url;
        audioRef.current.load();
        
        const handleCanPlay = () => {
          dispatch({ type: 'SET_LOADING', payload: { isLoading: false } });
          audioRef.current?.removeEventListener('canplay', handleCanPlay);
        };
        
        const handleLoadError = () => {
          dispatch({ type: 'SET_LOADING', payload: { isLoading: false } });
          audioRef.current?.removeEventListener('error', handleLoadError);
        };
        
        audioRef.current.addEventListener('canplay', handleCanPlay);
        audioRef.current.addEventListener('error', handleLoadError);
      }
    }
  }, [state.currentTrack, state.playlist, errorHandler]);

  useEffect(() => {
    const volume = state.isMuted ? 0 : state.volume;
    
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
    
    if (youtubePlayerRef.current && isYouTubePlayerReady.current) {
      try {
        youtubePlayerRef.current.setVolume(volume);
      } catch (error) {
        console.warn('Error setting YouTube volume:', error);
      }
    }
  }, [state.volume, state.isMuted]);

  useEffect(() => {
    const currentTrack = state.playlist[state.currentTrack];
    if (!currentTrack) return;
    
    if (isYouTubeUrl(currentTrack.url)) {
      if (youtubePlayerRef.current && isYouTubePlayerReady.current) {
        const timeoutId = setTimeout(() => {
          try {
            if (youtubePlayerRef.current && isYouTubePlayerReady.current) {
              if (state.isPlaying) {
                console.log('Playing YouTube video');
                youtubePlayerRef.current.playVideo();
                setTimeout(() => {
                  dispatch({ type: 'SET_LOADING', payload: { isLoading: false } });
                }, 500);
              } else {
                console.log('Pausing YouTube video');
                youtubePlayerRef.current.pauseVideo();
              }
            }
          } catch (error) {
            console.error('YouTube playback control error:', error);
            const playbackError = new YouTubeApiError('Playback control failed', error as Error);
            errorHandler(playbackError);
          }
        }, 200);
        
        return () => clearTimeout(timeoutId);
      } else {
        console.warn('YouTube player not ready for playback control:', {
          playerExists: !!youtubePlayerRef.current,
          playerReady: isYouTubePlayerReady.current,
          isPlaying: state.isPlaying
        });
        
        if (state.isPlaying) {
          const retryTimeoutId = setTimeout(() => {
            if (youtubePlayerRef.current && isYouTubePlayerReady.current) {
              try {
                console.log('Retrying YouTube playback');
                youtubePlayerRef.current.playVideo();
              } catch (error) {
                console.error('YouTube retry playback error:', error);
              }
            }
          }, 1000);
          
          return () => clearTimeout(retryTimeoutId);
        }
      }
    } else {
      if (audioRef.current) {
        if (state.isPlaying) {
          console.log('Playing regular audio');
          audioRef.current.play().catch(error => {
            console.error('Regular audio playback error:', error);
            const playbackError = new AudioLoadError(currentTrack.url, error);
            errorHandler(playbackError);
            
            dispatch({ type: 'PAUSE' });
            setTimeout(() => {
              if (state.playlist.length > 1) {
                dispatch({ type: 'NEXT_TRACK' });
              }
            }, 500);
          });
        } else {
          console.log('Pausing regular audio');
          audioRef.current.pause();
        }
      }
    }
  }, [state.isPlaying, state.currentTrack, errorHandler]);


  const play = useCallback(() => {
    dispatch({ type: 'PLAY' });
  }, []);

  const pause = useCallback(() => {
    dispatch({ type: 'PAUSE' });
  }, []);

  const stop = useCallback(() => {
    dispatch({ type: 'STOP' });
  }, []);

  const togglePlayPause = useCallback(() => {
    if (state.isPlaying) {
      pause();
    } else {
      play();
    }
  }, [state.isPlaying, play, pause]);

  const setVolume = useCallback((volume: number) => {
    const clampedVolume = Math.max(0, Math.min(100, volume));
    dispatch({ type: 'SET_VOLUME', payload: { volume: clampedVolume } });
  }, []);

  const toggleMute = useCallback(() => {
    dispatch({ type: 'TOGGLE_MUTE' });
  }, []);

  const nextTrack = useCallback(() => {
    if (state.playlist.length > 0) {
      dispatch({ type: 'NEXT_TRACK' });
    }
  }, [state.playlist.length]);

  const previousTrack = useCallback(() => {
    if (state.playlist.length > 0) {
      dispatch({ type: 'PREVIOUS_TRACK' });
    }
  }, [state.playlist.length]);

  const setTrack = useCallback((trackIndex: number) => {
    if (trackIndex >= 0 && trackIndex < state.playlist.length) {
      dispatch({ type: 'SET_TRACK', payload: { trackIndex } });
    }
  }, [state.playlist.length]);

  const setPlaylist = useCallback((playlist: AudioTrack[]) => {
    dispatch({ type: 'SET_PLAYLIST', payload: { playlist } });
  }, []);

  const getCurrentTrack = useCallback(() => {
    return state.playlist[state.currentTrack] || null;
  }, [state.playlist, state.currentTrack]);

  return {
    ...state,
    play,
    pause,
    stop,
    togglePlayPause,
    setVolume,
    toggleMute,
    nextTrack,
    previousTrack,
    setTrack,
    setPlaylist,
    getCurrentTrack,
    currentTrack: getCurrentTrack()
  };
}