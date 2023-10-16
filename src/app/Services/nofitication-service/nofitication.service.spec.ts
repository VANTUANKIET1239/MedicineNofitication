/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { NofiticationService } from './nofitication.service';

describe('Service: Nofitication', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NofiticationService]
    });
  });

  it('should ...', inject([NofiticationService], (service: NofiticationService) => {
    expect(service).toBeTruthy();
  }));
});
