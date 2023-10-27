import { Injectable } from '@angular/core';
import { Firestore, collection,
        deleteDoc,
        doc,
        getDoc,
        getDocs,
        orderBy,
        query,
        setDoc,
        updateDoc,
        where,} from '@angular/fire/firestore';

import { Appointment } from 'src/app/models/Appointment';


@Injectable({
  providedIn: 'root',
})
export class GetdataService {
  constructor(
    private readonly firestore: Firestore
  ) {}


  // Lấy danh sách lịch khám
  async getListApoint(uid: any, appointments: Appointment[], id: any[]) {
    try {
        const querySnapshot = await getDocs(
            query(collection(this.firestore, 'Appointments'), where('id', '==', uid))
        );
        appointments.splice(0, appointments.length);
        id.splice(0, id.length);
        querySnapshot.forEach((doc) => {
            appointments.push(doc.data() as Appointment);
            id.push(doc.id);
        });
    } catch (error) {
        console.error('Lỗi khi truy xuất dữ liệu:', error);
    }
}


  // Thêm lịch khám
  async addApoint(appointment: Appointment) {
    const id = appointment.name + '+' + appointment.date.toString();
    const usercollect1 = collection(this.firestore, 'Appointments');
    const firstDocRef1 = doc(usercollect1, id);
    await setDoc(firstDocRef1, appointment);
  }

  // Cập nhật lịch khám
  async updateApoint(appointment: any, newappointment: any) {
    const allUserDocRef = doc(this.firestore, 'Appointments', appointment);
    await updateDoc(allUserDocRef, newappointment);
  }

  // Check không cho phép đặt lịch chênh lệch dưới 1h so với lịch đã đặt
  async checkApoint(uid: any, date: Date) {
    const userDocRef = doc(this.firestore, 'Appointments', uid);
    let check = true;
    try {
      const list = query(collection(this.firestore, 'Appointments'), orderBy('date', 'desc')); 
      const subcollectionSnapshot = await getDocs(list);
      const subcollectionData = subcollectionSnapshot.docs.map((doc) =>
        doc.data()
      ); // Biến đổi thành mảng dữ liệu
      for (const doc of subcollectionData) {
        const aa = new Date(doc['date']);
        const minHours = new Date(doc['date']);
        const maxHours = new Date(doc['date']);
        minHours.setHours(aa.getHours() - 1);
        maxHours.setHours(aa.getHours() + 1); // So sánh giờ đã đặt trước và sau 1h
        if (date >= maxHours) {
          check = true;
        } else if (date <= minHours) {
          check = true;
        } else {
          check = false;
        }
        if (!check) {
          break;
        }
      }
    } catch (error) {
      console.error('Lỗi khi truy xuất dữ liệu:', error);
    }
    return check;
  }
  async GetAppoint(id:string){
    const docRef = doc(
      this.firestore,"Appointments",id
    );
    const docSnap = await getDoc(docRef);
    console.log(docSnap.data())
    return docSnap.data() as Appointment;
  }

  // Số lịch khám tối đa có thể đặt
  async countApoint(uid: string) {
    let length = null;
    try {
      const list = query(collection(this.firestore, 'Appointments'), where('id', '==', uid)) 
      const subcollectionSnapshot = await getDocs(list);
      const listApoint = [];

      subcollectionSnapshot.forEach((doc) => {
        listApoint.push(doc.data());
      });
      if (listApoint.length < 10) {
        length = true;
      } else {
        length = false;
      }
    } catch (error) {
      console.error('Lỗi khi truy xuất dữ liệu:', error);
    }
    return length;
  }

  // Xóa lịch khám
  async deleteApoint(id: any) {
    const docRef = doc(this.firestore, 'Appointments', id);
    deleteDoc(docRef);
  }

  // Check nếu 1 giờ đã có 5 người đăng ký thì báo đầy
  async checkTime(appointment: Appointment) {
    let check = true;
    try {
      const listduplicate = [];
      const list = query(collection(this.firestore, 'Appointments'));
      const subcollectionSnapshot = await getDocs(list);
      const subcollectionData = subcollectionSnapshot.docs.map((doc) =>
        doc.data()
      ); // Biến đổi thành mảng dữ liệu
      console.log(subcollectionData);
      for (const doc of subcollectionData) {
        const date = doc['date'];
        console.log(date + '+' + appointment.date);
        if (date == appointment.date) {
          listduplicate.push(date);
        }
        console.log(listduplicate);
        if (listduplicate.length == 5) {
          check = false;
        }
        if (!check) {
          break;
        }
      }
    } catch (error) {
      console.error('Lỗi khi truy xuất dữ liệu:', error);
    }
    return check;
  }

  // Check nếu sửa lịch đăng ký
  async checkApointEdit(id: any, date: Date) {
    let check = true;
    try {
      const list = query(collection(this.firestore, 'Appointments'), orderBy('date', 'desc')); 
      const subcollectionSnapshot = await getDocs(list);
      const index = subcollectionSnapshot.docs.map((doc) => doc.id).indexOf(id);
      const subcollectionData = subcollectionSnapshot.docs.map((doc) =>
        doc.data()
      );
      subcollectionData.splice(index, 1);
      console.log(index);
      console.log(subcollectionData);
      date = new Date(date);
      console.log();
      for (const doc of subcollectionData) {
        const aa = new Date(doc['date']);
        const minHours = new Date(doc['date']);
        const maxHours = new Date(doc['date']);
        minHours.setHours(aa.getHours() - 1);
        maxHours.setHours(aa.getHours() + 1);
        if (date >= maxHours) {
          check = true;
        } else if (date <= minHours) {
          check = true;
        } else {
          check = false;
        }
        if (!check) {
          break;
        }
        console.log(check);
      }
    } catch (error) {
      console.error('Lỗi khi truy xuất dữ liệu:', error);
    }
    return check;
  }

  async getKhoa(khoa:any[]){
    try {
      const list = query(collection(this.firestore, "khoa"));
      const subcollectionSnapshot = await getDocs(list);
      subcollectionSnapshot.forEach((doc) => {
        khoa.push(doc.id);
      });
    } catch (error) {
      console.error('Lỗi khi truy xuất dữ liệu:', error);
    }
  }
}
