import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GoogleUser } from 'src/app/models/GoogleUser';
import { Prescription } from 'src/app/models/prescription';
import { format, getDate, parseISO, toDate } from 'date-fns';
import { MedicineServiceService } from '../medicine-service/MedicineService.service';
import { Preferences } from '@capacitor/preferences';

declare var gapi: any;

@Injectable({
  providedIn: 'root'
})
export class GoogleCalendarService {

  constructor(private http: HttpClient,
    private medicineService:MedicineServiceService

    ) {
    this.initClient();

 }
  private initClient(){
        gapi.load('client',() => {
          console.log('load client');
          gapi.client.init({
            apiKey: "AIzaSyDQfcW6b833HEHU2yzcj5nSN6z1N9zC5WA",
            clientId:"328359127603-mq86l3909h5sft95nesfsqa7oful1063.apps.googleusercontent.com",
            discoveryDocs:["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"],
            scope: "https://www.googleapis.com/auth/calendar",
            plugin_name: "chat"
          });
          gapi.client.load('calendar','v3', () => console.log('load calendar'));
      });
 }
  calculateDateDifference(startDate: Date, endDate: Date): number {
  const timeDifference = endDate.getTime() - startDate.getTime();
  const daysDifference = timeDifference / (1000 * 3600 * 24);
  return Math.abs(Math.round(daysDifference));
}
 async insertEvent(model:Prescription, idNewPres :any){
  var token = await Preferences.get({key: 'ggtoken'})
      gapi.client.setToken({
        access_token: token.value
      });
      var events:string[] = [];
    var Datedifference = this.calculateDateDifference(new Date(model.fromDate || ''), new Date(model.toDate || ''));
    var eventsPromise :any[]= [];
    for(var i = 0; i <= Datedifference; i++){
      model.time?.forEach(async x => {
        let endtimeDate = new Date(x);
        endtimeDate.setDate(endtimeDate.getDate() + i);
        let starttime = new Date(endtimeDate);
        endtimeDate.setMinutes(endtimeDate.getMinutes() + 10);
        let endtime = endtimeDate;
        const event:any = {
          'summary': 'Nhắc nhở uống thuốc MedicineZ',
          'description': `Bạn có một đơn thuốc cần uống vào lúc ${format(parseISO(x), 'HH:mm')}`,
          'start': {
              'dateTime': starttime.toISOString(),
              'timeZone': 'Asia/Ho_Chi_Minh'
          },
          'end': {
              'dateTime': endtime.toISOString(),
              'timeZone': 'Asia/Ho_Chi_Minh'
          },
        };

        const request = gapi.client.calendar.events.insert({
        'calendarId': 'primary',
        'resource': event
        });

       const eventPromise =  request.then((response : any) => {
          const eventId = response.result.id;
          events.push(eventId);
        })
        .catch((error: any) =>  {
          console.error('Error adding event:', error);
        });
        eventsPromise.push(eventPromise);
      });
      await Promise.all(eventsPromise);
    }
    await this.medicineService.Prescription_AddNewCalendarEventId(events,idNewPres);
 }
 async CheckLogin():Promise<GoogleUser>{
  var userR =  new GoogleUser();
  var token = await Preferences.get({key: 'ggtoken'})
    console.log(token);
    if(token){
     var Us = await Preferences.get({key: 'User'});
     console.log(Us);
      userR =  JSON.parse(Us.value || '');
      return userR;
    }
    return userR;
}
 async DeleteEvent(eventId:string){
  var token = await Preferences.get({key: 'ggtoken'})
      gapi.client.setToken({
        access_token: token.value
      });
      const request =  gapi.client.calendar.events.delete({
      calendarId: 'primary',
      eventId: eventId,
      sendUpdates:'all'
    });
    request.then((x : any) => {
          console.log(x);
    });
  }

}
