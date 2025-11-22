export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications');
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

export const sendNotification = (title: string, options?: NotificationOptions) => {
  if (Notification.permission === 'granted') {
    const notification = new Notification(title, {
      icon: '/pwa-icon-192.png',
      badge: '/pwa-icon-192.png',
      ...options,
    });

    notification.onclick = () => {
      window.focus();
      notification.close();
    };

    return notification;
  }
  return null;
};

export const notifyNewInspection = (address: string, enabled: boolean = true) => {
  if (!enabled) return;
  sendNotification('New Inspection Scheduled', {
    body: `Property inspection scheduled at ${address}`,
    tag: 'inspection',
    requireInteraction: false,
  });
};

export const notifyInspectionUpdate = (address: string, message: string, enabled: boolean = true) => {
  if (!enabled) return;
  sendNotification('Inspection Update', {
    body: `${address}: ${message}`,
    tag: 'inspection-update',
    requireInteraction: false,
  });
};

export const notifyHighPriorityIssue = (issue: string, cost: number, enabled: boolean = true) => {
  if (!enabled) return;
  sendNotification('High Priority Issue Found', {
    body: `${issue} - Est. Cost: $${cost.toLocaleString()}`,
    tag: 'high-priority',
    requireInteraction: true,
  });
};
