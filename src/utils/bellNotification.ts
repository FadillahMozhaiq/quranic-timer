import { NOTIFICATION_SOUNDS } from './constants';

class BellNotificationManager {
  private audio: HTMLAudioElement | null = null;
  private isRinging = false;
  private wakeLock: WakeLockSentinel | null = null;
  private hasUserInteracted = false;
  private audioContext: AudioContext | null = null;
  private currentNotification: Notification | null = null;

  constructor() {
    this.setupUserInteractionDetection();
  }

  private setupUserInteractionDetection(): void {
    const handleUserInteraction = () => {
      if (!this.hasUserInteracted) {
        this.hasUserInteracted = true;
        this.initializeAudioContext();
      }
    };

    ['click', 'keydown', 'touchstart'].forEach(event => {
      document.addEventListener(event, handleUserInteraction, { once: true, passive: true });
    });
  }

  private initializeAudioContext(): void {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (error) {
      console.warn('AudioContext initialization failed:', error);
    }
  }

  async startBell(): Promise<void> {
    if (this.isRinging) {
      return;
    }

    this.forceCleanup();

    if (!this.hasUserInteracted) {
      this.hasUserInteracted = true;
      this.initializeAudioContext();
    }

    try {
      if ('wakeLock' in navigator) {
        this.wakeLock = await navigator.wakeLock.request('screen');
      }

      this.audio = new Audio(NOTIFICATION_SOUNDS.bell);
      this.audio.loop = true;
      this.audio.volume = 1.0;
      
      this.audio.setAttribute('preload', 'auto');
      this.audio.setAttribute('crossorigin', 'anonymous');
      
      this.audio.addEventListener('error', this.handleAudioError);
      this.audio.addEventListener('ended', this.handleAudioEnded);
      
      let playSuccess = false;
      
      try {
        const playPromise = this.audio.play();
        if (playPromise !== undefined) {
          await playPromise;
          this.isRinging = true;
          playSuccess = true;
        }
      } catch (playError) {
        console.warn('Bell direct play failed:', playError);
      }
      
      if (!playSuccess) {
        try {
          this.audio.load();
          
          await new Promise((resolve, reject) => {
            const timeout = setTimeout(() => reject(new Error('Timeout')), 3000);
            this.audio!.addEventListener('canplay', () => {
              clearTimeout(timeout);
              resolve(void 0);
            }, { once: true });
          });
          
          const retryPromise = this.audio.play();
          if (retryPromise !== undefined) {
            await retryPromise;
            this.isRinging = true;
            playSuccess = true;
          }
        } catch (retryError) {
          console.warn('Bell load-retry approach failed:', retryError);
        }
      }
      
      if (!playSuccess && this.audioContext) {
        try {
          if (this.audioContext.state === 'suspended') {
            await this.audioContext.resume();
          }
          
          const retryPromise = this.audio.play();
          if (retryPromise !== undefined) {
            await retryPromise;
            this.isRinging = true;
            playSuccess = true;
          }
        } catch (contextError) {
          console.warn('Bell AudioContext approach failed:', contextError);
        }
      }

      if (!playSuccess) {
        console.error('All bell audio playback strategies failed');
        this.showFallbackNotification();
        return;
      }

      this.showPersistentNotification();

    } catch (error) {
      console.error('Error starting bell notification:', error);
      this.showFallbackNotification();
    }
  }

  stopBell(): void {
    try {
      if (this.audio) {
        this.audio.pause();
        this.audio.currentTime = 0;
        
        
        this.audio.removeEventListener('error', this.handleAudioError);
        this.audio.removeEventListener('ended', this.handleAudioEnded);
        this.audio.src = '';
        this.audio.load();
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
      this.forceCleanup();
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

  

  private forceCleanup(): void {
    if (this.audio) {
      try {
        this.audio.pause();
        this.audio.currentTime = 0;
        this.audio.removeEventListener('error', this.handleAudioError);
        this.audio.removeEventListener('ended', this.handleAudioEnded);
        this.audio.src = '';
        this.audio.load();
        this.audio = null;
        
      } catch (error) {
        console.warn('Error during force cleanup:', error);
        this.audio = null;
      }
    }

    if (this.wakeLock) {
      try {
        this.wakeLock.release();
        this.wakeLock = null;
      } catch (error) {
        console.warn('Error releasing wake lock during cleanup:', error);
      }
    }

    this.isRinging = false;
    this.closePersistentNotification();
  }

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
      this.currentNotification = new Notification('⏰ Timer Complete!', {
        body: 'Your timer session has ended. Tap to stop the bell.',
        icon: '/vite.svg',
        requireInteraction: true,
        silent: false,
        tag: 'quranic-timer-bell'
      });

      this.currentNotification.onclick = () => {
        this.stopBell();
        this.currentNotification?.close();
      };
    }
  }

  private closePersistentNotification(): void {
    if (this.currentNotification) {
      this.currentNotification.close();
      this.currentNotification = null;
    }
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