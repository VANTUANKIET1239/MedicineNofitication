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
  isLiked: boolean = false; // Thêm biến để theo dõi trạng thái like

  constructor(
    private route: ActivatedRoute,
    private newsService: NewsServiceService
  ) {}

  ngOnInit() {
    from(this.newsService.News_List()).subscribe((x) => {
      this.ListNews = x;
      console.log(this.ListNews);
    });

    const id = this.route.snapshot.paramMap.get('id');
    this.route.params.subscribe(async (params) => {
      let id = 'K8gE68iwCzO7Xg5hitbM';
      if (id) {
        this.newsDetail = await this.newsService.getNewsById(id);
        console.log(this.newsDetail);
      }
    });
  }

  likeNews() {
    if (this.newsDetail) {
      if (this.newsDetail.like === undefined) {
        this.newsDetail.like = 1; // Nếu chưa có lượt thích, set là 1
      } else {
        if (this.isLiked) {
          this.newsDetail.like--; // Giảm 1 nếu đã thích
        } else {
          this.newsDetail.like++; // Tăng 1 nếu chưa thích
        }
      }
      this.isLiked = !this.isLiked; // Đảo ngược trạng thái like
    }
  }
}
