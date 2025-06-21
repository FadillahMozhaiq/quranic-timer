import { useReducer, useRef, useCallback, useEffect } from 'react';
import { AudioState, AudioAction, AudioTrack } from '../types/audio';

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
      return { ...state, currentTrack: nextTrack };
    
    case 'PREVIOUS_TRACK':
      const prevTrack = state.currentTrack === 0 
        ? state.playlist.length - 1 
        : state.currentTrack - 1;
      return { ...state, currentTrack: prevTrack };
    
    case 'SET_TRACK':
      return { ...state, currentTrack: action.payload.trackIndex };
    
    case 'SET_PLAYLIST':
      return { 
        ...state, 
        playlist: action.payload.playlist,
        currentTrack: 0
      };
    
    default:
      return state;
  }
}

export function useAudio(initialPlaylist: AudioTrack[] = []) {
  const [state, dispatch] = useReducer(audioReducer, {
    ...initialAudioState,
    playlist: initialPlaylist
  });
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentTrackRef = useRef<AudioTrack | null>(null);

  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.preload = 'metadata';
    
    const audio = audioRef.current;
    
    const handleEnded = () => {
      dispatch({ type: 'NEXT_TRACK' });
    };
    
    const handleError = (e: Event) => {
      const audio = e.target as HTMLAudioElement;
      console.group('🔴 Audio Error Diagnostic');
      console.error('Audio playback error:', e);
      console.log('Error details:', {
        audioSrc: audio?.src || 'No source',
        audioReadyState: audio?.readyState || 'Unknown',
        audioNetworkState: audio?.networkState || 'Unknown',
        audioError: audio?.error ? {
          code: audio.error.code,
          message: audio.error.message
        } : 'No error object',
        currentTrack: currentTrackRef.current,
        playlistLength: state.playlist.length,
        timestamp: new Date().toISOString()
      });
      console.groupEnd();
      dispatch({ type: 'PAUSE' });
    };
    
    const handleLoadStart = () => {
      console.log('🔄 Audio loading started:', {
        src: audio.src,
        readyState: audio.readyState,
        networkState: audio.networkState
      });
    };
    
    const handleCanPlay = () => {
      console.log('✅ Audio can play:', {
        src: audio.src,
        readyState: audio.readyState,
        duration: audio.duration
      });
      if (state.isPlaying) {
        audio.play().catch(error => {
          console.error('Play failed in canplay handler:', error);
        });
      }
    };
    
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);
    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('canplay', handleCanPlay);
    
    return () => {
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.pause();
    };
  }, []);

  useEffect(() => {
    if (audioRef.current && state.playlist.length > 0) {
      const currentTrack = state.playlist[state.currentTrack];
      currentTrackRef.current = currentTrack;
      
      console.group('🎵 Audio Source Update');
      console.log('Track change detected:', {
        currentTrackIndex: state.currentTrack,
        currentTrack: currentTrack,
        previousSrc: audioRef.current.src,
        newSrc: currentTrack?.url,
        playlistLength: state.playlist.length
      });
      
      if (currentTrack && audioRef.current.src !== currentTrack.url) {
        console.log('Setting new audio source:', currentTrack.url);
        
        fetch(currentTrack.url, { method: 'HEAD' })
          .then(response => {
            console.log('URL accessibility test:', {
              url: currentTrack.url,
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries())
            });
          })
          .catch(error => {
            console.error('URL accessibility test failed:', {
              url: currentTrack.url,
              error: error.message
            });
          });
        
        audioRef.current.src = currentTrack.url;
        audioRef.current.load();
      }
      console.groupEnd();
    }
  }, [state.currentTrack, state.playlist]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = state.isMuted ? 0 : state.volume / 100;
    }
  }, [state.volume, state.isMuted]);

  useEffect(() => {
    if (audioRef.current) {
      console.log('🎮 Play/Pause state change:', {
        isPlaying: state.isPlaying,
        audioSrc: audioRef.current.src,
        readyState: audioRef.current.readyState,
        networkState: audioRef.current.networkState,
        currentTime: audioRef.current.currentTime,
        duration: audioRef.current.duration
      });
      
      if (state.isPlaying) {
        audioRef.current.play().catch(error => {
          console.error('Play failed in state effect:', error);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [state.isPlaying]);

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