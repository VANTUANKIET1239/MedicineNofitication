import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Firestore, addDoc, collection, doc, setDoc, updateDoc,docData, getDoc,collectionData, query, where, getDocs, deleteDoc, orderBy, arrayUnion } from '@angular/fire/firestore';
import { getDownloadURL, ref, uploadBytes } from '@angular/fire/storage';
import { Preferences } from '@capacitor/preferences';
import { initializeApp } from 'firebase/app';

import { getStorage } from 'firebase/storage';
import { User } from 'src/app/models/User';
const app = initializeApp({
  apiKey: "AIzaSyB59ZKtqB6hIaTgVby5u0bYbaW38-xku-w",
authDomain: "drugnotification-267ca.firebaseapp.com",
projectId: "drugnotification-267ca",
storageBucket: "drugnotification-267ca.appspot.com",
messagingSenderId: "467612996582",
appId: "1:467612996582:web:bd8dc15c6c0f0800407c27",
measurementId: "G-XF1MGCSSBB"
});
@Injectable({
  providedIn: 'root'
})

export class UserService {


private storage = getStorage(app);

constructor(
  private firestore: Firestore,
  private auth: Auth
) { }


      dataURLtoBlob(dataurl: any) {
        var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
        while(n--){
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], {type:mime});
    }
    async uploadImage(blob: any, imageData: any,folder:string) {
      // try {
        const currentDate = Date.now();
        const filePath = `${folder}/${currentDate}.${imageData.format}`;
        const fileRef = ref(this.storage, filePath);
        const task = await uploadBytes(fileRef, blob);
        console.log('task: ', task);
        const url = getDownloadURL(fileRef);
        return url;
      // } catch(e) {
      //   throw(e);
      // }
    }
   async User_AddBase(phone:string){
    const userCollectionRef = collection(this.firestore, "User");
    //const songDocRef = doc(prescriptionCollectionRef);
    const userData = {
      name: '',
      birthDate : '',
      gender : '',
      phone : phone,
      email : '',
      imageUrl:''
    };
    try{
      console.log(userData);
    const newDocRef = await addDoc(userCollectionRef, userData);
    console.log(newDocRef.id);
    }catch(e:any){
      console.log(e.message);
    }
    }

    async CheckUserExists(uid:string){
      const userCollectionRef = doc(collection(this.firestore, "User"),uid);
      const userDoc = await getDoc(userCollectionRef);
      if(userDoc.exists()){
          return true;
      }
      return false;
    }
    async User_Upd(user:User){
      const userCollectionRef = doc(this.firestore, `User/${this.auth.currentUser?.uid || ''}`);
      const userData = {
        name: user.name,
        birthDate : user.birthDate,
        gender : user.gender,
        email : user.email
      };
      try{
        console.log(userData);
       await updateDoc(userCollectionRef,userData);
      }catch(e:any){
        console.log(e.message);
      }
    }
    async User_AddImage(Url:string){
      console.log("URL: " + Url);
      const prescriptionCollectionRef = collection(this.firestore, `User`);
      const prescriptionDocRef = doc(prescriptionCollectionRef,this.auth.currentUser?.uid || '');
      await setDoc(prescriptionDocRef, {
        imageUrl: Url,
     },{merge:true});
    }
}
