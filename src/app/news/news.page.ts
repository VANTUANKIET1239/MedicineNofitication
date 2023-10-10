import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { NewsServiceService } from '../Services/news-service/news-service.service';
import { News } from '../models/news';
import { from } from 'rxjs';

@Component({
  selector: 'app-news',
  templateUrl: './news.page.html',
  styleUrls: ['./news.page.scss'],
})
export class NewsPage implements OnInit {
  ListNews: News[] = [];

  constructor(
    private temp: NewsServiceService,
    private router: Router,
    private navCtrl: NavController,
  ) {}

  viewDetail(id: string) {
    if (id == '') {
      //this.ShowNofitication('Có lỗi xảy ra, vui lòng thử lại sau');
      return;
    }
    let paras: any = {
      id: id,
    };
    this.NavigateToPage('/detail-news', paras);
  }

  viewAllNews() {
    // Điều hướng đến trang hiển thị tất cả tin tức
    this.router.navigate(['/all-news']);
  }

  NavigateToPage(url: string, paras?: any) {
    if (paras) {
      console.log(paras);
      const navigationExtras = {
        queryParams: paras,
      };
      this.navCtrl.navigateForward(url, navigationExtras);
    } else {
      this.navCtrl.navigateForward(url);
    }
  }

  truncateText(text: string, limit: number): string {
    const words = text.split(' ');
    if (words.length > limit) {
      return words.slice(0, limit).join(' ') + '...';
    } else {
      return text;
    }
  }

  ngOnInit() {
    from(this.temp.News_List()).subscribe((x) => {
      // Cắt nội dung tin tức theo số từ
      x.forEach((news) => {
        news.detail = this.truncateText(news.detail || '', 30);
      });
      this.ListNews = x;
      console.log(this.ListNews);
    });
  }
}
