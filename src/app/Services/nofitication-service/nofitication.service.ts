import { WeekDay } from '@angular/common';
import { Injectable } from '@angular/core';
import {LocalNotifications, ScheduleOptions,CancelOptions} from "@capacitor/local-notifications"
import { Preferences } from '@capacitor/preferences';
import { weeksToDays } from 'date-fns';
@Injectable({
  providedIn: 'root'
})
export class NofiticationService {

  constructor() {}

  async scheduleNotification(message: string, dayOfWeek:number[],times:string[], namePres:string) {

    var Id:number;
    dayOfWeek.forEach( day => {
        times.forEach(async time => {
          var newId = await Preferences.get({
            key: 'NEW_SCHEDULE_ID'
          });
          if(!newId){
            Id = 0;
           await Preferences.set({
             key: 'NEW_SCHEDULE_ID',
             value: Id.toString()
           });
         }
         else{
            Id = parseInt(newId.value || '') || 0;
            await Preferences.set({
             key: 'NEW_SCHEDULE_ID',
             value: (Id + 1).toString()
           });
         }
         let date = new Date(time);
         let hours = date.getHours();
         let minutes = date.getMinutes();
          var op: ScheduleOptions = {
            notifications: [
             {
                id: Id,
                title: 'MedicineZ nhắc uống thuốc',
                body: `Bạn có lịch uống thuốc của đơn ${namePres} vào lúc `,
                schedule:
                {
                  on: {weekday: day, hour: hours, minute :minutes},
                }
             },
            ]
          }
          try{
           const result =  await LocalNotifications.schedule(op);
           console.log(result);
          }
          catch(e){
            console.log(e);
          }
        });
    });

  }
  async CancelSchedule(id:number){
    var options:CancelOptions = {
      notifications: [{id:id}]
    }
    await LocalNotifications.cancel(options);
  }

}
