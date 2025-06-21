import React, { createContext, useContext, ReactNode } from 'react';
import { useYouTubeAudio } from '../hooks/useYouTubeAudio';
import { AudioTrack } from '../types/audio';

const defaultPlaylist: AudioTrack[] = [
  {
    id: 1,
    title: 'Surah Baqarah (Lo-Fi)',
    url: 'https://www.youtube.com/watch?v=hla_pPXU5Vo',
    duration: 8938,
    reciter: 'Mohamed Hesham',
    source: 'YouTube'
  },
  {
    id: 2,
    title: 'Surah Maryam (Lo-Fi)',
    url: 'https://www.youtube.com/watch?v=hcDBhbN8EVU',
    duration: 1579,
    reciter: 'Sherif Moustafa',
    source: 'YouTube'
  },
  {
    id: 3,
    title: 'Beautiful Quran Recitation',
    url: 'https://www.youtube.com/watch?v=mL9vnNW2h0Q',
    duration: 3618,
    reciter: 'Omar Hisham Al Arabi',
    source: 'YouTube'
  },
  {
    id: 4,
    title: 'Surah Al-Fatihah (Recitation)',
    url: 'https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/1.mp3',
    duration: 52,
    reciter: 'Mishary Rashid Alafasy',
    source: 'Islamic Network'
  },
  {
    id: 5,
    title: 'Surah Al-Baqarah Part 1 (Recitation)',
    url: 'https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/2.mp3',
    duration: 48,
    reciter: 'Mishary Rashid Alafasy',
    source: 'Islamic Network'
  }
];

type AudioContextType = ReturnType<typeof useYouTubeAudio>;

const AudioContext = createContext<AudioContextType | undefined>(undefined);

interface AudioProviderProps {
  children: ReactNode;
  playlist?: AudioTrack[];
}

export function AudioProvider({ children, playlist = defaultPlaylist }: AudioProviderProps) {
  const audio = useYouTubeAudio(playlist);

  return (
    <AudioContext.Provider value={audio}>
      {children}
    </AudioContext.Provider>
  );
}

export function useAudioContext() {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error('useAudioContext must be used within an AudioProvider');
  }
  return context;
}