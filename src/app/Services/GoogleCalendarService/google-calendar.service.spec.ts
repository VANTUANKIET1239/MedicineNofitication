/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { GoogleCalendarService } from './google-calendar.service';

describe('Service: GoogleCalendar', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GoogleCalendarService]
    });
  });

  it('should ...', inject([GoogleCalendarService], (service: GoogleCalendarService) => {
    expect(service).toBeTruthy();
  }));
});
