/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { GoogleFirebaseAuthService } from './google-firebase-auth.service';

describe('Service: GoogleFirebaseAuth', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GoogleFirebaseAuthService]
    });
  });

  it('should ...', inject([GoogleFirebaseAuthService], (service: GoogleFirebaseAuthService) => {
    expect(service).toBeTruthy();
  }));
});
