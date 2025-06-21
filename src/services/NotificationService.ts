import {
  NotificationPermissionError, 
  NotificationError,
  createErrorHandler,
  isAppError
} from '../types';

export interface NotificationConfig {
  title: string;
  body?: string;
  icon?: string;
  badge?: string;
  tag?: string;
  requireInteraction?: boolean;
  silent?: boolean;
}

export interface NotificationServiceConfig {
  defaultIcon?: string;
  defaultBadge?: string;
  onPermissionDenied?: () => void;
  onNotificationClick?: (notification: Notification) => void;
  onError?: (error: NotificationError) => void;
}

export class NotificationService {
  private errorHandler = createErrorHandler('NOTIFICATION');
  private isSupported: boolean;

  constructor(private config: NotificationServiceConfig = {}) {
    this.isSupported = 'Notification' in window;
  }

  isNotificationSupported(): boolean {
    return this.isSupported;
  }

  getPermissionStatus(): NotificationPermission {
    if (!this.isSupported) {
      return 'denied';
    }
    return Notification.permission;
  }

  async requestPermission(): Promise<NotificationPermission> {
    if (!this.isSupported) {
      const error = new NotificationError('Notifications not supported');
      this.errorHandler(error);
      throw error;
    }

    if (Notification.permission === 'granted') {
      return 'granted';
    }

    try {
      const permission = await Notification.requestPermission();
      
      if (permission === 'denied') {
        const error = new NotificationPermissionError();
        this.config.onPermissionDenied?.();
        throw error;
      }

      return permission;
    } catch (error) {
      const notificationError = new NotificationError(
        'Failed to request permission',
        error as Error
      );
      this.errorHandler(notificationError);
      throw notificationError;
    }
  }

  async showNotification(config: NotificationConfig): Promise<Notification | null> {
    try {
      if (!this.isSupported) {
        console.warn('Notifications not supported, falling back to console log');
        console.log(`Notification: ${config.title}${config.body ? ` - ${config.body}` : ''}`);
        return null;
      }

      const permission = this.getPermissionStatus();
      if (permission === 'denied') {
        console.warn('Notification permission denied, falling back to console log');
        console.log(`Notification: ${config.title}${config.body ? ` - ${config.body}` : ''}`);
        return null;
      }

      if (permission === 'default') {
        await this.requestPermission();
      }

      const options: NotificationOptions = {
        body: config.body,
        icon: config.icon || this.config.defaultIcon,
        badge: config.badge || this.config.defaultBadge,
        tag: config.tag,
        requireInteraction: config.requireInteraction,
        silent: config.silent
      };

      const notification = new Notification(config.title, options);

      if (this.config.onNotificationClick) {
        notification.onclick = () => {
          this.config.onNotificationClick!(notification);
        };
      }

      if (!config.requireInteraction) {
        setTimeout(() => {
          notification.close();
        }, 5000);
      }

      return notification;

    } catch (error) {
      if (isAppError(error)) {
        this.config.onError?.(error as NotificationError);
        throw error;
      }

      const notificationError = new NotificationError(
        'Failed to show notification',
        error as Error
      );
      this.errorHandler(notificationError);
      this.config.onError?.(notificationError);
      
      console.log(`Notification: ${config.title}${config.body ? ` - ${config.body}` : ''}`);
      
      return null;
    }
  }

  async showSessionComplete(sessionType: 'work' | 'break'): Promise<Notification | null> {
    const isWorkSession = sessionType === 'work';
    
    return this.showNotification({
      title: isWorkSession ? 'Work Session Complete!' : 'Break Session Complete!',
      body: isWorkSession 
        ? 'Time for a well-deserved break. May Allah bless your efforts.' 
        : 'Break time is over. Ready to continue with focus and intention?',
      icon: '/vite.svg',
      tag: `session-${sessionType}`,
      requireInteraction: false
    });
  }

  async showTimerStarted(sessionType: 'work' | 'break', duration: number): Promise<Notification | null> {
    const minutes = Math.floor(duration / 60);
    const isWorkSession = sessionType === 'work';
    
    return this.showNotification({
      title: isWorkSession ? 'Work Session Started' : 'Break Session Started',
      body: `${minutes} minute ${sessionType} session has begun. Stay focused and mindful.`,
      icon: '/vite.svg',
      tag: `timer-start-${sessionType}`,
      silent: true
    });
  }

  clearNotifications(tag?: string): void {
    console.debug(`Clearing notifications${tag ? ` with tag: ${tag}` : ''}`);
  }
}