import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule, ModalController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AppointmentPage } from './appointment.page';
import { GetdataService } from '../Services/addApointment/addApointment.service';
import { AddAppointmentPage } from '../add-appointment/add-appointment.page';
import { EditAppointmentPage } from '../edit-appointment/edit-appointment.page';

describe('AppointmentPage', () => {
  let component: AppointmentPage;
  let fixture: ComponentFixture<AppointmentPage>;
  let getdataServiceSpy: jasmine.SpyObj<GetdataService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let modalControllerSpy: jasmine.SpyObj<ModalController>;
  let toastControllerSpy: jasmine.SpyObj<ToastController>;

  // Mock data for getListApoint
  const mockAppointmentData = [
    {
      name: 'John Doe',
      address: '123 Main St',
      phone: '555-1234',
      date: new Date(),
      doctor: 'Khoa 1',
    },
    // Add more mock appointment data as needed
  ];

  // Mock response for deleteApoint
  const mockDeleteResponse = { success: true }; // Or any response format you expect

  beforeEach(waitForAsync(() => {
    getdataServiceSpy = jasmine.createSpyObj('GetdataService', ['getListApoint', 'deleteApoint']);
    routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl', 'navigate']);
    modalControllerSpy = jasmine.createSpyObj('ModalController', ['create']);
    toastControllerSpy = jasmine.createSpyObj('ToastController', ['create']);

    TestBed.configureTestingModule({
      declarations: [AppointmentPage],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: GetdataService, useValue: getdataServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ModalController, useValue: modalControllerSpy },
        { provide: ToastController, useValue: toastControllerSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AppointmentPage);
    component = fixture.componentInstance;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('should open the AddAppointmentPage modal', async () => {
    // Simulate opening the AddAppointmentPage modal
    component.addAppointment();

    // Expect that create method of modalController was called with AddAppointmentPage component
    expect(modalControllerSpy.create).toHaveBeenCalledWith({
      component: AddAppointmentPage,
    });
  });

  it('should open the EditAppointmentPage modal with the correct data', async () => {
    // Simulate opening the EditAppointmentPage modal
    const appointmentToEdit = mockAppointmentData[0];
    component.editAppointment(appointmentToEdit);

    // Expect that create method of modalController was called with EditAppointmentPage component and correct data
    expect(modalControllerSpy.create).toHaveBeenCalledWith({
      component: EditAppointmentPage,
      componentProps: { idAp: appointmentToEdit },
    });
  });

  // Add more test cases as needed
});
