// Service Worker registration & messaging helper

const SW_PATH = '/Siva-Remainder/sw.js';
const SW_SCOPE = '/Siva-Remainder/';
const SYNC_TAG = 'hourly-reminder';

/**
 * Register the Service Worker and set up Periodic Background Sync (Chrome/Edge).
 * Safe to call multiple times — will skip if already registered.
 */
export const registerServiceWorker = async (): Promise<ServiceWorkerRegistration | null> => {
  if (!('serviceWorker' in navigator)) {
    console.warn('[SW] Service Workers not supported in this browser.');
    return null;
  }

  try {
    const reg = await navigator.serviceWorker.register(SW_PATH, { scope: SW_SCOPE });
    console.log('[SW] Registered successfully, scope:', reg.scope);

    // Periodic Background Sync — Chrome/Edge only
    if ('periodicSync' in reg) {
      try {
        const permStatus = await navigator.permissions.query({
          name: 'periodic-background-sync' as PermissionName,
        });

        if (permStatus.state === 'granted') {
          await (reg as any).periodicSync.register(SYNC_TAG, {
            minInterval: 60 * 60 * 1000, // 1 hour in ms
          });
          console.log('[SW] Periodic background sync registered (1-hour interval).');
        } else {
          console.log('[SW] Periodic sync permission not granted. Notifications only work while app is open.');
        }
      } catch (syncErr) {
        console.log('[SW] Periodic sync setup failed (not supported):', syncErr);
      }
    }

    return reg;
  } catch (err) {
    console.error('[SW] Registration failed:', err);
    return null;
  }
};

/**
 * Send a typed message to the active Service Worker controller.
 */
export const sendSWMessage = (message: Record<string, unknown>): void => {
  if (!('serviceWorker' in navigator) || !navigator.serviceWorker.controller) return;
  navigator.serviceWorker.controller.postMessage(message);
};

/**
 * Wait for the SW to be active, then send the message.
 * Useful right after first registration when controller isn't yet set.
 */
export const sendSWMessageWhenReady = async (message: Record<string, unknown>): Promise<void> => {
  if (!('serviceWorker' in navigator)) return;

  const reg = await navigator.serviceWorker.ready;
  const sw = reg.active;
  if (sw) {
    sw.postMessage(message);
  }
};
