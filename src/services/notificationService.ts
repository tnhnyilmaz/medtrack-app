import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configure notification handling
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});

// Request notification permissions
export const requestNotificationPermissions = async (): Promise<boolean> => {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
    }

    if (finalStatus !== 'granted') {
        console.log('Notification permissions not granted');
        return false;
    }

    // Set notification channel for Android
    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('medication-reminders', {
            name: 'İlaç Hatırlatıcıları',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#4CAF50',
            sound: 'default',
        });
    }

    return true;
};

// Schedule a medication reminder notification
export const scheduleMedicationNotification = async (
    medicineId: number,
    medicineName: string,
    scheduleTime: string, // Format: "HH:mm"
    scheduleType: 'daily' | 'weekly' | 'monthly' = 'daily',
    scheduleDays?: string[] // For weekly: ["monday", "wednesday"], for monthly: ["1", "15"]
): Promise<string[]> => {
    const [hours, minutes] = scheduleTime.split(':').map(Number);
    const notificationIds: string[] = [];

    try {
        if (scheduleType === 'daily') {
            // Schedule daily notification
            const id = await Notifications.scheduleNotificationAsync({
                content: {
                    title: '💊 İlaç Zamanı!',
                    body: `${medicineName} ilacınızı alma zamanı geldi.`,
                    data: { medicineId, scheduleTime },
                    sound: 'default',
                },
                trigger: {
                    type: Notifications.SchedulableTriggerInputTypes.DAILY,
                    hour: hours,
                    minute: minutes,
                },
            });
            notificationIds.push(id);
        } else if (scheduleType === 'weekly' && scheduleDays) {
            // Schedule for each selected weekday
            const weekdayMap: { [key: string]: number } = {
                sunday: 1,
                monday: 2,
                tuesday: 3,
                wednesday: 4,
                thursday: 5,
                friday: 6,
                saturday: 7,
            };

            for (const day of scheduleDays) {
                const weekday = weekdayMap[day.toLowerCase()];
                if (weekday) {
                    const id = await Notifications.scheduleNotificationAsync({
                        content: {
                            title: '💊 İlaç Zamanı!',
                            body: `${medicineName} ilacınızı alma zamanı geldi.`,
                            data: { medicineId, scheduleTime, day },
                            sound: 'default',
                        },
                        trigger: {
                            type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
                            weekday,
                            hour: hours,
                            minute: minutes,
                        },
                    });
                    notificationIds.push(id);
                }
            }
        } else if (scheduleType === 'monthly' && scheduleDays) {
            // For monthly, we schedule yearly triggers for each day of month
            // Note: Monthly repeating has limitations - using daily check approach
            for (const dayStr of scheduleDays) {
                const day = parseInt(dayStr, 10);
                if (day >= 1 && day <= 31) {
                    const id = await Notifications.scheduleNotificationAsync({
                        content: {
                            title: '💊 İlaç Zamanı!',
                            body: `${medicineName} ilacınızı alma zamanı geldi.`,
                            data: { medicineId, scheduleTime, monthDay: day },
                            sound: 'default',
                        },
                        trigger: {
                            type: Notifications.SchedulableTriggerInputTypes.MONTHLY,
                            day,
                            hour: hours,
                            minute: minutes,
                        },
                    });
                    notificationIds.push(id);
                }
            }
        }

        console.log(`Scheduled ${notificationIds.length} notifications for ${medicineName}`);
        return notificationIds;
    } catch (error) {
        console.error('Error scheduling notification:', error);
        return [];
    }
};

// Cancel all notifications for a specific medicine
export const cancelMedicineNotifications = async (medicineId: number): Promise<void> => {
    try {
        const allNotifications = await Notifications.getAllScheduledNotificationsAsync();

        for (const notification of allNotifications) {
            const data = notification.content.data as { medicineId?: number };
            if (data?.medicineId === medicineId) {
                await Notifications.cancelScheduledNotificationAsync(notification.identifier);
            }
        }

        console.log(`Cancelled notifications for medicine ${medicineId}`);
    } catch (error) {
        console.error('Error cancelling notifications:', error);
    }
};

// Cancel all medication notifications
export const cancelAllMedicationNotifications = async (): Promise<void> => {
    try {
        await Notifications.cancelAllScheduledNotificationsAsync();
        console.log('Cancelled all scheduled notifications');
    } catch (error) {
        console.error('Error cancelling all notifications:', error);
    }
};

// Get all scheduled notifications (for debugging)
export const getScheduledNotifications = async () => {
    return await Notifications.getAllScheduledNotificationsAsync();
};

// Schedule notifications for a medicine with all its schedules
export const scheduleMedicineReminders = async (
    medicineId: number,
    medicineName: string,
    schedules: string[], // Array of "HH:mm" times
    scheduleType: 'daily' | 'weekly' | 'monthly' = 'daily',
    scheduleDays?: string[]
): Promise<void> => {
    // First cancel any existing notifications for this medicine
    await cancelMedicineNotifications(medicineId);

    // Schedule new notifications for each time
    for (const time of schedules) {
        await scheduleMedicationNotification(
            medicineId,
            medicineName,
            time,
            scheduleType,
            scheduleDays
        );
    }
};
