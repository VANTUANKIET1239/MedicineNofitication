import { Component, Input, OnInit } from '@angular/core';
import { Appointment } from '../models/Appointment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActionSheetController, ModalController, ToastController } from '@ionic/angular';
import { GetdataService } from '../Services/addApointment/addApointment.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-edit-appointment',
  templateUrl: './edit-appointment.page.html',
  styleUrls: ['./edit-appointment.page.scss'],
})
export class EditAppointmentPage implements OnInit {

  @Input() idAp: any;
  editApointment: Appointment = new Appointment();
  appointment: any;
  appointmentForm: FormGroup;
  nameError!: string;
  addressError!: string;
  phoneError!: string;
  dateError!: string;
  doctorError!: string;
  formattedToday: any;
  formattedBookday: any;
  formattedMaxday: any;
  doctor: any[]=[];

  constructor(
    public modalCtrl: ModalController,
    public AppointmentService: GetdataService,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private toastController: ToastController,
    private actionSheetController: ActionSheetController
  ) {
    this.appointmentForm = this.formBuilder.group({
      name: ['', Validators.required],
      address: ['', Validators.required],
      phone: ['', Validators.required],
      date: ['', Validators.required],
      doctor: ['', Validators.required],
    });
  }

  ngOnInit() {
    console.log(this.editApointment)
    this.getData();
  }

  async getData() {
    this.AppointmentService.getKhoa(this.doctor)
    // const docRef = doc(
    //   this.AppointmentService.db,
    //   'danh sách người dùng',
    //   '1',
    //   'đặt lịch khám',
    //   this.idAp
    // );
    // const docSnap = await getDoc(docRef);
    // console.log(docSnap.data())
     this.editApointment = await this.AppointmentService.GetAppoint(this.idAp);

    this.formattedBookday = this.datePipe.transform(
      this.editApointment.date,
      'yyyy-MM-ddTHH:mm:ss'
    );
    console.log(this.formattedBookday);

    const today = new Date();
    this.formattedToday = this.datePipe.transform(today, 'yyyy-MM-ddTHH:mm');

    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 6);
    this.formattedMaxday = this.datePipe.transform(
      maxDate,
      'yyyy-MM-ddTHH:mm'
    );
  }

  // Chỉ cho phép đặt lịch hẹn từ 8h-11h
  isAppointmentBookM(appointmentDate: Date): boolean {
    const currentdate = new Date();
    const date = new Date(appointmentDate);
    const startLimit = new Date(appointmentDate);
    startLimit.setHours(8, 0, 0, 0); // 7:30 sáng

    const endLimit = new Date(appointmentDate);
    endLimit.setHours(11, 0, 0, 0); // 11:00 chiều
    currentdate.setHours(currentdate.getHours() + 2);
    console.log(date);

    return date >= startLimit && date <= endLimit && date >= currentdate;
  }

  // Chỉ cho phép đặt lịch hẹn từ 13h-16h
  isAppointmentBookA(appointmentDate: Date): boolean {
    const currentdate = new Date();
    const date = new Date(appointmentDate);
    const startLimit = new Date(appointmentDate);
    startLimit.setHours(13, 0, 0, 0); // 13:00 chiều

    const endLimit = new Date(appointmentDate);
    endLimit.setHours(16, 0, 0, 0); // 16:00 chiều
    currentdate.setHours(currentdate.getHours() + 1);
    console.log(date);

    return date >= startLimit && date <= endLimit && date >= currentdate;
  }

  async updateData() {
    if (this.appointmentForm.valid) {
      this.editApointment = this.appointmentForm.value;
      const data = {
        name: this.editApointment.name,
        address: this.editApointment.address,
        phone: this.editApointment.phone,
        date: this.editApointment.date,
        doctor: this.editApointment.doctor,
      };
      const cdate = new Date(this.editApointment.date);
      let check = await this.AppointmentService.checkApoint('1', cdate);
      console.log(check);
      if (check) {
        if (this.isAppointmentBookM(this.editApointment.date)) {
          this.AppointmentService.updateApoint('1', this.idAp, data);
          this.closeModal();
        } else if (this.isAppointmentBookA(this.editApointment.date)) {
          this.AppointmentService.updateApoint('1', this.idAp, data);
          this.closeModal();
        } else {
          this.presentToast(
            'Đặt lịch trong khoảng 8h-16h và đặt lịch khám trước 2h'
          );
        }
      } else {
        this.presentToast('Lịch khám mới cách lịch cũ ít nhất 1h');
      }
    } else {
      this.nameError = this.appointmentForm.get('name')!.hasError('required')
        ? 'Tên là trường bắt buộc'
        : '';
      this.addressError = this.appointmentForm
        .get('address')!
        .hasError('required')
        ? 'Địa chỉ là trường bắt buộc'
        : '';
      this.phoneError = this.appointmentForm.get('phone')!.hasError('required')
        ? 'Số điện thoại là trường bắt buộc'
        : '';
      this.dateError = this.appointmentForm.get('date')!.hasError('required')
        ? 'Ngày khám là trường bắt buộc'
        : '';
      this.doctorError = this.appointmentForm
        .get('doctor')!
        .hasError('required')
        ? 'Bác sĩ là trường bắt buộc'
        : '';
    }
  }

  closeModal() {
    this.modalCtrl.dismiss();
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 1500,
      position: 'bottom',
    });
    toast.present();
  }

  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Tùy chọn',
      buttons: [
        {
          text: 'Xác nhận',
          role: 'destructive',
          handler: async () => {
            let check=this.AppointmentService.checkApointEdit("1",this.idAp,this.editApointment.date);
            if(await check){
              this.updateData();
            }else{
              this.presentToast('ê ê');
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

}
