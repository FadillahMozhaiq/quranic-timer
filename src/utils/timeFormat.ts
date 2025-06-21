import {
  Seconds,
  Minutes,
  createSeconds,
  createMinutes
} from '../types';

export const formatTime = (seconds: Seconds): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export const formatDuration = (seconds: Seconds): string => {
  const minutes = Math.floor(seconds / 60);
  
  if (minutes === 0) {
    return seconds === 1 ? '1 second' : `${seconds} seconds`;
  }
  
  if (minutes === 1) {
    return '1 minute';
  }
  
  return `${minutes} minutes`;
};

export const formatTimeDisplay = (
  seconds: Seconds,
  showSeconds: boolean = true,
  compact: boolean = false
): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  
  if (compact && !showSeconds) {
    return `${minutes}m`;
  }
  
  if (compact && showSeconds) {
    return remainingSeconds > 0 ? `${minutes}m ${remainingSeconds}s` : `${minutes}m`;
  }
  
  if (showSeconds) {
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
  
  return `${minutes.toString().padStart(2, '0')}:00`;
};

export const calculateProgress = (currentTime: Seconds, totalTime: Seconds): number => {
  if (totalTime === 0) return 0;
  return Math.max(0, Math.min(100, ((totalTime - currentTime) / totalTime) * 100));
};

export const calculateTimeRemaining = (currentTime: Seconds, totalTime: Seconds): number => {
  return 100 - calculateProgress(currentTime, totalTime);
};

export const formatContextualTime = (seconds: Seconds): string => {
  if (seconds < 60) {
    return `${seconds}s`;
  }
  
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  
  if (minutes < 60) {
    return remainingSeconds > 0 ? `${minutes}m ${remainingSeconds}s` : `${minutes}m`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
};

export const parseTimeString = (timeStr: string): Seconds | null => {
  const trimmed = timeStr.trim().toLowerCase();
  
  const mmssMatch = trimmed.match(/^(\d{1,2}):(\d{2})$/);
  if (mmssMatch) {
    const minutes = parseInt(mmssMatch[1]);
    const seconds = parseInt(mmssMatch[2]);
    return createSeconds(minutes * 60 + seconds);
  }
  
  const simpleMatch = trimmed.match(/^(\d+)([hms])$/);
  if (simpleMatch) {
    const value = parseInt(simpleMatch[1]);
    const unit = simpleMatch[2];
    
    switch (unit) {
      case 'h': return createSeconds(value * 3600);
      case 'm': return createSeconds(value * 60);
      case 's': return createSeconds(value);
    }
  }
  
  const complexMatch = trimmed.match(/(?:(\d+)h)?\s*(?:(\d+)m)?\s*(?:(\d+)s)?/);
  if (complexMatch) {
    const hours = parseInt(complexMatch[1] || '0');
    const minutes = parseInt(complexMatch[2] || '0');
    const seconds = parseInt(complexMatch[3] || '0');
    
    return createSeconds(hours * 3600 + minutes * 60 + seconds);
  }
  
  return null;
};

export const minutesToSeconds = (minutes: number): number => minutes * 60;
export const secondsToMinutes = (seconds: number): number => Math.round(seconds / 60);