// ============================================================
// Siva's Reminder App — Service Worker
// Handles background hourly notifications via Periodic Sync
// ============================================================

const DB_NAME = 'siva-reminders-sw-db';
const STORE_NAME = 'reminders';
const SYNC_TAG = 'hourly-reminder';
const APP_URL = self.location.origin + '/Siva-Remainder/';

// ----- IndexedDB helpers -----

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = (e) => {
      e.target.result.createObjectStore(STORE_NAME, { keyPath: 'id' });
    };
    req.onsuccess = (e) => resolve(e.target.result);
    req.onerror = () => reject(req.error);
  });
}

async function getAllReminders() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const req = tx.objectStore(STORE_NAME).getAll();
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function putReminder(reminder) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const req = tx.objectStore(STORE_NAME).put(reminder);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

async function removeReminder(id) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const req = tx.objectStore(STORE_NAME).delete(id);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

async function patchReminder(id, updates) {
  const db = await openDB();
  const existing = await new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const req = tx.objectStore(STORE_NAME).get(id);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
  if (existing) {
    await putReminder({ ...existing, ...updates });
  }
}

// ----- Notification dispatcher -----

async function fireHourlyNotifications() {
  const reminders = await getAllReminders();
  const active = reminders.filter((r) => !r.completed);

  for (const reminder of active) {
    await self.registration.showNotification("Hi! It's from Siva's-reminder app 🌸", {
      body: `⏰ Do your reminder: "${reminder.text}"`,
      icon: APP_URL + 'favicon.ico',
      badge: APP_URL + 'favicon.ico',
      requireInteraction: true,
      tag: `siva-hourly-${reminder.id}`,
      renotify: true,
      data: { url: APP_URL, reminderId: reminder.id },
    });
  }
}

// ----- Lifecycle -----

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(self.clients.claim());
});

// ----- Periodic Background Sync (Chrome/Edge) -----

self.addEventListener('periodicsync', (e) => {
  if (e.tag === SYNC_TAG) {
    e.waitUntil(fireHourlyNotifications());
  }
});

// ----- Push messages from the main thread -----

self.addEventListener('message', async (e) => {
  const { type, reminder, id } = e.data || {};

  switch (type) {
    case 'ADD_REMINDER':
      await putReminder({ ...reminder, completed: false });
      break;

    case 'REMOVE_REMINDER':
      await removeReminder(id);
      break;

    case 'COMPLETE_REMINDER':
      await patchReminder(id, { completed: true });
      break;

    case 'UNCOMPLETE_REMINDER':
      await patchReminder(id, { completed: false });
      break;

    case 'SYNC_ALL':
      // Full refresh: overwrite store with provided list
      if (Array.isArray(e.data.todos)) {
        const db = await openDB();
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        store.clear();
        e.data.todos.forEach((t) => store.put(t));
      }
      break;

    default:
      break;
  }
});

// ----- Notification click: open/focus the app -----

self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  const url = e.notification.data?.url || APP_URL;

  e.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((list) => {
      for (const client of list) {
        if (client.url.startsWith(self.location.origin) && 'focus' in client) {
          return client.focus();
        }
      }
      return self.clients.openWindow(url);
    })
  );
});
