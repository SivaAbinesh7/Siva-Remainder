export interface Todo {
    id: string;
    text: string;
    completed: boolean;
    dueDate?: Date;
    reminderTime?: number; // minutes before due to remind
    notified?: boolean;
}

// Map to track active hourly interval IDs per todo
const hourlyIntervals: Map<string, ReturnType<typeof setInterval>> = new Map();

export const requestNotificationPermission = async (): Promise<boolean> => {
    if (!('Notification' in window)) {
        console.log('Browser does not support notifications');
        return false;
    }

    if (Notification.permission === 'granted') {
        return true;
    }

    if (Notification.permission !== 'denied') {
        const permission = await Notification.requestPermission();
        return permission === 'granted';
    }

    return false;
};

export const sendNotification = (title: string, body: string, vibrate = true) => {
    if (Notification.permission === 'granted') {
        const notification = new Notification(title, {
            body,
            icon: '/favicon.ico',
            badge: '/favicon.ico',
            tag: `siva-reminder-${Date.now()}`,
            requireInteraction: true,
        });

        // Vibrate if supported
        if (vibrate && 'vibrate' in navigator) {
            navigator.vibrate([200, 100, 200, 100, 200]);
        }

        notification.onclick = () => {
            window.focus();
            notification.close();
        };

        return notification;
    }
    return null;
};

/**
 * Start sending an hourly reminder notification for a specific todo.
 * Fires immediately once, then every 1 hour until stopped.
 */
export const startHourlyReminder = (todo: Todo) => {
    // Don't start if already running for this todo
    if (hourlyIntervals.has(todo.id)) return;

    const fireNotification = () => {
        sendNotification(
            "Hi! It's from Siva's-reminder app 🌸",
            `⏰ Do your reminder: "${todo.text}"`,
            true
        );
    };

    // Fire immediately on add
    fireNotification();

    // Then repeat every 1 hour (3600000 ms)
    const intervalId = setInterval(fireNotification, 60 * 60 * 1000);
    hourlyIntervals.set(todo.id, intervalId);
};

/**
 * Stop the hourly reminder for a specific todo (on complete or delete).
 */
export const stopHourlyReminder = (todoId: string) => {
    const intervalId = hourlyIntervals.get(todoId);
    if (intervalId !== undefined) {
        clearInterval(intervalId);
        hourlyIntervals.delete(todoId);
    }
};

/**
 * Stop ALL active hourly reminders (e.g., on page unload).
 */
export const stopAllHourlyReminders = () => {
    hourlyIntervals.forEach((id) => clearInterval(id));
    hourlyIntervals.clear();
};

/**
 * Restart hourly reminders for all incomplete todos on page reload.
 */
export const restoreHourlyReminders = (todos: Todo[]) => {
    todos.forEach(todo => {
        if (!todo.completed) {
            startHourlyReminder(todo);
        }
    });
};

export const checkReminders = (todos: Todo[], onUpdate: (id: string, updates: Partial<Todo>) => void) => {
    const now = new Date();

    todos.forEach(todo => {
        if (todo.completed || todo.notified || !todo.dueDate) return;

        const dueTime = new Date(todo.dueDate).getTime();
        const currentTime = now.getTime();
        const reminderTime = todo.reminderTime || 5;

        const timeUntilDue = dueTime - currentTime;
        const reminderThreshold = reminderTime * 60 * 1000;

        if (timeUntilDue <= reminderThreshold && timeUntilDue > 0) {
            const minutesLeft = Math.ceil(timeUntilDue / 60000);
            sendNotification(
                '⏰ Reminder Alert!',
                `"${todo.text}" is due in ${minutesLeft} minute${minutesLeft !== 1 ? 's' : ''}!`,
                true
            );
            onUpdate(todo.id, { notified: true });
        } else if (timeUntilDue <= 0 && timeUntilDue > -60000) {
            sendNotification(
                '🚨 Reminder Overdue!',
                `"${todo.text}" is now overdue!`,
                true
            );
            onUpdate(todo.id, { notified: true });
        }
    });
};
