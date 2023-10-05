import { async } from '@angular/core/testing';
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
    this.route.queryParams.subscribe(async params => {
      const id = params['id'];
      if (id) {
            this.newsDetail = await this.newsService.getNewsById(id);
            console.log(this.newsDetail);
          }
      console.log('ID from URL:', id);
    });

    // this.route.queryParams.subscribe(async params => {
    //   let id = params['id']; // Trích xuất giá trị "id" từ URL
    //   if (id) {
    //     this.newsDetail = await this.newsService.getNewsById(id);
    //     console.log(this.newsDetail);
    //   }
    // });

    // const id = this.route.snapshot.paramMap.get('id');
    // this.route.params.subscribe(async (params) => {
    //   let id = 'K8gE68iwCzO7Xg5hitbM';
    //   if (id) {
    //     this.newsDetail = await this.newsService.getNewsById(id);
    //     console.log(this.newsDetail);
    //   }
    // });
  }

  likeNews() {
    if (this.newsDetail) {
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
    }
  }
}
