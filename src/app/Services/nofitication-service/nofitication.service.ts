import { WeekDay } from '@angular/common';
import { Injectable } from '@angular/core';
import {LocalNotifications, ScheduleOptions,CancelOptions} from "@capacitor/local-notifications"
import { Preferences } from '@capacitor/preferences';
import { weeksToDays } from 'date-fns';
import { MedicineServiceService } from '../medicine-service/MedicineService.service';
@Injectable({
  providedIn: 'root'
})
export class NofiticationService {

  constructor(
    private medicineService: MedicineServiceService
  ) {}

  async scheduleNotification(dayOfWeek:number[],times:string[], namePres:string, idPres:string) {
    var Id = 0;
    var listScheduleIds: number[] = [];
    var newId = await Preferences.get({
      key: 'NEW_SCHEDULE_ID'
    });
    if(!newId.value){
      Id = 0;
     await Preferences.set({
       key: 'NEW_SCHEDULE_ID',
       value: Id.toString()
     });
    }
    else{
      Id = parseInt(newId.value);
    }
    dayOfWeek.forEach( day => {
        times.forEach(async time => {
          ++Id;
          listScheduleIds.push(Id);
         let date = new Date(time);
         let hours = date.getHours();
         let minutes = date.getMinutes();
          var op: ScheduleOptions = {
            notifications: [
             {
                id: Id,
                title: 'MedicineZ nhắc uống thuốc',
                body: `Bạn có lịch uống thuốc của đơn ${namePres} vào lúc ${hours}:${minutes}, hãy uống ngay! `,
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
    await Preferences.set({
      key: 'NEW_SCHEDULE_ID',
      value: Id.toString()
    });
   await this.medicineService.Prescription_AddScheduleId(listScheduleIds,idPres);
    const v = await LocalNotifications.getPending();
    console.log(v);

  }
  async CancelSchedule(id:number){
    var options:CancelOptions = {
      notifications: [{id:id}]
    }
    await LocalNotifications.cancel(options);
  }

}
