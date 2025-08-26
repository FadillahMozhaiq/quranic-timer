import { useReducer, useEffect, useRef, useCallback } from 'react';
import { TimerState, TimerAction, TimerSettings } from '../types/timer';
import { DEFAULT_WORK_DURATION, DEFAULT_BREAK_DURATION } from '../utils/constants';
import { notify } from '../utils/notifications';
import { bellNotificationManager, requestBellPermissions } from '../utils/bellNotification';

const initialTimerState: TimerState = {
  currentTime: DEFAULT_WORK_DURATION,
  isRunning: false,
  isPaused: false,
  sessionType: 'work',
  sessionCount: 0,
  isBellRinging: false
};

const initialSettings: TimerSettings = {
  workDuration: DEFAULT_WORK_DURATION,
  breakDuration: DEFAULT_BREAK_DURATION,
  autoStart: false,
  notifications: true
};

function timerReducer(state: TimerState, action: TimerAction): TimerState {
  switch (action.type) {
    case 'START':
      return {
        ...state,
        isRunning: true,
        isPaused: false,
        isBellRinging: false
      };

    case 'PAUSE':
      return {
        ...state,
        isRunning: false,
        isPaused: true
      };

    case 'RESET':
      return {
        ...state,
        isRunning: false,
        isPaused: false,
        isBellRinging: false,
        currentTime: state.sessionType === 'work' ? initialSettings.workDuration : initialSettings.breakDuration
      };

    case 'TICK':
      return {
        ...state,
        currentTime: action.payload.remaining
      };

    case 'COMPLETE':
      const newSessionType = state.sessionType === 'work' ? 'break' : 'work';
      const newSessionCount = state.sessionType === 'work' ? state.sessionCount + 1 : state.sessionCount;

      return {
        ...state,
        isRunning: false,
        isPaused: false,
        isBellRinging: true,
        sessionType: newSessionType,
        sessionCount: newSessionCount,
        currentTime: newSessionType === 'work' ? initialSettings.workDuration : initialSettings.breakDuration
      };

    case 'SWITCH_SESSION':
      return {
        ...state,
        sessionType: action.payload.sessionType,
        currentTime: action.payload.sessionType === 'work' ? initialSettings.workDuration : initialSettings.breakDuration,
        isRunning: false,
        isPaused: false,
        isBellRinging: false
      };

    case 'UPDATE_SETTINGS':
      const updatedSettings = { ...initialSettings, ...action.payload };
      return {
        ...state,
        currentTime: state.sessionType === 'work' ? updatedSettings.workDuration : updatedSettings.breakDuration
      };

    case 'START_BELL':
      return {
        ...state,
        isBellRinging: true
      };

    case 'STOP_BELL':
      return {
        ...state,
        isBellRinging: false
      };

    default:
      return state;
  }
}

export function useTimer(settings: TimerSettings = initialSettings) {
  const [state, dispatch] = useReducer(timerReducer, initialTimerState);
  const workerRef = useRef<Worker | null>(null);
  const settingsRef = useRef(settings);

  useEffect(() => {
    settingsRef.current = settings;
    dispatch({ type: 'UPDATE_SETTINGS', payload: settings });
  }, [settings]);

  useEffect(() => {
    workerRef.current = new Worker(
      new URL('../workers/timer.worker.ts', import.meta.url),
      { type: 'module' }
    );

    workerRef.current.onmessage = (e) => {
      const { type, payload } = e.data;

      switch (type) {
        case 'TICK':
          dispatch({ type: 'TICK', payload });
          break;
        case 'COMPLETE':
          dispatch({ type: 'COMPLETE' });
          handleTimerComplete();
          break;
      }
    };

    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  const handleTimerComplete = useCallback(async () => {
    const currentSettings = settingsRef.current;

    if (currentSettings.notifications) {
      if (state.sessionType === 'work') {
        notify('Work Session Complete!', 'Time for a break. Great job!', 'sessionComplete');
      } else {
        notify('Break Complete!', 'Ready to get back to work?', 'breakComplete');
      }

      try {
        await bellNotificationManager.startBell();
        dispatch({ type: 'START_BELL' });
      } catch (error) {
        console.error('Failed to start bell notification:', error);
      }
    }

    if (currentSettings.autoStart && !bellNotificationManager.isBellRinging) {
      setTimeout(() => {
        if (workerRef.current && !state.isRunning) {
          workerRef.current.postMessage({
            action: 'START',
            payload: { duration: state.currentTime }
          });
          dispatch({ type: 'START' });
        }
      }, 1000);
    }
  }, [state.sessionType, state.isRunning, state.currentTime]);

  const startTimer = useCallback(() => {
    if (workerRef.current && !state.isRunning) {
      workerRef.current.postMessage({
        action: 'START',
        payload: { duration: state.currentTime }
      });
      dispatch({ type: 'START' });
    }
  }, [state.isRunning, state.currentTime]);

  const pauseTimer = useCallback(() => {
    if (workerRef.current && state.isRunning) {
      workerRef.current.postMessage({ action: 'PAUSE' });
      dispatch({ type: 'PAUSE' });
    }
  }, [state.isRunning]);

  const resumeTimer = useCallback(() => {
    if (workerRef.current && state.isPaused) {
      workerRef.current.postMessage({ action: 'RESUME', payload: { duration: state.currentTime } });
      dispatch({ type: 'START' });
    }
  }, [state.isPaused, state.currentTime]);

  const resetTimer = useCallback(() => {
    if (workerRef.current) {
      workerRef.current.postMessage({ action: 'RESET' });
      dispatch({ type: 'RESET' });
    }
  }, []);

  const toggleTimer = useCallback(() => {
    if (state.isRunning) {
      pauseTimer();
    } else if (state.isPaused) {
      resumeTimer();
    } else {
      startTimer();
    }
  }, [state.isRunning, state.isPaused, startTimer, pauseTimer, resumeTimer]);

  const switchSession = useCallback((sessionType: 'work' | 'break') => {
    if (workerRef.current) {
      workerRef.current.postMessage({ action: 'RESET' });
    }
    if (state.isBellRinging) {
      bellNotificationManager.stopBell();
      dispatch({ type: 'STOP_BELL' });
    }
    dispatch({ type: 'SWITCH_SESSION', payload: { sessionType } });
  }, [state.isBellRinging]);

  const stopBell = useCallback(() => {
    bellNotificationManager.stopBell();
    dispatch({ type: 'STOP_BELL' });
  }, []);

  const requestPermissions = useCallback(async () => {
    return await requestBellPermissions();
  }, []);

  const resetTimerWithBellStop = useCallback(() => {
    if (state.isBellRinging) {
      bellNotificationManager.stopBell();
    }
    resetTimer();
  }, [state.isBellRinging, resetTimer]);

  const startTimerWithBellStop = useCallback(() => {
    if (state.isBellRinging) {
      bellNotificationManager.stopBell();
      dispatch({ type: 'STOP_BELL' });
    }
    startTimer();
  }, [state.isBellRinging, startTimer]);

  return {
    ...state,
    startTimer: startTimerWithBellStop,
    pauseTimer,
    resumeTimer,
    resetTimer: resetTimerWithBellStop,
    toggleTimer,
    switchSession,
    stopBell,
    requestPermissions
  };
}