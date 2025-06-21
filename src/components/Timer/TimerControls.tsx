import React from 'react';
import { useTimerContext } from '../../context/TimerContext';
import styles from './Timer.module.css';

const PlayIcon = () => <span style={{ fontSize: '20px' }}>▶</span>;
const PauseIcon = () => <span style={{ fontSize: '20px' }}>⏸</span>;
const ResetIcon = () => <span style={{ fontSize: '18px' }}>↻</span>;

export function TimerControls() {
  const {
    isRunning,
    isPaused,
    toggleTimer,
    resetTimer
  } = useTimerContext();

  const getPlayPauseIcon = () => {
    if (isRunning) {
      return <PauseIcon />;
    }
    return <PlayIcon />;
  };

  const getPlayPauseLabel = () => {
    if (isRunning) return 'Pause';
    if (isPaused) return 'Resume';
    return 'Start';
  };

  return (
    <div className={styles.timerControls}>
      <button
        className={`${styles.controlButton} ${styles.secondary}`}
        onClick={resetTimer}
        title="Reset Timer (R)"
        aria-label="Reset timer"
      >
        <ResetIcon />
      </button>
      
      <button
        className={`${styles.controlButton} ${styles.primary}`}
        onClick={toggleTimer}
        title={`${getPlayPauseLabel()} (Space)`}
        aria-label={getPlayPauseLabel()}
      >
        {getPlayPauseIcon()}
      </button>
    </div>
  );
}