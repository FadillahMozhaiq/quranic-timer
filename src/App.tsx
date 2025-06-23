import React, { useEffect } from 'react';
import {
  TimerProvider,
  AudioProvider,
  SettingsProvider,
  useSettingsContext,
  useTimerContext,
  useAudioContext
} from './context';
import { CircularTimer } from './components/Timer/CircularTimer';
import { TimerControls } from './components/Timer/TimerControls';
import { ModeSelector } from './components/Timer/ModeSelector';
import { AudioPlayer } from './components/Audio/AudioPlayer';
import { SessionSettings } from './components/Settings/SessionSettings';
import { Bell } from './components/Bell/Bell';
import { useKeyboardShortcuts } from './hooks';
import { requestNotificationPermission } from './utils';
import './App.css';

function AppContent() {
  const { settings } = useSettingsContext();
  const { toggleTimer, resetTimer, stopBell, requestPermissions, isBellRinging } = useTimerContext();
  const { togglePlayPause } = useAudioContext();

  useKeyboardShortcuts({
    onToggleTimer: toggleTimer,
    onResetTimer: resetTimer,
    onToggleAudio: togglePlayPause,
    onStopBell: isBellRinging ? stopBell : undefined
  });

  useEffect(() => {
    if (settings.preferences.timer.notifications) {
      requestNotificationPermission();
      requestPermissions();
    }
  }, [settings.preferences.timer.notifications, requestPermissions]);

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">Quranic Timer</h1>
        <p className="app-subtitle">Focus with spiritual mindfulness</p>
      </header>

      <main className="app-main">
        <div className="timer-container">
          <ModeSelector />
          <CircularTimer />
          <TimerControls />
        </div>

        <div className="audio-container">
          <AudioPlayer />
        </div>
      </main>

      <SessionSettings />
      
      <footer className="app-footer">
        <p>
          Press <kbd>Space</kbd> to start/pause • <kbd>R</kbd> to reset • <kbd>M</kbd> to toggle audio
          {isBellRinging && <> • <kbd>Esc</kbd> to stop bell</>}
        </p>
      </footer>

      <Bell isRinging={isBellRinging} onStop={stopBell} />
    </div>
  );
}

function App() {
  return (
    <SettingsProvider>
      <TimerProvider>
        <AudioProvider>
          <AppContent />
        </AudioProvider>
      </TimerProvider>
    </SettingsProvider>
  );
}

export default App;
