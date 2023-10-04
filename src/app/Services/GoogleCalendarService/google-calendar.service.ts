import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GoogleUser } from 'src/app/models/GoogleUser';
import { Prescription } from 'src/app/models/prescription';
declare var gapi: any;
@Injectable({
  providedIn: 'root'
})
export class GoogleCalendarService {

  constructor(private http: HttpClient) {
    this.initClient();

 }
  private initClient(){
    var token = localStorage.getItem('ggtoken');
    if(token){
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

      console.log(token);
        if(!gapi.auth2.getAuthInstance().isSignedIn.get()){
            gapi.client.setToken({
              access_token: token
            });
        }
      }
 }
  calculateDateDifference(startDate: Date, endDate: Date): number {

  const timeDifference = endDate.getTime() - startDate.getTime();

  const daysDifference = timeDifference / (1000 * 3600 * 24);
  return Math.abs(Math.round(daysDifference));
}
 async insertEvent(model:Prescription){
// Set the access token in the gapi.client object
    var Datedifference = this.calculateDateDifference(new Date(model.fromDate || ''), new Date(model.toDate || ''));
    for(let i = 0; i <= Datedifference; i++){
      const startDate = new Date(model.fromDate || '');
      startDate.setDate(startDate.getDate() + i); // Increment the day
      const endDate = new Date(model.toDate || '');
      endDate.setDate(endDate.getDate() + i); // Increment the day
    }
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
 CheckLogin(): GoogleUser | null{
  const check = gapi.auth2.getAuthInstance().isSignedIn.get();
  console.log(check);
  if(check){
    var profile = gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile();
    console.log(profile);
    return new GoogleUser(profile.getName(),profile.getEmail(), profile.getImageUrl(), profile.getId());
  }
  return null;
}

}
