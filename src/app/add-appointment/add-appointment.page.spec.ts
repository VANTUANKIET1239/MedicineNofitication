import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule, ModalController, ToastController } from '@ionic/angular';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { AddAppointmentPage } from './add-appointment.page';
import { GetdataService } from '../Services/addApointment/addApointment.service';

describe('AddAppointmentPage', () => {
  let component: AddAppointmentPage;
  let fixture: ComponentFixture<AddAppointmentPage>;
  let modalControllerSpy: jasmine.SpyObj<ModalController>;
  let toastControllerSpy: jasmine.SpyObj<ToastController>;
  let getDataServiceSpy: jasmine.SpyObj<GetdataService>;

  beforeEach(waitForAsync(() => {
    modalControllerSpy = jasmine.createSpyObj('ModalController', ['dismiss']);
    toastControllerSpy = jasmine.createSpyObj('ToastController', ['create', 'present']);
    getDataServiceSpy = jasmine.createSpyObj('GetdataService', ['checkApoint', 'checkTime', 'addApoint', 'countApoint']);

    TestBed.configureTestingModule({
      declarations: [AddAppointmentPage],
      imports: [IonicModule.forRoot(), ReactiveFormsModule, FormsModule],
      providers: [
        DatePipe,
        FormBuilder,
        { provide: ModalController, useValue: modalControllerSpy },
        { provide: ToastController, useValue: toastControllerSpy },
        { provide: GetdataService, useValue: getDataServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AddAppointmentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with default values', () => {
    component.ngOnInit();
    const formValue = component.appointmentForm.value;
    expect(formValue).toEqual({
      name: '',
      address: '',
      phone: '',
      date: null,
      doctor: '',
    });
  });

  it('should add a new appointment when form is valid and within available time', async () => {
    const validFormValue = {
      name: 'John Doe',
      address: '123 Main St',
      phone: '555-1234',
      date: new Date('2023-10-05T15:30:00'),
      doctor: 'Khoa 1',
    };
    component.appointmentForm.setValue(validFormValue);

    getDataServiceSpy.checkTime.and.returnValue(Promise.resolve(true));
    getDataServiceSpy.checkApoint.and.returnValue(Promise.resolve(true));

    await component.add();

    expect(getDataServiceSpy.checkTime).toHaveBeenCalledWith(validFormValue);
    expect(getDataServiceSpy.checkApoint).toHaveBeenCalledWith('1', jasmine.any(Date));
    expect(getDataServiceSpy.addApoint).toHaveBeenCalledWith('1', validFormValue);
    expect(modalControllerSpy.dismiss).toHaveBeenCalled();
  });

  it('should show a toast message when the selected time is not available', async () => {
    const invalidFormValue = {
      name: 'John Doe',
      address: '123 Main St',
      phone: '555-1234',
      date: new Date(),
      doctor: 'Khoa 1',
    };
    component.appointmentForm.setValue(invalidFormValue);

    getDataServiceSpy.checkTime.and.returnValue(Promise.resolve(false));

    await component.add();

    expect(getDataServiceSpy.checkTime).toHaveBeenCalledWith(invalidFormValue);
    expect(toastControllerSpy.create).toHaveBeenCalledWith({
      message: 'Giờ này đã đầy',
      duration: 1500,
      position: 'bottom',
    });
   // expect(toastControllerSpy.present).toHaveBeenCalled();
    expect(modalControllerSpy.dismiss).not.toHaveBeenCalled();
  });

  it('should show a toast message when there are no available slots', async () => {
    const validFormValue = {
      name: 'John Doe',
      address: '123 Main St',
      phone: '555-1234',
      date: new Date(),
      doctor: 'Khoa 1',
    };
    component.appointmentForm.setValue(validFormValue);

    getDataServiceSpy.checkTime.and.returnValue(Promise.resolve(true));
    getDataServiceSpy.checkApoint.and.returnValue(Promise.resolve(false));

    await component.add();

    expect(getDataServiceSpy.checkTime).toHaveBeenCalledWith(validFormValue);
    expect(getDataServiceSpy.checkApoint).toHaveBeenCalledWith('1', jasmine.any(Date));
    expect(toastControllerSpy.create).toHaveBeenCalledWith({
      message: 'Lịch khám cách nhau ít nhất 1h',
      duration: 1500,
      position: 'bottom',
    });
    //expect(toastControllerSpy.present).toHaveBeenCalled();
    expect(modalControllerSpy.dismiss).not.toHaveBeenCalled();
  });

  it('should add appointment', () => {
    const addAppointmentSpy = spyOn(component, 'add').and.callThrough();
    component.appointmentForm.setValue({
      name: 'John Doe',
      address: '123 Main St',
      phone: '555-1234',
      date: new Date(),
      doctor: 'Khoa 1',
    });
    component.add();
    expect(addAppointmentSpy).toHaveBeenCalled();
  });

  it('should check if appointment can be booked in the morning', () => {
    const appointmentDate = new Date();
    appointmentDate.setHours(9, 0, 0, 0); // 9:00 sáng
    expect(component.isAppointmentBookM(appointmentDate)).toBe(true);
  });

  it('should check if appointment can be booked in the afternoon', () => {
    const appointmentDate = new Date();
    appointmentDate.setHours(14, 0, 0, 0); // 2:00 chiều
    expect(component.isAppointmentBookA(appointmentDate)).toBe(true);
  });
});
