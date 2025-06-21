export const DEFAULT_WORK_DURATION = 25 * 60;
export const DEFAULT_BREAK_DURATION = 5 * 60;

export const TIMER_UPDATE_INTERVAL = 100;

export const STORAGE_KEY = 'quranic-timer-preferences';

export const NOTIFICATION_SOUNDS = {
  sessionComplete: '/sounds/session-complete.mp3',
  breakComplete: '/sounds/break-complete.mp3',
  tick: '/sounds/tick.mp3',
  bell: '/sounds/bell-ring.mp3'
} as const;

export const KEYBOARD_SHORTCUTS = {
  TOGGLE_TIMER: ' ',
  RESET_TIMER: 'r',
  TOGGLE_AUDIO: 'm'
} as const;

export const ISLAMIC_COLORS = {
  primary: {
    teal: '#006666',
    tealLight: '#008080'
  },
  accent: {
    gold: '#DAA520',
    goldLight: '#F4D03F'
  },
  earth: {
    warm: '#8B4513',
    light: '#D2B48C'
  },
  background: '#F8F6F0',
  surface: '#FFFFFF',
  text: {
    primary: '#2C3E50',
    secondary: '#7F8C8D'
  }
} as const;

export const BREAKPOINTS = {
  mobile: 768,
  tablet: 1024,
  desktop: 1025
} as const;
