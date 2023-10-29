import { Injectable } from '@angular/core';
import { Plugins } from '@capacitor/core';

const { LocalNotifications } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class LocalNotificationsService {
  constructor() { }

  async scheduleNotification(title: string, body: string, id: number, schedule: number) {
    const notif = {
      title,
      body,
      id,
      ['schedule']: { at: new Date(schedule) }, // Truy cập 'schedule' bằng cách sử dụng ['schedule']
      sound: null,
      attachments: null
    };

    await LocalNotifications['schedule']({
      notifications: [notif]
    });
  }
}
