import { NOTIFICATION_SOUNDS } from './constants';
import { NotificationService } from '../services';

const notificationService = new NotificationService({
  defaultIcon: '/vite.svg'
});

export const playNotificationSound = (type: keyof typeof NOTIFICATION_SOUNDS): void => {
  try {
    const audio = new Audio(NOTIFICATION_SOUNDS[type]);
    audio.volume = 0.3;
    audio.play().catch(console.error);
  } catch (error) {
    console.error('Error playing notification sound:', error);
  }
};

export const showNotification = async (title: string, body: string, icon?: string): Promise<void> => {
  try {
    await notificationService.showNotification({
      title,
      body,
      icon: icon || '/vite.svg'
    });
  } catch (error) {
    console.warn('Notification failed, falling back to console log:', error);
  }
};

export const requestNotificationPermission = async (): Promise<NotificationPermission> => {
  try {
    return await notificationService.requestPermission();
  } catch (error) {
    console.error('Failed to request notification permission:', error);
    return 'denied';
  }
};

export const canShowNotifications = (): boolean => {
  return notificationService.isNotificationSupported() &&
         notificationService.getPermissionStatus() === 'granted';
};

export const notify = async (
  title: string,
  body: string,
  soundType: keyof typeof NOTIFICATION_SOUNDS = 'sessionComplete'
): Promise<void> => {
  playNotificationSound(soundType);
  await showNotification(title, body);
};

export { notificationService };