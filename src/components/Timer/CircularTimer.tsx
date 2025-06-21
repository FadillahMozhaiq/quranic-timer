import React from 'react';
import { formatTime, calculateProgress } from '../../utils/timeFormat';
import { useTimerContext } from '../../context/TimerContext';
import { useSettingsContext } from '../../context/SettingsContext';
import { createSeconds } from '../../types/branded';
import styles from './Timer.module.css';

interface CircularTimerProps {
  size?: number;
  strokeWidth?: number;
}

export function CircularTimer({ size = 300, strokeWidth = 8 }: CircularTimerProps) {
  const { currentTime, sessionType, isRunning } = useTimerContext();
  const { settings } = useSettingsContext();
  
  const totalTime = sessionType === 'work' 
    ? settings.preferences.timer.workDuration 
    : settings.preferences.timer.breakDuration;
  
  const progress = calculateProgress(createSeconds(currentTime), createSeconds(totalTime));
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className={`${styles.circularTimer} ${isRunning ? styles.active : ''}`}>
      <svg width={size} height={size} className={styles.timerSvg}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--color-background-secondary)"
          strokeWidth={strokeWidth}
          className={styles.backgroundCircle}
        />
        
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={sessionType === 'work' ? 'var(--color-primary-teal)' : 'var(--color-accent-gold)'}
          strokeWidth={strokeWidth}
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className={styles.progressCircle}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
        
        <defs>
          <pattern id="islamicPattern" patternUnits="userSpaceOnUse" width="40" height="40">
            <circle cx="10" cy="10" r="1" fill="var(--color-accent-gold)" opacity="0.1" />
            <circle cx="30" cy="30" r="1" fill="var(--color-primary-teal)" opacity="0.1" />
          </pattern>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius - strokeWidth}
          fill="url(#islamicPattern)"
          className={styles.patternOverlay}
        />
      </svg>
      
      <div className={styles.timeDisplay}>
        <div className={styles.timeText}>
          {formatTime(createSeconds(currentTime))}
        </div>
        <div className={styles.sessionType}>
          {sessionType === 'work' ? 'Focus Time' : 'Break Time'}
        </div>
      </div>
    </div>
  );
}