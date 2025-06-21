export interface TimerState {
  currentTime: number;
  isRunning: boolean;
  isPaused: boolean;
  sessionType: 'work' | 'break';
  sessionCount: number;
  isBellRinging: boolean;
}

export interface TimerSettings {
  workDuration: number;
  breakDuration: number;
  autoStart: boolean;
  notifications: boolean;
}

export type TimerAction =
  | { type: 'START' }
  | { type: 'PAUSE' }
  | { type: 'RESET' }
  | { type: 'TICK'; payload: { remaining: number } }
  | { type: 'COMPLETE' }
  | { type: 'SWITCH_SESSION'; payload: { sessionType: 'work' | 'break' } }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<TimerSettings> }
  | { type: 'START_BELL' }
  | { type: 'STOP_BELL' };