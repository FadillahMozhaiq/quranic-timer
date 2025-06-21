import React, { useState } from 'react';
import { useSettingsContext } from '../../context/SettingsContext';
import { secondsToMinutes, minutesToSeconds } from '../../utils/timeFormat';
import styles from './Settings.module.css';

const SettingsIcon = () => <span style={{ fontSize: '18px' }}>⚙️</span>;
const CloseIcon = () => <span style={{ fontSize: '18px' }}>✕</span>;

interface SessionSettingsProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function SessionSettings({ isOpen = false, onClose }: SessionSettingsProps) {
  const { settings, updateTimerSettings, updateAudioSettings, updateUISettings } = useSettingsContext();
  const [showModal, setShowModal] = useState(isOpen);

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => {
    setShowModal(false);
    onClose?.();
  };

  const handleWorkDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const minutes = parseInt(e.target.value);
    updateTimerSettings({ workDuration: minutesToSeconds(minutes) });
  };

  const handleBreakDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const minutes = parseInt(e.target.value);
    updateTimerSettings({ breakDuration: minutesToSeconds(minutes) });
  };

  const handleAutoStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateTimerSettings({ autoStart: e.target.checked });
  };

  const handleNotificationsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateTimerSettings({ notifications: e.target.checked });
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateAudioSettings({ volume: parseInt(e.target.value) });
  };

  const handleAutoPlayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateAudioSettings({ autoPlay: e.target.checked });
  };

  const handleShowSecondsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateUISettings({ showSeconds: e.target.checked });
  };

  const handleCompactModeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateUISettings({ compactMode: e.target.checked });
  };

  if (!showModal) {
    return (
      <button
        className={styles.settingsButton}
        onClick={handleOpenModal}
        title="Settings"
        aria-label="Open settings"
      >
        <SettingsIcon />
      </button>
    );
  }

  return (
    <div className={styles.modalOverlay} onClick={handleCloseModal}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Settings</h2>
          <button
            className={styles.closeButton}
            onClick={handleCloseModal}
            aria-label="Close settings"
          >
            <CloseIcon />
          </button>
        </div>

        <div className={styles.settingsContent}>
          <section className={styles.settingsSection}>
            <h3 className={styles.sectionTitle}>Timer Settings</h3>
            
            <div className={styles.settingItem}>
              <label htmlFor="workDuration" className={styles.settingLabel}>
                Work Duration (minutes)
              </label>
              <input
                id="workDuration"
                type="number"
                min="1"
                max="60"
                value={secondsToMinutes(settings.preferences.timer.workDuration)}
                onChange={handleWorkDurationChange}
                className={styles.settingInput}
              />
            </div>

            <div className={styles.settingItem}>
              <label htmlFor="breakDuration" className={styles.settingLabel}>
                Break Duration (minutes)
              </label>
              <input
                id="breakDuration"
                type="number"
                min="1"
                max="30"
                value={secondsToMinutes(settings.preferences.timer.breakDuration)}
                onChange={handleBreakDurationChange}
                className={styles.settingInput}
              />
            </div>

            <div className={styles.settingItem}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={settings.preferences.timer.autoStart}
                  onChange={handleAutoStartChange}
                  className={styles.settingCheckbox}
                />
                Auto-start next session
              </label>
            </div>

            <div className={styles.settingItem}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={settings.preferences.timer.notifications}
                  onChange={handleNotificationsChange}
                  className={styles.settingCheckbox}
                />
                Enable notifications
              </label>
            </div>
          </section>

          <section className={styles.settingsSection}>
            <h3 className={styles.sectionTitle}>Audio Settings</h3>
            
            <div className={styles.settingItem}>
              <label htmlFor="volume" className={styles.settingLabel}>
                Volume ({settings.preferences.audio.volume}%)
              </label>
              <input
                id="volume"
                type="range"
                min="0"
                max="100"
                value={settings.preferences.audio.volume}
                onChange={handleVolumeChange}
                className={styles.settingSlider}
              />
            </div>

            <div className={styles.settingItem}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={settings.preferences.audio.autoPlay}
                  onChange={handleAutoPlayChange}
                  className={styles.settingCheckbox}
                />
                Auto-play background audio
              </label>
            </div>
          </section>

          <section className={styles.settingsSection}>
            <h3 className={styles.sectionTitle}>Display Settings</h3>
            
            <div className={styles.settingItem}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={settings.preferences.ui.showSeconds}
                  onChange={handleShowSecondsChange}
                  className={styles.settingCheckbox}
                />
                Show seconds in timer
              </label>
            </div>

            <div className={styles.settingItem}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={settings.preferences.ui.compactMode}
                  onChange={handleCompactModeChange}
                  className={styles.settingCheckbox}
                />
                Compact mode
              </label>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}