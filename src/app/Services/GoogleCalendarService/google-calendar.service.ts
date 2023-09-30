import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
declare var gapi: any;
@Injectable({
  providedIn: 'root'
})
export class GoogleCalendarService {

  constructor(private http: HttpClient) {
    this.initClient();
 }
  private initClient(){
   gapi.load('client',() => {
       console.log('load client');

       gapi.client.init({
        //  apiKey: "AIzaSyDQfcW6b833HEHU2yzcj5nSN6z1N9zC5WA",
        //  clientId:"328359127603-mq86l3909h5sft95nesfsqa7oful1063.apps.googleusercontent.com",
         discoveryDocs:["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"],
         scope: "https://www.googleapis.com/auth/calendar",
         plugin_name: "chat"
       });
       gapi.client.load('calendar','v3', () => console.log('load calendar'));

   });

 }
 async insertEvent() : Promise<boolean>{
// Set the access token in the gapi.client object
      var token = localStorage.getItem('ggtoken');
      gapi.client.setToken({
        access_token: token
      });
   const event:any = {
       'summary': 'vantuankiet',
       'description': 'A chance to hear more about Google\'s developer products.',
       'start': {
           'dateTime': '2023-12-28T09:00:00-07:00',
           'timeZone': 'America/Los_Angeles'
       },
       'end': {
           'dateTime': '2023-12-30T17:00:00-07:00',
           'timeZone': 'America/Los_Angeles'
       },
     };

     const request = gapi.client.calendar.events.insert({
     'calendarId': 'primary',
     'resource': event
     });

     request.execute((event:any) => {
       console.log(event);
       if(event){
           return true;
       }
       return false;
     });
     return false;
 }


}
