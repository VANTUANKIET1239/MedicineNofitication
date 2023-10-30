import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ActionSheetController, ModalController, ToastController } from '@ionic/angular';
import { AddAppointmentPage } from '../add-appointment/add-appointment.page';
import { EditAppointmentPage } from '../edit-appointment/edit-appointment.page';
import { Appointment } from '../models/Appointment';
import { GetdataService } from '../Services/addApointment/addApointment.service';
import { LocalNotificationsService } from '../Services/addApointment/notifications.service';
import { Auth } from '@angular/fire/auth';

@Component({
  selector: 'app-appointment',
  templateUrl: './appointment.page.html',
  styleUrls: ['./appointment.page.scss'],
})

export class Tab1Page {
  appointments: Appointment[] = [];
  id: any[] = [];
  private auth:Auth = inject(Auth);
  user$ =this.auth.currentUser;

  constructor(
    private modalCtrl: ModalController,
    private config: GetdataService,
    private router: Router,
    private actionSheetController: ActionSheetController,
    private toastController: ToastController,
    private localNotificationsService: LocalNotificationsService
  ) {}


  ionViewWillEnter() {
   this.getdataAndScheduleNotifications();
    console.log(this.id);
    this.router
      .navigateByUrl('/main/appointment', { skipLocationChange: true })
      .then(() => {
        this.router.navigate(['/main/appointment']);
      });
  }

  getdataAndScheduleNotifications() {
    this.config.getListApoint(this.user$?.uid, this.appointments, this.id).then(() => {
      this.scheduleNotificationsForAppointments(this.appointments);
    });
  }
  scheduleNotificationsForAppointments(appointments: any[]) {
    appointments.forEach((appointment: any) => {
      const appointmentDate = new Date(appointment.dateTime);
      const notificationTime = new Date(appointmentDate);
      notificationTime.setHours(notificationTime.getHours() - 2); // Đặt thông báo 2 giờ trước cách lịch hẹn

      this.localNotificationsService.scheduleNotification(
        'Thông báo lịch khám',
        'Lịch khám lúc'+ appointment.date+ 'sắp tới',
        appointment.id, // ID của thông báo (có thể sử dụng ID của lịch hẹn)
        notificationTime.getTime()
      );
    });
  }

  formatDateTime(inputDateTime: Date) {
    const currentDate = new Date();
    const date = new Date(inputDateTime);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    if (date < currentDate) {
      return `${day}/${month}/${year} ${hours}:${minutes}` + '(Hết hạn)'; // quá hạn sẽ không thể sửa
    } else {
      return `${day}/${month}/${year} ${hours}:${minutes}`; // Nếu không, hiển thị ngày theo định dạng bình thường
    }
  }

  // Không thể sửa lịch hén trước 1h
  isAppointmentEdit(appointmentDate: Date): boolean {
    const currentDate = new Date();
    const date = new Date(appointmentDate);
    currentDate.setHours(currentDate.getHours() + 2);
    return date < currentDate;
  }

  // Các lịch hén đã quá hẹn sẽ bị gắn mác quá hạn
  isAppointmentOvertime(appointmentDate: Date): boolean {
    const currentDate = new Date();
    const date = new Date(appointmentDate);
    currentDate.setHours(currentDate.getHours());
    return date < currentDate;
  }

  addAppointment() {
    const modal = this.modalCtrl.create({
      component: AddAppointmentPage,
    });

    if (modal) {
      modal.then((modalInstance) => {
        modalInstance.present();
        modalInstance.onDidDismiss().then(() => {
          this.getdataAndScheduleNotifications();
        });
      });
    } else {
      console.error('Failed to create modal');
    }
  }


  editAppointment(appointment: any) {
    const modal = this.modalCtrl.create({
      component: EditAppointmentPage,
      componentProps: { idAp: appointment },
    });

    if (modal) {
      modal.then((modalInstance) => {
        modalInstance.present();
        modalInstance.onDidDismiss().then(() => {
          this.getdataAndScheduleNotifications();
        });
      });
    } else {
      console.error('Failed to create modal');
    }
  }


  async presentActionSheet(appointment: any) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Tùy chọn',
      buttons: [
        {
          text: 'Xóa lịch khám',
          role: 'destructive',
          handler: () => {
            const index = this.id.indexOf(appointment);
            this.id.splice(index, 1);
            this.config.deleteApoint(appointment);
            console.log('Tài liệu đã được xóa thành công.');
            this.presentToast('Xóa thành công');
            this.getdataAndScheduleNotifications();
          },
        },
        {
          text: 'Hủy',
          role: 'cancle',
          handler: () => {
            this.presentToast('Hủy thao tác');
          },
        },
      ],
    });
    await actionSheet.present();
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 1500,
      position: 'bottom',
    });
    toast.present();
  }

}
