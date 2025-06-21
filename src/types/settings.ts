import { TimerSettings } from './timer';

export interface UserPreferences {
  timer: TimerSettings;
  audio: {
    volume: number;
    selectedPlaylist: string;
    autoPlay: boolean;
  };
  ui: {
    theme: string;
    showSeconds: boolean;
    compactMode: boolean;
  };
  version: string;
}

export interface AppSettings {
  preferences: UserPreferences;
  isLoaded: boolean;
}

export type SettingsAction =
  | { type: 'LOAD_PREFERENCES'; payload: { preferences: UserPreferences } }
  | { type: 'UPDATE_TIMER_SETTINGS'; payload: Partial<TimerSettings> }
  | { type: 'UPDATE_AUDIO_SETTINGS'; payload: Partial<UserPreferences['audio']> }
  | { type: 'UPDATE_UI_SETTINGS'; payload: Partial<UserPreferences['ui']> }
  | { type: 'RESET_TO_DEFAULTS' };