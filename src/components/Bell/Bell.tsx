import React from 'react';
import styles from './Bell.module.css';

interface BellProps {
  isRinging: boolean;
  onStop: () => void;
}

export const Bell: React.FC<BellProps> = ({ isRinging, onStop }) => {
  if (!isRinging) return null;

  return (
    <div className={styles.bellOverlay}>
      <div className={styles.bellContainer}>
        <div className={styles.bellIcon}>
          <svg
            width="80"
            height="80"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={styles.bellSvg}
          >
            <path
              d="M12 2C13.1 2 14 2.9 14 4C14 4.74 13.6 5.39 13 5.73V7C16.86 7.5 20 10.9 20 15V16L22 18V19H2V18L4 16V15C4 10.9 7.14 7.5 11 7V5.73C10.4 5.39 10 4.74 10 4C10 2.9 10.9 2 12 2ZM12 22C13.1 22 14 21.1 14 20H10C10 21.1 10.9 22 12 22Z"
              fill="currentColor"
            />
          </svg>
        </div>

        <div className={styles.pulseRing1}></div>
        <div className={styles.pulseRing2}></div>
        <div className={styles.pulseRing3}></div>

        <div className={styles.message}>
          <h2 className={styles.title}>⏰ Timer Complete!</h2>
          <p className={styles.subtitle}>Your timer session has ended</p>
        </div>

        <button
          className={styles.stopButton}
          onClick={onStop}
          aria-label="Stop bell notification"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect x="6" y="6" width="12" height="12" rx="2" fill="currentColor" />
          </svg>
          Stop Bell
        </button>

        <div className={styles.instructions}>
          <p>Press <kbd>Escape</kbd> or <kbd>Space</kbd> to stop</p>
        </div>
      </div>

      <div className={styles.flashBackground}></div>
    </div>
  );
};