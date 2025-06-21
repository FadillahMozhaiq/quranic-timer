import React, { createContext, useContext, ReactNode, useReducer, useEffect } from 'react';
import { UserPreferences, AppSettings, SettingsAction } from '../types/settings';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { STORAGE_KEY, DEFAULT_WORK_DURATION, DEFAULT_BREAK_DURATION } from '../utils/constants';

const defaultPreferences: UserPreferences = {
  timer: {
    workDuration: DEFAULT_WORK_DURATION,
    breakDuration: DEFAULT_BREAK_DURATION,
    autoStart: false,
    notifications: true
  },
  audio: {
    volume: 50,
    selectedPlaylist: 'quran-lofi',
    autoPlay: true
  },
  ui: {
    theme: 'default',
    showSeconds: true,
    compactMode: false
  },
  version: '1.0.0'
};

const initialSettings: AppSettings = {
  preferences: defaultPreferences,
  isLoaded: false
};

function settingsReducer(state: AppSettings, action: SettingsAction): AppSettings {
  switch (action.type) {
    case 'LOAD_PREFERENCES':
      return {
        ...state,
        preferences: action.payload.preferences,
        isLoaded: true
      };
    
    case 'UPDATE_TIMER_SETTINGS':
      return {
        ...state,
        preferences: {
          ...state.preferences,
          timer: { ...state.preferences.timer, ...action.payload }
        }
      };
    
    case 'UPDATE_AUDIO_SETTINGS':
      return {
        ...state,
        preferences: {
          ...state.preferences,
          audio: { ...state.preferences.audio, ...action.payload }
        }
      };
    
    case 'UPDATE_UI_SETTINGS':
      return {
        ...state,
        preferences: {
          ...state.preferences,
          ui: { ...state.preferences.ui, ...action.payload }
        }
      };
    
    case 'RESET_TO_DEFAULTS':
      return { ...state, preferences: defaultPreferences };
    
    default:
      return state;
  }
}

interface SettingsContextType {
  settings: AppSettings;
  updateTimerSettings: (settings: Partial<UserPreferences['timer']>) => void;
  updateAudioSettings: (settings: Partial<UserPreferences['audio']>) => void;
  updateUISettings: (settings: Partial<UserPreferences['ui']>) => void;
  resetToDefaults: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

interface SettingsProviderProps {
  children: ReactNode;
}

export function SettingsProvider({ children }: SettingsProviderProps) {
  const [settings, dispatch] = useReducer(settingsReducer, initialSettings);
  const [storedPreferences, setStoredPreferences] = useLocalStorage(STORAGE_KEY, defaultPreferences);

  useEffect(() => {
    console.log('🔄 SettingsContext: Loading preferences from localStorage', storedPreferences);
    dispatch({ type: 'LOAD_PREFERENCES', payload: { preferences: storedPreferences } });
  }, [storedPreferences]);

  useEffect(() => {
    console.log('💾 SettingsContext: Saving preferences to localStorage', {
      isLoaded: settings.isLoaded,
      preferences: settings.preferences
    });
    if (settings.isLoaded) {
      const currentStored = JSON.stringify(storedPreferences);
      const newPreferences = JSON.stringify(settings.preferences);
      
      if (currentStored !== newPreferences) {
        console.log('📝 SettingsContext: Preferences changed, saving to localStorage');
        setStoredPreferences(settings.preferences);
      } else {
        console.log('⏭️ SettingsContext: Preferences unchanged, skipping save');
      }
    }
  }, [settings.preferences, settings.isLoaded, setStoredPreferences]);

  const updateTimerSettings = (timerSettings: Partial<UserPreferences['timer']>) => {
    dispatch({ type: 'UPDATE_TIMER_SETTINGS', payload: timerSettings });
  };

  const updateAudioSettings = (audioSettings: Partial<UserPreferences['audio']>) => {
    dispatch({ type: 'UPDATE_AUDIO_SETTINGS', payload: audioSettings });
  };

  const updateUISettings = (uiSettings: Partial<UserPreferences['ui']>) => {
    dispatch({ type: 'UPDATE_UI_SETTINGS', payload: uiSettings });
  };

  const resetToDefaults = () => {
    dispatch({ type: 'RESET_TO_DEFAULTS' });
  };

  const contextValue: SettingsContextType = {
    settings,
    updateTimerSettings,
    updateAudioSettings,
    updateUISettings,
    resetToDefaults
  };

  return (
    <SettingsContext.Provider value={contextValue}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettingsContext() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettingsContext must be used within a SettingsProvider');
  }
  return context;
}