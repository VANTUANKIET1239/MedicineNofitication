import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Firestore, addDoc, collection, doc, setDoc, updateDoc,docData, getDoc,collectionData, query, where, getDocs, deleteDoc, orderBy, arrayUnion } from '@angular/fire/firestore';
import { getDownloadURL, ref, uploadBytes } from '@angular/fire/storage';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';
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
   async User_AddBase(phone:string,uid:string){
    const userCollectionRef = doc(this.firestore, "User",uid);
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
    const newDocRef = await setDoc(userCollectionRef, userData);
    console.log(newDocRef);
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
       return true;
      }catch(e:any){
        console.log(e.message);
        return false;
      }
    }
    async User_AddImage(Url:string){
      console.log("URL: " + Url);
      const UserCollectionRef = doc(this.firestore, `User/${this.auth.currentUser?.uid || ''}`);
      const userData = {
        imageUrl:Url
      };
      await updateDoc(UserCollectionRef,userData);
    }
    async User_ById(id:string){
      const userCollectionRef = doc(this.firestore, `User`,id).withConverter(this.GetConverterSingle());
      const docSnap = await getDoc(userCollectionRef);
        if (docSnap.exists()) {
          const user = docSnap.data();
          return user;
        }
        return new User();
    }
    GetConverterSingle(){
      const PresConverter = {
        toFirestore: (user:any) => {
            return {
              name: user.name,
              birthDate : user.birthDate,
              gender : user.gender,
              phone : user.phone,
              email : user.email,
              imageUrl: user.imageUrl
            };
        },
        fromFirestore: async (snapshot:any, options:any) => {
            const data = snapshot.data(options);
            return new User(data.name, data.birthDate, data.gender, data.phone, data.email,data.imageUrl);
        }
      };
      return PresConverter;
    }
    async TakeAPhoto(){
      try{
        if(Capacitor.getPlatform() != 'web') await Camera.requestPermissions();
      const image = await Camera.getPhoto({
        quality: 90,
        source: CameraSource.Prompt,
        resultType: CameraResultType.DataUrl
      });
      console.log(image);
      const blob = this.dataURLtoBlob(image.dataUrl);
      const url = await this.uploadImage(blob,image,'userimage');
      await this.User_AddImage(url);
      console.log(url);
      return image.dataUrl;
      }catch(e){
          console.log(e);
      }
      return 'https://w7.pngwing.com/pngs/627/335/png-transparent-a-camera-photo-picture-take-ui-ux-user-interface-outline-icon-thumbnail.png';
    }
}
