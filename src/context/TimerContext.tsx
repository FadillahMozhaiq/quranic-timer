import React, { createContext, useContext, ReactNode } from 'react';
import { useTimer } from '../hooks/useTimer';
import { TimerSettings } from '../types/timer';
import { DEFAULT_WORK_DURATION, DEFAULT_BREAK_DURATION } from '../utils/constants';

const defaultSettings: TimerSettings = {
  workDuration: DEFAULT_WORK_DURATION,
  breakDuration: DEFAULT_BREAK_DURATION,
  autoStart: false,
  notifications: true
};

type TimerContextType = ReturnType<typeof useTimer>;

const TimerContext = createContext<TimerContextType | undefined>(undefined);

interface TimerProviderProps {
  children: ReactNode;
  settings?: TimerSettings;
}

export function TimerProvider({ children, settings = defaultSettings }: TimerProviderProps) {
  const timer = useTimer(settings);

  return (
    <TimerContext.Provider value={timer}>
      {children}
    </TimerContext.Provider>
  );
}

export function useTimerContext() {
  const context = useContext(TimerContext);
  if (context === undefined) {
    throw new Error('useTimerContext must be used within a TimerProvider');
  }
  return context;
}