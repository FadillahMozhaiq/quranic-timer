import React from 'react';
import { useTimerContext } from '../../context/TimerContext';
import styles from './ModeSelector.module.css';

export function ModeSelector() {
  const { sessionType, switchSession } = useTimerContext();

  const handleModeSwitch = (mode: 'work' | 'break') => {
    if (mode !== sessionType) {
      switchSession(mode);
    }
  };

  return (
    <div className={styles.modeSelector} role="tablist" aria-label="Timer mode selection">
      <button
        className={`${styles.modeTab} ${sessionType === 'work' ? styles.active : ''}`}
        onClick={() => handleModeSwitch('work')}
        role="tab"
        aria-selected={sessionType === 'work'}
        aria-controls="timer-content"
        id="work-tab"
        type="button"
      >
        <span className={styles.tabIcon}>🍅</span>
        <span className={styles.tabLabel}>Pomodoro</span>
      </button>
      
      <button
        className={`${styles.modeTab} ${sessionType === 'break' ? styles.active : ''}`}
        onClick={() => handleModeSwitch('break')}
        role="tab"
        aria-selected={sessionType === 'break'}
        aria-controls="timer-content"
        id="break-tab"
        type="button"
      >
        <span className={styles.tabIcon}>☕</span>
        <span className={styles.tabLabel}>Break</span>
      </button>
    </div>
  );
}