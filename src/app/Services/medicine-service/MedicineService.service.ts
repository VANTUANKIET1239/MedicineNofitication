import { toDate } from 'date-fns';
import { Injectable } from '@angular/core';
import { Firestore, addDoc, collection, doc, setDoc, updateDoc,docData, getDoc,collectionData, query, where, getDocs, deleteDoc, orderBy } from '@angular/fire/firestore';
import { Prescription } from 'src/app/models/prescription';
import { Observable, from } from 'rxjs';
import { IPrescription } from 'src/app/Interfaces/Imedicine/IPrescription';
import { PrescriptionDetail } from 'src/app/models/prescriptionDetail';
import { Validators } from '@angular/forms';


@Injectable({
  providedIn: 'root'
})
export class MedicineServiceService {

constructor(private readonly firestore: Firestore) {

 }
 async Prescription_Add(model:Prescription):Promise<boolean>{

    const prescriptionCollectionRef = collection(this.firestore, "Prescription");
    //const songDocRef = doc(prescriptionCollectionRef);
    const prescriptionData = {
      prescriptionName: model.prescriptionName,
      doctorName: model.doctorName,
      medicineStoreName: model.medicineStoreName,
      isComplete: '0',
      fromDate: model.fromDate,
      toDate: model.toDate,
      isAllDate:model.isAllDate,
      userId:model.userId,
      time:model.time,
    };
    try{
      console.log(prescriptionData);
    const newDocRef = await addDoc(prescriptionCollectionRef, prescriptionData);
    console.log(newDocRef.id);
    if(model.prescriptionDetails){
        model.prescriptionDetails.forEach(x => {
          this.Prescription_Detail_Add(x,newDocRef.id);
        });
    }
        return true;
    }catch(e:any){
      console.log(e.message);
        return false;
    }
 }
 async Prescription_Detail_Add(model:PrescriptionDetail,presId:string | undefined){
  console.log("add_detail" + model);
  const prescriptionCollectionRefDT = collection(this.firestore, "PrescriptionDetail");
          var item = {
            prescriptionId: presId == undefined ? "NONE" : presId,
            medicineName: model.medicineName,
            quantityPerDose: model.quantityPerDose,
            isDone: model.isDone,
         };
         const newDocRefDT = await addDoc(prescriptionCollectionRefDT, item);
 }
 async Prescription_Upd(model:Prescription):Promise<boolean>{

  const prescriptionCollectionRef = doc(this.firestore, `Prescription/${model.prescriptionId}`);
  //const songDocRef = doc(prescriptionCollectionRef);
  const prescriptionData = {
    prescriptionName: model.prescriptionName,
    doctorName: model.doctorName,
    medicineStoreName: model.medicineStoreName,
    isComplete: model.isComplete,
    fromDate: model.fromDate,
    toDate: model.toDate,
    isAllDate:model.isAllDate,
    userId:model.userId,
    time:model.time,
  };
  try{
    console.log(prescriptionData);
   await updateDoc(prescriptionCollectionRef,prescriptionData);
  if(model.prescriptionDetails){
      console.log(model.prescriptionDetails);
      model.prescriptionDetails.forEach( async x => {
        if(x.prescriptionDetailId == ''){
          await this.Prescription_Detail_Add(x,model.prescriptionId);
        }
        else{
          await this.Prescription_Detail_Upd(x);
        }
      });
  }
      return true;
  }catch(e:any){
    console.log(e.message);
      return false;
  }
}
async Prescription_Detail_Upd(model:PrescriptionDetail){
      console.log("upd_detail" + model);
      const prescriptionCollectionRefDT = doc(this.firestore, `PrescriptionDetail/${model.prescriptionDetailId}`);
      var item = {
        prescriptionId: model.prescriptionId,
        medicineName: model.medicineName,
        quantityPerDose: model.quantityPerDose,
        isDone: model.isDone,
     };
     await updateDoc(prescriptionCollectionRefDT, item);
}
 async Prescription_ById(id:string):Promise<Prescription>{

  const prescriptionCollectionRef = doc(this.firestore, `Prescription`,id).withConverter(this.GetConverterSingle());
  const docSnap = await getDoc(prescriptionCollectionRef);
    if (docSnap.exists()) {
      const kiet = docSnap.data();
      return kiet;
    }
    return new Prescription();

}
async Prescription_List():Promise<Prescription[]>{
    const prescriptionCollectionRef = collection(this.firestore,`Prescription`);
    const allData = await getDocs(prescriptionCollectionRef);
    const result =  allData.docs.map( async(x) => {
        let data = x.data();
        var dataDT:PrescriptionDetail[] = await this.Prescription_Detail_ById(x.id);
      return new Prescription(x.id, data['prescriptionName'], data['doctorName'], data['isComplete'], data['medicineStoreName'], data['fromDate'], data['toDate'], data['isAllDate'], data['userId'],data['time'],dataDT);
  });
  var finalResult = Promise.all(result);
  return finalResult;
}
async Prescription_Detail_ById(prescriptionId:string):Promise<PrescriptionDetail[]>{
  const Ref = collection(this.firestore,`PrescriptionDetail`);
  const queryData = query(Ref,where('prescriptionId','==',prescriptionId));
  const allData = await getDocs(queryData);
  return allData.docs.map(x => {
    let data = x.data();
    return new PrescriptionDetail(x.id, data['prescriptionId'], data['medicineName'], data['quantityPerDose'], data['isDone']);
});
}
async Prescription_Del(id:string,idDTs:string[]){
    try{
      const prescriptionCollectionRef = doc(this.firestore,`Prescription/${id}`);
        await deleteDoc(prescriptionCollectionRef);
        idDTs.forEach(async x => {
            await this.Prescription_Detail_Del(x);
        });
        return true;
    }
    catch(e:any){
        console.log(e.message);
        return false;
    }
}
async Prescription_Detail_Del(id:string){
  const prescriptionCollectionRef = doc(this.firestore,`PrescriptionDetail/${id}`);
  return await deleteDoc(prescriptionCollectionRef);
}
GetConverterSingle(){
  const PresConverter = {
    toFirestore: (pres:any) => {
        return {
                prescriptionName: pres.prescriptionName,
                doctorName: pres.doctorName,
                medicineStoreName: pres.medicineStoreName,
                isComplete: pres.isComplete,
                fromDate: pres.fromDate,
                toDate: pres.toDate,
                isAllDate:pres.isAllDate,
                userId:pres.userId,
                time:pres.time,
            };
    },
    fromFirestore: async (snapshot:any, options:any) => {
        const data = snapshot.data(options);
        var dataDT:PrescriptionDetail[] = await this.Prescription_Detail_ById(snapshot.id);
        return new Prescription(snapshot.id, data.prescriptionName, data.doctorName, data.isComplete, data.medicineStoreName, data.fromDate, data.toDate, data.isAllDate, data.userId,data.time,dataDT);
    }
  };
  return PresConverter;
}
  async Prescription_Detail_Confirm(id:string,isDone:string){
      console.log("upd_detail" + id);
      const prescriptionCollectionRefDT = doc(this.firestore, `PrescriptionDetail/${id}`);
      var item = {
        isDone: isDone,
    };
    await updateDoc(prescriptionCollectionRefDT, item);

  }
  async Prescription_Search(presriptionName?:string): Promise<Prescription[]>{
      const prescriptionCollectionRef = collection(this.firestore,`Prescription`);
      const queryData = query(prescriptionCollectionRef,orderBy('fromDate', 'desc'));
      const allData = await getDocs(queryData);

      var list: Prescription[] = []
      allData.docs.forEach( async(x) => {
          let data = x.data();
          if((data['prescriptionName'] as string).toLowerCase().includes((presriptionName || '').toLowerCase()) || presriptionName == '' || presriptionName == null || presriptionName == undefined){
            var dataDT:PrescriptionDetail[] = await this.Prescription_Detail_ById(x.id);
            list.push( new Prescription(x.id, data['prescriptionName'], data['doctorName'], data['isComplete'], data['medicineStoreName'], data['fromDate'], data['toDate'], data['isAllDate'], data['userId'],data['time'],dataDT));
          }
    });
    return Promise.resolve(list);
  }
}
