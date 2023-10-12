import { Component, OnInit } from '@angular/core';
import { Appointment } from '../models/Appointment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GetdataService } from '../Services/addApointment/addApointment.service';
import { DatePipe } from '@angular/common';
import { ActionSheetController, ModalController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-add-appointment',
  templateUrl: './add-appointment.page.html',
  styleUrls: ['./add-appointment.page.scss'],
})
export class AddAppointmentPage implements OnInit {

  appointment: Appointment = new Appointment();
  appointmentForm: FormGroup;
  nameError!: string;
  addressError!: string;
  phoneError!: string;
  dateError!: string;
  doctorError!: string;
  formattedToday: any;
  formattedMaxday: any;
  doctor: any[] = [];


  constructor(
    private config: GetdataService,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private toastController: ToastController,
    private actionSheetController: ActionSheetController,
    private modalCtrl: ModalController
  ) {
    this.appointmentForm = this.formBuilder.group({
      name: ['', Validators.required],
      address: ['', Validators.required],
      phone: ['', Validators.required],
      date: [, Validators.required],
      doctor: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.config.getKhoa(this.doctor)
    const today = new Date();
    this.formattedToday = this.datePipe.transform(today, 'yyyy-MM-ddTHH:mm');
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 6);
    this.formattedMaxday = this.datePipe.transform(maxDate, 'yyyy-MM-ddTHH:mm');
  }

  // Chỉ cho phép đặt lịch hẹn từ 8h-11h
  isAppointmentBookM(appointmentDate: Date): boolean {
    const currentdate = new Date();
    const date = new Date(appointmentDate);

    // Tạo hai đối tượng Date cho 7:30 và 11:00 sáng
    const startLimit = new Date(appointmentDate);
    startLimit.setHours(7, 3, 0, 0); // 8:00 sáng
    const endLimit = new Date(appointmentDate);
    endLimit.setHours(11, 0, 0, 0); // 11:00 sáng
    currentdate.setHours(currentdate.getHours() + 2);

    console.log(date);
    return date >= startLimit && date <= endLimit && date >= currentdate;
  }

  // Chỉ cho phép đặt lịch hẹn từ 13h-16h
  isAppointmentBookA(appointmentDate: Date): boolean {
    const currentDate = new Date();
    const date = new Date(appointmentDate);
    const startLimit = new Date(appointmentDate);
    startLimit.setHours(13, 0, 0, 0); // 13:00 chiều

    const endLimit = new Date(appointmentDate);
    endLimit.setHours(16, 0, 0, 0); // 16:00 chiều
    currentDate.setHours(currentDate.getHours() + 1);

    console.log(currentDate);
    return date >= startLimit && date <= endLimit && date >= currentDate;
  }

  async add() {
    if (this.appointmentForm.valid) {
      this.appointment = this.appointmentForm.value;
      const appoinments = {
        name: this.appointment.name,
        address: this.appointment.address,
        phone: this.appointment.phone,
        date: this.appointment.date,
        doctor: this.appointment.doctor,
      };
      const cdate = new Date(this.appointment.date);
      let check = await this.config.checkApoint('1', cdate);
      console.log(check);
      let checktime = await this.config.checkTime(this.appointment)
      console.log(checktime)
      if (checktime) {
        if (check) {
          console.log(this.isAppointmentBookM(this.appointment.date));
          console.log(this.isAppointmentBookA(this.appointment.date));
          if (this.isAppointmentBookM(this.appointment.date))
          {
            this.config.addApoint('1', appoinments);
            this.closeModal();
            this.appointmentForm.reset();
          }
          else if (this.isAppointmentBookA(this.appointment.date))
          {
            this.config.addApoint('1', appoinments);
            this.closeModal();
            this.appointmentForm.reset();
          }
          // else {

          // }
        } else {
          this.presentToast('Lịch khám cách nhau ít nhất 1h');
        }
      } else {
        this.presentToast(
          'Giờ này đã đầy'
        );
      }
    } else {
      this.nameError = this.appointmentForm.get('name')!.hasError('required') ? 'Tên là trường bắt buộc' : '';
      this.addressError = this.appointmentForm.get('address')!.hasError('required') ? 'Địa chỉ là trường bắt buộc' : '';
      this.phoneError = this.appointmentForm.get('phone')!.hasError('required') ? 'Số điện thoại là trường bắt buộc' : '';
      this.dateError = this.appointmentForm.get('date')!.hasError('required') ? 'Ngày khám là trường bắt buộc' : '';
      this.doctorError = this.appointmentForm.get('doctor')!.hasError('required') ? 'Bác sĩ là trường bắt buộc' : '';
    }
  }

  async presentToast(message: string) {
    try {
      const toast = await this.toastController.create({
        message: message,
        duration: 1500,
        position: 'bottom',
      });
      await toast.present();
    } catch (error) {
      console.error('Error presenting toast:', error);
    }
  }


  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Tùy chọn',
      buttons: [
        {
          text: 'Xác nhận',
          role: 'destructive',
          handler: async () => {
            let length = await this.config.countApoint('1');
            console.log(length)
            if (length) {
              this.add();
            }
            else {
              this.presentToast('Bạn đã đặt đủ 10 lịch khám');
            }
          },
        },
        {
          text: 'Hủy',
          role: 'cancel',
          handler: () => {
            this.presentToast('Hủy thao tác');
          },
        },
      ],
    });
    await actionSheet.present();
  }

  closeModal() {
    this.modalCtrl.dismiss();
  }

}
