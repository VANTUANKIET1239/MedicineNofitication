import { Injectable } from '@angular/core';
import { Firestore, collection,
        deleteDoc,
        doc,
        getDoc,
        getDocs,
        getFirestore,
        orderBy,
        query,
        setDoc,
        updateDoc,} from '@angular/fire/firestore';

import { Appointment } from 'src/app/models/Appointment';


@Injectable({
  providedIn: 'root',
})
export class GetdataService {
  constructor(
    private readonly firestore: Firestore
  ) {}

  //db = getFirestore(initializeApp(environment.firebaseConfig));

  // Lấy danh sách lịch khám
  async getListApoint(uid: string, appointments: Appointment[], id: any[]) {
    //lấy data add vào mảng lịch khám và mảng id
    // uid: Lấy từ đăng nhập sms
    const userDocRef = doc(this.firestore, 'danh sách người dùng', uid);
    try {
      //const list = query(collection(this.db, 'danh sách lịch khám'), orderBy('date', 'desc')); // Lấy tất cả danh sách khám
      const list = query(collection(userDocRef, "đặt lịch khám"), orderBy("date", "desc"));// Lấy danh sách theo id người dùng
      const subcollectionSnapshot = await getDocs(list);
      appointments.splice(0, appointments.length);
      id.splice(0, id.length);
      subcollectionSnapshot.forEach((doc) => {
        appointments.push(doc.data() as Appointment);
        id.push(doc.id);
      });
    } catch (error) {
      console.error('Lỗi khi truy xuất dữ liệu:', error);
    }
  }

  // Thêm lịch khám
  async addApoint(uid: string, appointment: Appointment) {
    // add vào 2 collection danh sách người dùng và danh sách lịch khám
    const id = appointment.name + '+' + appointment.date.toString();
    const usercollect1 = collection(this.firestore, 'danh sách lịch khám');
    const usercollect2 = collection(
      this.firestore,
      'danh sách người dùng',
      uid,
      'đặt lịch khám'
    );
    const firstDocRef2 = doc(usercollect2, id);
    //const firstDocRef1 = doc(usercollect1, id);
    await setDoc(firstDocRef2, appointment).then(async () => {
      // add vào danh sách người dùng thành công rồi mới add vào danh sách lịch khám
      const firstDocRef1 = doc(usercollect1, id);
      //const firstDocRef2 = doc(usercollect2, id);
      await setDoc(firstDocRef1, appointment);
    });
  }

  // Cập nhật lịch khám
  async updateApoint(uid: string, appointment: any, newappointment: any) {
    //update đồng thời vào cả hai danh sách
    const userDocRef = doc(
      this.firestore,
      'danh sách người dùng',
      uid,
      'đặt lịch khám',
      appointment
    );
    const allUserDocRef = doc(this.firestore, 'danh sách lịch khám', appointment);
    await updateDoc(allUserDocRef, newappointment);
    //await updateDoc(userDocRef, newappointment);
    //await updateDoc(allUserDocRef, newappointment);
  }

  // Check không cho phép đặt lịch chênh lệch dưới 1h so với lịch đã đặt
  async checkApoint(uid: string, date: Date) {
    const userDocRef = doc(this.firestore, 'danh sách người dùng', uid);
    let check = true;
    try {
      const list = query(
        collection(userDocRef, 'đặt lịch khám'),
        orderBy('date', 'desc')
      );
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
      this.firestore,
      'danh sách người dùng',
      '1',
      'đặt lịch khám',
      id
    );
    const docSnap = await getDoc(docRef);
    console.log(docSnap.data())
    return docSnap.data() as Appointment;
  }

  // Số lịch khám tối đa có thể đặt
  async countApoint(uid: string) {
    let length = null;
    const userDocRef = doc(this.firestore, 'danh sách người dùng', uid);
    try {
      const list = query(collection(userDocRef, 'đặt lịch khám'));
      const subcollectionSnapshot = await getDocs(list);
      const listApoint = [];

      subcollectionSnapshot.forEach((doc) => {
        //console.log("Dữ liệu từ subcollection:", doc.id, "=>", doc.data());
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
    //console.log(appointments)
  }

  // Xóa ở hai danh sách
  async deleteApoint(id: any) {
    const docRefUser = doc(this.firestore,'danh sách người dùng','1','đặt lịch khám',id);
    const docRef = doc(this.firestore, 'danh sách lịch khám', id);
    deleteDoc(docRefUser)
    deleteDoc(docRef);
  }

  // Check nếu 1 giờ đã có 5 người đăng ký thì báo đầy
  async checkTime(appointment: Appointment) {
    let check = true;
    try {
      const listduplicate = [];
      const list = query(collection(this.firestore, 'danh sách lịch khám'));
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
  async checkApointEdit(uid: string, id: any, date: Date) {
    const userDocRef = doc(this.firestore, 'danh sách người dùng', uid);
    let check = true;
    try {
      const list = query(
        collection(userDocRef, 'đặt lịch khám'),
        orderBy('date', 'desc')
      );
      const subcollectionSnapshot = await getDocs(list);
      const index = subcollectionSnapshot.docs.map((doc) => doc.id).indexOf(id);
      const subcollectionData = subcollectionSnapshot.docs.map((doc) =>
        doc.data()
      );
      subcollectionData.splice(index, 1);
      console.log(index);
      console.log(subcollectionData);
      //debugger
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
