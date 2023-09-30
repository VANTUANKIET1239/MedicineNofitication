/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { MedicineServiceService } from './MedicineService.service';

describe('Service: MedicineService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MedicineServiceService]
    });
  });

  it('should ...', inject([MedicineServiceService], (service: MedicineServiceService) => {
    expect(service).toBeTruthy();
  }));
});
