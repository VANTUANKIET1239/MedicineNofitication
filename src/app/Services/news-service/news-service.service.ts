import { Injectable } from '@angular/core';
import { Firestore, collection, doc, getDocs, getDoc, getFirestore, DocumentSnapshot } from '@angular/fire/firestore';
import { DocumentReference } from '@angular/fire/firestore';
import { News } from 'src/app/models/news';

@Injectable({
  providedIn: 'root'
})
export class NewsServiceService {

  constructor(private readonly firestore: Firestore) {

  }
  async News_List():Promise<News[]>{
    const prescriptionCollectionRef = collection(this.firestore,`News`);
    const allData = await getDocs(prescriptionCollectionRef);
    const result =  allData.docs.map( (x) => {
        let data = x.data();
      return new News(x.id, data['img'], data['title'], data['detail']);
  });
  return result;
  
}
async getNewsById(id: string): Promise<News | null> {
  const firestore = collection(this.firestore, 'News');
  try {
    // Tạo một tham chiếu đến tài liệu tin tức trong Firestore dựa trên id.
    const newsDocRef = doc(firestore, id);

    // Lấy thông tin của tài liệu.
    //const newsDocSnapshot: DocumentSnapshot<News> = await getDoc(newsDocRef);
    const newsDocSnapshot = await getDoc(newsDocRef);

    // Kiểm tra xem tài liệu có tồn tại không.
    if (newsDocSnapshot.exists()) {
      // Nếu có, trích xuất dữ liệu và tạo đối tượng News.
      const newsData = newsDocSnapshot.data();
      return new News(newsDocSnapshot.id, newsData['img'], newsData['title'], newsData['detail'], newsData['like']);
    } else {
      // Trả về null nếu không tìm thấy tài liệu với ID tương ứng.
      return null;
    }
  } catch (error) {
    // Xử lý lỗi nếu có bất kỳ lỗi nào xảy ra trong quá trình truy vấn Firestore.
    console.error('Lỗi khi lấy tin tức từ Firestore:', error);
    throw error; // Chuyển tiếp lỗi cho phía gọi để xử lý.
  }
}



}
