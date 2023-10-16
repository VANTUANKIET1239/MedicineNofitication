import { Injectable } from '@angular/core';
import {LocalNotifications, ScheduleOptions} from "@capacitor/local-notifications"

@Injectable({
  providedIn: 'root'
})
export class NofiticationService {

  constructor() {}

  // scheduleNotification(dateTime: Date, message: string) {
  //   this.localNotifications.schedule({
  //     id: 1,
  //     title: 'Scheduled Notification',
  //     text: message,
  //     trigger: { at: dateTime },
  //   });
  //   var op: scheduleio
  // }

}
