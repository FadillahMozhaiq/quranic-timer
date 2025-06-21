import { NOTIFICATION_SOUNDS } from './constants';

class BellNotificationManager {
  private audio: HTMLAudioElement | null = null;
  private isRinging = false;
  private wakeLock: WakeLockSentinel | null = null;

  async startBell(): Promise<void> {
    if (this.isRinging) return;

    try {
      if ('wakeLock' in navigator) {
        this.wakeLock = await navigator.wakeLock.request('screen');
      }

      this.audio = new Audio(NOTIFICATION_SOUNDS.bell);
      this.audio.loop = true;
      this.audio.volume = 1.0;
      
      if (this.audio.play) {
        this.audio.setAttribute('preload', 'auto');
        
        await this.audio.play();
        this.isRinging = true;

        this.audio.addEventListener('error', this.handleAudioError);
        this.audio.addEventListener('ended', this.handleAudioEnded);
      }

      this.showPersistentNotification();

    } catch (error) {
      console.error('Error starting bell notification:', error);
      this.showFallbackNotification();
    }
  }

  stopBell(): void {
    if (!this.isRinging) return;

    try {
      if (this.audio) {
        this.audio.pause();
        this.audio.currentTime = 0;
        this.audio.removeEventListener('error', this.handleAudioError);
        this.audio.removeEventListener('ended', this.handleAudioEnded);
        this.audio = null;
      }

      if (this.wakeLock) {
        this.wakeLock.release();
        this.wakeLock = null;
      }

      this.isRinging = false;

      this.closePersistentNotification();

    } catch (error) {
      console.error('Error stopping bell notification:', error);
    }
  }

  get isBellRinging(): boolean {
    return this.isRinging;
  }

  private handleAudioError = (): void => {
    console.warn('Bell audio error, attempting to restart...');
    if (this.isRinging) {
      setTimeout(() => {
        this.restartBell();
      }, 1000);
    }
  };

  private handleAudioEnded = (): void => {
    if (this.isRinging) {
      this.restartBell();
    }
  };

  private async restartBell(): Promise<void> {
    if (this.audio && this.isRinging) {
      try {
        this.audio.currentTime = 0;
        await this.audio.play();
      } catch (error) {
        console.error('Error restarting bell:', error);
      }
    }
  }

  private showPersistentNotification(): void {
    if ('Notification' in window && Notification.permission === 'granted') {
      const notification = new Notification('⏰ Timer Complete!', {
        body: 'Your timer session has ended. Tap to stop the bell.',
        icon: '/vite.svg',
        requireInteraction: true,
        silent: false,
        tag: 'quranic-timer-bell'
      });

      notification.onclick = () => {
        this.stopBell();
        notification.close();
      };
    }
  }

  private closePersistentNotification(): void {
  }

  private showFallbackNotification(): void {
    if ('Notification' in window && Notification.permission === 'granted') {
      const notification = new Notification('⏰ Timer Complete!', {
        body: 'Your timer session has ended. Audio notification failed.',
        icon: '/vite.svg',
        requireInteraction: true
      });

      notification.onclick = () => {
        this.stopBell();
        notification.close();
      };
    }
  }
}

export const bellNotificationManager = new BellNotificationManager();

export const requestBellPermissions = async (): Promise<boolean> => {
  try {
    if ('Notification' in window && Notification.permission === 'default') {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        console.warn('Notification permission denied');
        return false;
      }
    }

    return true;
  } catch (error) {
    console.error('Error requesting bell permissions:', error);
    return false;
  }
};