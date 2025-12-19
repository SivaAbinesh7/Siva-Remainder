export interface Todo {
    id: string;
    text: string;
    completed: boolean;
    dueDate?: Date;
    reminderTime?: number; // minutes before due to remind
    notified?: boolean;
}

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
            tag: 'siva-reminder',
            requireInteraction: true,
        });

        // Vibrate if supported and requested
        if (vibrate && 'vibrate' in navigator) {
            navigator.vibrate([200, 100, 200, 100, 200]); // Vibrate pattern
        }

        // Play notification sound
        try {
            const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIFWm98OScTgwOUKvk8bllHAU2j9n0ynUrBSF0yO/gllkOClSm5O+uYBsBLIHO8tmJNggVabvt559NEAxPqOPwtmMcBjiP2fPKdSsFJHXI8N+RQAoUXLPq66hVFApGnt/yvmwhBSuBzvLZiTYIFWm98OScTgwOUKvk8bllHAU2j9n0ynUrBSF0yO/gllkOClSm5O+uYBsBLIHO8tmJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwGJHfH8N2RQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIFWm98OScTgwOUKvk8bllHAU2j9n0ynUrBSF0yO/gllkOClSm5O+uYBsBLIHO8tmJNwgZaLvt559MEAxQp+PwtmMcBjiR1/LMeSwGJHfH8N2RQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIFWm98OScTgwOUKvk8bllHAU2j9n0ynUrBSF0yO/gllkOClSm5O+uYBsBLIHO8tmJNggVabvt559NEAxPqOPwtmMcBjiP2fPKdSsFJHXI8N+RQAoUXLPq66hVFApGnt/yvmwhBSuBzvLZiTYIFWm98OScTgwOUKvk8bllHAU2j9n0ynUrBSF0yO/gllkOClSm5O+uYBsBLIHO8tmJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwGJHfH8N2RQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIFWm98OScTgwOUKvk8bllHAU2j9n0ynUrBSF0yO/gllkOClSm5O+uYBsBLIHO8tmJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwGJHfH8N2RQAoUXrTp66hVFApGn+DyvmwhBSuBzvLYiTYIFWm98OScTgwOUKvk8bllHAU2j9n0ynUrBSF0yO/gllkOClSm5O+uYBsBLIHO8tmJNggVabvt559NEAxPqOPwtmMcBjiP2fPKdSsGJHXI8N+RQAoUXLPq66hVFApGnt/yvmwhBSuBzvLZiTYIFWm98OScTgwOUKvk8bllHAU2j9n0ynUrBSF0yO/gllkOClSm5e+uYBsBLIHO8tmJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwGJHfH79yRQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIFWm98OScTgwOUKvk8bllHAU2j9n0ynUrBSF0yO/gllkOClSm5O+uYBsBLIHO8tmJNwgZaLvt559NEA');
            audio.play().catch(() => { });
        } catch (e) {
            // Audio not supported, ignore
        }

        notification.onclick = () => {
            window.focus();
            notification.close();
        };

        return notification;
    }
    return null;
};

export const checkReminders = (todos: Todo[], onUpdate: (id: string, updates: Partial<Todo>) => void) => {
    const now = new Date();

    todos.forEach(todo => {
        if (todo.completed || todo.notified || !todo.dueDate) return;

        const dueTime = new Date(todo.dueDate).getTime();
        const currentTime = now.getTime();
        const reminderTime = todo.reminderTime || 5; // Default 5 minutes before

        const timeUntilDue = dueTime - currentTime;
        const reminderThreshold = reminderTime * 60 * 1000; // Convert to milliseconds

        // Check if we should send notification
        if (timeUntilDue <= reminderThreshold && timeUntilDue > 0) {
            const minutesLeft = Math.ceil(timeUntilDue / 60000);
            sendNotification(
                '⏰ Reminder Alert!',
                `"${todo.text}" is due in ${minutesLeft} minute${minutesLeft !== 1 ? 's' : ''}!`,
                true
            );
            onUpdate(todo.id, { notified: true });
        }
        // Check if past due
        else if (timeUntilDue <= 0 && timeUntilDue > -60000) { // Within 1 minute of being overdue
            sendNotification(
                '🚨 Reminder Overdue!',
                `"${todo.text}" is now overdue!`,
                true
            );
            onUpdate(todo.id, { notified: true });
        }
    });
};
