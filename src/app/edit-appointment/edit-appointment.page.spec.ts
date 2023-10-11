import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { EditAppointmentPage } from './edit-appointment.page';

describe('EditAppointmentPage', () => {
  let component: EditAppointmentPage;
  let fixture: ComponentFixture<EditAppointmentPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(EditAppointmentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
