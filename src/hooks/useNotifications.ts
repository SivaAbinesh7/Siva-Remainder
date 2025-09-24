import { useCallback } from 'react';

export const useNotifications = () => {
  const requestPermission = useCallback(async () => {
    if (!('Notification' in window)) {
      console.log('This browser does not support desktop notifications');
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }, []);

  const showNotification = useCallback(
    (title: string, options?: NotificationOptions) => {
      if (Notification.permission !== 'granted') {
        console.warn('Notification permission not granted');
        return;
      }

      new Notification(title, {
        icon: '/favicon.ico',
        ...options,
      });
    },
    []
  );

  return { requestPermission, showNotification };
};