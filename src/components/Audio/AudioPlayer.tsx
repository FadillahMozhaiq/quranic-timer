import React from 'react';
import { useAudioContext } from '../../context/AudioContext';
import styles from './Audio.module.css';

const PlayIcon = () => <span style={{ fontSize: '16px' }}>▶</span>;
const PauseIcon = () => <span style={{ fontSize: '16px' }}>⏸</span>;
const LoadingIcon = () => <span style={{ fontSize: '16px', animation: 'spin 1s linear infinite' }}>⟳</span>;
const SkipBackIcon = () => <span style={{ fontSize: '14px' }}>⏮</span>;
const SkipForwardIcon = () => <span style={{ fontSize: '14px' }}>⏭</span>;
const VolumeIcon = () => <span style={{ fontSize: '14px' }}>🔊</span>;
const VolumeMutedIcon = () => <span style={{ fontSize: '14px' }}>🔇</span>;

export function AudioPlayer() {
  const {
    isPlaying,
    volume,
    isMuted,
    currentTrack,
    isLoading,
    isYouTubePlayerReady,
    togglePlayPause,
    setVolume,
    toggleMute,
    nextTrack,
    previousTrack
  } = useAudioContext();

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(parseInt(e.target.value));
  };

  return (
    <div className={styles.audioPlayer}>
      <div className={styles.trackInfo}>
        {currentTrack ? (
          <>
            <div className={styles.trackTitle}>
              {currentTrack.title}
              {isLoading && <span className={styles.loadingIndicator}> (Loading...)</span>}
            </div>
            {(currentTrack.reciter || currentTrack.source) && (
              <div className={styles.trackCredit}>
                {currentTrack.reciter && `Recited by ${currentTrack.reciter}`}
                {currentTrack.source && currentTrack.reciter && ' • '}
                {currentTrack.source && `Source: ${currentTrack.source}`}
                {currentTrack.source === 'YouTube' && !isYouTubePlayerReady && (
                  <span className={styles.playerStatus}> (Initializing player...)</span>
                )}
              </div>
            )}
            <div className={styles.trackDuration}>
              {Math.floor(currentTrack.duration / 60)}:{(currentTrack.duration % 60).toString().padStart(2, '0')}
            </div>
          </>
        ) : (
          <div className={styles.noTrack}>No track selected</div>
        )}
      </div>

      <div className={styles.audioControls}>
        <button
          className={styles.controlBtn}
          onClick={previousTrack}
          title="Previous Track"
          aria-label="Previous track"
        >
          <SkipBackIcon />
        </button>

        <button
          className={`${styles.controlBtn} ${styles.playPauseBtn} ${isLoading ? styles.loading : ''}`}
          onClick={togglePlayPause}
          disabled={isLoading}
          title={isLoading ? 'Loading...' : (isPlaying ? 'Pause' : 'Play')}
          aria-label={isLoading ? 'Loading...' : (isPlaying ? 'Pause' : 'Play')}
        >
          {isLoading ? <LoadingIcon /> : (isPlaying ? <PauseIcon /> : <PlayIcon />)}
        </button>

        <button
          className={styles.controlBtn}
          onClick={nextTrack}
          title="Next Track"
          aria-label="Next track"
        >
          <SkipForwardIcon />
        </button>
      </div>

      <div className={styles.volumeControl}>
        <button
          className={styles.volumeBtn}
          onClick={toggleMute}
          title={isMuted ? 'Unmute' : 'Mute'}
          aria-label={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? <VolumeMutedIcon /> : <VolumeIcon />}
        </button>

        <div className={styles.volumeSliderContainer}>
          <input
            type="range"
            min="0"
            max="100"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className={styles.volumeSlider}
            title={`Volume: ${volume}%`}
            aria-label="Volume control"
          />
          <div className={styles.volumeValue}>{isMuted ? 0 : volume}%</div>
        </div>
      </div>
    </div>
  );
}