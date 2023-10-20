import { Component, OnInit } from '@angular/core';
import { News } from '../models/news';
import { ActivatedRoute } from '@angular/router';
import { NewsServiceService } from '../Services/news-service/news-service.service';
import { from } from 'rxjs';

@Component({
  selector: 'app-detail-news',
  templateUrl: './detail-news.page.html',
  styleUrls: ['./detail-news.page.scss'],
})
export class DetailNewsPage implements OnInit {
  newsDetail: News | null = null;
  ListNews: News[] = [];
  errorMessage: string | undefined;
  isLiked: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private newsService: NewsServiceService
  ) {}

  ngOnInit() {
    from(this.newsService.News_List()).subscribe((x) => {
      this.ListNews = x;
      console.log(this.ListNews);
    });
    this.route.queryParams.subscribe(async (params) => {
      const id = params['id'];
      if (id) {
        this.newsDetail = await this.newsService.getNewsById(id);
        console.log(this.newsDetail);
      }
      console.log('ID from URL:', id);
    });
  }

  likeNews() {
    if (this.newsDetail && this.newsDetail.id) {
      if (this.newsDetail.like === undefined) {
        this.newsDetail.like = 1;
      } else {
        if (this.isLiked) {
          this.newsDetail.like--;
        } else {
          this.newsDetail.like++;
        }
      }
      this.isLiked = !this.isLiked;
  
      // Kiểm tra lại một lần nữa trước khi gọi hàm cập nhật số lượt thích từ service
      if (this.newsDetail.id) {
        this.newsService.updateLikeCount(this.newsDetail.id, this.newsDetail.like as number);
      }
    }
  }
  
  
}
